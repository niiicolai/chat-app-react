import { useState, useContext, JSX } from 'react'
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/userContext';
import UserService from '../../services/userService';
import RoomCreate from '../room/RoomCreate';
import RoomList from '../room/RoomList';
import UserEdit from '../user/UserEdit';
import GhostIcon from '../icons/GhostIcon';
import LogoutIcon from '../icons/LogoutIcon';
import ListIcon from '../icons/ListIcon';
import UserGear from '../icons/UserGear';
import PlusIcon from '../icons/PlusIcon';
import Button from '../utils/Button';

/**
 * @function AppLeftPanel
 * @description The left panel of the app
 * @returns {JSX.Element} JSX.Element
 */
function AppLeftPanel(): JSX.Element {
  const { setUser } = useContext(UserContext);
  const [browseRooms, setBrowseRooms] = useState(false);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [editUser, setEditUser] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    setUser(null);
    UserService.logout();
    localStorage.removeItem('user');
    navigate('/login')
  }

  const actions = [
    { name: 'Create Room', type: 'primary', onClick: () => { setShowCreateRoom(true) }, slot: <PlusIcon fill="white" width="1em" /> },
    { name: 'Browse Rooms', type: 'primary', onClick: () => { setBrowseRooms(true) }, slot: <ListIcon fill="white" width="1em" /> },
    { name: 'Edit Profile', type: 'primary', onClick: () => { setEditUser(true) }, slot: <UserGear fill="white" width="1em" /> },
    { name: 'Logout', type: 'error', onClick: () => { logout() }, slot: <LogoutIcon fill="white" width="1em" /> }
  ]

  return (
    <div className='flex flex-row sm:flex-col justify-between gap-2 p-3 sm:h-screen border-b sm:border-r sm:border-b-0 border-gray-800'>
      <RoomCreate showCreateRoom={showCreateRoom} setShowCreateRoom={setShowCreateRoom} />
      <RoomList browseRooms={browseRooms} setBrowseRooms={setBrowseRooms} />
      <UserEdit editUser={editUser} setEditUser={setEditUser} />

      <div className='flex items-center justify-center bg-gray-800 w-8 h-8 rounded-md' title='Chat App'>
        <GhostIcon fill="white" width=".8em" />
      </div>

      <div className='flex flex-row sm:flex-col gap-2'>
        {actions.map((action: { name:string, type:string, onClick: () => void, slot: JSX.Element }, index: number) => (
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
