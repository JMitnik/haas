// import * as AuthAPI from '../models/auth/Auth';
import * as DebugAPI from '../models/debug/Debug';
import * as NodeEntryAPI from '../models/node-entry/NodeEntry';
import * as PaginationAPI from '../models/general/Pagination';
import config from './config';
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
  // ...Array(AuthAPI),
  ...Array(PaginationAPI),
  ...Array(NodeEntryAPI),
  ...sessionNexus,
  ...questionNodeNexus,
  ...edgeNexus,
  ...(config.isDebug ? Array(DebugAPI) : []),
];

export default nexus;
