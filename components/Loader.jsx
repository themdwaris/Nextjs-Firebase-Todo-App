import React from "react";
import Image from "next/image";

const Loader = () => {
  return (
    <div className="fixed top-0 left-0 h-full w-full flex justify-center items-center">
      <Image height={100} width={100} src="/loader.svg" alt="loading"/>
    </div>
  );
};

export default Loader;
