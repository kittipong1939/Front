import axios from 'axios';
import { useState } from 'react';

export default function AddProductForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price_product: '',
    stock_of_product: '',
    categoryId: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8889/auth/product', formData);
      console.log(response.data);
      // Handle success response
    } catch (error) {
      console.error('Error:', error);
      // Handle error response
    }
  };

  return (
    <div>
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} />
        </div>
        <div>
          <label>Description:</label>
          <input type="text" name="description" value={formData.description} onChange={handleChange} />
        </div>
        <div>
          <label>Price:</label>
          <input type="number" name="price_product" value={formData.price_product} onChange={handleChange} />
        </div>
        <div>
          <label>Stock:</label>
          <input type="number" name="stock_of_product" value={formData.stock_of_product} onChange={handleChange} />
        </div>
        <div>
          <label>Category ID:</label>
          <input type="number" name="categoryId" value={formData.categoryId} onChange={handleChange} />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
