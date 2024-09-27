import { useNavigate } from "react-router-dom";
import { JSX } from "react";
import Alert from "../components/utils/Alert";
import Button from "../components/utils/Button";
import Spinner from "../components/utils/Spinner";
import useJoinRoom from "../hooks/useJoinRoom";

/**
 * @function JoinRoomView
 * @description The join room view
 * @returns {JSX.Element} JSX.Element
 */
function JoinRoomView(): JSX.Element {
    const { room, roomInviteLink, error, isLoading } = useJoinRoom();
    const navigate = useNavigate();
    const toApp = () => {
        navigate("/");
    }

    return (
        <div className="App w-full h-screen bg-black text-white flex items-center justify-center">
            <Alert type="error" message={error} />

            {room && roomInviteLink && (
                <div>
                    <h1 className="text-3xl font-bold mb-3">Welcome to {room?.name}</h1>
                    <p className="mb-3">
                        {room?.description}
                    </p>
                    <Button type="primary" onClick={toApp} slot="Go to App" />
                </div>
            )}

            {isLoading && (
                <div>
                    <h1 className="text-3xl font-bold mb-3">Joining Room</h1>
                    <Spinner isLoading={isLoading} width="2em" fill="white" />
                </div>
            )}

            {!room && !roomInviteLink && !error && !isLoading && (
                <div>
                    <h1 className="text-3xl font-bold mb-3">Something went wrong</h1>
                    <p className="mb-3">
                        This may be an error on the server, an invalid link or you may already be in the room.
                    </p>
                    <Button type="error" onClick={toApp} slot="Go to App" />
                </div>    
            )}

        </div>
    )
}

export default JoinRoomView;
