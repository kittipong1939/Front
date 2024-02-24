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
      const maxQuantity = 3; // จำนวนสินค้าสูงสุดที่สามารถเพิ่มได้ในแต่ละครั้ง
  
      // วนลูปเพื่อสร้าง payload สำหรับการ POST request สำหรับแต่ละสินค้าในตะกร้า
      for (let i = 0; i < cartItems.length; i++) {
        const payload = {
          cartId: 1, // ตั้งค่า cartId ตามที่ต้องการ
          productId: cartItems[i].id, // เลือกสินค้าในตะกร้าที่ตำแหน่ง i
          quantity: cartItems[i].quantity // จำนวนสินค้าที่ต้องการเพิ่มในแต่ละครั้ง
        };
  
        // ส่ง POST request ไปยังเซิร์ฟเวอร์
        const response = await axios.post('http://localhost:8889/cartitem/', payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Added to cart:', response.data);
      }
  
      // เมื่อทำการเพิ่มสินค้าเรียบร้อยแล้ว
      alert('Products added successfully');
      setAddConfirmation(true); // ตั้งค่า AddConfirmation เป็น true เมื่อสินค้าถูกเพิ่มลงในตะกร้าเรียบร้อยแล้ว
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
    <div className="user-home-container">
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
      <div className="products-list">
        {(searchTerm ? filteredProducts : products) // ใช้ filteredProducts ถ้ามีการค้นหา มิฉะนั้นใช้ products ทั้งหมด
          .filter((product) => !selectedCategory || product.categoryId === selectedCategory)
          .map((product) => (
            <div key={product.id} className="product-item">
              <img src={product.img} alt="Product" className="product-image" />
              
              <h3 className="product-title">{product.name.toUpperCase()}</h3>
              <p className="product-description">{product.description}</p>
              <p className="product-price">Price: {product.price}</p>
              <p className="product-category">Category ID: {product.categoryId}</p>
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
          ))}
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
