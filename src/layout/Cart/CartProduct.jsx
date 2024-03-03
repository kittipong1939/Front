import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CartPage.css'; // Import CSS file for styling
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const [cartData, setCartData] = useState([]);
  const [cartItemData, setCartItemData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // ระบุหน้าปัจจุบันของตะกร้า
  const [showPaymentButton, setShowPaymentButton] = useState(false);
  const nav = useNavigate()

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        const cartResponse = await axios.get('http://localhost:8889/cart/last', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const latestCart = cartResponse.data; // จะได้เป็น object ของ order ล่าสุด
        setCartData([latestCart]);
     
      } catch (error) {
        console.error('Error fetching cart data:', error);
      }
    };

    const fetchCartItemData = async () => {
      try {
        const token = localStorage.getItem('token');
        const cartResponse = await axios.get('http://localhost:8889/cart/', {
          headers: { Authorization: `Bearer ${token}` }
        });
    
        console.log('Cart Response:', cartResponse);
    
        const cartId = cartResponse.data[0].id;
        console.log('Cart ID:', cartId);
    
        const cartItemResponse = await axios.get(`http://localhost:8889/cartitem/?cartId=${cartId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
    
        console.log('Cart Item Response:', cartItemResponse);
    
        // ใช้ method filter เพื่อค้นหา cartItem ที่มี cartId ตรงกับค่าที่ได้จากการ get cart มา
        const cartItems = cartItemResponse.data.filter(item => item.cartId === cartId);
    
        setCartItemData(cartItems);
      } catch (error) {
        console.error('Error fetching cart item data:', error);
      }
    };
    

    fetchCartData();
    fetchCartItemData();
  }, []);

  const getProductInfo = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8889/product/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data; // Return product info
    } catch (error) {
      console.error('Error fetching product info:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchProductInfoForCartItems = async () => {
      try {
        const productInfos = await Promise.all(cartItemData.map(item => getProductInfo(item.productId)));
        // Merge product info with cart item data
        const updatedCartItems = cartItemData.map((item, index) => ({
          ...item,
          productInfo: productInfos[index] // Add product info to each cart item
        }));
        setCartItemData(updatedCartItems);
      } catch (error) {
        console.error('Error fetching product info for cart items:', error);
      }
    };

    // Check if cartItemData is not empty before fetching product info
    if (cartItemData.length > 0) {
      fetchProductInfoForCartItems();
    }
  }, [cartItemData]);

  const handleDelete = async (itemId) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this item?');
    if (isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:8889/cartitem/${itemId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Remove the deleted item from the state immediately
        setCartItemData(prevData => prevData.filter(item => item.id !== itemId));
        // รีเฟรชหน้าหลังจากลบสินค้า
        window.location.reload();
      } catch (error) {
        console.error('Error deleting cart item:', error);
      }
    }
  };

  const handleUpdateCart = async () => {
  try {
    const token = localStorage.getItem('token');
  
    // Fetch the latest cart data first
    const cartResponse = await axios.get('http://localhost:8889/cart/', {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('Cart Response:', cartResponse);

    const cartId = cartResponse.data[0].id;
    const userId = cartResponse.data[0].userId;

    // Update total in the cart
    await axios.put(`http://localhost:8889/cart/${cartId}`, {
      total: calculateTotal() // Assuming calculateTotal() returns the total value
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const currentDate = new Date().toISOString();
    await axios.post('http://localhost:8889/order/', {
        dueDate: currentDate,
        status: 'UNPAID',
        userId: userId,
        cartId: cartId 
    }, {
        headers: { Authorization: `Bearer ${token}` }
    });

    nav('/OrderPopUp'); // Open in a new tab
  } catch (error) {
    console.error('Error updating cart:', error);
  }
};

  
  
  // const handleConfirm = async () => {
  //   try {
  //     const token = localStorage.getItem('token');
  //     const cartResponse = await axios.get('http://localhost:8889/cart/last', {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });
  //     const latestCart = cartResponse.data; // จะได้เป็น object ของ order ล่าสุด
  //     setCartData([latestCart]);
  //     // Fetch the latest cart data
  //     const cartId = latestCart.id;
  //     if (cartId) {
  //       // Create cart first
  //       await axios.post('http://localhost:8889/cart/', {  , userId: 1 }, {
  //         headers: { Authorization: `Bearer ${token}` }
  //       });
  //     }

  //     setShowPaymentButton(true);
  //   } catch (error) {
  //     console.error('Error handling confirmation:', error);
  //   }
  // };

  const calculateTotal = () => {
    return cartItemData.reduce((acc, item) => {
      const subtotal = item.productInfo ? item.productInfo.price * item.quantity : 0;
      return acc + subtotal;
    }, 0);
  };

  // กำหนดจำนวนสินค้าต่อหน้า
  const itemsPerPage = 3;
  // คำนวณหน้าสุดท้าย
  const lastPageIndex = Math.ceil(cartItemData.length / itemsPerPage);
  // คำนวณหน้าเริ่มต้นของสินค้าที่ต้องการแสดง
  const startIndex = (currentPage - 1) * itemsPerPage;
  // คำนวณหน้าสุดท้ายของสินค้าที่ต้องการแสดง
  const endIndex = Math.min(startIndex + itemsPerPage, cartItemData.length);

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1 className="cart-title">Your Cart</h1>
        <div className="cart-summary">
          <h2 className="cart-summary-title">สรุปรายการสั่งซื้อ /Order Summary</h2><br />
          <table className="cart-summary-table">
            <tbody>
              {cartData.map(item => (
                <tr key={item.id}>
                  <td className="cart-summary-label">Total</td>
                  <td className="cart-summary-value">{calculateTotal()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* <button onClick={handleConfirm} className="update-cart-button">ยืนยัน</button> */}
          {/* {showPaymentButton && ( */}
            <button onClick={handleUpdateCart} className="update-cart-button">ชำระเงิน</button>
          {/* // )} */}
        </div>
      </div>
      <div className="cart-items ">
        <h2 className="cart-items-title ">Cart Items</h2>
        <table className="cart-items-table ">
          <thead>
            <tr>
              <th>Product</th>
              <th>Description</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {cartItemData.slice(startIndex, endIndex).map((item, index) => (
              <tr key={item.id}>
                <td className="cart-item-product">
                  <img src={item.productInfo ? item.productInfo.img : ''} alt="Product" className="cart-item-image" />
                  <span className="cart-item-name">{item.productInfo ? item.productInfo.name : 'Loading...'}</span>
                </td>
                <td className="cart-item-description">{item.productInfo ? item.productInfo.description : 'Loading...'}</td>
                <td className="cart-item-price">{item.productInfo ? item.productInfo.price * item.quantity : 'Loading...'}</td>
                <td className="cart-item-quantity">{item.quantity}</td>
                <td className="cart-item-action">
                  <button onClick={() => handleDelete(item.id)} className="delete-button">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {currentPage > 1 && (
          <button onClick={() => setCurrentPage(currentPage - 1)}>Previous</button> 
        )}
        {currentPage < lastPageIndex && (
          <button onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
        )}
      </div>
    </div>
  );
};

export default CartPage;
