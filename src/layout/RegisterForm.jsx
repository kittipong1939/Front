import axios from 'axios'
import {useState} from "react";

export default function RegisterForm() {
  const [input, setInput] = useState({
    username : '', 
    password : '',
    confirmPassword : '',
    email : ''
  })

  const hdlChange = e => {
    setInput( prv => ( { ...prv, [e.target.name] : e.target.value } ) )
  }

  const hdlSubmit = async e => {
    try {
      e.preventDefault()
      // validation
      if(input.password !== input.confirmPassword) {
        return alert('Please check confirm password')
      }
      const rs = await axios.post('http://localhost:8889/auth/register', input)
      console.log(rs)
      if(rs.status === 200) {
        alert('Register Successful')
      }
    }catch(err) {
      console.log( err.message)
    }

  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
   
    <div className="p-8 border rounded w-96">
      <h2 className="text-3xl font-bold mb-4 text-center">Register Form</h2>
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
          <span className="text-sm font-semibold mb-1">E-mail</span>
          <input
            type="email"
            className="py-2 px-3 border rounded"
            name="email"
            value={input.email}
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
        <label className="flex flex-col">
          <span className="text-sm font-semibold mb-1">Confirm Password</span>
          <input
            type="password"
            className="py-2 px-3 border rounded"
            name="confirmPassword"
            value={input.confirmPassword}
            onChange={hdlChange}
          />
        </label>
        <div className="flex gap-5">
        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
  Submit
</button>
<button type="reset" className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded">
  Reset
</button>

        </div>
      </form>
    </div>
  </div>
);
}