import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../src/Manage.css'; // Import CSS file for styling

export default function ManagementProduct() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [editConfirmation, setEditConfirmation] = useState(null);
  const [editedProduct, setEditedProduct] = useState(null);

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

  const handleEditProduct = (productId) => {
    const productToEdit = products.find(product => product.id === productId);
    setEditedProduct(productToEdit);
    setEditConfirmation(true);
  };

  const handleConfirmEdit = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8889/auth/edit/${editedProduct.id}`, editedProduct, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Edited product:", editedProduct);
      // Update the products state to reflect the changes
      const updatedProducts = products.map(product => {
        if (product.id === editedProduct.id) {
          return editedProduct;
        }
        return product;
      });
      setProducts(updatedProducts);
      setEditConfirmation(null);
      setEditedProduct(null);
    } catch (error) {
      console.error('Error editing product:', error);
    }
  };

  const handleDeleteProduct = (productId) => {
    setDeleteConfirmation(productId);
  };

  const handleDeleteConfirmed = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8889/product/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(`Deleted product with ID ${productId}`);
      // After deleting the product, update the products state by filtering out the product with the deleted productId
      setProducts(products.filter(product => product.id !== productId));
      setDeleteConfirmation(null); // Close delete confirmation window
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleShowAllProducts = () => {
    setSelectedCategory(''); // Set selected category to empty to display all products
  };

  const handleAddProduct = () => {
    // Add your logic to navigate to the add product page or show the add product form
    // This can be done using React Router or by toggling a state to show the add product form
    // For demonstration purposes, I will simply log a message to the console
    console.log('Add Product clicked');
  };

  return (
    <div className="management-product-container">
      <div className="category-buttons1">
        <button
          className={`category-button1 ${!selectedCategory ? 'selected' : ''}`}
          onClick={handleShowAllProducts}
        >
          Show All
        </button>
        
        {categories.map((category) => (
          <button
            key={category.id}
            className={`category-button1 ${selectedCategory === category.id ? 'selected' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.category_name}
          </button>
        ))}
        
      </div>
      {/* Add Product button */}
      <div className="add-product-button">
        <button onClick={handleAddProduct} className="add-button">Add Product</button>
      </div>
      <div className="products-table">
        <table>
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Title</th>
              <th>img</th>
              <th>Description</th>
              <th>Price</th>
              <th>Category ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products
              .filter((product) => !selectedCategory || product.categoryId === selectedCategory)
              .map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td><img src={product.img} alt="Product" className="product-image1" /></td>

                  <td>{product.description}</td>
                  <td>{product.price}</td>
                  <td>{product.categoryId}</td>
                  <td>
                    {/* <button onClick={() => handleEditProduct(product.id)} className="edit-button">Edit</button> */}
                    <button onClick={() => handleDeleteProduct(product.id)} className="action-button">Delete</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {/* Delete Confirmation Dialog */}
      {deleteConfirmation && (
        <div className="delete-confirmation">
          <p>Are you sure you want to delete this product?</p>
          <p>Product ID: {deleteConfirmation}</p> {/* Show the product ID */}
          <p>Name: {products.find(product => product.id === deleteConfirmation)?.title}</p> {/* Show the product title */}
          <p>Description: {products.find(product => product.id === deleteConfirmation)?.description}</p> {/* Show the product description */}
          <p>Price: {products.find(product => product.id === deleteConfirmation)?.price}</p> {/* Show the product price */}
          <p>Stock: {products.find(product => product.id === deleteConfirmation)?.stock_of_product}</p> {/* Show the product stock */}
          <p>Category ID: {products.find(product => product.id === deleteConfirmation)?.categoryId}</p> {/* Show the product category ID */}
          <button onClick={() => handleDeleteConfirmed(deleteConfirmation)} className="confirm-button">Yes</button>
          <button onClick={() => setDeleteConfirmation(null)} className="cancel-button">Cancel</button>
        </div>
      )}
      {/* Edit Confirmation Dialog */}
      {editConfirmation && (
        <div className="edit-confirmation">
          <p>Edit Product:</p>
          <p>Product ID: {editedProduct.id}</p>
          <label>Title </label>
          <input type="text" value={editedProduct.title} onChange={(e) => setEditedProduct({...editedProduct, title: e.target.value})} /><br />
          <label>Detail </label>
          <input type="text" value={editedProduct.description} onChange={(e) => setEditedProduct({...editedProduct, description: e.target.value})} /><br />
          <label>Price </label>
          <input type="number" value={editedProduct.price_product} onChange={(e) => setEditedProduct({...editedProduct, price_product: e.target.value})} /><br />
          <label>Stock </label>
          <input type="number" value={editedProduct.stock_of_product} onChange={(e) => setEditedProduct({...editedProduct, stock_of_product: e.target.value})} />
          <button onClick={() => handleConfirmEdit()} className="confirm-button">Save</button>
          <button onClick={() => setEditConfirmation(null)} className="cancel-button">Cancel</button>
        </div>
      )}
    </div>
  );
}
