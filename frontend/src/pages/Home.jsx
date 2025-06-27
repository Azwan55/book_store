import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner';
import { Link } from 'react-router-dom';
import { MdOutlineAddBox } from 'react-icons/md';
import BooksTable from '../components/home/BooksTable';
import BooksCard from '../components/home/BooksCard';
import bgImg from '../assets/pngtree-bookstore-image_834987.jpg';
import { AiOutlineTable } from 'react-icons/ai';
import { BsGrid3X3Gap } from 'react-icons/bs';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showType, setShowType] = useState('table');

  useEffect(() => {
  const savedView = localStorage.getItem('homeView');
  if (savedView) {
    setShowType(savedView);
    console.log(`Loaded view type from localStorage: ${savedView}`);
  }

  setLoading(true);
  axios.get('http://localhost:5555/books')
    .then((response) => {
      setBooks(response.data.data);
      setLoading(false);
    }).catch((error) => {
      console.log(error);
      setLoading(false);
    });
}, []);

  // useEffect(() => {
  //   setLoading(true);
  //   axios.get('http://localhost:5555/books')
  //     .then((response) => {
  //       setBooks(response.data.data);
  //       setLoading(false);
  //     }).catch((error) => {
  //       console.log(error);
  //       setLoading(false);
  //     });
  // }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/*  Blurred Background */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-sm brightness-75"
        style={{
          backgroundImage: `url(${bgImg})`
        }}
      ></div>

      {/*  Foreground Content */}
      <div className="relative z-10 p-4 text-black">

        <div className="flex gap-2 my-4">
          <button
            className={`px-4 py-2 rounded-lg transition-all font-medium shadow-sm ${showType === 'table'
              ? 'bg-emerald-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            onClick={() => { setShowType('table'); localStorage.setItem('homeView', 'table'); }}
          >
            <AiOutlineTable className="inline-block mr-2" />
            Table View
          </button>

          <button
            className={`px-4 py-2 rounded-lg transition-all font-medium shadow-sm ${showType === 'card'
              ? 'bg-emerald-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            onClick={() => { setShowType('card'); localStorage.setItem('homeView', 'card'); }}
          >
            <BsGrid3X3Gap className="inline-block mr-2" />
            Card View
          </button>
        </div>


        <div className='flex justify-between items-center'>
          <h1 className='text-3xl my-8 text-gray-800 font-bold'>Book List</h1>
          <Link to='/books/create'>
            <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-200">
              <MdOutlineAddBox className="text-2xl" />
              <span className="font-medium">Add Book</span>
            </button>
          </Link>

        </div>

        {loading ? (
          <Spinner />
        ) : showType === 'table' ? (
          <BooksTable books={books} />
        ) : (
          <BooksCard books={books} />
        )}
      </div>
    </div>
  );
};

export default Home;
