import ChannelProvider from '../providers/ChannelProvider';
import RoomProvider from '../providers/RoomProvider';
import UserProvider from '../providers/UserProvider';
import AppMain from '../components/AppMain';

function AppView() {
  return (
    <UserProvider slot={
      <RoomProvider slot={
        <ChannelProvider slot={
          <AppMain />
        } />
      } />
    } />
  );
}

export default AppView;
