import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { getToken, isLoggedIn, clearToken } from '../utils/auth';
import '../styles/home.css';

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();
  const toast = useRef(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const loggedIn = isLoggedIn();

  useEffect(() => {
    // Redirect to login if not logged in or user data is missing
    if (!loggedIn) {
      navigate('/login');
      return;
    }
    
    // Check if user data exists
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (!storedUser || !storedUser.id) {
      console.log("User data missing, redirecting to login");
      clearToken();
      navigate('/login');
      return;
    }
    
    fetchBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn, navigate]);

  const fetchBooks = async () => {
    try {
      const token = getToken();
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      console.log("currentUser : ", currentUser);
      
      if (!currentUser || !currentUser.id) {
        console.log("User data missing, redirecting to login");
        clearToken();
        navigate('/login');
        toast.current.show({ severity: 'error', summary: 'Session Error', detail: 'Please login again' });
        return;
      }
      
      const headers = { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      
      // Send POST request with userId in payload for backend filtering
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/books/get-books`, { 
        method: 'POST',
        headers,
        body: JSON.stringify({ userId: currentUser.id })
      });
      
      // Handle token expiration (401 Unauthorized)
      if (response.status === 401) {
        clearToken();
        navigate('/login');
        toast.current.show({ severity: 'warn', summary: 'Session Expired', detail: 'Your token has expired. Please login again.' });
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }
      
      const data = await response.json();
      setBooks(data.data || data);
    } catch {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch books' });
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      book.author.toLowerCase().includes(searchValue.toLowerCase())
  );

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="action-buttons">
        <Button
          icon="pi pi-eye"
          rounded
          text
          severity="info"
          onClick={() => navigate(`/books/details/${rowData._id}`)}
          tooltip="View"
          tooltipPosition="top"
        />
        <Button
          icon="pi pi-pencil"
          rounded
          text
          severity="warning"
          onClick={() => navigate(`/books/edit/${rowData._id}`)}
          tooltip="Edit"
          tooltipPosition="top"
          disabled={!loggedIn}
        />
        <Button
          icon="pi pi-trash"
          rounded
          text
          severity="danger"
          onClick={() => navigate(`/books/delete/${rowData._id}`)}
          tooltip="Delete"
          tooltipPosition="top"
          disabled={!loggedIn}
        />
      </div>
    );
  };

  const leftToolbarTemplate = () => {
    return (
      <Button
        label="Add Book"
        icon="pi pi-plus"
        onClick={() => navigate(loggedIn ? '/books/create' : '/login')}
        severity={loggedIn ? 'success' : 'info'}
      />
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <div className="search-box">
        <InputText
          placeholder="Search by title or author..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="search-input"
        />
      </div>
    );
  };

  return (
    <div className="home-container">
      <Toast ref={toast} />
      <Card className="home-card">
        <div className="header-section">
          <h1>📚 Library Books</h1>
          {user.name && <p className="user-info">Welcome, {user.name}</p>}
        </div>

        <Toolbar left={leftToolbarTemplate} right={rightToolbarTemplate} className="toolbar-custom" />

        <DataTable
          value={filteredBooks}
          loading={loading}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 20, 50]}
          responsiveLayout="scroll"
          className="books-table"
          emptyMessage="No books found"
        >
          <Column field="title" header="Title" sortable filter style={{ minWidth: '200px' }} />
          <Column field="author" header="Author" sortable filter style={{ minWidth: '150px' }} />
          <Column field="publishYear" header="Year" sortable style={{ width: '100px' }} />
          <Column body={actionBodyTemplate} header="Actions" style={{ width: '150px', textAlign: 'center' }} />
        </DataTable>
      </Card>
    </div>
  );
}
