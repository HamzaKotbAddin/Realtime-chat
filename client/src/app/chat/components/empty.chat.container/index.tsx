"use client";
import React from "react";
import Lottie from "lottie-react";
import animationData from "@/assets/gradient.animation.json";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
const EmptyChatContainer = () => {
  return (
    <div className="flex-1 md:bg-[#1c1d25] md:flex flex-col justify-center items-center hidden duration-1000 transition-all">
      <div className="w-[300px] h-[300px]">
        <Lottie animationData={animationData} loop={true} />
      </div>
      <TextGenerateEffect
        words="welcome to chat"
        className="text-2xl text-purple-600 "
        filter={true}
      />
    </div>
  );
};

export default EmptyChatContainer;
