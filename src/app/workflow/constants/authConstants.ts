/* eslint-disable import/prefer-default-export */
export enum Permissions {
  PUBLIC = 'public',

  VIEW_DASHBOARD = 'view_dashboard',
  VIEW_ENTITY = 'view_entity',
  CREATE_ENTITY = 'add_entity',
  UPDATE_ENTITY = 'change_entity',
  DELETE_ENTITY = 'delete_entity',
  CREATE_EMAIL_ADDRESS = 'add_emailaddress',
  UPDATE_EMAIL_ADDRESS = 'change_emailaddress',
  DELETE_EMAIL_ADDRESS = 'delete_emailaddress',
  VIEW_EMAIL_ADDRESS = 'view_emailaddress',

  // ==================== SPECIAL/CUSTOM PERMISSIONS ====================
  EDIT_TICKET_COMMENT = 'can_edit_ticket_comment',
  EDIT_TICKET_STATUS = 'can_edit_ticket_status',

  // ==================== ACCOUNT AGGREGATOR PERMISSONS =================
  VIEW_AA_ACCOUNT_PROFILE = 'view_aaaccountprofile',
  VIEW_AA_ACCOUNT_SUMMARY = 'view_aaaccountsummary',
  VIEW_AA_CONSENT = 'view_aaconsent',
  VIEW_AA_DATA_REQUEST = 'view_aadatarequest',
  VIEW_AA_DATA_REQUEST_EVENT = 'view_aadatarequestevent',
  VIEW_AA_DATA_REQUEST_RESULT = 'view_aadatarequestresult',
  VIEW_AA_LINKED_ACCOUNT = 'view_aalinkedaccount',
  VIEW_AA_PENDING_TRANSACTION = 'view_aapendingtransaction',
}
