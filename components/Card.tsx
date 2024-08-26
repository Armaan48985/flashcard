// Card.tsx
'use client';
import React, { useEffect, useState } from 'react';
import ReactCardFlip from 'react-card-flip';
import { BiDownvote, BiSolidDownvote, BiSolidUpvote, BiUpvote } from 'react-icons/bi';
import { FaBitcoin } from 'react-icons/fa';
import { useAccount, useAccountEffect, useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { IoMdClose } from 'react-icons/io';
import { setUserDataa } from '@/app/supabaseFunc';
import { Tooltip } from './Tooltip';

const Card = ({ front, back }: any) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [upvoted, setUpvoted] = useState(false);
  const [downvoted, setDownvoted] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tipAmount, setTipAmount] = useState('');
  const [showTooltip, setShowTooltip] = useState({ upvote: false, downvote: false, bitcoin: false });

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };
 
 const { isConnected } = useAccount();



  const handleVote = (type: 'upvote' | 'downvote') => {
    if (type === 'upvote') {
      setUpvoted(!upvoted);
      setDownvoted(false);
    } else if (type === 'downvote') {
      setDownvoted(!downvoted);
      setUpvoted(false);
    }
  };


  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };
  const { sendTransaction, isSuccess, status,data, failureReason,error } = useSendTransaction();

  const [transactionStatus, setTransactionStatus] = useState('');
  const [transactionMessage, setTransactionMessage] = useState<any>('');
  const [transdata, setTransData] = useState('');
  const [messageLoading, setMessageLoading] = useState(false)

  const checkTransaction = async () => {
    if(data){
      setMessageLoading(false)
      setTransactionStatus('success');
      setTransactionMessage('Transaction successful! Thank you for your tip.');
    }
    else if(error){
      setMessageLoading(false)
      setTransactionStatus('error');
      setTransactionMessage(failureReason?.name);
    }
    else{
      setTransactionMessage('');
    }
  }

  useEffect(() => {
    checkTransaction()
  }, [transdata, isSuccess, error, data])

  const sendTip = async () => {
    setMessageLoading(true)
    setTransactionStatus('');
    setTransactionMessage(''); 
    try {
      await sendTransaction({
        to: '0xb50c2a93683b8dA575cD8f93602f3dB89a27A1e4',
        value: parseEther(tipAmount),
      });
  
      if(isSuccess){
        console.log("yay", data)
        setTransData(data)
      }

    } catch (error) {
      console.error('Transaction Error:', error);
    }
  };



  return (
    <div className="flex flex-col justify-center items-center">
      <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
        <div
          onClick={handleClick}
          className="w-[360px] h-[450px] bg-[#0f1f36] text-white rounded-lg shadow-lg flex justify-center items-center cursor-pointer transform transition-transform duration-500 ease-in-out hover:scale-105"
        >
          <h2>{front}</h2>
        </div>

        <div
          onClick={handleClick}
          className="w-[360px] h-[450px] bg-[#0f1f36] text-white rounded-lg shadow-lg flex justify-center items-center cursor-pointer transform transition-transform duration-500 ease-in-out hover:scale-105"
        >
          <h2>{back}</h2>
        </div>
      </ReactCardFlip>

      <div className="flex-center gap-10 mt-8 relative">
        <div
          className="relative"
          onMouseEnter={() => setShowTooltip({ ...showTooltip, upvote: true })}
          onMouseLeave={() => setShowTooltip({ ...showTooltip, upvote: false })}
        >
          <div
            className={`border-white ${upvoted && 'text-green-500'} border-[1px] cursor-pointer rounded-full p-5 hover:scale-105 duration-100`}
            onClick={() => handleVote('upvote')}
          >
            <span className="text-2xl font-bold">{!upvoted ? <BiUpvote /> : <BiSolidUpvote />}</span>
          </div>
          {showTooltip.upvote && (
            <Tooltip text="Upvote" />
          )}
        </div>

        <div
          className="relative"
          onMouseEnter={() => setShowTooltip({ ...showTooltip, downvote: true })}
          onMouseLeave={() => setShowTooltip({ ...showTooltip, downvote: false })}
        >
          <div
            className={`border-white ${downvoted && 'text-red-500'} border-[1px] cursor-pointer rounded-full p-5 hover:scale-105 duration-100`}
            onClick={() => handleVote('downvote')}
          >
            <span className="text-2xl font-bold">{!downvoted ? <BiDownvote /> : <BiSolidDownvote />}</span>
          </div>
          {showTooltip.downvote && (
            <Tooltip text="Downvote" />
          )}
        </div>

        <div
          className="relative"
          onClick={openDialog}
          onMouseEnter={() => setShowTooltip({ ...showTooltip, bitcoin: true })}
          onMouseLeave={() => setShowTooltip({ ...showTooltip, bitcoin: false })}
        >
          <div
            className="border-white border-[1px] cursor-pointer rounded-full p-5 hover:scale-105 duration-100"
          >
            <span className="text-2xl font-bold"><FaBitcoin /></span>
          </div>
          {showTooltip.bitcoin && (
            <Tooltip text="Tip the creator" />
          )}
        </div>
      </div>



      {isDialogOpen && (
  <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
    <div className="relative bg-white text-black p-6 rounded-lg shadow-lg w-[90%] max-w-sm">
      <span onClick={() => setIsDialogOpen(false)} className='text-xl text-black flex justify-end cursor-pointer'><IoMdClose /></span>

      <h2 className="text-2xl font-bold mb-6 ml-8">Tip with Eth</h2>

      <div className="mb-6 flex justify-center">
        <ConnectButton showBalance={false} />
      </div>


        <div className="flex flex-col items-center text-black">
          <div className="flex flex-col items-center mb-4 w-full">
            <input 
              type="text" 
              value={tipAmount} 
              onChange={(e) => setTipAmount(e.target.value)} 
              className="w-full p-2 border border-gray-300 rounded mb-2 focus:outline-none focus:border-blue-500"
              placeholder="Enter tip amount"
            />
            <button 
              onClick={sendTip} 
              className={`bg-blue-500 ${!isConnected && 'bg-gray-300'} text-white py-2 px-4 rounded w-full transition duration-150`}
              {...(isConnected ? {} : { disabled: true })}
            >
              Send Tip
            </button>

            {messageLoading ? (
              <div className="mt-4 text-center text-gray-500">Waiting for transaction...</div>
            ) : (
              transactionStatus && (
                <div
                  className={`mt-4 text-center ${
                    transactionStatus === 'success' ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {transactionMessage}
                </div>
              )
            )}
          </div>
        </div>
    </div>
  </div>
)}

    </div>
  );
};

export default Card;
