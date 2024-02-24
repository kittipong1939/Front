import React, { useState, useEffect } from 'react';
import './OrderProduct.css';
import axios from 'axios'; // import axios library
import { useNavigate } from 'react-router-dom';

const OrderPopup = () => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [order, setOrder] = useState([]);
  const [cart, setCart] = useState({});
  const [cartItems, setCartItems] = useState([]); // สร้าง state เพื่อเก็บข้อมูล order items
  const [isCancelled, setIsCancelled] = useState(false); // เพิ่ม state เพื่อตรวจสอบว่ามีการยกเลิกหรือไม่
  const nav = useNavigate();

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };
  
  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8889/order/last', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const latestOrder = response.data; // จะได้เป็น object ของ order ล่าสุด
      setOrder([latestOrder]); // ให้ setOrder เป็นอาร์เรย์ที่มี object เดียวคือ order ล่าสุด
    } catch (error) {
      console.error('Error fetching order:', error);
    }
  };
  
  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8889/cart/last', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const latestCart = response.data; // จะได้เป็น object ของ cart ล่าสุด
      setCart(latestCart); // ให้ setCart เป็น object ของ cart ล่าสุด
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const fetchCartItem = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8889/cartitem/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems(response.data); // เก็บข้อมูล order items ที่ได้รับเข้าสู่ state
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  useEffect(() => {
    fetchOrder();
    fetchCart();
    fetchCartItem(); // เรียกใช้ fetchOrderItems เมื่อ component ถูกโหลดเรียบร้อย
  }, []); // ใช้วิธีนี้เพื่อทำให้ useEffect ทำงานเหมือน componentDidMount

  const handlePayment = async () => {
    try {
      const token = localStorage.getItem('token');
      const currentDate = new Date().toISOString();
      const updatedOrders = order.map(item => ({
        ...item,
        dueDate: currentDate,
        status: 'SUCCESS'
      }));
      await Promise.all(updatedOrders.map(async (orderItem) => {
        await axios.put(`http://localhost:8889/order/${orderItem.id}`, orderItem, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }));
      // หลังจากอัปเดตสถานะ order ให้เรียก fetchOrder อีกครั้งเพื่ออัพเดตข้อมูล
      fetchOrder();
      alert('Payment completed successfully!');
    } catch (error) {
      console.error('Error completing payment:', error);
    }
  };
  
  const handlePayment1 = async () => {
    try {
      const token = localStorage.getItem('token');
      const currentDate = new Date().toISOString();
      const updatedOrders = order.map(item => ({
        ...item,
        dueDate: currentDate,
        status: 'CANCELLED'
      }));
      await Promise.all(updatedOrders.map(async (orderItem) => {
        await axios.put(`http://localhost:8889/order/${orderItem.id}`, orderItem, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }));
      setIsCancelled(true);
      // หลังจากอัปเดตสถานะ order ให้เรียก fetchOrder อีกครั้งเพื่ออัพเดตข้อมูล
      fetchOrder();
      alert('ยกเลิกการชำระเงินและสั่งซื้อเรียบร้อยแล้ว');
    } catch (error) {
      console.error('Error cancelling payment:', error);
    }
  };

  const handleBackToCart = async () => {
    nav('/new');
  };

  return (
    <div className="order-popup">
      <h1>ชำระเงิน</h1>
      <div className="order-details">
        <h2>Order</h2>
        <ul>
          {order.map((item) => (
            <li key={item.id} className="order-item">
              <div>ID: {item.id}</div>
              <div>Due Date: {item.dueDate}</div>
              <div>Cart ID: {item.cartId}</div>
              <div>Status: <span className={item.status === 'UNPAID' ? 'status-unpaid' : item.status === 'SUCCESS' ? 'status-success' : 'status-cancelled'}>{item.status}</span></div>
              {!isCancelled && cart && cart.cartItems && ( // แสดงเฉพาะหากยังไม่ยกเลิก และมีข้อมูล cart และ cartItems อยู่
                <ul>
                  {cart.cartItems
                    .filter((cartItem) => cartItem.cartId === item.cartId)
                    .map((cartItem) => (
                      <li key={cartItem.id} className="cart-item">
                        <div>Product: {cartItem.productName}</div>
                        <div>x {cartItem.quantity}</div>
                        <div>Price: {cartItem.price}</div>
                      </li>
                    ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
        {/* แสดงข้อมูล total ที่อยู่ใน cart */}
        {cart && cart.total && (
          <div className='asdd'>Total: {cart.total} <br /><br /></div>
        )}
      </div>
      {!isCancelled && ( // แสดงเฉพาะหากยังไม่ยกเลิก
        <div className="payment-methods">
          <label>
            <input
              type="radio"
              value="credit_card"
              checked={paymentMethod === 'credit_card'}
              onChange={() => handlePaymentMethodChange('credit_card')}
            />
            บัตรเครดิต
          </label>
          <label>
            <input
              type="radio"
              value="cash"
              checked={paymentMethod === 'cash'}
              onChange={() => handlePaymentMethodChange('cash')}
            />
            ปลายทาง
          </label>
          <label>
            <input
              type="radio"
              value="bank_transfer"
              checked={paymentMethod === 'bank_transfer'}
              onChange={() => handlePaymentMethodChange('bank_transfer')}
            />
            การโอนเงิน
          </label>
          {/* Add more payment methods here */}
        </div>
      )}
      {!isCancelled && ( // แสดงเฉพาะหากยังไม่ยกเลิก
        <button className="pay-button" onClick={handlePayment}>
          ชำระเงิน
        </button>
      )}
      <br />
      <button className="pay-button" onClick={handlePayment1}>
        ยกเลิก
      </button>
      <div>
        <button className="back-to-cart-button" onClick={handleBackToCart}>
          Back to Cart
        </button>
      </div>
    </div>
  );
};

export default OrderPopup;