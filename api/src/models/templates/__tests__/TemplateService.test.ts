import fs from 'fs';
import YAML from 'yaml'
import { TemplateService } from "../TemplateService";

describe('TemplateService.parseTemplateFile', () => {
  it('Parses a yaml file', () => {
    const templateFile = fs.readFileSync(`${__dirname}/haas-test.yml`, 'utf8');
    const template = YAML.parse(templateFile);
    const templateService = new TemplateService();

    const dialogueTemplate = templateService.parseTemplate(template);
  });
})