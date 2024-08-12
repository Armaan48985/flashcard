'use client'
import { useEffect, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { motion, AnimatePresence } from 'framer-motion';
import Card from "@/components/Card";
import { IoIosArrowBack, IoIosArrowForward, IoMdClose } from "react-icons/io";
import { supabase } from '@/lib/supabase';

type CardType = {
  id: number;
  front: string;
  back: string;
  created_at: string;
};

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [frontText, setFrontText] = useState('');
  const [backText, setBackText] = useState('');
  const [cardData, setCardData] = useState<CardType[]>([]);

  useEffect(() => {
    const fetchCards = async () => {
      const { data, error } = await supabase.from('cards').select('*');

      if (data) {
        setCardData(data);
      } else {
        console.log(error);
      }
    };

    fetchCards();
  }, []); // Empty dependency array to run only once on component mount

  const handleSwipe = (dir: any) => {
    if (cardData.length === 0) return; // No cards to swipe through

    if (dir === 'LEFT') {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % cardData.length);
    } else if (dir === 'RIGHT') {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + cardData.length) % cardData.length);
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleSwipe('LEFT'),
    onSwipedRight: () => handleSwipe('RIGHT'),
    trackMouse: true
  });

  const createCard = async () => {
    if (frontText.trim() === '' || backText.trim() === '') {
      alert('Please fill in all fields');
      return;
    }

    const { data, error } = await supabase.from('cards').insert({ front: frontText, back: backText }).select('*');

    if (data) {
      setCardData((prevData) => [...prevData, ...data]); // Add new card to existing data
      setFrontText('');
      setBackText('');
      setIsDialogOpen(false);
    } else {
      console.log(error);
    }
  };

  return (
    <div className="w-full min-h-screen bg-black flex flex-col text-white">
      <div className="w-full flex-center p-6">
        <h1 className="text-6xl font-bold text-white mt-10 text-center relative">
          FlashCards
          <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-56 h-1 bg-blue-500 rounded-full"></span>
        </h1>

        <button
          className="absolute top-3 right-5 flex justify-end bg-[#163664] px-4 my-6 py-2 cursor-pointer rounded-xl"
          onClick={() => setIsDialogOpen(true)}
        >
          Create
        </button>
      </div>

      <div className="w-full flex-center gap-[15rem] mt-16">
        {cardData.length > 0 ? (
          <>
            <div>
              <span
                className="text-white text-6xl cursor-pointer"
                onClick={() => setCurrentIndex((prevIndex) => (prevIndex - 1 + cardData.length) % cardData.length)}
              >
                <IoIosArrowBack />
              </span>
            </div>

            <div className="flex flex-center" {...swipeHandlers}>
              <AnimatePresence>
                <motion.div
                  key={cardData[currentIndex].id}
                  initial={{ opacity: 0, x: 300 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -300 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card front={cardData[currentIndex].front} back={cardData[currentIndex].back} />
                </motion.div>
              </AnimatePresence>
            </div>

            <div>
              <span
                className="text-white text-6xl cursor-pointer"
                onClick={() => setCurrentIndex((prevIndex) => (prevIndex + 1) % cardData.length)}
              >
                <IoIosArrowForward />
              </span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-[300px] text-white">
            <p className="text-xl">No cards available.</p>
            <p className="text-sm mt-2">Please create a card to get started.</p>
          </div>
        )}
      </div>

      {isDialogOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsDialogOpen(false)}
          ></div>
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 text-white w-[400px] p-6 rounded-lg shadow-lg max-w-lg mx-auto transform transition-transform duration-300 ease-in-out">
              <div className="w-full flex justify-end mb-4">
                <span
                  className="text-2xl cursor-pointer text-gray-400 hover:text-gray-200"
                  onClick={() => setIsDialogOpen(false)}
                >
                  <IoMdClose />
                </span>
              </div>

              <h1 className="text-2xl font-semibold mb-4">Create Your Own Card</h1>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Front Text</label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-700 rounded-lg shadow-sm bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter front text"
                  value={frontText}
                  onChange={(e) => setFrontText(e.target.value)}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">Back Text</label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-700 rounded-lg shadow-sm bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter back text"
                  value={backText}
                  onChange={(e) => setBackText(e.target.value)}
                />
              </div>

              <button
                className="w-full bg-[#163664] px-4 py-2 rounded-lg text-white font-semibold hover:bg-[#0f2a4f] transition-colors duration-200"
                onClick={createCard}
              >
                Submit
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
