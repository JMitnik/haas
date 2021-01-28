import { PrismaClient } from "@prisma/client";

export class TemplateService {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Parses a `HAAS` template (already imported)
   */
  public async parseTemplate(template: any) {
    const dialogue = template.haas.dialogue;
    const dialogueResources = dialogue.resources;

    // Parse resources (CTAs and Topics) (validate uniqueness IDs for instance)

    // Parse nodes, get both nodes and edges
    console.log(dialogue.node.children[0]);
    const nodes = this.parseTemplateNode(dialogue.node, null, dialogueResources);
    console.log(nodes);
  }

  /**
   * Parses a template node recursively.
   * @param templateNode 
   */
  private parseTemplateNode(templateNode: any, parentNode: any | null, resources: any) {
    // Convert each node into a specific format

    let options: any[] = [];

    if (templateNode.options && !Array.isArray(templateNode.options)) {
      // We need to interpolate these options then
      const topicId = templateNode.options.byTopicId;
      const topic = resources.topics.find((topic: any) => topic.topic.id === topicId);
      options = topic.topic.values;
    }

    const parsedNode = {
      heading: templateNode.heading,
      type: templateNode.type,
      options: options,
    };

    if (!templateNode.children) {
      return [parsedNode];
    }

    const childNodes = templateNode.children.flatMap((childNode: any) => {
      return this.parseTemplateNode(childNode, templateNode, resources);
    }) || [];

    return [parsedNode, ...childNodes];
  }
}