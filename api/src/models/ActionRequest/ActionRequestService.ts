import {
  ActionRequestState,
  AuditEventType,
  Customer,
  Prisma,
  PrismaClient,
} from 'prisma/prisma-client';
import { subDays } from 'date-fns'

import { ActionRequestPrismaAdapter } from './ActionRequestPrismaAdapter';
import {
  ActionRequestConnectionFilterInput,
  ActionRequestFilterInput,
  AssignUserToActionRequestInput,
  ConfirmActionRequestInput,
  SetActionRequestStatusInput,
  VerifyActionRequestInput,
} from './ActionRequest.types';
import { offsetPaginate } from '../general/PaginationHelpers';
import AuditEventService from '../AuditEvent/AuditEventService';
import { assertNonNullish } from '../../utils/assertNonNullish';
import { mailService } from '../../services/mailings/MailService';
import IssuePrismaAdapter from '../Issue/IssuePrismaAdapter';
import makeConfirmCompletedRequestTemplate, { makeConfirmCompletedRequestTemplateProps } from '../../services/mailings/templates/makeConfirmCompletedRequestTemplate';
import makeRejectedCompletedRequestTemplate, { makeRejectedCompletedRequestProps } from '../../services/mailings/templates/makeRejectedCompletedRequestTemplate';
import DialoguePrismaAdapter from '../questionnaire/DialoguePrismaAdapter';
import { CustomerPrismaAdapter } from '../customer/CustomerPrismaAdapter';
import { lasActionRequestAuditEventNeedsConfirm } from './ActionRequestService.helpers';
import UserPrismaAdapter from 'models/users/UserPrismaAdapter';

class ActionRequestService {
  private actionRequestPrismaAdapter: ActionRequestPrismaAdapter;
  private auditEventService: AuditEventService;
  private issuePrismaAdapter: IssuePrismaAdapter;
  private dialoguePrismaAdapter: DialoguePrismaAdapter;
  private customerPrismaAdapter: CustomerPrismaAdapter;
  private userPrismaAdapter: UserPrismaAdapter;

  constructor(prisma: PrismaClient) {
    this.actionRequestPrismaAdapter = new ActionRequestPrismaAdapter(prisma);
    this.auditEventService = new AuditEventService(prisma);
    this.issuePrismaAdapter = new IssuePrismaAdapter(prisma);
    this.dialoguePrismaAdapter = new DialoguePrismaAdapter(prisma);
    this.customerPrismaAdapter = new CustomerPrismaAdapter(prisma);
    this.userPrismaAdapter = new UserPrismaAdapter(prisma);
  }

  /**
   * Set last reminded field of stale requests (and adds an audit event)
   */
  public async updateLastRemindedStaleRequests(requestIds: string[], workspace: Customer) {
    const updateManyInput: Prisma.ActionRequestUpdateManyMutationInput = {
      lastRemindedAt: new Date(),
    };

    const whereInput: Prisma.ActionRequestWhereInput = {
      id: {
        in: requestIds,
      },
    };

    await this.actionRequestPrismaAdapter.updateMany(whereInput, updateManyInput);

    const auditEventInput: Prisma.AuditEventCreateInput = {
      type: AuditEventType.SEND_STALE_ACTION_REQUEST_REMINDER,
      version: 1.0,
      payload: Prisma.JsonNull,
      user: {
        connectOrCreate: {
          create: {
            email: `${workspace.slug}@haas.live`,
          },
          where: {
            email: `${workspace.slug}@haas.live`,
          },
        },
      },
      workspace: {
        connect: {
          id: workspace.id,
        },
      },
    }

    for (const requestId of requestIds) {
      await this.auditEventService.addAuditEventToActionRequest(requestId, auditEventInput);
    }
  }

  /**
   * Finds all stale action requests within a workspace 
   */
  public async findStaleWorkspaceActionRequests(workspaceId: string, daysNoAction: number) {
    const currentDate = new Date();
    const isStaleDate = subDays(currentDate, daysNoAction);

    const whereInput: Prisma.ActionRequestWhereInput = {
      dialogue: {
        customerId: workspaceId,
      },
      status: {
        notIn: ['DROPPED', 'COMPLETED'],
      },
      assigneeId: {
        not: null,
      },
      updatedAt: {
        lte: isStaleDate,
      },
    };

    return this.actionRequestPrismaAdapter.findMany(whereInput);
  }

