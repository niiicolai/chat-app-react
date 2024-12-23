import UserService from '../../services/userService';
import GhostIcon from '../icons/GhostIcon';
import LogoutIcon from '../icons/LogoutIcon';
import ListIcon from '../icons/ListIcon';
import UserGear from '../icons/UserGear';
import PlusIcon from '../icons/PlusIcon';
import KeyIcon from '../icons/KeyIcon';
import Button from '../utils/Button';
import { JSX } from 'react'
import { useNavigate } from 'react-router-dom';

/**
 * @function AppLeftPanel
 * @description The left panel of the app
 * @returns {JSX.Element} JSX.Element
 */
function AppLeftPanel(): JSX.Element {
  const navigate = useNavigate();

  const logout = () => {
    UserService.logout();
    localStorage.removeItem('user');
    navigate('/login')
  }

  const actions = [
    { name: 'Create Room', type: 'primary', onClick: () => { navigate('/room/create') }, slot: <PlusIcon fill="white" width="1em" />, testId: 'show-create-room-button' },
    { name: 'Browse Rooms', type: 'primary', onClick: () => { navigate('/rooms') }, slot: <ListIcon fill="white" width="1em" />, testId: 'browse-rooms-button' },
    { name: 'Edit Profile', type: 'primary', onClick: () => { navigate('/user/edit') }, slot: <UserGear fill="white" width="1em" />, testId: 'edit-profile-button' },
    { name: 'Logins', type: 'primary', onClick: () => { navigate('/user/logins') }, slot: <KeyIcon fill="white" width="1em" />, testId: 'logins-button' },
    { name: 'Logout', type: 'error', onClick: () => { logout() }, slot: <LogoutIcon fill="white" width="1em" />, testId: 'logout-button' }
  ]

  return (
    <div className='flex flex-row sm:flex-col justify-between gap-2 p-3 sm:h-screen border-b sm:border-r sm:border-b-0 border-gray-800'>
      <div className='flex items-center justify-center bg-gray-800 w-8 h-8 rounded-md cursor-pointer' onClick={() => navigate(`/`)} title='Chat App'>
        <GhostIcon fill="white" width=".8em" />
      </div>

      <div className='flex flex-row sm:flex-col gap-2'>
        {actions.map((action: { name:string, type:string, onClick: () => void, slot: JSX.Element, testId: string }, index: number) => (
          <Button onClick={action.onClick}
            display="w-8 h-8 p-1 font-bold flex items-center justify-center"
            button="button"
            type={action.type}
            slot={action.slot}
            title={action.name}
            key={index}
            testId={action.testId}
          />))}
      </div>
      
    </div>
  )
}

export default AppLeftPanel
