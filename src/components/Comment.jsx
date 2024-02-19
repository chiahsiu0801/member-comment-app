import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import React from "react";

export default function Comment({ children, id, name, comment, date, imageUrl, likedUser, userData, handleReplyClick, replyComments, allMembersMap }) {
  const [like, setLike] = useState(false);
  const [likeNumber, setLikeNumber] = useState(likedUser ? likedUser.length : 0);
  // const [replyTop, setReplyTop] = useState(0);

  const commentRef = useRef(null);
  const replyRef = useRef(null);
  const commentSectionRef = useRef(null);
  
  const totalRef = useRef(null);
  const replyCommentsRef = useRef(null);
  const lineRef = useRef(null);

  const { repliedCommentId } = useParams();

  const likeButtonStyle = {
    color: (like || (likedUser?.includes(userData._id))) ? "#fd0e35" : ""
  };
  
  const handleLikeClick = async () => {
    try {
      await axios.post('/api/like', {
        commentId: id,
        likedUser: userData._id
      });

      setLike(true);

      if(!likedUser?.includes(userData._id)) {
        setLikeNumber(likedUser ? likedUser.length + 1 : 1);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const calculateHeight = () => {
    let commentHeight;
    let replyHeight;

    if(commentRef.current) {
      commentHeight = commentRef.current.offsetHeight;
    }

    if(replyRef.current) {
      replyHeight = replyRef.current.offsetHeight;
    }

    commentSectionRef.current.style.height = commentHeight + replyHeight + 'px';
    
    if(replyHeight === 48) {
      replyRef.current.style.top = commentHeight + 16 - replyHeight + 'px'; 
    }
  }

  

  useEffect(() => { 
    calculateHeight();
  }, [replyRef, handleReplyClick]);

  useEffect(() => {
    if(id !== repliedCommentId) {
      replyRef.current.classList.remove('translate-y-[48px]');
    }
  }, [id, repliedCommentId]);

  useEffect(() => {
    if(repliedCommentId === id) {
      replyRef.current.classList.add('translate-y-[48px]');
    }
  }, [repliedCommentId, id, handleReplyClick]);

  useEffect(() => {
    let lineHeight = totalRef.current?.offsetHeight - replyCommentsRef.current?.lastChild?.offsetHeight + (replyCommentsRef.current?.lastChild?.firstChild?.offsetHeight / 2) - 8;

    if(lineRef.current) {
      lineRef.current.style.height = lineHeight + 'px'; 
    }
  }, [replyComments])

  return (
    <div className="bg-gray-700 text-gray-400 px-6 py-4 rounded-lg my-4 z-5 relative box-content" id={id} ref={commentSectionRef}>
      <div className="absolute z-20 bg-gray-700 left-6 right-6" ref={commentRef}>
        <div className="flex items-center my-1">
          <img src={imageUrl || `../../../../public/profile-icon.jpg`} alt="" className="rounded-full ring-2 h-10 w-10 object-cover" />
          <h2 className="ml-2 mr-1 text-white text-lg">{name}</h2>
          <p className="mx-1 mt-0.5 text-sm">{date}</p>
        </div>
        <pre className="my-4 text-wrap font-sans">
          {comment}
        </pre>
        <div className="flex text-sm">
          <button type="button" className="flex mr-px hover:-translate-y-1 transition-all" onClick={handleLikeClick} 
          style={likeButtonStyle}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
            <p className="mx-1">{likeNumber} Likes</p> 
          </button>
          <button type="button" className="flex mx-1 hover:-translate-y-1 transition-all" onClick={() => {
            handleReplyClick(id, replyRef);
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
            </svg>
            <p className="mx-1">Reply</p>  
          </button>
        </div>
        {
          replyComments && (
          <div className="flex my-4" ref={totalRef}>
            <div className="ml-4 min-w-0.5 bg-slate-500" ref={lineRef}></div>
            <div ref={replyCommentsRef}>
              {
                replyComments?.map(replyComment => {
                  return (
                    <div key={replyComment._id} className="my-2">
                      <div className="flex items-center">
                        <div className="mr-2 w-4 border-b-2 border-slate-500"></div>
                        <img src={allMembersMap.get(replyComment.replyUserId)?.[0] || `../../../../public/profile-icon.jpg`} alt="" className="rounded-full ring-2 h-6 w-6 object-cover" />
                        <h2 className="ml-2 mr-1 text-white text-lg">{allMembersMap.get(replyComment.replyUserId)?.[1]}</h2>
                      </div>
                      <pre className="text-md ml-14 text-wrap font-sans">{replyComment.reply}</pre>
                    </div>
                  );
                })
              }
            </div>
          </div>)
        }
      </div>
      {/* comment - reply in calculateHeight */}
      <div className="absolute left-6 right-6 z-10 transition-transform delay-100 duration-300" ref={replyRef}>
        {/* { children } */}
        {children && React.Children.map(children, child =>
          React.cloneElement(child, { calculateHeight })
        )}
      </div>
    </div>
  );
}