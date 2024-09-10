import RoomCreate from '../components/room/RoomCreate'
import RoomList from '../components/room/RoomList'

function AppView() {
  return (
    <div className="App w-full h-screen bg-black text-white">
      <div className="">
        <RoomList />
        <RoomCreate />
      </div>
    </div>
  )
}

export default AppView
