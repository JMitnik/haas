import { init } from '@lumigo/opentelemetry';
import prisma from './config/prisma';
import config from './config/config';
import { makeServer } from './config/server';
import { redis } from './config/redis';
import { logger } from './config/logger';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { PrismaInstrumentation } from '@prisma/instrumentation';
import { RedisInstrumentation } from '@opentelemetry/instrumentation-redis';
import { OTLPTraceExporter } from '@opentelemetry/exporter-otlp-http';

void (async () => {
  const { tracerProvider } = await init;

  const exporter = new OTLPTraceExporter({
    headers: {
      Authorization: `LumigoToken ${process.env.LUMIGO_TRACER_TOKEN}`,
    },
  })

  registerInstrumentations({
    tracerProvider,
    instrumentations: [
      new PrismaInstrumentation(),
      new RedisInstrumentation(),
    ],
  });

  tracerProvider.addSpanProcessor(
    new BatchSpanProcessor(exporter),
  );

  try {
    await makeServer(config.port, prisma);
  } catch (e: unknown) {
    logger.error('Error in lifecycle', e);
  }

  /**
     * Terminates the server and other processes (such as Prisma) when the process is killed.
     * - SIGTERM is triggered by AWS Fargate. Prisma only watches for SIGINT.
     */
  process.on('SIGTERM', async () => {
    logger.logLifeCycle('Disconnecting from prisma and redis');
    await prisma.$disconnect();
    await redis.quit();
    await tracerProvider.shutdown();
    process.exit(0);
  });
})();
