import {createBrowserRouter, RouterProvider, Outlet} from 'react-router-dom'
import LoginForm from '../layout/LoginForm'
import RegisterForm from '../layout/RegisterForm'
import useAuth from '../hooks/useAuth'
import Header from '../layout/Header'
import UserHome from '../layout/Home/UserHome'
import AddProductForm from '../layout/AddProductForm'
import OrderManage from '../layout/OrderManage/OrderManage'
import CartProduct from '../layout/Cart/CartProduct'
import NewTodoForm from '../layout/NewTodoForm'
import ManagementProduct from '../layout/ManagementProduct'
import OrderPopUp from '../layout/Order/Order'

const guestRouter = createBrowserRouter([
  {
    path: '/',
    element: <>
      <Header />
      <Outlet />
    </>,
    children: [
      { index: true, element: <LoginForm /> },
      { path: '/register', element: <RegisterForm /> },
      { path: '/product', element: <AddProductForm /> } // เพิ่ม path สำหรับผลิตภัณฑ์
    ]
  }
])

const userRouter = createBrowserRouter([
  {
    path: '/',
    element: <>
      <Header />
      <Outlet />
    </>,
    children : [
      { index: true, element: <UserHome /> },
      { path: '/new', element: <CartProduct/> },
      { path: '/product', element: <AddProductForm /> },
      { path: '/Mnproduct', element: <ManagementProduct /> },
      { path: '/OrderPopUp', element: <OrderPopUp /> },
      { path: '/Order', element: <OrderManage /> },

      { path: '/todos', element: <NewTodoForm/> },// เพิ่ม path สำหรับผลิตภัณฑ์
    ]
  }
])

export default function AppRouter() {
  const {user} = useAuth()
  const finalRouter = user?.id ? userRouter : guestRouter
  return (
    <RouterProvider router={finalRouter} />
  )
}
