'use client'
import React, { useState } from 'react'
import ReactCardFlip from 'react-card-flip';

const Card = ({front, back}:any) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="flex justify-center items-center">
      <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
        <div
          onClick={handleClick}
          className="w-[400px] h-[480px] px-5 bg-[#0f1f36] text-white rounded-lg shadow-lg flex justify-center items-center cursor-pointer transform transition-transform duration-500 ease-in-out hover:scale-105"
        >
          <h2 className="text-lg">{front}</h2>
        </div>

        <div
          onClick={handleClick}
          className="w-[400px] h-[480px] px-5 bg-[#0f1f36] text-white rounded-lg shadow-lg flex justify-center items-center cursor-pointer transform transition-transform duration-500 ease-in-out hover:scale-105"
        >
          <h2 className="text-lg">{back}</h2>
        </div>
      </ReactCardFlip>
    </div>
  );
}


export default Card