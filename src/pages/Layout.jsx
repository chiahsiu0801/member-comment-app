import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <div className="min-h-dvh h-dvh w-full overflow-y-scroll flex flex-col">
        {/* <div className="bg-cover bg-center flex flex-col items-center justify-center overflow-y-scroll"> */}
          <Outlet></Outlet>
        {/* </div> */}
      </div>
    </>
  );
}