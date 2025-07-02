import React from "react";

const Auth = () => {
  return (
    <div className="h-[100vh] w-[100vw]  flex justify-center items-center">
      <div className="h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[70vw] lg:w-[60vw]  rounded-lg grid xl:grid-cols-2">
        <div className="flex justify-center items-center gap-10 ">
          <div className="flex justify-center items-center flex-col">
            <div className="flex justify-center items-center">
              <h1 className="text-5xl font-bold  md:text-6xl ">Welcome</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
