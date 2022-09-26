import { DialogueTemplateType } from 'prisma/prisma-client';
import templates from '../../models/templates';
import { DemoWorkspaceTemplate } from '../../models/templates/TemplateTypes';

export function cartesian(...args: any) {
  var r: any = [], max = args.length - 1;
  function helper(arr: any[], i: any) {
    for (var j = 0, l = args[i].length; j < l; j++) {
      var a = arr.slice(0); // clone arr
      a.push(args[i][j]);
      if (i == max)
        r.push(a);
      else
        helper(a, i + 1);
    }
  }
  helper([], 0);
  return r;
}

/**
   * Creates an array of unique dialogue slugs + title pairs based on a template type
   * @param templateType 
   * @returns 
 */
export const generateCreateDialogueDataByTemplateLayers = (templateType: string) => {
  const template = getTemplate(templateType);

  let uniqueDialogues: string[][];

  if (template.rootLayer.length && template.subLayer.length && template.subSubLayer.length) {
    uniqueDialogues = cartesian(template.rootLayer, template.subLayer, template.subSubLayer);
  } else if (template.rootLayer.length && template.subLayer.length && !template.subSubLayer.length) {
    uniqueDialogues = cartesian(template.rootLayer, template.subLayer);
  } else {
    uniqueDialogues = cartesian(template.rootLayer);
  }

  const mappedDialogueInputData = uniqueDialogues.map(
    (dialogue: string[]) => {
      if (dialogue?.[0].length && dialogue?.[1].length) {
        return { slug: dialogue.join('-'), title: dialogue.join(' - ') };
      }
      return { slug: dialogue[0], title: dialogue[0] };
    });

  return mappedDialogueInputData;
}

export const getTemplate = (templateType: string): DemoWorkspaceTemplate => {
  switch (templateType) {
    case DialogueTemplateType.STUDENT_NL:
      return templates.studentNl;
    case DialogueTemplateType.TEACHER_NL:
      return templates.teacherNl;
    case DialogueTemplateType.STUDENT_ENG:
      return templates.student;
    case DialogueTemplateType.TEACHER_ENG:
      return templates.teacher;
    case DialogueTemplateType.BUSINESS_ENG:
      return templates.business;
    case DialogueTemplateType.SPORT_ENG:
      return templates.sportEng;
    case DialogueTemplateType.SPORT_NL:
      return templates.sportNl;
    case DialogueTemplateType.DEFAULT:
      return templates.default;
    default:
      return templates.default;
  }
}