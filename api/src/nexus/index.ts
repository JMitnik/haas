import customerNexus from '../models/customer/Customer';
import customerSettingsNexus from '../models/settings/CustomerSettings';
import dialogueNexus from '../models/questionnaire/Dialogue';
import edgeNexus from '../models/edge/Edge';
import linkNexus from '../models/link/Link';
import permissionNexus from '../models/permission/Permission';
import questionNodeNexus from '../models/question/QuestionNode';
import roleNexus from '../models/role/Role';
import sessionNexus from '../models/session/Session';
import tagNexus from '../models/tag/Tag';
import triggerNexus from '../models/trigger/Trigger';
import userNexus from '../models/users/User';

const nexus = [
  ...linkNexus,
  ...tagNexus,
  ...triggerNexus,
  ...permissionNexus,
  ...roleNexus,
  ...userNexus,
  ...customerNexus,
  ...customerSettingsNexus,
  ...dialogueNexus,
  ...sessionNexus,
  ...questionNodeNexus,
  ...edgeNexus,
];

export default nexus;
