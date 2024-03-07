// LoginForm.js

import axios from 'axios';
import { useState } from "react";
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom'; // เพิ่มการนำเข้า useNavigate

export default function LoginForm() {
  const { setUser } = useAuth();
  const navigate = useNavigate(); // ใช้ hook useNavigate

  const [input, setInput] = useState({
    username: '', 
    password: ''
  });

  const hdlChange = e => {
    setInput(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const hdlSubmit = async e => {
    try {
      e.preventDefault();
      const rs = await axios.post('http://localhost:8889/auth/login', input);
      localStorage.setItem('token', rs.data.token);
      const rs1 = await axios.get('http://localhost:8889/auth/me', {
        headers: { Authorization: `Bearer ${rs.data.token}` }
      });
      setUser(rs1.data);
      navigate('/'); // เมื่อเข้าสู่ระบบสำเร็จให้ไปยังหน้า Home
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="p-8 border rounded w-96">
        <h2 className="text-3xl font-bold mb-4 text-center">Please Login</h2>
        <form className="flex flex-col gap-4" onSubmit={hdlSubmit}>
          <label className="flex flex-col">
            <span className="text-sm font-semibold mb-1">Username</span>
            <input
              type="text"
              className="py-2 px-3 border rounded"
              name="username"
              value={input.username}
              onChange={hdlChange}
            />
          </label>
          <label className="flex flex-col">
            <span className="text-sm font-semibold mb-1">Password</span>
            <input
              type="password"
              className="py-2 px-3 border rounded"
              name="password"
              value={input.password}
              onChange={hdlChange}
            />
          </label>
          <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
