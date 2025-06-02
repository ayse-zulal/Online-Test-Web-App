import React from 'react';
import './Loader.css';
import cute from '../assets/cute.png'
const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader-logo">
        <img src={cute} style={{width:'100px'}}>
        </img></div>
      <div className="loading-bar">
        <div className="bar-fill"></div>
      </div>
      <div>
        <p style={{textAlign:'center', fontWeight: 'bold'}}>Ücretsiz server kullandığımız için başta biraz tutukluk yapabiliyoruz, gecikme için sorry..</p>
        <p style={{marginTop: 5,textAlign:'center', fontWeight: 'bold'}}>Lütfen sayfayı yenileme!</p>  
      </div>
    </div>
  );
};

export default Loader;
