import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { SimpleSpanProcessor, BatchSpanProcessor, TraceIdRatioBasedSampler } from '@opentelemetry/sdk-trace-base';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { trace, Tracer } from '@opentelemetry/api';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { PrismaInstrumentation } from '@prisma/instrumentation';

import config from './config';

export function initializeTracing(serviceName: string): Tracer {
  // To improve perofrmance in production only a subset of all possible actions will be tracked
  const traceRatio = process.env.NODE_ENV === 'production' ? 0.1 : 1.0;

  const provider = new NodeTracerProvider({
    sampler: new TraceIdRatioBasedSampler(traceRatio),
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
    }),
  });

  const jaegerExporter = new JaegerExporter({
    endpoint: config.jeagerEndpoint,
  });

  // To improve performance in production spans will be batched
  if (process.env.NODE_ENV === 'production') {
    provider.addSpanProcessor(new BatchSpanProcessor(jaegerExporter))
  } else {
    provider.addSpanProcessor(new SimpleSpanProcessor(jaegerExporter))
  }

  registerInstrumentations({
    instrumentations: [
      new PrismaInstrumentation(),
    ],
    tracerProvider: provider,
  });

  provider.register();

  return trace.getTracer(serviceName);
};

const tracer = initializeTracing('graphql-yoga');

export const useTrace = async (label: string, callback: any) => {
  return await tracer.startActiveSpan(label, (requestSpan) => {
    try {
      return callback?.();
    } finally {
      requestSpan.end();
    };
  });
}

export default tracer;