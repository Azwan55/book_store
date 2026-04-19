import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import Spinner from '../components/Spinner';
import bgImg from '../assets/pngtree-bookstore-image_834987.jpg';

export const ShowBook = () => {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/books/${id}`)
      .then((response) => {
        setBook(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [id]);

  return (
    <div
      className='min-h-screen bg-cover bg-center bg-no-repeat px-3 py-4 md:px-4 md:py-8'
      style={{ backgroundImage: `linear-gradient(rgba(15,23,42,0.7), rgba(15,23,42,0.7)), url(${bgImg})` }}
    >
      <div className='mx-auto max-w-4xl'>
        {loading ? (
          <div className='mt-20 flex justify-center'>
            <Spinner />
          </div>
        ) : (
          <Card className='bg-slate-950/90 border border-slate-800 shadow-2xl text-slate-100'>
            <div className='px-4 py-5 md:px-6 md:py-8'>
              <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                <div>
                  <p className='text-5xl md:text-2xl uppercase font-extrabold tracking-[0.22em] md:tracking-[0.3em] text-amber-300'>Book Details</p>
                  <h1 className='mt-2 md:mt-3 text-2xl md:text-4xl font-semibold text-white break-words'>{book?.title || 'Untitled Book'}</h1>
                </div>
                <div className='rounded-3xl bg-slate-900/80 px-4 py-3 text-left md:text-right'>
                  <p className='text-xs uppercase tracking-[0.3em] text-slate-400'>Added</p>
                  <p className='mt-2 text-lg font-semibold text-white'>
                    {book?.createdAt ? new Date(book.createdAt).toLocaleDateString() : 'Unknown'}
                  </p>
                </div>
              </div>

              <Divider className='my-6 border-slate-700' />

              <div className='grid gap-4 md:gap-6 md:grid-cols-2'>
                <div className='space-y-4 rounded-3xl border border-slate-800 bg-slate-900/80 p-5'>
                  <p className='text-sm uppercase tracking-[0.25em] text-slate-400'>Author</p>
                  <p className='text-lg md:text-xl font-semibold text-white break-words'>{book?.author || 'Unknown'}</p>
                </div>
                <div className='space-y-4 rounded-3xl border border-slate-800 bg-slate-900/80 p-5'>
                  <p className='text-sm uppercase tracking-[0.25em] text-slate-400'>Publish Year</p>
                  <p className='text-lg md:text-xl font-semibold text-white'>{book?.publishYear || 'Unknown'}</p>
                </div>
                <div className='space-y-4 rounded-3xl border border-slate-800 bg-slate-900/80 p-5'>
                  <p className='text-sm uppercase tracking-[0.25em] text-slate-400'>Last Updated</p>
                  <p className='text-lg md:text-xl font-semibold text-white'>
                    {book?.updatedAt ? new Date(book.updatedAt).toLocaleDateString() : 'Unknown'}
                  </p>
                </div>
              
              </div>

              <Divider className='my-6 border-slate-700' />

              <div className='rounded-3xl border border-slate-800 bg-slate-900/80 p-6'>
                <p className='text-sm uppercase tracking-[0.25em] text-slate-400'>Description</p>
                <p className='mt-3 text-base leading-8 text-slate-200'>
                  {book?.description || 'No description provided for this book.'}
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ShowBook;
