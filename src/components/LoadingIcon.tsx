import React from "react";
import Lottie from "react-lottie";
import animationData from "../assets/loading-animation.json";

export const LoadingIcon: React.FC = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-100">
      <Lottie options={defaultOptions} height={100} width={100} />
    </div>
  );
};
