import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import { getToken, isLoggedIn } from '../utils/auth';

export const DeleteBook = () => {
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [visible, setVisible] = useState(true);
  const [bookData, setBookData] = useState({ title: '', author: '', publishYear: '', createdAt: '' });
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useRef(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/books/${id}`)
      .then((response) => {
        setBookData({
          title: response.data.title,
          author: response.data.author
        });
        setFetchLoading(false);
      })
      .catch((error) => {
        setFetchLoading(false);
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch book details.' });
        console.log(error);
        setTimeout(() => navigate('/'), 1500);
      });
  }, [id, navigate]);

  const handleDeleteBook = async () => {
    if (!isLoggedIn()) {
      toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please login to delete books.' });
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    setLoading(true);
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/books/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setLoading(false);
      toast.current.show({ severity: 'success', summary: 'Success', detail: 'Book deleted successfully.' });
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      setLoading(false);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete book. Please check console.' });
      console.log(error);
    }
  };

  const handleCancel = () => {
    setVisible(false);
    navigate('/');
  };

  return (
    <div>
      <Toast ref={toast} />

      {fetchLoading ? (
        <div className='mt-16 flex justify-center'>
          <Spinner />
        </div>
      ) : (
        <div className='bg-slate-50 p-4 md:p-6 flex justify-center'>
          <Dialog
            visible={visible}
            onHide={handleCancel}
            header='Confirm Delete'
            modal
            className='w-full max-w-[420px]'
            headerClassName='bg-gradient-to-r from-red-600 to-orange-500 text-white'
          >
            <Card className='shadow-lg border border-slate-200'>
              <div className='text-center'>
                <h2 className='text-xl font-semibold text-slate-900'>Delete this book</h2>
                <p className='mt-2 text-sm text-slate-600'>This action cannot be undone.</p>
              </div>

              <div className='mt-5 rounded-3xl border border-red-200 bg-red-50 p-5'>
                <p className='text-[11px] uppercase tracking-[0.26em] text-red-600'>Book to delete</p>
                <p className='mt-3 text-xl font-semibold text-slate-900'>{bookData.title || 'Untitled Book'}</p>
                <p className='mt-1 text-sm text-slate-600'>Published: {bookData.publishYear || 'Unknown'}</p>
              </div>

              <div className='mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center'>
                <Button
                  label='Delete Book'
                  icon='pi pi-trash'
                  severity='danger'
                  onClick={handleDeleteBook}
                  loading={loading}
                  disabled={loading}
                  className='w-full sm:w-auto'
                />
                <Button
                  label='Cancel'
                  icon='pi pi-times'
                  className='p-button-outlined w-full sm:w-auto'
                  onClick={handleCancel}
                  disabled={loading}
                />
              </div>
            </Card>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default DeleteBook;