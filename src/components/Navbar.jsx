import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Navbar({ roomId, roomName }) {
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      await axios.get('http://localhost:3000/signout', {withCredentials: true});
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <nav className="w-full h-20 flex items-center justify-between flex-wrap bg-cyan-700 px-2 py-4 fixed top-0 z-[99999]">
        <div className="flex flex-col flex-shrink-0 text-white mr-6 ml-2">
          <span className="font-bold text-xl md:text-2xl tracking-tight">{roomName}</span>
          <span className="text-xs md:text-sm text-gray-300">Room Id: {roomId}</span>
        </div>
        <div>
          <button type="button" className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-sky-500 hover:bg-white" onClick={handleClick}>Log out</button>
        </div>
      </nav>
    </>
  );
}