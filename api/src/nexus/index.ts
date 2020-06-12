import customerNexus from '../models/customer/Customer';
import customerSettingsNexus from '../models/settings/CustomerSettings';
import dialogueNexus from '../models/questionnaire/Dialogue';
import edgeNexus from '../models/edge/Edge';
import permissionNexus from '../models/permission/Permission';
import questionNodeNexus from '../models/question/QuestionNode';
import roleNexus from '../models/role/Role';
import sessionNexus from '../models/session/Session';
import topicBuilderNexus from '../models/topicBuilder/TopicBuilder';
import triggerNexus from '../models/trigger/Trigger';
import userNexus from '../models/users/User';

const nexus = [
  ...triggerNexus,
  ...permissionNexus,
  ...roleNexus,
  ...userNexus,
  ...customerNexus,
  ...customerSettingsNexus,
  ...dialogueNexus,
  ...sessionNexus,
  ...questionNodeNexus,
  ...topicBuilderNexus,
  ...edgeNexus,
];

export default nexus;
