import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { ArrowLeftFromLine, Menu, Triangle } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import Navbar from "../components/Navbar";
import Comment from "../components/Comment";
import ReplyTextarea from "../components/ReplyTextarea";
import Loading from "../components/Loading";
import '../index.css';
// const socket = io('https://realtime-chatroom-5e6206396b62.herokuapp.com/');
const socket = io('http://localhost:5000');

export default function Member() {
  const [userData, setUserData] = useState({});
  const [newComment, setNewComment] = useState('');
  const [commentList, setCommentList] = useState([]);
  const [replyList, setReplyList] = useState(new Map());
  const [allMembers, setAllMembers] = useState([]);
  const [onlineMembers, setOnlineMembers] = useState([]);
  const [replyStatus, setReplyStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarCollapse, setSidebarCollapse] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [isMemberExpand, setIsMemberExpand] = useState(true);
  
  const memberListRef = useRef(null);
  const endOfCommentsRef = useRef(null);
  const commentsContainerRef = useRef(null);
  const isAtBottomRef = useRef(true);
  
  const navigate = useNavigate();
  const { repliedCommentId } = useParams();
  const { roomId } = useParams();

  const allMembersMap = useMemo(() => new Map(), []);

  allMembers.map(member => {
    allMembersMap.set(member._id, [member.imageUrl, member.name]);
  });

  const handleChange = (event) => {
    setNewComment(event.target.value);
  }

  const handleClick = async () => {
    const date = new Date().toLocaleString();

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/comment`, {
        commentUserId: userData._id,
        username: userData.name,
        comment: newComment,
        date: date,
        imageUrl: userData.imageUrl,
        roomId: roomId,
      }, {withCredentials: true});

      isAtBottomRef.current = (window.innerHeight - endOfCommentsRef.current.getBoundingClientRect().top) >= 128;
      setCommentList([...commentList, res.data.newComment]);
      socket.emit('send_comment', res.data.newComment, roomId);
    } catch (error) {
      console.log(error);
    }

    setNewComment('');
  }

  const handleReplyClick = (clickedId) => {
    if(replyStatus && clickedId === repliedCommentId) {
      navigate(`/member/${roomId}`);
      setReplyStatus(false);
    } else {
      navigate(`reply/${clickedId}`);
      setReplyStatus(true);

      setTimeout(() => {
        document.getElementById(clickedId).scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 0);
    }
  }

  const handleReplySendClick = async (reply) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/reply`, {
        repliedCommentId: repliedCommentId,
        reply: reply,
        replyUserId: userData._id,
      }, {withCredentials: true});

      const newReply = {
        _id: res.data.newReplyId,
        repliedCommentId: repliedCommentId,
        repliedCommentUserId: res.data.repliedCommentUserId,
        reply: reply,
        replyUserId: userData._id,
      };

      setReplyList(prevReplyList => {
        const updatedReplyList = new Map(prevReplyList);
        const existingReplies = updatedReplyList.get(repliedCommentId) || [];
        updatedReplyList.set(repliedCommentId, [...existingReplies, newReply]);
        return updatedReplyList;
      });

      socket.emit('send_reply', {
        ...newReply,
        roomId: roomId,
      });

      navigate(`/member/${roomId}`);
    } catch (error) {
      console.log(error);
    }
  }

  const handleSidebar = () => {
    setSidebarCollapse(prevState => !prevState);
  }

  const handleLeaveRoom = () => {
    socket.emit('leave_room', { roomId: roomId, userData: userData });
    navigate('/roomlist');
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/member`, {
          params: { roomId: roomId },
          withCredentials: true
        });

        setUserData(res.data.member);
      } catch (error) {
        console.log(error);
        
        navigate('/');
      }
    })()
  }, [navigate, roomId]);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/allmembers`, {
          params: { roomId: roomId, },
        });

        setAllMembers(res.data.members);
      } catch (error) {
        console.log(error);
      }
    })()
  }, [roomId]);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/comment`, {
          params: { roomId: roomId },
        });

        const comments = res.data.comments;

        const replyMap = new Map();
        comments.forEach(comment => {
          replyMap.set(comment._id, comment.replyComments);
        });

        setRoomName(res.data.roomName);
        setCommentList(comments);
        setReplyList(replyMap);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [roomId])


  useEffect(() => {
    if(!repliedCommentId) { 
      setReplyStatus(false);
    } else {
      setReplyStatus(true);
    }
  }, [repliedCommentId, setReplyStatus]);

  useEffect(() => {
    const handleReceiveComment = (data) => {
      isAtBottomRef.current = (window.innerHeight - endOfCommentsRef.current.getBoundingClientRect().top) >= 128;
      setCommentList(prevList => [...prevList, data]);
    };

    const handleReceiveReply = (data) => {
      setReplyList(prevList => {
        const updatedReplyList = new Map(prevList);
        const existingReplies = updatedReplyList.get(data.repliedCommentId) || [];
        updatedReplyList.set(data.repliedCommentId, [...existingReplies, data]);
        return updatedReplyList;
      })

      if(userData._id === data.repliedCommentUserId) {
        toast(`${allMembersMap.get(data.replyUserId)?.[1]} replied your comment.`, {
          action: {
            label: 'Check',
            onClick: () => {
              navigate(`reply/${data.repliedCommentId}`);
              setReplyStatus(true);

              setTimeout(() => {
                const replyDivs = document.getElementById('replyContainer').children;
                const lastReply = replyDivs[replyDivs.length - 1];
                lastReply.scrollIntoView({ behavior: 'smooth', block: 'center' });
                lastReply.classList.add('animate-highlight');
              }, 0);
            },
          },
        })
      }
    }

    const handleUpdateUsers = (data) => {
      if(data.every(member => Object.keys(member).length > 0)) {
        setOnlineMembers(data);
      }
    }

    socket.on('receive_comment', handleReceiveComment);
    socket.on('receive_reply', handleReceiveReply);
    socket.on('update_users_in_room', handleUpdateUsers);

    return () => {
      socket.off('receive_comment', handleReceiveComment);
      socket.off('receive_reply', handleReceiveReply);
      socket.off('update_users_in_room', handleUpdateUsers);

    };
  }, [allMembersMap, navigate, userData._id, allMembers]);

  useEffect(() => {
    socket.emit('join_room', {
      roomId: roomId,
      userData: userData,
    });

    // Handle the beforeunload event to detect when the user closes the tab or refreshes the page
    const handleBeforeUnload = () => {
      socket.emit('leave_room', { roomId: roomId, userData: userData });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);

      // Emit leave room event on component unmount
      socket.emit('leave_room', { roomId: roomId, userData: userData });
    }
  }, [roomId, userData]);

  useEffect(() => {
    if (onlineMembers.length > allMembers.length && onlineMembers.every(member => Object.keys(member).length > 0)) {
      const allMembersId = new Set(allMembers.map(member => member._id));
      const newMembers = onlineMembers.filter(member => !allMembersId.has(member._id));

      if (newMembers.length > 0) {
        setAllMembers(prevState => [...prevState, ...newMembers]);

        newMembers.forEach(newMember => {
          allMembersMap.set(newMember._id, [newMember.imageUrl, newMember.name]);
        });
      }
    }
  }, [allMembers, onlineMembers, allMembersMap]);

  useEffect(() => {
    if(isAtBottomRef.current) {
      endOfCommentsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [commentList]);
  
  return (
    <>
      <div className="bg-gray-900 relative h-dvh">
        <Navbar roomId={roomId} roomName={roomName} />
        <div className="w-full pt-20 h-dvh flex">
          <div className={`w-full md:w-48 lg:w-80 h-[calc(100%-80px)] bg-slate-600 flex flex-col items-center fixed z-[9999] md:z-0 transition-transform ${sidebarCollapse ? `-translate-x-full md:-translate-x-0` : ``}`}>
            <div className="w-full absolute z-50 bg-slate-600 ">
              {
                <div
                  className="py-2 items-center relative"
                >
                  <div className="flex items-center justify-center">
                    <img src={userData.imageUrl || `${import.meta.env.VITE_BASENAME}/profile-icon.jpg`} alt="" className="rounded-full ring-2 h-10 w-10 object-cover" />
                    <h2 className="ml-2 mr-1 text-white text-base lg:text-2xl">Hello, {userData.name}</h2>
                  </div>
                  <button
                    className={`bg-white w-10 h-10 rounded-md absolute top-3 right-6 md:hidden transition-transform ${sidebarCollapse ? `translate-x-[76px]` : ``}`}
                    onClick={() => {handleSidebar()}}
                  >
                    <Menu className="mx-auto" />
                  </button>
                </div>
              }
              <hr className="w-full h-1 my-2 bg-white" />
              <div className="w-full flex flex-col items-center text-white">
                <div className="w-full flex flex-col justify-center items-center">
                  <button type="button" className="w-full my-2 py-2 flex justify-center items-center bg-slate-600 hover:bg-gray-400" onClick={() => {handleLeaveRoom()}}>
                    <ArrowLeftFromLine className="mr-2" />
                    <span>Room<br />dashboard</span>
                  </button>
                  <button className="w-full flex items-center my-2 py-2 bg-slate-600 hover:bg-gray-400 justify-center" onClick={() => setIsMemberExpand(prevState => !prevState)}>
                    <span>Online members</span>
                    <Triangle className={`w-4 h-4 ml-2 transition-all ${isMemberExpand ? `rotate-180` : `rotate-90`}`} />
                  </button>
                </div>
              <div className={`overflow-y-auto flex transition-all duration-100 self-start ${isMemberExpand ? `animate-dropdown` : `-translate-y-full animate-dropup hidden`}`} ref={memberListRef}>
                <div className="w-0.5 ml-8 mr-4 bg-white"></div>
                <div className="-mx-4 overflow-y-scroll">
                  {
                    onlineMembers && onlineMembers.map((member) => {
                      return (
                        <div key={member._id} className="flex mx-4 p-2 items-center">
                          <img src={member.imageUrl || `${import.meta.env.VITE_BASENAME}/profile-icon.jpg`} alt="" className="rounded-full ring-2 h-8 w-8 object-cover" />
                          <h2 className="ml-2 mr-1 text-white text-md">{member.name}</h2>
                        </div>
                      );
                    })
                  }
                </div>
              </div>
            </div>
            
            </div>
          </div>
          <div ref={commentsContainerRef} className="w-full h-full flex md:flex-1 justify-center md:ml-48 lg:ml-80 overflow-y-hidden">
            <div className="w-full px-16 md:px-24 lg:px-36 xl:px-44 2xl:px-60 pb-32 flex flex-col overflow-y-auto">
              {
                isLoading ? <div className="fixed z-50 left-[55%] top-1/2">
                  <Loading type="bubbles" color="white" />
                </div> :
                commentList.map((comment) => {
                  return (
                    <div key={comment._id} className={`w-9/12 md:w-[350px] xl:w-[500px] ${userData._id === comment.commentUserId ? `self-end` : `self-start`}`}>
                      <Comment id={comment._id} name={comment.name} comment={comment.comment} date={comment.date} imageUrl={comment.imageUrl} likedUser={comment?.likedUser} userData={userData} handleReplyClick={handleReplyClick} replyComments={replyList.get(comment._id)} allMembersMap={allMembersMap} isLoading={isLoading} replyStatus={replyStatus} socket={socket} roomId={roomId} >
                        { comment._id === repliedCommentId && <ReplyTextarea name={comment.name} handleClick={handleReplySendClick} />}
                      </Comment>
                    </div>
                  );
                })
              }
              <div ref={endOfCommentsRef}></div>
            </div>
          </div>
          <div className={`rounded-xl w-full md:w-[calc(100%-384px)] lg:w-[calc(100%-608px)] xl:w-[calc(100%-672px)] 2xl:w-[calc(100%-800px)] ml-0 md:ml-[288px] lg:ml-[464px] xl:ml-[496px] 2xl:ml-[560px] h-32 border-2 border-slate-500 fixed bottom-0 z-[999]transition-transform duration-300 ${replyStatus ? `translate-y-[136px]` : `translate-y-0`}`}>
            <div className="h-3/4">
              <textarea rows="4" value={newComment} className="resize-none h-full w-full rounded-t-lg block p-2.5 text-lg bg-gray-700 border-gray-600 dark:placeholder-gray-400 dark:text-white outline-none" placeholder="Send a message..." onChange={handleChange} />
            </div>
            <div className="bg-gray-500 h-1/4 w-full rounded-b-lg flex justify-center items-center py-1">
              <button type="button" className="bg-blue-700 hover:bg-blue-900 text-white font-bold text-sm py-1 px-4 rounded" onClick={handleClick}>Send</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}