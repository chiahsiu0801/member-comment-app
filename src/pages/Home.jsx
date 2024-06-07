import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <h1 className="text-4xl md:text-5xl my-2 px-4 text-white font-bold text-center">Connect Instantly with Our Real-Time Chat App</h1>
      <p className="text-xl md:text-3xl my-2 px-4 text-white font-semibold text-center">Experience seamless and secure conversations anytime, anywhere.</p>
      <div className="mt-8 flex gap-4 items-center justify-center text-center">
        <Link to="/signup" className="w-32 h-full transform bg-sky-500 text-white p-4 rounded transition duration-100 hover:-translate-y-1 hover:bg-sky-700">Signup Now</Link>
        <Link to="/login" className="w-32 h-full transform bg-sky-500 text-white p-4 rounded transition duration-100 hover:-translate-y-1 hover:bg-sky-700">Login</Link>
      </div>
    </>
  );
}