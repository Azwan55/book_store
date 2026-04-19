import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Divider } from 'primereact/divider';
import { Skeleton } from 'primereact/skeleton';
import { getToken, isLoggedIn } from '../utils/auth';
import '../styles/form.css';

export default function EditBook() {
  const { id } = useParams();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();
  const toast = useRef(null);
  const token = getToken();

  useEffect(() => {
    fetchBook();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchBook = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/books/${id}`);
      const data = await response.json();
      setFormData(data);
    } catch {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch book' });
    } finally {
      setFetching(false);
    }
  };

  if (!isLoggedIn()) {
    navigate('/login');
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNumberChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.author.trim()) {
      toast.current.show({ 
        severity: 'warn', 
        summary: 'Warning', 
        detail: 'Please fill in all required fields' 
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/books/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          author: formData.author,
          publishYear: formData.publishYear,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.current.show({ 
          severity: 'success', 
          summary: 'Success', 
          detail: 'Book updated successfully!' 
        });
        setTimeout(() => navigate('/'), 1500);
      } else {
        toast.current.show({ 
          severity: 'error', 
          summary: 'Error', 
          detail: data.message || 'Failed to update book' 
        });
      }
    } catch {
      toast.current.show({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Server error occurred' 
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="form-container">
        <Card className="form-card">
          <Skeleton height="2rem" className="mb-4" />
          <Skeleton height="3rem" className="mb-4" />
          <Skeleton height="3rem" className="mb-4" />
          <Skeleton height="3rem" />
        </Card>
      </div>
    );
  }

  if (!formData) return null;

  return (
    <div className="form-container">
      <Toast ref={toast} position="top-right" />
      <Card className="form-card">
        <div className="form-header">
          <h1>✏️ Edit Book</h1>
          <p className="form-subtitle">Update book information</p>
        </div>

        <Divider />

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="p-field">
              <label htmlFor="title" className="required">Book Title</label>
              <InputText
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., The Great Gatsby"
                required
                className="w-full"
                maxLength={100}
              />
              <small className="text-gray-500">{formData.title.length}/100</small>
            </div>

            <div className="p-field">
              <label htmlFor="author" className="required">Author Name</label>
              <InputText
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="e.g., F. Scott Fitzgerald"
                required
                className="w-full"
                maxLength={100}
              />
              <small className="text-gray-500">{formData.author.length}/100</small>
            </div>

            <div className="p-field">
              <label htmlFor="publishYear" className="required">Publication Year</label>
              <InputNumber
                id="publishYear"
                name="publishYear"
                value={formData.publishYear}
                onValueChange={(e) => handleNumberChange('publishYear', e.value)}
                min={1900}
                max={new Date().getFullYear() + 1}
                className="w-full"
                useGrouping={false}
              />
            </div>

            <div className="p-field">
              <label htmlFor="description">Description (Optional)</label>
              <InputTextarea
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                placeholder="Add a brief description of the book..."
                rows={4}
                className="w-full"
                maxLength={500}
              />
              <small className="text-gray-500">{(formData.description || '').length}/500</small>
            </div>
          </div>

          <Divider />

          <div className="button-group">
            <Button
              label={loading ? 'Updating Book...' : 'Update Book'}
              icon="pi pi-check"
              loading={loading}
              onClick={handleSubmit}
              className="p-button-warning"
            />
            <Button
              label="Cancel"
              icon="pi pi-times"
              severity="secondary"
              onClick={() => navigate('/')}
              type="button"
            />
          </div>
        </form>
      </Card>
    </div>
  );
}