  /**
   * Verify an action request
   */
  public async verifyActionRequest(input: VerifyActionRequestInput) {
    const actionRequest = await this.actionRequestPrismaAdapter.findById(input.actionRequestId);

    if (!actionRequest) return null;

    const updateArgs: Prisma.ActionRequestUpdateInput = { isVerified: !!input.actionRequestId ? true : false };
    return this.actionRequestPrismaAdapter.updateActionRequest(input.actionRequestId, updateArgs);
  }

  public async confirmActionRequest(input: ConfirmActionRequestInput) {
    // Check if actionRequest is still completed 
    const actionRequest = await this.actionRequestPrismaAdapter.findById(input.actionRequestId);
    if (actionRequest?.status !== ActionRequestState.COMPLETED) return null;

    // Check if there is already a completed AuditEvent with payload agree = true before doing anything
    const auditEvents = await this.auditEventService.findManyByActionRequestId(input.actionRequestId);
    if (!lasActionRequestAuditEventNeedsConfirm(auditEvents)) return null;

    // User doesn't agree action request has been correctly set to COMPLETED
    if (!input.agree) {
      await this.auditEventService.addAuditEventToActionRequest(input.actionRequestId, {
        type: AuditEventType.ACTION_REQUEST_REJECTED_COMPLETED,
        version: 1.0,
        workspace: {
          connect: {
            id: input.workspaceId,
          },
        },
        payload: Prisma.JsonNull,
      });

      // Set actionable back to pending 
      const updatedActionRequest = await this.setActionRequestStatus({
        actionRequestId: input.actionRequestId,
        status: ActionRequestState.PENDING,
        workspaceId: input.workspaceId,
      });

      const workspace = await this.customerPrismaAdapter.findWorkspaceById(input.workspaceId);

      // TODO: Send email to assignee user
      if (actionRequest.assigneeId && workspace) {
        const user = await this.userPrismaAdapter.getUserById(actionRequest.assigneeId);
        if (user) {
          this.dispatchRejectCompletedRequestJob({
            recipientEmail: user.email,
            recipientName: `${user.firstName} ${user.lastName}`,
            userId: user.id,
            workspaceSlug: workspace.slug,
          });
        };
      };

      return updatedActionRequest;
    };

    // User has agreed so create an confirm audit event
    await this.auditEventService.addAuditEventToActionRequest(input.actionRequestId, {
      type: AuditEventType.ACTION_REQUEST_CONFIRMED_COMPLETED,
      version: 1.0,
      workspace: {
        connect: {
          id: input.workspaceId,
        },
      },
      payload: Prisma.JsonNull,
    });

    return actionRequest;
  }

  /**
   * Sets the status of an actionRequest
   */
  public async setActionRequestStatus(input: SetActionRequestStatusInput) {
    const updateArgs: Prisma.ActionRequestUpdateInput = { status: input.status };
    const result = await this.actionRequestPrismaAdapter.updateActionRequest(input.actionRequestId, updateArgs);

    // Send email to user so they can confirm/reject request if finalized
    if (input.status === ActionRequestState.COMPLETED) {
      const actionRequest = await this.actionRequestPrismaAdapter.findById(input.actionRequestId);
      if (actionRequest?.requestEmail) {
        assertNonNullish(actionRequest?.dialogueId, 'Could not find dialogue id of action request');

        const dialogue = await this.dialoguePrismaAdapter.getDialogueById(actionRequest.dialogueId);
        const workspace = await this.customerPrismaAdapter.findWorkspaceById(input.workspaceId);

        assertNonNullish(workspace, 'Could not find workspace');
        assertNonNullish(dialogue, 'Could not find dialogue');
        assertNonNullish(actionRequest, 'Could not find action request');
        assertNonNullish(actionRequest.issueId, 'Could not find issue ID for request');

        const issue = await this.issuePrismaAdapter.findIssueById(actionRequest.issueId);
        const topic = issue?.topic.name || '';

        this.dispatchConfirmCompletedRequestJob({
          actionRequestId: actionRequest.id,
          dialogueSlug: dialogue.slug,
          requestCreatedDate: actionRequest.createdAt,
          requestEmail: actionRequest.requestEmail,
          topic,
          workspaceSlug: workspace.slug,
        })
      }
    }

    await this.auditEventService.addAuditEventToActionRequest(input.actionRequestId, {
      type: AuditEventType.SET_ACTION_REQUEST_STATUS,
      version: 1.0,
      workspace: {
        connect: {
          id: input.workspaceId,
        },
      },
      payload: {
        status: input.status,
        actionRequestId: input.actionRequestId,
      },
    });

    return result;
  };

