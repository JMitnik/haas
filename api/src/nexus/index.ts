import customerNexus from '../models/customer/Customer';
import customerSettingsNexus from '../models/settings/CustomerSettings';
import dialogueNexus from '../models/questionnaire/Dialogue';
import edgeNexus from '../models/edge/Edge';
import permissionNexus from '../models/users/Permission';
import questionNodeNexus from '../models/question/QuestionNode';
import roleNexus from '../models/users/Role';
import sessionNexus from '../models/session/Session';
import topicBuilderNexus from '../models/topicBuilder/TopicBuilder';
import userNexus from '../models/users/User';

const nexus = [
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
