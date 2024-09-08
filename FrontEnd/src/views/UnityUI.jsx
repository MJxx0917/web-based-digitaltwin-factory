import React from 'react';

const UnityUI = () => {
  return (
    <div className="h-screen w-screen m-0 p-0">
      <iframe
        src="/UnityProject/index.html" // Adjust path as needed
        className="border-none w-full h-full"
        title="Unity WebGL"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default UnityUI;

