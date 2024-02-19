import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <h1 className="text-6xl text-black font-semibold">Welcome to member comment system!</h1>
      <div className="w-1/3 flex items-center justify-center text-center">
        <Link to="/signup" className="transform bg-sky-500 text-white p-4 rounded m-8 w-1/3 transition duration-100 hover:-translate-y-1 hover:bg-sky-700">Signup Now</Link>
        <Link to="/login" className="transform bg-sky-500 text-white p-4 rounded m-8 w-1/3 transition duration-100 hover:-translate-y-1 hover:bg-sky-700">Login</Link>
      </div>
    </>
  );
}