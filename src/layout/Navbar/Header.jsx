// Header.js

import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Logo from "../../assets/website/logo.png";
import DarkMode from "./DarkMode";

const guestNav = [
  { to: '/', text: 'Home' },
  { to: '/login', text: 'Login' },
  { to: '/register', text: 'Register' },
];

const userNav = [
  { to: '/', text: 'Home' },
  { to: '/new', text: 'Cart' },
];

const adminNav = [
  { to: '/', text: 'Home' },
  { to: '/product', text: 'Add Product' },
  { to: '/Mnproduct', text: 'Management' },
  { to: '/Order', text: 'Order Management' },
  { to: '/new', text: 'Cart' },
];

export default function Header() {
  const { user, logout } = useAuth();
  let finalNav = guestNav;

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
    <div className="navbar bg-base-100 shadow-md bg-white dark:bg-gray-900 dark:text-white duration-200">
      <div className="flex-1 ml-6">
        <img src={Logo} alt="Logo" className="w-10" />
        <a className="btn btn-ghost text-3xl font-bold">Books</a>
      </div>
      
      <div className="flex-none">
        <DarkMode />
        <ul className="menu menu-horizontal px-1">
          {finalNav.map((el) => (
            <li key={el.to}>
              <Link to={el.to} className="text-black hover:text-primary-dark bg-white dark:bg-gray-900 dark:text-white duration-200">{el.text}</Link>
            </li>
          ))}
          {user?.id && (
            <li>
              <Link to='#' onClick={handleLogout} className="text-black hover:text-primary-dark bg-white dark:bg-gray-900 dark:text-white duration-200">Logout</Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
