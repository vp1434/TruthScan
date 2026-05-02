import React from 'react';
import Hero from '../components/Hero';
import InputSection from '../components/InputSection';
import Features from '../components/Features';

const Home: React.FC = () => {
  return (
    <main>
      <Hero />
      <InputSection />
      <Features />
    </main>
  );
};

export default Home;
