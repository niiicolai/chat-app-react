import { JSX } from "react";
import ChannelProvider from '../providers/ChannelProvider';
import RoomProvider from '../providers/RoomProvider';
import UserProvider from '../providers/UserProvider';
import ToastProvider from "../providers/ToastProvider";
import WebsocketProvider from "../providers/WebsocketProvider";
import RollbarProvider from "../providers/RollbarProvider";
import AppMain from '../components/app/AppMain';

/**
 * @function AppView
 * @description The app view
 * @returns {JSX.Element} JSX.Element
 */
function AppView(): JSX.Element {
  return (
    <RollbarProvider slot={
      <UserProvider slot={
        <RoomProvider slot={
          <ChannelProvider slot={
            <ToastProvider slot={
              <WebsocketProvider slot={
                <AppMain />
              } />
            } />
          } />
        } />
      } />
    } />
  );
}

export default AppView;
