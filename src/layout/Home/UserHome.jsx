import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProfileImg from '../../assets/Offer/as.png';
import './Home.css';
import AllProduct from '../Product/ProductAll';

export default function UserHome() {
  
  return (
    <div>
    <div className='offers'>
      <div className='offers-left'>
        <h1>Exclusive</h1>
        <h1>Offer For You</h1>
        <p>ONLY ON BASE SELLERS PRODUCTS</p>
        <button>Check Now</button>
      </div>
      <div className='offers-right'>
        <img className='imgg' src={ProfileImg} alt="" />
      </div>

    </div>
    <AllProduct />
    </div>

    
  );
}
