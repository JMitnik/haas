export class TemplateService {
  constructor() { }

  /**
   * Parses a `HAAS` template (already imported)
   */
  public async parseTemplate(template: any) {
    const dialogue = template.haas.dialogue;
    const dialogueResources = dialogue.resources;

    // Parse resources (CTAs and Topics) (validate uniqueness IDs for instance)

    // Parse 
  }
}