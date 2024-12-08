import AppView from '../views/AppView';
import JoinRoomView from '../views/JoinRoomView';
import LoginView from '../views/LoginView';
import SignupView from '../views/SignupView';
import ForgotPasswordView from '../views/ForgotPasswordView';
import RedirectAuthView from '../views/RedirectAuthView';
import RedirectAuthConfirmView from '../views/RedirectAuthConfirmView';

import UserEditView from '../views/user/UserEditView';
import UserLoginsView from '../views/user/UserLoginsView';

import RoomListView from '../views/room/RoomListView';
import RoomEditView from '../views/room/RoomEditView';
import RoomCreateView from '../views/room/RoomCreateView';

export const routes = [
  {
    path: "/",
    element: <AppView />,
  },
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
    path: "/room/:roomInviteLinkUuid/join",
    element: <JoinRoomView />,
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
   * Rooms routes
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
    path: "/room/:room_uuid/edit",
    element: <RoomEditView />,
  },
];
