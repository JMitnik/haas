import * as AuthAPI from '../models/auth/Auth';
import * as DebugAPI from '../models/debug/Debug';
import * as InteractionAPI from '../models/session/Session';
import * as NodeEntryAPI from '../models/node-entry/NodeEntry';
import * as PaginationAPI from '../models/general/Pagination';
import * as QuestionNodeAPI from '../models/QuestionNode';
import * as UserAPI from '../models/users/User';
import * as WorkspaceAPI from '../models/customer/Customer';
import config from './config';
import customerSettingsNexus from '../models/settings/CustomerSettings';
import dialogueNexus from '../models/questionnaire/Dialogue';
import edgeNexus from '../models/edge/Edge';
import linkNexus from '../models/link/Link';
import permissionNexus from '../models/permission/Permission';
import roleNexus from '../models/role/Role';
import tagNexus from '../models/tag/Tag';
import triggerNexus from '../models/trigger/Trigger';

const nexus = [
  ...linkNexus,
  ...tagNexus,
  ...triggerNexus,
  ...permissionNexus,
  ...roleNexus,
  ...Array(WorkspaceAPI),
  ...Array(UserAPI),
  ...customerSettingsNexus,
  ...dialogueNexus,
  ...Array(AuthAPI),
  ...Array(AuthAPI),
  ...Array(PaginationAPI),
  ...Array(NodeEntryAPI),
  ...Array(InteractionAPI),
  ...Array(QuestionNodeAPI),
  ...edgeNexus,
  ...(config.isDebug ? Array(DebugAPI) : []),
];

export default nexus;
