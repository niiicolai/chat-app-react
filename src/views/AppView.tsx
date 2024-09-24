import { ReactNode } from "react";
import ChannelProvider from '../providers/ChannelProvider';
import RoomProvider from '../providers/RoomProvider';
import UserProvider from '../providers/UserProvider';
import ToastProvider from "../providers/ToastProvider";
import AppMain from '../components/AppMain';

/**
 * @function AppView
 * @description The app view
 * @returns {ReactNode} ReactNode
 */
function AppView(): ReactNode {
  return (
    <UserProvider slot={
      <RoomProvider slot={
        <ChannelProvider slot={
          <ToastProvider slot={
            <AppMain />
          } />
        } />
      } />
    } />
  );
}

export default AppView;
