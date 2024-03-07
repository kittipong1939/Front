// AppRouter.js

import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import LoginForm from '../layout/LoginForm';
import RegisterForm from '../layout/RegisterForm';
import useAuth from '../hooks/useAuth';
import Header from '../layout/Navbar/Header';
import UserHome from '../layout/Home/UserHome';
import AddProductForm from '../layout/AddProductForm';

// เพิ่ม CartProduct ใน import
import CartProduct from '../layout/Cart/CartProduct';

// เพิ่ม OrderManage ใน import
import OrderManage from '../layout/OrderManage/OrderManage';

// เพิ่ม ManagementProduct ใน import
import ManagementProduct from '../layout/ManagementProduct';

// เพิ่ม OrderPopUp ใน import
import OrderPopUp from '../layout/Order/Order';

// เพิ่ม ThankYou ใน import
import ThankYou from '../layout/Thank you/ThankYou';

const guestRouter = createBrowserRouter([
  {
    path: '/',
    element: <>
      <Header />
      <Outlet />
    </>,
    children: [
      { index: true, element: <UserHome /> },
      { path: '/login', element: <LoginForm /> },
      { path: '/register', element: <RegisterForm /> },
      { path: '/product', element: <AddProductForm /> }
    ]
  }
]);

const userRouter = createBrowserRouter([
  {
    path: '/',
    element: <>
      <Header />
      <Outlet />
    </>,
    children: [
      { index: true, element: <UserHome /> },
      { path: '/new', element: <CartProduct /> },
      { path: '/product', element: <AddProductForm /> },
      { path: '/Mnproduct', element: <ManagementProduct /> },
      { path: '/OrderPopUp', element: <OrderPopUp /> },
      { path: '/Order', element: <OrderManage /> },
      { path: '/ThankYou', element: <ThankYou /> },
    ]
  }
]);

export default function AppRouter() {
  const { user } = useAuth();
  const finalRouter = user?.id ? userRouter : guestRouter;
  return (
    <RouterProvider router={finalRouter} />
  );
}
