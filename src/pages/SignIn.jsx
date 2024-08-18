
import React, { useState } from "react";
import { Link ,useNavigate} from "react-router-dom";
import { useDispatch } from "react-redux";
import { signInFailure, signInStart, signInSuccess } from "../redux/userSlice";
import Oauth from "../componenets/Oauth";


function SignIn() {
  const [formdata, setFormdata] = useState({
    
    email: "",
    password: ""
  });
  const [loading ,setloading]=useState()
  const [error,seterror]=useState()
//   const error = useSelector(state => state.user.error);
//   const loading = useSelector(state => state.user.loading);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormdata({
      ...formdata,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart)
      // setloading(true)
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formdata)
      });

      if (!res.ok) {
        dispatch(signInFailure(data.error || 'Network response was not ok'));
      
      }

      const data = await res.json();
    //   localStorage.setItem('userId', data._id); 
      console.log(data)
    
      if(data.success===false){
       
       dispatch(signInFailure(data.message))
      return;   }
   
      // setloading(false)
      // seterror(null)
      dispatch(signInSuccess(data))
      
      navigate('/');
      console.log(data);
    }
    
    catch (error) {
      dispatch(signInFailure(error.message))
      // seterror(error)
      // setloading(true)
      console.error('There was an error!', error);
    }
  };

  return (
    <div className="p-4 max-w-lg m-auto">
      <h1 className="text-3xl text-center font-semibold">SignIn</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 p-4"
      >
      
        <input
          type="email"
          className="border p-3 rounded-lg"
          onChange={handleChange}
          placeholder="email"
          id="email"
          value={formdata.email}
        />
        <input
          type="password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
          placeholder="password"
          id="password"
          value={formdata.password}
        />
        <button  disabled={loading} className="bg-slate-700 text-slate-50 rounded-lg hover:opacity-70 disabled:opacity-80 p-3 uppercase0">
         {loading?'Loading...' : 'SignIn'}

        </button>
    <Oauth/>
      </form>
      <div className="flex gap-2 mt-5">
        <p>
          Dont have an account? <Link to="/signUp">Sign Up</Link>
        </p>
      </div>
      <p className="text-red-700">{error?error.message:''}</p>
    </div>
  );  
}

export default SignIn;



// import React from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { increment, decrement } from '../redux/userSlice';

// function Counter() {
//     const dispatch = useDispatch();
//     const count = useSelector((state) => state.counter.value);

//     return (
//         <div>
//             <h1>Counter: {count}</h1>
//             <button onClick={() => dispatch(increment())}>Increment</button>
//             <button onClick={() => dispatch(decrement())}>Decrement</button>
//         </div>
//     );
// }

// export default Counter;

