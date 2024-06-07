import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <div className="h-dvh w-full flex flex-col justify-center items-center">
        <Outlet></Outlet>
      </div>
    </>
  );
}