import AppView from '../views/AppView';
import JoinRoomView from '../views/JoinRoomView';
import LoginView from '../views/LoginView';
import SignupView from '../views/SignupView';
import ForgotPasswordView from '../views/ForgotPasswordView';

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
];
