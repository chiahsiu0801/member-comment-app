import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import Navbar from "../components/Navbar";
import Comment from "../components/Comment";
import ReplyTextarea from "../components/ReplyTextarea";

import '../index.css'; 
import Loading from "../components/Loading";

export default function Member() {
  const [userData, setUserData] = useState({});
  const [newComment, setNewComment] = useState('');
  const [commentList, setCommentList] = useState([]);
  const [allMembers, setAllMembers] = useState([]);
  const [replyStatus, setReplyStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const memberListRef = useRef(null);
  const arrowIconRef = useRef(null);

  const repliedCommentIdRef = useRef('');
  const scrollElementTopRef = useRef(0);
  const scrollElementRef = useRef(null);
  
  const navigate = useNavigate();
  const { repliedCommentId } = useParams();
  
  if(repliedCommentId) {
    repliedCommentIdRef.current = repliedCommentId;
    if(document.getElementById(repliedCommentIdRef.current) && document.getElementById(repliedCommentIdRef.current)?.offsetTop !== 0)
    scrollElementTopRef.current = document.getElementById(repliedCommentIdRef.current)?.offsetTop;
  }


  const allMembersMap = new Map();

  allMembers.map(member => {
    allMembersMap.set(member._id, [member.imageUrl, member.name]);
  });

  const getComments = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get('/api/comment');

      setCommentList(res.data.comments);
      setIsLoading(false); 
    } catch (error) {
      console.log(error);
    }
  }

  const handleChange = (event) => {
    setNewComment(event.target.value);
  }

  const handleClick = async () => {
    const date = new Date().toLocaleString();

    try {
      await axios.post('/api/comment', {
        username: userData.name,
        comment: newComment,
        date: date
      });

      getComments();
    } catch (error) {
      console.log(error);
    }

    setNewComment('');
  }

  const handleDorpdownClick = () => {
    memberListRef.current.classList.toggle('opacity-0');
    
    if(memberListRef.current.classList.contains('top-[116px]')) {
      memberListRef.current.classList.remove('top-[116px]');
      memberListRef.current.classList.add('-top-[116px]'); 
    } else {
      memberListRef.current.classList.add('top-[116px]');
      memberListRef.current.classList.remove('-top-[116px]'); 
    }

    arrowIconRef.current.classList.toggle('-rotate-90');
  }

  const handleReplyClick = (repliedCommentId, replyRef) => {
    setReplyStatus(true);

    navigate(`reply/${repliedCommentId}`);
    
    replyRef.current.classList.add('translate-y-[48px]');
  }

  const handleReplySendClick = async (reply) => {
    try {
      await axios.post('api/reply', {
        repliedCommentId: repliedCommentId,
        reply: reply,
        replyUserId: userData._id,
      });

      getComments();

      navigate('/member');
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('/api/member');

        setUserData(res.data.member);
      } catch (error) {
        console.log(error);
        
        navigate('/');
      }
    })()
  }, [navigate]);

  useEffect(() => {
    getComments();
  }, [])

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('/api/allmembers');

        setAllMembers(res.data.members);
      } catch (error) {
        console.log(error);
      }
    })()
  }, []);

  useEffect(() => {
    if(!repliedCommentId) { 
      setReplyStatus(false);
    } else {
      setReplyStatus(true);
    }
  }, [repliedCommentId, setReplyStatus]);

  useEffect(() => {
    scrollElementRef.current = document.getElementById(repliedCommentIdRef.current);
  }, [repliedCommentId])

  useEffect(() => {
    window.scrollTo(0, scrollElementTopRef.current - 80);
  }, [commentList]);
  
  document.body.style.backgroundColor = 'rgb(17, 24, 39)';
  
  return (
    <>
      <div className="bg-gray-900 h-full relative flex flex-col">
        <Navbar commentNums={commentList.length} />
        <div className="w-full flex">
          <div className="w-1/5 h-full bg-slate-600 flex flex-col items-center fixed top-[80px]">
            <div className="w-full absolute z-10 bg-slate-600">
              {
                <div className="flex p-2 items-center justify-center">
                  <img src={userData.imageUrl || `${import.meta.env.VITE_BASENAME}/profile-icon.jpg`} alt="" className="rounded-full ring-2 h-10 w-10 object-cover" />
                  <h2 className="ml-2 mr-1 text-white text-2xl">Hello, {userData.name}</h2>
                </div>
              }
              <hr className="w-full h-1 my-2 bg-white" />
              <div className="mx-10 self-start w-full">
                <button type="button" onClick={handleDorpdownClick} className="">
                  <h3 className="text-white font-bold my-2 flex items-center">
                    <div className="bg-slate-600 w-full">All members</div>
                    <svg ref={arrowIconRef} xmlns="http://www.w3.org/2000/svg" className="mx-1 transition-all" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                    </svg>
                  </h3>
                </button>  
              </div>
            </div>
            
            <div className="flex transition-all duration-100 self-start ml-[10%] absolute top-[116px]" ref={memberListRef}>
              <div className="w-0.5 mx-4 bg-white"></div>
              <div className="-mx-4">
                {
                  allMembers.map((member) => {
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
          <div className="flex flex-col w-4/5 items-center ml-[20%]">
            <div className={replyStatus ? "replyTextArea" : "commentTextArea"}>
              <div className="h-3/4">
                <textarea rows="4" value={newComment} className="resize-none h-full w-full rounded-t-lg block p-2.5 text-lg bg-gray-700 border-gray-600 dark:placeholder-gray-400 dark:text-white outline-none" placeholder="Write a comment..." onChange={handleChange} />
              </div>
              <div className="bg-gray-500 h-1/4 w-full rounded-b-lg flex justify-center items-center py-1">
                <button type="button" className="bg-blue-700 hover:bg-blue-900 text-white font-bold text-sm py-1 px-4 rounded" onClick={handleClick}>Post comment</button>
              </div>
            </div>
            <div className="w-2/3 mt-[80px] mb-[12%]">
              {
                isLoading ? <div className="fixed z-50 left-[55%] top-1/2">
                  <Loading type="bubbles" color="white" />
                </div> :
                commentList.map((comment) => {
                  return (
                    <Comment key={comment._id} id={comment._id} name={comment.name} comment={comment.comment} date={comment.date} imageUrl={comment.imageUrl} likedUser={comment?.likedUser} userData={userData} handleReplyClick={handleReplyClick} replyComments={comment?.replyComments} allMembersMap={allMembersMap} isLoading={isLoading} >
                      { comment._id === repliedCommentId && <ReplyTextarea name={comment.name} handleClick={handleReplySendClick} />}
                    </Comment>
                  );
                })
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
}