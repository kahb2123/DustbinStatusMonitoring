import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="carousel-container">
        <Carousel 
          autoPlay 
          infiniteLoop 
          interval={5000} 
          showThumbs={false}
          showStatus={false}
        >
          <div>
            <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945" alt="Smart Waste Management" />
            
          </div>
           
          <div>
            <img src="https://images.unsplash.com/photo-1600585152220-90363fe7e115" alt="Clean City" />
            
          </div>
          <div>
            <img src="https://images.unsplash.com/photo-1503596476-1c12a8ba09a9" alt="IoT Technology" />
         
          </div>
        </Carousel>
      </div>

      <div className="features-section">
        <h2>Our System Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-trash-alt"></i>
            </div>
            <h3>Smart Bins</h3>
            <p>Real-time monitoring of waste levels in smart bins across the city.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-route"></i>
            </div>
            <h3>Optimal Routes</h3>
            <p>AI-powered route optimization for waste collection vehicles.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <h3>Data Analytics</h3>
            <p>Comprehensive reports and analytics for better waste management.</p>
          </div>
        </div>
      </div>

      <div className="about-section">
        <h2>About Our Project</h2>
        <p>
          Our IoT-based Smart Waste Management System revolutionizes traditional waste collection 
          methods by implementing real-time monitoring, automated alerts, and optimized collection 
          routes. This innovative solution helps cities reduce operational costs, improve efficiency, 
          and contribute to a cleaner environment.
        </p>
      </div>
    </div>
  );
};

export default Home;