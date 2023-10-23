import './App.css';
import { React, useEffect, useState } from "react";
import Navbar from './components/header/Navbar';
import Newnav from './components/newnavbar/Newnav';
import Maincomponent from './components/home/Maincomponent';
import Footer from './components/footer/footer';
import Sign_in from './components/signup_signin/signin';
import Sign_Up from './components/signup_signin/signup';
import Cart from './components/cart/Cart';
import Buynow from './components/buynow/Buynow';
import {Routes, Route} from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';




function App() {

  const [data,setData] = useState(false);

  useEffect(()=>{
    setTimeout(()=>{
      setData(true)
    },2000)
  },[])


  return (
    <>
    {
      data ? (
        <>
        <Navbar />
    <Newnav />
    <Routes>
      <Route path="/" element ={<Maincomponent />} />
      <Route path="/login" element ={<Sign_in/>} />
      <Route path="/register" element ={<Sign_Up />} />
      <Route path="/getproductsone/:id" element ={<Cart />} />
      <Route path="/buynow" element ={<Buynow />} />
    </Routes>
    <Footer/>
        </>
      ) : (
        <div className='circle'>
          <CircularProgress /> 
          <h2>Loading ...</h2>

        </div>
      )
    }
    
    </>
  );
}

export default App;
