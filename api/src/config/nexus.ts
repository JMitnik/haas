import * as AuthAPI from '../models/auth/Auth';
import * as DebugAPI from '../models/debug/Debug';
import * as NodeEntryAPI from '../models/node-entry/NodeEntry';
import * as PaginationAPI from '../models/general/Pagination';
import * as QuestionNodeAPI from '../models/question/QuestionNode';
import * as UserAPI from '../models/users/User';
import config from './config';
import customerNexus from '../models/customer/Customer';
import customerSettingsNexus from '../models/settings/CustomerSettings';
import dialogueNexus from '../models/questionnaire/Dialogue';
import edgeNexus from '../models/edge/Edge';
import linkNexus from '../models/link/Link';
import permissionNexus from '../models/permission/Permission';
import roleNexus from '../models/role/Role';
import sessionNexus from '../models/session/Session';
import tagNexus from '../models/tag/Tag';
import triggerNexus from '../models/trigger/Trigger';

const nexus = [
  ...linkNexus,
  ...tagNexus,
  ...triggerNexus,
  ...permissionNexus,
  ...roleNexus,
  ...customerNexus,
  ...Array(UserAPI),
  ...customerSettingsNexus,
  ...dialogueNexus,
  ...Array(AuthAPI),
  ...Array(AuthAPI),
  ...Array(PaginationAPI),
  ...Array(NodeEntryAPI),
  ...sessionNexus,
  ...Array(QuestionNodeAPI),
  ...edgeNexus,
  ...(config.isDebug ? Array(DebugAPI) : []),
];

export default nexus;
