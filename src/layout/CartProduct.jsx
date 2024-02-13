// CartPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8889/auth/cart2', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCartItems(response.data);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchCartItems();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const productPromises = cartItems.map(item => axios.get(`http://localhost:8889/product1/${item.productId}`, {
          headers: { Authorization: `Bearer ${token}` }
        }));
        const productResponses = await Promise.all(productPromises);
        const productData = productResponses.map(response => response.data);
        setProducts(productData);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    if (cartItems.length > 0) {
      fetchProducts();
    }
  }, [cartItems]);

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Cart Items</h1>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Quantity</th>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Subtotal Price</th>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Product Details</th>
            {/* You can add more table headers here if needed */}
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item, index) => (
            <tr key={item.id}>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.quantity}</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.subtotal_price}</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                {products[index] && (
                  <>
                    <div>ID: {products[index].id}</div>
                    <div>Title: {products[index].title}</div>
                    <div>Description: {products[index].description}</div>
                    <div>Price: {products[index].price_product}</div>
                    {/* Add more details here if needed */}
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CartPage;
