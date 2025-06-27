import React, { useEffect, useState } from 'react';
import  axios from 'axios';
import {useParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import bgImg from '../assets/pngtree-bookstore-image_834987.jpg';


export const ShowBook = () => {
  const [book, setBook] = useState({});
  const [Loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {

    setLoading(true);
    axios
      .get(`http://localhost:5555/books/${id}`)
      .then((response) => {
        console.log('Response Data:', response.data);
        setBook(response.data);
        setLoading(false);

      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });


  },[])

  return (
    <div className='p-4 h-200 bg-cover bg-center bg-no-repeat  ' style={{
          backgroundImage: `url(${bgImg})`,
    
        }}>
      <BackButton />
      {/* <h1 className='text-3xl my-8 text-gray-800 font-bold'>Show Book</h1> */}

      <div className='flex justify-center items-center h-150'>
      {
        Loading ? (
          <Spinner />
        ) : (
          <div className='flex justify-center items-center '>
          <div className='  flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 bg-amber-50'>

            <div className='my-4'>
              <span className='text-xl mr-4 text-black-bold'>Id :</span>
              <span >{book._id}</span>
            </div>

            <div className='my-4'>
              <span className='text-xl mr-4 text-black-bold'>Title :</span>
              <span >{book.title}</span>
            </div>

            <div className='my-4'>
              <span className='text-xl mr-4 text-black-bold'>Author :</span>
              <span >{book.author}</span>
            </div>

            <div className='my-4'>
              <span className='text-xl mr-4 text-black-bold'>Publish Year :</span>
              <span >{book.publishYear}</span>
            </div>

            <div className='my-4'>
              <span className='text-xl mr-4 text-black-bold'>Create Time :</span>
              <span >{new Date(book.createdAt).toString()}</span>
            </div>

            <div className='my-4'>
              <span className='text-xl mr-4 text-black-bold'>Last Update Time :</span>
              <span >{new Date(book.updatedAt).toString()}</span>
            </div>
          </div></div>
        )
      }
    </div></div>
  )
}

export default ShowBook