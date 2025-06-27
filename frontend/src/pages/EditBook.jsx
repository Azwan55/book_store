import React, { useState, useEffect } from 'react';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import axios from 'axios';
import bgImg from '../assets/pngtree-bookstore-image_834987.jpg';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const EditBook = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publishYear, setPublishYear] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const{ id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5555/books/${id}`)
      .then((response) => {
        setTitle(response.data.title);
        setAuthor(response.data.author);
        setPublishYear(response.data.publishYear);
        setLoading(false);
      }).catch((error) => {
        setLoading(false);
        alert('An error happen,please check console');
        console.log(error);
      });
  }, []);
  const handleEditBook = () => {
    const data = {
      title,
      author,
      publishYear
    };
    setLoading(true);
    axios
      .put(`http://localhost:5555/books/${id}`, data)
      .then(() => {
        setLoading(false);
        enqueueSnackbar('Book Edited successfully', { variant: 'success' });
        navigate('/');
      })
      .catch((error) => {
        setLoading(false);
        // alert('An error happen,please check console');
        enqueueSnackbar('An error occurred while Editing the book,Please check console', { variant: 'error' });
        console.log(error);

      })

  };
  return (
    <div className='p-4 h-200 bg-cover bg-center bg-no-repeat  '  style={{
                  backgroundImage: `url(${bgImg})`,
                 
                }}>
      <BackButton />

      <div className='flex justify-center items-center h-150'>
      {/* <h1 className='text-3xl my-8 text-gray-800 font-bold'>Edit Book</h1> */}
      {loading ? <Spinner /> : ''}

      <div className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto bg-amber-50'>
        <div className='my-4'>
          <label className='text-xl mr-4 text-black'>Title</label>
          <input
            type='text'
            className='border-2 border-gray-500 px-4 py-2 w-full'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-black'>Author</label>
          <input
            type='text'
            className='border-2 border-gray-500 px-4 py-2 w-full'
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-black'>Publish Year</label>
          <input
            type='text'
            className='border-2 border-gray-500 px-4 py-2 w-full'
            value={publishYear}
            onChange={(e) => setPublishYear(e.target.value)}
          />
        </div>
        <button className='p-2 bg-sky-300 m-8' onClick={handleEditBook}>
          Save
        </button>
      </div>
    </div></div>
  )
}

export default EditBook
