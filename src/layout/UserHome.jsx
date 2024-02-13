import axios from 'axios';
import { useEffect, useState } from 'react';
import '../../src/Userhome.css'; // Import CSS file for styling

export default function UserHome() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8889/auth/product1', {
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
        const response = await axios.get('http://localhost:8889/auth/category1', {
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

  const handleBuyProduct = (productId) => {
    console.log(`Buying product with ID ${productId}`);
  };

  const handleAddToCart = (productId) => {
    console.log(`Adding product with ID ${productId} to cart`);
  };

  const handleRefresh = () => {
    window.location.reload(); // รีเฟรชหน้า
  };

  const handleShowAllProducts = () => {
    setSelectedCategory(''); // เซ็ตค่าเลือกประเภทเป็นค่าว่างเพื่อแสดงสินค้าทุกประเภท
  };

  return (
    <div className="user-home-container">
      <div className="category-buttons">
        <button
          className={`category-button ${!selectedCategory ? 'selected' : ''}`}
          onClick={handleShowAllProducts}
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
        {products
          .filter((product) => !selectedCategory || product.categoryId === selectedCategory)
          .map((product) => (
            <div key={product.id} className="product-item">
              <h3 className="product-title">{product.title}</h3>
              <p className="product-description">{product.description}</p>
              <p className="product-price">Price: {product.price_product}</p>
              <p className="product-stock">Stock: {product.stock_of_product}</p>
              <p className="product-category">Category ID: {product.categoryId}</p>
              <div className="button-group">
                <button onClick={() => handleBuyProduct(product.id)} className="buy-button">Buy Now</button>
                <button onClick={() => handleAddToCart(product.id)} className="add-to-cart-button">Add to Cart</button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
