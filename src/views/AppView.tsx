import { useState } from 'react';
import { RoomContext } from '../context/roomContext';
import { ChannelContext } from '../context/channelContext';
import Spinner from '../components/utils/Spinner';
import AppLeftPanel from '../components/AppLeftPanel';
import AppMainPanel from '../components/AppMainPanel';
import AppUnauthorized from '../components/AppUnauthorized';
import useUser from "../hooks/useUser";
import Room from '../models/room';
import Channel from '../models/channel';

function AppView() {
  const [room, setRoom] = useState<Room | null>(null);
  const [channel, setChannel] = useState<Channel | null>(null);
  const { user, isLoading: isLoadingUser } = useUser();

  if (isLoadingUser) return <Spinner />;
  else if (!user) return <AppUnauthorized />;

  return (
    <RoomContext.Provider value={{ room, setRoom }}>
      <ChannelContext.Provider value={{ channel, setChannel }}>
        <div className="w-full h-screen bg-black text-white flex flex-col sm:flex-row">
          <AppLeftPanel />
          <AppMainPanel />
        </div>
      </ChannelContext.Provider>
    </RoomContext.Provider>
  );
}

export default AppView;
