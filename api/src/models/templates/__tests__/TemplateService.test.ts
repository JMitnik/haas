// Temp workaround until we can fix this problem (pass prisma new datasource url ...)
process.env.DB_STRING = 'postgresql://prisma:prisma@localhost:5439/postgres?schema=public';

import fs from 'fs';
import YAML from 'yaml'
import { PrismaClient } from '@prisma/client';
import { TemplateService } from "../TemplateService";


const prisma = new PrismaClient({
  datasources: { postgresql: { url: process.env.TEST_DB_STRING } }
});

afterAll(async (done) => {
  await prisma.$disconnect();
  done();
});

describe('TemplateService.parseTemplateFile', () => {
  it('Parses a yaml file', async () => {
    const templateFile = fs.readFileSync(`${__dirname}/haas-test.yml`, 'utf8');
    const template = YAML.parse(templateFile);
    const templateService = new TemplateService(prisma);

    const dialogueTemplate = templateService.parseTemplate(template);

  });
})