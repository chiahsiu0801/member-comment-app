import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Navbar({ commentNums }) {
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      await axios.get('https://member-comment-system.onrender.com/signout', {withCredentials: true});
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <nav className="w-full flex items-center justify-between flex-wrap bg-cyan-700 p-6 fixed z-30">
        <div className="flex items-center flex-shrink-0 text-white mr-6">
          <span className="font-semibold text-xl tracking-tight">Member Comments ({commentNums})</span>
        </div>
        <div>
          <button type="button" className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-sky-500 hover:bg-white mt-4 lg:mt-0" onClick={handleClick}>Log out</button>
        </div>
      </nav>
    </>
  );
}