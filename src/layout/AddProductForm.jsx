import axios from 'axios';
import { useState } from 'react';
import '../../src/Addproduct.css';

export default function AddProductForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price_product: '',
    stock_of_product: '',
    categoryId: '',
    image: null, // เพิ่มฟิลด์สำหรับรูปภาพ
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
      const parsedFormData = {
        ...formData,
        price_product: parseFloat(formData.price_product), // แปลงค่าราคาเป็น Number
        stock_of_product: parseInt(formData.stock_of_product), // แปลงจำนวนสต๊อกเป็นจำนวนเต็ม
        categoryId: parseInt(formData.categoryId), // แปลง categoryId เป็นจำนวนเต็ม
      };
  
      const response = await axios.post('http://localhost:8889/auth/product', parsedFormData);
      console.log(response.data);
      if (response.status === 200) {
        alert('Product added successfully');
      } else {
        alert('Unexpected response: ' + response.status);
      }
    } catch (error) {
      console.error('Error:', error);
      if (error.response) {
        console.error('Error Response:', error.response.data);
        alert('Error: ' + error.response.data.message);
      } else if (error.request) {
        console.error('No response received from the server');
        alert('No response received from the server');
      } else {
        console.error('Error setting up the request:', error.message);
        alert('Error setting up the request: ' + error.message);
      }
    }
  };
  

  return (
    <div className="p-5 border w-4/6 min-w-[500px] mx-auto rounded mt-5">
      <div className="text-3xl mb-5">Add Product Form</div>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Title:</span>
          </div>
          <input
            type="text"
            className="input input-bordered w-full max-w-xs"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </label>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Description:</span>
          </div>
          <input
            type="text"
            className="input input-bordered w-full max-w-xs"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </label>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Price:</span>
          </div>
          <input
            type="number"
            className="input input-bordered w-full max-w-xs"
            name="price_product"
            value={formData.price_product}
            onChange={handleChange}
          />
        </label>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Stock:</span>
          </div>
          <input
            type="number"
            className="input input-bordered w-full max-w-xs"
            name="stock_of_product"
            value={formData.stock_of_product}
            onChange={handleChange}
          />
        </label>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Category ID:</span>
          </div>
          <input
            type="number"
            className="input input-bordered w-full max-w-xs"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
          />
        </label>
        <div className="flex gap-5">
          <button type="submit" className="btn btn-outline btn-info mt-7">
            Submit
          </button>
          <button type="reset" className="btn btn-outline btn-warning mt-7">
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
