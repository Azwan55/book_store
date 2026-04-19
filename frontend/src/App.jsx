import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import CreateBook from './pages/CreateBook';
import EditBook from './pages/EditBook';
import DeleteBook from './pages/DeleteBook';
import ShowBook from './pages/ShowBook';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';

import './App.css';

export const App = () => {
  const location = useLocation();
  const hideNavbar = location.pathname === '/login' || location.pathname === '/register';

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/books/create' element={<CreateBook/>}/>
        <Route path='/books/details/:id' element={<ShowBook/>}/>
        <Route path='/books/edit/:id' element={<EditBook/>}/>
        <Route path='/books/delete/:id' element={<DeleteBook/>}/>
      </Routes>
      </>
  );
};

export default App;
