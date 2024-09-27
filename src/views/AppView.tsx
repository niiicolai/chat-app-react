import { JSX } from "react";
import ChannelProvider from '../providers/ChannelProvider';
import RoomProvider from '../providers/RoomProvider';
import UserProvider from '../providers/UserProvider';
import ToastProvider from "../providers/ToastProvider";
import AppMain from '../components/app/AppMain';

/**
 * @function AppView
 * @description The app view
 * @returns {JSX.Element} JSX.Element
 */
function AppView(): JSX.Element {
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
