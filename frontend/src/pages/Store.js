import React, { useState, useEffect } from 'react';
import Preloader from '../components/Preloader';
import './Store.css';

function Store() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5001/api/store');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  return (
    <div className="store-container container">
      <h1>Medical Store</h1>
      {loading ? (
        <Preloader />
      ) : (
        <div className="store-grid">
          {products.map(product => (
            <div key={product.id} className="product-card card">
              <img src={product.image} alt={product.name} className="product-image" />
              <h3>{product.name}</h3>
              <p className="product-desc">{product.description}</p>
              <div className="product-footer">
                <span className="product-price">${product.price}</span>
                <button className="button-primary">Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Store;