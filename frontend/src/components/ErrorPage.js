import React from 'react';
import './Loader.css';
import cloud from '../assets/cloud.png'
const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader-logo">
        <img src={cloud} style={{width:'100px'}}>
        </img></div>
        <p>Bu test/ler elimizde yok maalesef...</p>
    </div>
  );
};

export default Loader;