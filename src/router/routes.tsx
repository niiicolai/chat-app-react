import AppView from '../views/DashboardView';

import LoginView from '../views/auth/LoginView';
import SignupView from '../views/auth/SignupView';
import ForgotPasswordView from '../views/auth/ForgotPasswordView';
import RedirectAuthView from '../views/auth/RedirectAuthView';
import RedirectAuthConfirmView from '../views/auth/RedirectAuthConfirmView';

import UserEditView from '../views/user/UserEditView';
import UserLoginsView from '../views/user/UserLoginsView';

import RoomListView from '../views/room/RoomListView';
import RoomEditView from '../views/room/RoomEditView';
import RoomCreateView from '../views/room/RoomCreateView';
import RoomDeleteView from '../views/room/RoomDeleteView';
import RoomSettingEditView from '../views/room_setting/RoomSettingEditView';
import RoomLeaveView from '../views/room/RoomLeaveView';
import RoomShowView from '../views/room/RoomShowView';

import RoomFileListView from '../views/room_file/RoomFileListView';
import RoomFileDeleteView from '../views/room_file/RoomFileDeleteView';

import RoomInviteLinkListView from '../views/room_invite_link/RoomInviteLinkListView';
import RoomInviteLinkCreateView from '../views/room_invite_link/RoomInviteLinkCreateView';
import RoomInviteLinkEditView from '../views/room_invite_link/RoomInviteLinkEditView';
import RoomInviteLinkDeleteView from '../views/room_invite_link/RoomInviteLinkDeleteView';
import RoomInviteLinkJoinView from '../views/room_invite_link/RoomInviteLinkJoinView';
import RoomUserListView from '../views/room_user/RoomUserListView';

import ChannelCreateView from '../views/channel/ChannelCreateView';
import ChannelEditView from '../views/channel/ChannelEditView';
import ChannelDeleteView from '../views/channel/ChannelDeleteView';
import ChannelShowView from '../views/channel/ChannelShowView';

import ChannelWebhookListView from '../views/channel_webhook/ChannelWebhookListView';
import ChannelWebhookCreateView from '../views/channel_webhook/ChannelWebhookCreateView';
import ChannelWebhookEditView from '../views/channel_webhook/ChannelWebhookEditView';
import ChannelWebhookDeleteView from '../views/channel_webhook/ChannelWebhookDeleteView';
import ChannelWebhookTestView from '../views/channel_webhook/ChannelWebhookTestView';

export const routes = [
  {
    path: "/",
    element: <AppView />,
  },

  /**
   * Auth routes
   */
  {
    path: "/login",
    element: <LoginView />,
  },
  {
    path: "/signup",
    element: <SignupView />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordView />,
  },
  {
    path: "/redirect/auth",
    element: <RedirectAuthView />,
  },
  {
    path: "/redirect/auth/confirm",
    element: <RedirectAuthConfirmView />,
  },

  /**
   * User routes
   */
  {
    path: "/user/edit",
    element: <UserEditView />,
  },
  {
    path: "/user/logins",
    element: <UserLoginsView />,
  },

  /**
   * Room routes
   */
  {
    path: "/rooms",
    element: <RoomListView />,
  },
  {
    path: "/room/create",
    element: <RoomCreateView />,
  },
  {
    path: "/room/:room_uuid",
    element: <RoomShowView />,
  },
  {
    path: "/room/:room_uuid/edit",
    element: <RoomEditView />,
  },
  {
    path: "/room/:room_uuid/settings/edit",
    element: <RoomSettingEditView />,
  },
  {
    path: "/room/:room_uuid/delete",
    element: <RoomDeleteView />,
  },
  {
    path: "/room/:room_uuid/leave",
    element: <RoomLeaveView />,
  },

  /**
   * Room file routes
   */
  {
    path: "/room/:room_uuid/files",
    element: <RoomFileListView />,
  },
  {
    path: "/room/:room_uuid/file/:file_uuid/delete",
    element: <RoomFileDeleteView />,
  },

  /**
   * Room invite link routes
   */
  {
    path: "/room/:room_uuid/links",
    element: <RoomInviteLinkListView />,
  },
  {
    path: "/room/:room_uuid/link/create",
    element: <RoomInviteLinkCreateView />,
  },
  {
    path: "/room/:room_uuid/link/:room_invite_link_uuid/edit",
    element: <RoomInviteLinkEditView />,
  },
  {
    path: "/room/:room_uuid/link/:room_invite_link_uuid/delete",
    element: <RoomInviteLinkDeleteView />,
  },
  {
    path: "/room/:room_invite_link_uuid/join",
    element: <RoomInviteLinkJoinView />,
  },

  /**
   * Room user routes
   */
  {
    path: "/room/:room_uuid/users",
    element: <RoomUserListView />,
  },

  /**
   * Channel routes
   */
  {
    path: "/room/:room_uuid/channel/create",
    element: <ChannelCreateView />,
  },
  {
    path: "/room/:room_uuid/channel/:channel_uuid",
    element: <ChannelShowView />,
  },
  {
    path: "/room/:room_uuid/channel/:channel_uuid/edit",
    element: <ChannelEditView />,
  },
  {
    path: "/room/:room_uuid/channel/:channel_uuid/delete",
    element: <ChannelDeleteView />,
  },

  /**
   * Channel Webhook routes
   */
  {
    path: "/room/:room_uuid/webhooks",
    element: <ChannelWebhookListView />,
  },
  {
    path: "/room/:room_uuid/webhook/create",
    element: <ChannelWebhookCreateView />,
  },
  {
    path: "/room/:room_uuid/webhook/:channel_webhook_uuid/edit",
    element: <ChannelWebhookEditView />,
  },
  {
    path: "/room/:room_uuid/webhook/:channel_webhook_uuid/delete",
    element: <ChannelWebhookDeleteView />,
  },
  {
    path: "/room/:room_uuid/webhook/:channel_webhook_uuid/test",
    element: <ChannelWebhookTestView />,
  },
];
