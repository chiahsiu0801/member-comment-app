import { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "../index.css";

export default function ReplyTextarea({ name, handleClick }) {
  const { roomId } = useParams();

  const [reply, setReply] = useState('');
  const textareaRef = useRef(null);

  const handleChange = (e) => {
    setReply(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  }

  return (
    <div className="mt-1 relative">
      <div>
        <textarea rows="1" className="resize-none w-full rounded-lg block p-2.5 text-sm md:text-md bg-gray-500 border-gray-600 dark:placeholder-gray-400 dark:text-white outline-none" placeholder={`Reply to ${name}...`} onChange={handleChange} value={reply} ref={textareaRef} />
      </div>
      <button type="button" className="hover:text-white text-slate-300 font-bold text-sm py-1 px-4 rounded absolute bottom-0 left-full -translate-x-full -translate-y-1/3" onClick={() => {
        handleClick(reply, roomId);
        setReply('');
      }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"  viewBox="0 0 16 16">
          <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z"/>
        </svg>
      </button>
    </div> 
  );
}