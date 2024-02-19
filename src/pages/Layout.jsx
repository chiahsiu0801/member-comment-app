import { Outlet } from "react-router-dom";

export default function Layout() {
  document.body.style.backgroundColor = '';

  return (
    <>
      <div className="min-h-screen relative top-0 left-0 w-full">
        <img src="./../public/miko.jpg" alt="" className="w-full h-full bg-cover absolute opacity-60" />
        <div className="w-full min-h-screen bg-cover bg-center flex flex-col items-center justify-center absolute">
          <Outlet></Outlet>
        </div>
      </div>
    </>
  );
}