import React from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import Features from './Features';
import HowItWorks from './HowItWorks';
import Footer from './Footer';
import { motion } from 'framer-motion';

const LandingPage = () => {
    return (
        <div className="landing-page bg-light overflow-hidden">
            <Navbar />
            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
            >
                <section id="hero">
                    <Hero />
                </section>
                <section id="features" className="py-5">
                    <Features />
                </section>
                <section id="how-it-works" className="py-5 bg-white">
                    <HowItWorks />
                </section>
            </motion.main>
            <Footer />
        </div>
    );
};

export default LandingPage;
