import businessWorkspaceTemplate from './businessWorkspaceTemplate';
import defaultWorkspaceTemplate from './defaultWorkspaceTemplate';
import sportWorkspaceEngTemplate from './sportWorkspaceEngTemplate';
import { defaultMassSeedTemplate } from './defaultWorkspaceTemplate';
import sportWorkspaceNlTemplate from './sportWorkspaceNlTemplate';
import studentWorkspaceTemplate from './studentWorkspaceEngTemplate';
import teacherWorkspaceTemplate from './teacherWorkspaceEngTemplate';

export default {
  student: studentWorkspaceTemplate,
  teacher: teacherWorkspaceTemplate,
  business: businessWorkspaceTemplate,
  sportEng: sportWorkspaceEngTemplate,
  sportNl: sportWorkspaceNlTemplate,
  massSeed: defaultMassSeedTemplate,
  default: defaultWorkspaceTemplate,
}