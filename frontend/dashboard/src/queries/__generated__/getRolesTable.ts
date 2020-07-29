/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PaginationWhereInput } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: getRolesTable
// ====================================================

export interface getRolesTable_roleConnection_roles_permissions {
  __typename: "PermssionType";
  id: string;
  name: string;
}

export interface getRolesTable_roleConnection_roles {
  __typename: "RoleType";
  id: string;
  name: string;
  nrPermissions: number | null;
  permissions: getRolesTable_roleConnection_roles_permissions[] | null;
}

export interface getRolesTable_roleConnection_permissions {
  __typename: "PermssionType";
  id: string;
  name: string;
}

export interface getRolesTable_roleConnection_pageInfo {
  __typename: "PaginationPageInfo";
  pageIndex: number;
  nrPages: number;
}

export interface getRolesTable_roleConnection {
  __typename: "RoleConnection";
  roles: getRolesTable_roleConnection_roles[];
  permissions: getRolesTable_roleConnection_permissions[];
  pageInfo: getRolesTable_roleConnection_pageInfo;
}

export interface getRolesTable {
  roleConnection: getRolesTable_roleConnection;
}

export interface getRolesTableVariables {
  customerId: string;
  filter?: PaginationWhereInput | null;
}
