import customerNexus from '../models/customer/Customer';
import customerSettingsNexus from '../models/settings/CustomerSettings';
import dialogueNexus from '../models/questionnaire/Dialogue';
import sessionNexus from '../models/session/Session';
import questionNodeNexus from '../models/question/QuestionNode';
import topicBuilderNexus from '../models/topicBuilder/TopicBuilder';
import edgeNexus from '../models/edge/Edge';

const nexus = [
  ...customerNexus,
  ...customerSettingsNexus,
  ...dialogueNexus,
  ...sessionNexus,
  ...questionNodeNexus,
  ...topicBuilderNexus,
  ...edgeNexus,
];

export default nexus;
