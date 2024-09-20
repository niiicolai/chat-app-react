import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import useUser from '../hooks/useUser';

import RoomCreate from '../components/room/RoomCreate';
import RoomList from '../components/room/RoomList';
import UserEdit from '../components/user/UserEdit';

import GhostIcon from '../components/icons/GhostIcon';
import LogoutIcon from '../components/icons/LogoutIcon';
import ListIcon from '../components/icons/ListIcon';
import UserGear from '../components/icons/UserGear';
import PlusIcon from '../components/icons/PlusIcon';

import Button from '../components/utils/Button'

function AppLeftPanel(props: any) {
  const [browseRooms, setBrowseRooms] = useState(false);
  const [createRoom, setCreateRoom] = useState(false);
  const [editUser, setEditUser] = useState(false);
  const { logout } = useUser();
  const navigate = useNavigate();

  const actions = [
    { name: 'Create Room', type: 'primary', onClick: () => { setCreateRoom(true) }, slot: <PlusIcon fill="white" width="1em" /> },
    { name: 'Browse Rooms', type: 'primary', onClick: () => { setBrowseRooms(true) }, slot: <ListIcon fill="white" width="1em" /> },
    { name: 'Edit Profile', type: 'primary', onClick: () => { setEditUser(true) }, slot: <UserGear fill="white" width="1em" /> },
    { name: 'Logout', type: 'error', onClick: () => { logout().then(()=> navigate('/login')) }, slot: <LogoutIcon fill="white" width="1em" /> }
  ]

  return (
    <div className='flex flex-row sm:flex-col justify-between gap-2 p-3 sm:h-screen border-b sm:border-r sm:border-b-0 border-gray-800'>
      <RoomCreate createRoom={createRoom} setCreateRoom={setCreateRoom} />
      <RoomList browseRooms={browseRooms} setBrowseRooms={setBrowseRooms} />
      <UserEdit editUser={editUser} setEditUser={setEditUser} />

      <div className='flex items-center justify-center bg-gray-800 w-8 h-8 rounded-md' title='Chat App'>
        <GhostIcon fill="white" width=".8em" />
      </div>

      <div className='flex flex-row sm:flex-col gap-2'>
        {actions.map((action: any, index: number) => (
          <Button onClick={action.onClick}
            display="w-8 h-8 p-1 font-bold flex items-center justify-center"
            button="button"
            type={action.type}
            slot={action.slot}
            title={action.name}
            key={index}
          />))}
      </div>
      
    </div>
  )
}

export default AppLeftPanel
