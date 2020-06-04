import customerNexus from '../models/customer/Customer';
import customerSettingsNexus from '../models/settings/CustomerSettings';
import dialogueNexus from '../models/questionnaire/Dialogue';
import edgeNexus from '../models/edge/Edge';
import questionNodeNexus from '../models/question/QuestionNode';
import sessionNexus from '../models/session/Session';
import topicBuilderNexus from '../models/topicBuilder/TopicBuilder';
import userNexus from '../models/users/User';

const nexus = [
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
