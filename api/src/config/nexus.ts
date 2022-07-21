import * as AuthAPI from '../models/auth/Auth';
import * as AutodeckAPI from '../models/autodeck/Autodeck';
import * as AutomationAPI from '../models/automations';
import * as CampaignAPI from '../models/Campaigns';
import * as DebugAPI from '../models/debug/Debug';
import * as InteractionAPI from '../models/session/graphql';
import * as NodeEntryAPI from '../models/node-entry/NodeEntry';
import * as PaginationAPI from '../models/general/Pagination';
import * as SandboxAPI from '../models/Common/Sandbox/graphql/SandboxMutation.graphql';
import * as OrganizationAPI from '../models/organization/graphql';
import * as QuestionNodeAPI from '../models/QuestionNode';
import * as DateAPI from '../models/Common/Date/graphql';
import * as IssueAPI from '../models/Issue/graphql';
import * as CommonAnalyticsAPI from '../models/Common/Analytics/graphql';
import * as CommonStatusAPI from '../models/Common/Status/graphql';
import * as UserAPI from '../models/users/graphql';
import * as WorkspaceAPI from '../models/customer';
import * as GenerateWorkspaceAPI from '../models/generate-workspace';
import * as TopicAPI from '../models/Topic/graphql';
import config from './config';
import customerSettingsNexus from '../models/settings/CustomerSettings';
import * as DialogueAPI from '../models/questionnaire';
import edgeNexus from '../models/edge/Edge';
import linkNexus from '../models/link/Link';
import permissionNexus from '../models/permission/Permission';
import * as RoleAPI from '../models/role';
import tagNexus from '../models/tag/Tag';
import triggerNexus from '../models/trigger/Trigger';
import uploadNexus from '../models/link/graphql/UploadUpsellFileResolver';

const nexus = [
  ...Array(OrganizationAPI),
  ...Array(CommonAnalyticsAPI),
  ...Array(DateAPI),
  ...Array(CommonStatusAPI),
  ...Array(SandboxAPI),
  ...Array(GenerateWorkspaceAPI),
  ...Array(AutodeckAPI),
  ...linkNexus,
  ...tagNexus,
  ...Array(TopicAPI),
  ...Array(IssueAPI),
  ...Array(AutomationAPI),
  ...Array(CampaignAPI),
  ...triggerNexus,
  ...permissionNexus,
  ...Array(RoleAPI),
  ...Array(WorkspaceAPI),
  ...Array(UserAPI),
  ...customerSettingsNexus,
  ...Array(DialogueAPI),
  ...Array(uploadNexus),
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
