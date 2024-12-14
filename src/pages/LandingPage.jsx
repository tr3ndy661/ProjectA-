import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import Services from '../components/Services';
import About from '../components/About';
import Footer from '../components/Footer.jsx';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <Services />
      <About />
      <Footer />
    </div>
  );
};

export default LandingPage; 