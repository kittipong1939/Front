import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const guestNav = [
  { to: '/', text: 'Login' },
  { to: '/register', text: 'Register' },
];

const userNav = [
  { to: '/Search', text: 'Search' },
  { to: '/', text: 'Home' },
  { to: '/new', text: 'Cart' },
  { to: '/todos', text: 'NewTodos' },
  
];

const adminNav = [

  { to: '/', text: 'Home' },
  { to: '/product', text: 'Add Product' },
  { to: '/Mnproduct', text: 'Management' },
  { to: '/new', text: 'Cart' },
  { to: '/Order', text: 'OrderMagnagement' },
  { to: '/todos', text: 'NewTodos' },
];

export default function Header() {
  const { user, logout } = useAuth();
  let finalNav = guestNav; // กำหนด finalNav ให้เป็น guestNav เริ่มต้น

  if (user?.id && user.role === 'ADMIN') {
    finalNav = adminNav;
  } else if (user?.id) {
    finalNav = userNav;
  }

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">Hello, {user?.id && user.role === 'ADMIN' ? 'ADMIN' : user?.id ? user.username : 'Guest'}</a>
      </div>
      
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          {finalNav.map((el) => (
            <li key={el.to}>
              <Link to={el.to} className="text-primary hover:text-primary-dark">{el.text}</Link>
            </li>
          ))}
          {user?.id && (
            <li>
              <Link to='#' onClick={handleLogout} className="text-primary hover:text-primary-dark">Logout</Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
