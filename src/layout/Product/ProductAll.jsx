import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Product/Product.css'; // Import CSS file for styling
import { useNavigate } from 'react-router-dom';

export default function AllProduct() {
  
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0); // State เก็บราคาทั้งหมดของสินค้าในตะกร้า
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [AddConfirmation, setAddConfirmation] = useState(null);
  const [BuyConfirmation, setBuyConfirmation] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]); // เพิ่ม state เก็บรายการสินค้าที่ผ่านการค้นหา
  const nav = useNavigate()
  const handleToCart = async () =>{
    const token = localStorage.getItem('token');
    if (!token) {
      // Redirect user to login page
      alert('Please login')
      window.location.href = '/login';
      return;
    }
    nav('/new');
  };  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8889/product/all', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8889/auth/category', {
          headers: { Authorization: `Bearer ${token}` }
        }); 
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    // คำนวณราคาทั้งหมดของสินค้าในตะกร้าเมื่อมีการเปลี่ยนแปลงใน cartItems
    let totalPrice = 0;
    cartItems.forEach(item => {
      const product = products.find(product => product.id === item.id);
      if (product) {
        totalPrice += item.quantity * product.price;
      }
    });
    setTotalPrice(totalPrice);
  }, [cartItems, products]);

  //กดซื้อ
  const handleBuyProduct = (productId) => {
    
    setBuyConfirmation(productId);
    document.querySelector('.overlay').classList.add('active');
    console.log(`Buying product with ID ${productId}`);
  };
  
  //cancle
  const CanclehandleBuyProduct = () => {
    setBuyConfirmation(null);
    document.querySelector('.overlay').classList.remove('active');
  };

  //กด Add 
  const handleAddProduct = (productId) => {
    const existingItem = cartItems.find(item => item.id === productId);
    if (existingItem) {
      const updatedCartItems = cartItems.map(item => {
        if (item.id === productId) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });
      setCartItems(updatedCartItems);
    } else {
      setCartItems([...cartItems, { id: productId, quantity: 1 }]);
    }
  };

  const handleRemoveFromCart = (itemId) => {
    const updatedCartItems = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCartItems);
  };

  const handleIncreaseQuantity = (itemId) => {
    const updatedCartItems = cartItems.map(item => {
      if (item.id === itemId) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    setCartItems(updatedCartItems);
  };

  const handleDecreaseQuantity = (itemId) => {
    const updatedCartItems = cartItems.map(item => {
      if (item.id === itemId && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });
    setCartItems(updatedCartItems);
  };
  const handleAddToCart1 = async () => {
    try {
      
      const token = localStorage.getItem('token');
      // สร้าง payload สำหรับการ POST request
      if (!token) {
        // Redirect user to login page
        alert('Please login')
        window.location.href = '/login';
        return;
      }
      const payload = {
        cartId: 1, // ตั้งค่า cartId ตามที่ต้องการ
        productId: BuyConfirmation, // ใช้ BuyConfirmation ที่เก็บ ID ของสินค้าที่ต้องการซื้อ
        quantity: 1 // ให้เพิ่มสินค้าเพียง 1 ชิ้น
      };
      const response = await axios.post('http://localhost:8889/cartitem/', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Added to cart:', response.data);
      alert('Product added successfully');
      setAddConfirmation(true);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setAddConfirmation(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Check if token exists
      if (!token) {
        // Redirect user to login page
        alert('Please login')
        window.location.href = '/login';
        return;
      }

      const maxQuantity = 3;
      console.log(token);
  
      // Check if there's an existing cart for the user
      const existingCartResponse = await axios.get('http://localhost:8889/cart/', {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      // If there's an existing cart, use it instead of creating a new one
      let cartId;
      if (existingCartResponse.data.length > 0) {
        cartId = existingCartResponse.data[0].id;
      } else {
        // Create a new cart if no existing cart found
        const newCartResponse = await axios.post('http://localhost:8889/cart/', { total: totalPrice }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        cartId = newCartResponse.data.id;
      }
  
      // Loop to create payloads for each item in the cart
      for (let i = 0; i < cartItems.length; i++) {
        const payload = {
          cartId: cartId,
          productId: cartItems[i].id,
          quantity: cartItems[i].quantity
        };
  
        const response = await axios.post('http://localhost:8889/cartitem/', payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Added to cart:', response.data);
      }
  
      // Once products are successfully added
      alert('Products added successfully');
      setAddConfirmation(true);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setAddConfirmation(false);  
      
    }
};

  
  
  
  
  
  

  const filterItem = () => {
    const filteredlist = products.filter(
      item => item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filteredlist);
  };

  return (
    <div className="user-home-container bg-white dark:bg-gray-900 dark:text-white duration-200">
      <h1 className='H11'>Book For You</h1><br />
      <p className='P11'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni, iusto.</p><br />
      <div className="category-buttons">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by product name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyUp={filterItem} // เรียกใช้งาน filterItem เมื่อปล่อยปุ่มหายไป
          />
        </div>
        <button
          className={`category-button ${!selectedCategory ? 'selected' : ''}`}
          onClick={() => setSelectedCategory('')} // เพิ่มฟังก์ชันที่จะล้างค่า selectedCategory เมื่อคลิกปุ่ม "Show All"
        >
          Show All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            className={`category-button ${selectedCategory === category.id ? 'selected' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.category_name}
          </button>
        ))}
      </div>
      <div className="products-list ">
        {(searchTerm ? filteredProducts : products) // ใช้ filteredProducts ถ้ามีการค้นหา มิฉะนั้นใช้ products ทั้งหมด
          .filter((product) => !selectedCategory || product.categoryId === selectedCategory)
          .map((product) => (
            <div key={product.id} className="product-item">
              <img src={product.img} alt="Product" className="product-image " />
              
              <h3 className="product-title">{product.name.toUpperCase()}</h3>
              <p className="product-description">{product.description}</p>
              <p className="product-price">Price: {product.price} บาท</p><br />
              {/* <p className="product-category">Category ID: {product.categoryId}</p> */}
              <div className="button-group">
                <button onClick={() => handleBuyProduct(product.id)} className="buy-button">View</button>
                <button onClick={() => handleAddProduct(product.id)} className="add-to-cart-button">Add to Cart</button>
              </div>
            </div>
          ))}
      </div>
      {((searchTerm && filteredProducts.length === 0) || (searchTerm === '' && products.length === 0)) && (
        <p className='noproduct' style={{ textAlign: 'center', color: 'red' }}>ไม่พบสินค้าดังกล่าว!</p>
      )}
      {cartItems.length > 0 && (
        <div className="Add-confirmation">
            <button className="close-button" onClick={() => setCartItems([])}>X</button>
          <h2>ตะกร้าสินค้า</h2>
          
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={products.find(product => product.id === item.id)?.img} alt="Product" className="product-image" />
              <div className="ddd">
              <p>ไอดีสินค้า: {products.find(product => product.id === item.id)?.id}</p>
                <p>ชื่อสินค้า: {products.find(product => product.id === item.id)?.name}</p>
                <p>รายละเอียด: {products.find(product => product.id === item.id)?.description}</p>
                <p>Price: {products.find(product => product.id === item.id)?.price}</p>
                <p>Category ID: {products.find(product => product.id === item.id)?.categoryId}</p>
                <div className="quantity-buttons">
                  <button onClick={() => handleDecreaseQuantity(item.id)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleIncreaseQuantity(item.id)}>+</button>
                  <button className='cancel-button' onClick={() => handleRemoveFromCart(item.id)}>Remove</button>
                </div>
              </div>
              
            </div>
          ))}<br/><br/>
          <button className="add-to-cart-button" onClick={handleAddToCart}>Add Cart</button>
          <button className="view-cart-button" onClick={handleToCart}>View Cart</button>

          <p>Total: {totalPrice}.- Bath</p> {/* แสดงราคาทั้งหมด */}
        </div>
      )}
      {BuyConfirmation && (
        <div className="Buy-confirmation">
          <div className='Buy-detail'>
            <div className='Buy-img'>
              <img src={products.find(product => product.id === BuyConfirmation)?.img} alt="Product" className="product-image1" />
            </div>
            <div className='Buy-text'>
              <p>ชื่อสินค้า: {products.find(product => product.id === BuyConfirmation)?.name}</p>
              <p>รายละเอียด: {products.find(product => product.id === BuyConfirmation)?.description}</p>
              <p>Price: {products.find(product => product.id === BuyConfirmation)?.price}</p>
              <p>Category ID: {products.find(product => product.id === BuyConfirmation)?.categoryId}</p>
            </div>
            
            <div className='Buy-btn'>
              <button onClick={() => handleAddToCart1(BuyConfirmation)} className="confirm-button">Buy now</button>
              <button onClick={() => CanclehandleBuyProduct(null)} className="cancel-button">Cancel</button>
            </div><br />
            <div><button className="view-cart-button" onClick={handleToCart}>View Cart</button></div>
          </div>
        </div>
      )}
      <div className="overlay"></div>
    </div>
  );
}
