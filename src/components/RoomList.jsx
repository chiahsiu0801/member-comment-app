import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from "axios";
import Loading from "./Loading";
import FailedMessage from "./FailedMessage";

const hexStringSchema = z.string().refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
  message: "Invalid room id format!",
});

const validationSchema = z.object({
  id: hexStringSchema,
});

const RoomList = () => {
  const navigate = useNavigate();

  const [roomName, setRoomName] = useState('');
  const [roomList, setRoomList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [joinSuccess, setJoinSuccess] = useState(true);

  const userDataRef = useRef({});

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validationSchema),
  });

  const handleCreateRoom = async () => {
    const res = await axios.post('http://localhost:3000/createroom', {
      userId: userDataRef.current.member._id,
      roomName: roomName,
    }, {withCredentials: true});

    navigate(`/member/${res.data.newRoomId}`);
  }

  const handleJoinRoom = async (data) => {
    try {
      const res = await axios.post('http://localhost:3000/joinroom', {
        roomId: data.id,
        userId: userDataRef.current.member._id,
      });

      if(res.data.success) {
        navigate(`/member/${data.id}`);
        setJoinSuccess(true);
      }
    } catch (error) {
      setJoinSuccess(false);
    }
  }

  const handleLogOut = async () => {
    try {
      await axios.get('http://localhost:3000/signout', {withCredentials: true});
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const resMember = await axios.get('http://localhost:3000/member', {withCredentials: true});

        userDataRef.current = resMember.data;

        const resRoom = await axios.get('http://localhost:3000/room', {
          params: { userId: userDataRef.current.member._id } 
        });

        setRoomList(resRoom.data.roomList);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        
        navigate('/');
      }
    })()
  }, [navigate]);

  return ( 
    <div className="w-[300px] md:w-[500px] bg-white p-8 rounded-md shadow-md absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="flex flex-col gap-2">
        <label htmlFor="roomname" className="font-bold">Create new room</label>
        <input id="roomname" type="text" value={roomName} placeholder="Enter room name ..." onChange={(e) => setRoomName(e.target.value)} className="w-full p-2 border border-black rounded-md" />
        <button className="w-full bg-sky-500 text-white p-2 rounded hover:bg-sky-700" onClick={handleCreateRoom}>
          Create
        </button>
      </div>
      <form onSubmit={handleSubmit(handleJoinRoom)} className="flex flex-col gap-2 my-4">
        {
          (!joinSuccess) && <FailedMessage message="Room is not exist!" />
        }
        {errors.id && <FailedMessage message={errors.id.message} />}
        <label htmlFor="id" className="font-bold">Join another room</label>
        <input id="id" type="text" placeholder="Enter room id ..." className="w-full p-2 border border-black rounded-md" {...register("id")}/>
        <button type="submit" className="w-full bg-sky-500 text-white p-2 rounded hover:bg-sky-700">
          Join
        </button>
      </form>
      <div className="border-2 border-black mt-4 rounded-md p-2">
        <p className="font-bold">Joined rooms</p>
        <div className="h-40 flex flex-col items-center overflow-y-scroll">
          {
            isLoading ?
            <div className="my-auto">
              <Loading color={"gray"} type={"spin"} height={"50px"} width={"50px"} />
            </div> :
            roomList.map(room => (
              <Link key={room._id} to={`/member/${room._id}`} className="w-full p-2 text-center rounded-md bg-transparent hover:bg-gray-300">{room.roomName}</Link>
            ))
          }
        </div>
      </div>
      <button className="w-full bg-red-500 text-white mt-2 p-2 rounded hover:bg-red-700" onClick={handleLogOut}>
        Log out
      </button>
    </div>
   );
}
 
export default RoomList;