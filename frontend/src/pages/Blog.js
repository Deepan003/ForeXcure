import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Preloader from '../components/Preloader';
import './Blog.css';

function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5001/api/blog');
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      }
      setLoading(false);
    };
    fetchPosts();
  }, []);

  return (
    <div className="blog-container container">
      <h1>Health & Wellness Blog</h1>
      {loading ? (
        <Preloader />
      ) : (
        <div className="blog-grid">
          {posts.map(post => (
            <div key={post.id} className="blog-card card">
              <h2>{post.title}</h2>
              <p className="blog-meta">By {post.author} on {post.date}</p>
              <p className="blog-excerpt">{post.excerpt}</p>
              <Link to={`/blog/${post.id}`} className="button-primary">Read More</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Blog;