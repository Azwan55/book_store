import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Menubar } from 'primereact/menubar';
import { getToken, clearToken } from '../utils/auth';
import '../styles/navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = getToken();

  const handleLogout = () => {
    clearToken();
    localStorage.removeItem('user');
    navigate('/login');
  };

  const items = [
    {
      label: '📚 Library',
      icon: 'pi pi-fw pi-home',
      command: () => navigate('/'),
    },
  ];

  const end = (
    <div className="navbar-end">
      {token && user.name ? (
          <Button
            label="Logout"
            icon="pi pi-sign-out"
            onClick={handleLogout}
            severity="danger"
            text
            size="small"
          />
      ) : (
        <>
          <Button
            label="Login"
            icon="pi pi-sign-in"
            onClick={() => navigate('/login')}
            text
            size="small"
          />
          <Button
            label="Register"
            icon="pi pi-user-plus"
            onClick={() => navigate('/register')}
            text
            size="small"
          />
        </>
      )}
    </div>
  );

  return <Menubar model={items} end={end} className="navbar-custom" />;
}
