import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './OrderMag.css'; // Import CSS file for styling

const OrderManage = () => {
  const [order, setOrder] = useState([]);
  const nav = useNavigate();

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8889/order/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  return (
    <div className="order-manage-container">
      <h1>Order Management</h1>
      <div className="order-list">
        <h2>Orders</h2>
        <ul>
          {order.map((orderItem) => (
            <li key={orderItem.id} className="order-item">
              <h3 className='cc'>Order ID: {orderItem.id}</h3>
              <p className={`status ${orderItem.status.toLowerCase()}`}>Status: {orderItem.status}</p>
              <p className='cc'>Due Date: {orderItem.dueDate}</p>
              <h3 className='cc'>Cart ID: {orderItem.cartId}</h3>
            </li>
          ))}
        </ul>
      </div>
      <button className="back-to-cart-button" onClick={() => nav('/new')}>Back to Cart</button>
    </div>
  );
};

export default OrderManage;
