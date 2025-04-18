import React from "react";
import Lottie from "react-lottie";
import animationData from "../assets/success-animation.json";

export const AnimatedSuccessIcon: React.FC = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="flex justify-center items-center">
      <Lottie options={defaultOptions} height={250} width={250} />
    </div>
  );
};
