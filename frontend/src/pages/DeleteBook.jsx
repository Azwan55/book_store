import React, { useState } from 'react';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import axios from 'axios';
import bgImg from '../assets/pngtree-bookstore-image_834987.jpg';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

export const DeleteBook = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const handleDeleteBook = () => {
    setLoading(true);
    axios
      .delete(`http://localhost:5555/books/${id}`)
      .then(() => {
        setLoading(false);
        enqueueSnackbar('Book deleted successfully', { variant: 'success' });
        navigate('/');
      }).catch((error) => {
        setLoading(false);
        // alert('An error happened, please check console');
        enqueueSnackbar('An error occurred while deleting the book, Please check console', { variant: 'error' });
        console.log(error);
      })
  };
  return (
    <div className='p-4 h-200 bg-cover bg-center bg-no-repeat  ' style={{
      backgroundImage: `url(${bgImg})`,

    }}>
      <BackButton />
      <div className='flex justify-center items-center h-100'>
      {/* <h1 className='text-3xl my-8 text-gray-800 font-bold'>Delete Book</h1> */}
      {loading ? <Spinner /> : ''}
      
      <div className='flex flex-col items-center border-2 border-sky-400 rounded-xl w-[600px] p-8 mx-auto bg-amber-50'>
        <h3 className='text-2xl'>Are you sure you want to delete this book?</h3>

        <button
          className='p-4 bg-red-600 text-white m-8 w-full'
          onClick={handleDeleteBook}>
          Yes, Delete it
        </button>
      </div>
    </div></div>
  )
}

export default DeleteBook