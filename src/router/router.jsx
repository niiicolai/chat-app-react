import { createBrowserRouter } from "react-router-dom";
import AppView from "../views/AppView";
import JoinRoomView from "../views/JoinRoomView";
import LoginView from "../views/LoginView";
import SignupView from "../views/SignupView";

export const router = createBrowserRouter([
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
    path: "/join-room/:roomUuid",
    element: <JoinRoomView />,
  },
]);
