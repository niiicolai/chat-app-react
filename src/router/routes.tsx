import AppView from '../views/AppView';
import JoinRoomView from '../views/JoinRoomView';
import LoginView from '../views/LoginView';
import SignupView from '../views/SignupView';

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
    path: "/room/:roomInviteLinkUuid/join",
    element: <JoinRoomView />,
  },
];