  /**
   * Assigns a user to an actionRequest
   */
  public async assignUserToActionRequest(input: AssignUserToActionRequestInput) {
    const result = await this.actionRequestPrismaAdapter.assignUserToActionRequest(input);
    return result;
  };

  /**
   * Finds all actionRequests of an specific issue based on a filter
   * @param issueId 
   * @param filter 
   */
  public async findActionRequestsByIssueId(issueId: string, filter?: ActionRequestFilterInput) {
    return this.actionRequestPrismaAdapter.findActionRequestsByIssue(issueId, filter);
  }

  /**
   * Finds all actionRequests assigned to a user within a workspace.
   * @param workspaceId 
   * @param userId - id of the user requesting the function
   * @param canAccessAllactionRequests - if set to true, can see all actionRequests no matter whether you are assigned
   * @param filter 
   * @returns a paginated subset of actionRequests
   */
  public async findPaginatedWorkspaceActionRequests(
    workspaceId: string,
    userId: string,
    canAccessAllactionRequests: boolean,
    filter?: ActionRequestConnectionFilterInput,
  ) {
    const offset = filter?.offset ?? 0;
    const perPage = filter?.perPage ?? 5;

    const actionRequests = await this.actionRequestPrismaAdapter.findPaginatedActionRequestsByWorkspace(
      workspaceId, userId, canAccessAllactionRequests, filter,
    );
    const totalactionRequests = await this.actionRequestPrismaAdapter.countActionRequestsByWorkspace(
      workspaceId, userId, canAccessAllactionRequests, filter
    );

    const { totalPages, ...pageInfo } = offsetPaginate(totalactionRequests, offset, perPage);

    return {
      actionRequests: actionRequests,
      totalPages,
      pageInfo,
    };
  }

  /**
   * Finds all actionRequests of a specific issue based on a filter.
   * @returns a paginated subset of actionRequests
   */
  public async findPaginatedactionRequests(issueId: string, filter?: ActionRequestConnectionFilterInput) {
    const offset = filter?.offset ?? 0;
    const perPage = filter?.perPage ?? 5;

    const actionRequests = await this.actionRequestPrismaAdapter.findPaginatedActionRequests(issueId, filter);
    const totalactionRequests = await this.actionRequestPrismaAdapter.countActionRequests(issueId, filter);

    const { totalPages, ...pageInfo } = offsetPaginate(totalactionRequests, offset, perPage);

    return {
      actionRequests: actionRequests,
      totalPages,
      pageInfo,
    };
  }

  /**
   * Sends stale request email to a particular user
   */
  private dispatchRejectCompletedRequestJob(
    props: makeRejectedCompletedRequestProps
  ) {
    mailService.send({
      body: makeRejectedCompletedRequestTemplate(props),
      recipient: props.recipientEmail,
      subject: 'Someone has denied the completion of their action request!',
    });
  }

  /**
   * Sends stale request email to a particular user
   */
  private dispatchConfirmCompletedRequestJob(
    props: makeConfirmCompletedRequestTemplateProps
  ) {
    mailService.send({
      body: makeConfirmCompletedRequestTemplate(props),
      recipient: props.requestEmail,
      subject: 'Please approve a completed action request!',
    });
  }

}

export default ActionRequestService;
