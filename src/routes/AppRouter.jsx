import {createBrowserRouter, RouterProvider, Outlet} from 'react-router-dom'
import LoginForm from '../layout/LoginForm'
import RegisterForm from '../layout/RegisterForm'
import useAuth from '../hooks/useAuth'
import Header from '../layout/Header'
import UserHome from '../layout/UserHome'
import AddProductForm from '../layout/AddProductForm'

import CartProduct from '../layout/CartProduct'
import NewTodoForm from '../layout/NewTodoForm'
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
