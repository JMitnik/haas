import React from 'react';
import { ReactComponent as ChatIcon } from 'assets/icons/icon-chat-group.svg';
import { ReactComponent as CursorIcon } from 'assets/icons/icon-chat-group.svg';
import { SystemPermission } from 'types/globalTypes';
import { ReactComponent as EyeIcon } from 'assets/icons/icon-user.svg';
import * as Rf from 'react-feather';

interface GlobalPermissionListPropertiesOutput {
  icon: React.FC<React.SVGProps<SVGSVGElement>> | any;
  bg: string;
  color: string;
  stroke?: string;
  label?:string;
  domain?:string;
}


export const GlobalPermissionList = (type: any): GlobalPermissionListPropertiesOutput=>{
    switch (type){
        case SystemPermission.CAN_ACCESS_ADMIN_PANEL:{
            return {
                icon: ChatIcon,
                bg:'',
                color:'tertiary',
                label:'CAN_ACCESS_ADMIN_PANEL',
                domain:''
            }
        }
        case SystemPermission.CAN_ADD_USERS:{
            return {
                icon: Rf.Plus,
                bg:'',
                color: 'tertiary',
                label:'CAN_ADD_USERS',
                domain:''
            }
        }
        case SystemPermission.CAN_BUILD_DIALOGUE:{
            return {
                icon: ChatIcon,
                bg:'',
                color: 'success',
                label:'CAN_BUILD_DIALOGUE',
                domain:''
            }
        }
        case SystemPermission.CAN_CREATE_TRIGGERS:{
            return {
                icon: Rf.Bell,
                bg:'',
                color: 'muted',
                label:'CAN_CREATE_TRIGGERS',
                domain:'Create'
            }
        }
        case SystemPermission.CAN_DELETE_TRIGGERS:{
            return {
                icon: Rf.Delete,
                bg:'',
                color: 'error',
                label:'CAN_DELETE_TRIGGERS',
                domain:'Delete'
            }
        }
        case SystemPermission.CAN_DELETE_USERS:{
            return {
                icon: Rf.UserX,
                bg:'',
                color: 'error',
                label:'CAN_DELETE_USERS',
                domain:'Delete'
            }
        }
        case SystemPermission.CAN_DELETE_WORKSPACE:{
            return {
                icon: Rf.XSquare,
                bg:'',
                color: 'warning',
                label:'CAN_DELETE_WORKSPACE',
                domain:'Delete'
            }
        }
        case SystemPermission.CAN_EDIT_DIALOGUE:{
            return {
                icon: Rf.Edit,
                bg:'',
                color: 'strongPrimary',
                label:'CAN_EDIT_DIALOGUE',
                domain:'Edit'
            }
        }
        case SystemPermission.CAN_EDIT_USERS:{
            return {
                icon: Rf.Edit2,
                bg:'',
                color: 'text',
                label:'CAN_EDIT_USERS',
                domain:'Edit'
            }
        }
        case SystemPermission.CAN_EDIT_WORKSPACE:{
            return {
                icon: Rf.Edit3,
                bg:'',
                color: 'tertiary',
                label:'CAN_EDIT_WORKSPACE',
                domain:'Edit'
            }
        }
        case SystemPermission.CAN_VIEW_DIALOGUE:{
            return {
                icon: EyeIcon,
                bg:'',
                color: '#99cc33',
                label:'CAN_VIEW_DIALOGUE',
                domain:'View'
            }
        }
        case SystemPermission.CAN_VIEW_DIALOGUE_ANALYTICS:{
            return {
                icon: Rf.BarChart2,
                bg:'',
                color: 'warning',
                label:'CAN_VIEW_DIALOGUE_ANALYTICS',
                domain:'View'
            }
        }
        case SystemPermission.CAN_VIEW_USERS:{
            return {
                icon: Rf.Users,
                bg:'',
                color: 'primaryAlt',
                label:'CAN_VIEW_USERS',
                domain:'View'
            }
        }
        case SystemPermission.CAN_VIEW_CAMPAIGNS:{
            return {
                icon: Rf.Grid,
                bg:'',
                color: 'warning',
                label:'CAN_VIEW_CAMPAIGNS',
                domain:'View'
            }
        }
        case SystemPermission.CAN_CREATE_CAMPAIGNS:{
            return {
                icon: Rf.FilePlus,
                bg:'',
                color: 'success',
                label:'CAN_CREATE_CAMPAIGNS',
                domain:'Create'
            }
        }
        case SystemPermission.CAN_CREATE_DELIVERIES:{
            return {
                icon: Rf.Send,
                bg:'',
                color: 'error',
                label:'CAN_CREATE_DELIVERIES',
                domain:'Create'
            }
        }
        default:{
            return {
                icon: CursorIcon,
                bg: '#e4e5ec',
                color: '#323546',
                label:'default'
            }
        }
    }
}

