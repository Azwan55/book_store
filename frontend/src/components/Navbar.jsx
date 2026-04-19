import { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getToken, clearToken } from '../utils/auth';
import '../styles/navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const userTriggerRef = useRef(null);
  const userMenuPanelRef = useRef(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = getToken();

  useEffect(() => {
    if (!isUserMenuOpen) return;

    const handleOutsideClick = (event) => {
      const clickedTrigger = userTriggerRef.current?.contains(event.target);
      const clickedMenu = userMenuPanelRef.current?.contains(event.target);

      if (!clickedTrigger && !clickedMenu) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick, true);
    document.addEventListener('touchstart', handleOutsideClick, true);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick, true);
      document.removeEventListener('touchstart', handleOutsideClick, true);
    };
  }, [isUserMenuOpen]);

  const handleLogout = () => {
    setIsUserMenuOpen(false);
    clearToken();
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="navbar-pro">
      <div className="navbar-pro__inner">
        <div className="brand">
          {token && user.name && (
            <nav className="nav-links">
              <NavLink
                to='/'
                aria-label='Go to Home'
                title='Home'
                className={({ isActive }) => `nav-link nav-link--icon ${isActive ? 'nav-link--active' : ''}`}
              >
                <i className="pi pi-home" />
              </NavLink>
            </nav>
          )}
          <span className="brand__icon">📚</span>
          <span className="brand__text">BookStore</span>
        </div>
        <div className="navbar-end">
          {token && user.name && (
            <>
              <button
                type="button"
                ref={userTriggerRef}
                className="user-pill user-pill--clickable"
                onClick={() => setIsUserMenuOpen((prev) => !prev)}
                aria-label="Open user menu"
                aria-haspopup="menu"
                aria-controls="user_menu"
                aria-expanded={isUserMenuOpen}
              >
                <i className="pi pi-user user-icon-btn" aria-hidden="true" />
                <span className="username-text">{user.name}</span>
              </button>

              {isUserMenuOpen && (
                <div ref={userMenuPanelRef} id="user_menu" className="user-dropdown" role="menu" aria-label="User menu">
                  <button type="button" className="user-dropdown__item" onClick={handleLogout} role="menuitem">
                    <i className="pi pi-sign-out" aria-hidden="true" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
