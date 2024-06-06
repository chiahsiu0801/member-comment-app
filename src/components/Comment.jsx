import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CornerDownRight, Heart, MessageSquareText } from "lucide-react";
import React from "react";
import axios from "axios";

export default function Comment({ children, id, name, comment, date, imageUrl, likedUser, userData, handleReplyClick, replyComments, allMembersMap, replyStatus, socket, roomId }) {
  const [likedUserList, setLikedUserList] = useState(likedUser ? likedUser : []);

  const commentRef = useRef(null);
  const replyRef = useRef(null);
  const commentSectionRef = useRef(null);
  
  const totalRef = useRef(null);

  const { repliedCommentId } = useParams();
  
  const handleLikeClick = async () => {
    try {
      if(!likedUserList.includes(userData._id)) {
        setLikedUserList([...likedUserList, userData._id]);

        const likeData = {
          commentId: id,
          likedUser: userData._id,
          isLike: true,
        };

        await axios.post('https://member-real-time-chatroom-kh1jbl21r-chiahsiu0801s-projects.vercel.app/like', likeData, {withCredentials: true});

        socket.emit('send_like', {
          ...likeData,
          roomId: roomId,
        });
      } else {
        setLikedUserList(likedUserList.filter(userId => userId !== userData._id));

        const unlikeData = {
          commentId: id,
          likedUser: userData._id,
          isLike: false,
        };

        await axios.post('https://member-real-time-chatroom-kh1jbl21r-chiahsiu0801s-projects.vercel.app/like', unlikeData, {withCredentials: true});

        socket.emit('send_like', {
          ...unlikeData,
          roomId: roomId,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const handleReceiveLike = (data) => {
      if(data.commentId === id && data.isLike) {
        setLikedUserList(prevList => [...prevList, data.likedUser]);
      } else if(data.commentId === id && !data.isLike) {
        setLikedUserList(prevList => prevList.filter(userId => {
          return userId !== data.likedUser
        }));
      }
    };

    socket.on('receive_like', handleReceiveLike);

    return () => {
      socket.off('receive_like', handleReceiveLike);
    };
  }, [id, socket]);

  return (
    <>
      <div className="bg-gray-700 text-gray-400 px-6 py-2 md:py-4 rounded-lg my-4 relative box-content" id={id} ref={commentSectionRef}>
        <div className="bg-gray-700" ref={commentRef}>
          <div className="bg-gray-700">
            <div className="flex items-center my-1">
              <img src={imageUrl || `${import.meta.env.VITE_BASENAME}/profile-icon.jpg`} alt="" className="rounded-full ring-2 h-6 md:h-10 w-6 md:w-10 object-cover" />
              <h2 className="ml-2 mr-1 text-white text-md md:text-lg">{name}</h2>
              <p className="mx-1 mt-0.5 text-xs md:text-sm">{date}</p>
            </div>
            <pre className="my-2 md:my-4 text-wrap font-sans">
              {comment}
            </pre>
            <div className="flex text-sm my-2">
              <button type="button" className={`flex items-center mr-px hover:-translate-y-1 transition-all ${likedUserList.includes(userData._id) ? `text-red-500` : `text-inherit`}`} onClick={handleLikeClick}>
                <Heart className="w-3 md:w-5 h-3 md:h-5" />
                <p className="mx-1 text-xs md:text-base">{likedUserList.length} Likes</p>
              </button>
              <button type="button" className="flex items-center mx-1 hover:-translate-y-1 transition-all" onClick={() => {
                handleReplyClick(id, replyRef);
              }}>
                <MessageSquareText className="w-3 md:w-5 h-3 md:h-5" />
                <p className="mx-1 text-xs md:text-base">Reply</p>
              </button>
            </div>
          </div>
          <div className={`transition-all duration-300 ${(replyStatus && repliedCommentId === id) ? `-translate-y-0 animate-dropdown` : `-translate-y-full`}`}>
            {
              replyComments && replyStatus && repliedCommentId === id && (
              <div className="flex ml-1" ref={totalRef}>
                <div className="w-full" id="replyContainer">
                  {
                    replyComments?.map(replyComment => {
                      return (
                        <div key={replyComment._id} className="w-full my-2 py-1 rounded-md reply">
                          <div className="flex items-center">
                            <CornerDownRight className="mr-2" />
                            <img src={allMembersMap.get(replyComment.replyUserId)?.[0] || `${import.meta.env.VITE_BASENAME}/profile-icon.jpg`} alt="" className="rounded-full ring-2 h-3 md:h-6 w-3 md:w-6 object-cover" />
                            <h2 className="ml-2 mr-1 text-white text-sm md:text-md">{allMembersMap.get(replyComment.replyUserId)?.[1]}</h2>
                          </div>
                          <pre className="text-sm md:text-md ml-[54px] md:ml-[66px] text-wrap font-sans">{replyComment.reply}</pre>
                        </div>
                      );
                    })
                  }
                </div>
              </div>)
            }
            <div className="" ref={replyRef}>
              {children && React.Children.map(children, child =>
                React.cloneElement(child)
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}