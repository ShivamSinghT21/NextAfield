import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import Login from '../components/Login.jsx';
import Signup from '../components/Signup.jsx';
import './styles/Home.css';

const Home = () => {
  // State to track active modal: 'login', 'signup', or null
  const [activeModal, setActiveModal] = useState(null);

  // Handlers to open modals
  const openLogin = () => setActiveModal('login');
  const openSignup = () => setActiveModal('signup');
  const closeModal = () => setActiveModal(null);

  // Handlers to switch modals inside modal components
  const switchToSignup = () => setActiveModal('signup');
  const switchToLogin = () => setActiveModal('login');

  const shouldShowNavbar = () => {
    return activeModal === null; // shows navbar only if no modal open
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    if (activeModal) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [activeModal]);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <main className="app-container">
        {/* Navbar with handlers and hidden flag to hide when modal open */}
        {shouldShowNavbar() && <Navbar onOpenLogin={openLogin} onOpenSignup={openSignup} />}

        {/* Hero Section */}
        <section id="home" className="hero">
          <div className="hero-content">
            <h1 className="hero-title">
              Elevate Your Business with <span>SkyGrow</span>
            </h1>
            <p className="hero-subtitle">
              Sustainable growth solutions powered by AI, analytics, and innovative technology.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary" onClick={openSignup}>
                Get Started
              </button>
              <button className="btn-secondary" onClick={() => scrollToSection('features')}>
                Learn More
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="services-section">
          <h2 className="section-title">Our Key Features</h2>
          <div className="services-list">
            <div className="service-item">
              <h3>AI Growth Engine</h3>
              <p>
                Intelligent algorithms analyze your data and recommend personalized growth strategies 
                that deliver measurable results and 3x ROI.
              </p>
            </div>
            <div className="service-item">
              <h3>Advanced Analytics</h3>
              <p>
                Complete visibility into your business performance with 50+ KPIs, custom dashboards, 
                and exportable reports for data-driven decisions.
              </p>
            </div>
            <div className="service-item">
              <h3>Lightning Performance</h3>
              <p>
                99.9% uptime, sub-second load times, and seamless scalability ensuring optimal 
                performance for businesses of all sizes.
              </p>
            </div>
            <div className="service-item">
              <h3>Enterprise Security</h3>
              <p>
                SOC 2 compliant, end-to-end encryption, and role-based access control trusted 
                by Fortune 500 companies worldwide.
              </p>
            </div>
            <div className="service-item">
              <h3>API-First Platform</h3>
              <p>
                Integrate seamlessly with 100+ tools including Zapier, Slack, HubSpot, 
                and custom webhook endpoints for workflow automation.
              </p>
            </div>
            <div className="service-item">
              <h3>Smart Automation</h3>
              <p>
                Automate repetitive tasks, customer workflows, and growth experiments 
                with our intuitive no-code automation builder.
              </p>
            </div>
            <div className="service-item">
              <h3>Real-time Insights</h3>
              <p>
                Monitor performance metrics in real-time with comprehensive dashboards, 
                alerts, and actionable recommendations for continuous improvement.
              </p>
            </div>
            <div className="service-item">
              <h3>Scalable & Secure System</h3>
              <p>
                Built on robust full-stack architecture with auto-scaling capabilities, 
                ensuring real-time synchronization and enterprise-grade data security.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="pricing-section section-wrapper">
          <h2 className="section-title">Pricing Plans</h2>
          <div className="pricing-cards">
            <div className="pricing-card">
              <h3>Basic Plan</h3>
              <p className="price">
                $0<span>/month</span>
              </p>
              <ul>
                <li>Access to basic features</li>
                <li>Limited analytics</li>
                <li>Community support</li>
              </ul>
            </div>
            <div className="pricing-card featured">
              <h3>Pro Plan</h3>
              <p className="price">
                $29<span>/month</span>
              </p>
              <ul>
                <li>Unlimited features</li>
                <li>AI-powered insights</li>
                <li>Advanced analytics</li>
                <li>Priority support</li>
              </ul>
            </div>
            <div className="pricing-card">
              <h3>Enterprise</h3>
              <p className="price">Contact Us</p>
              <ul>
                <li>Custom solutions</li>
                <li>Team management</li>
                <li>Dedicated support</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Blog Section */}
        <section id="blog" className="blog-section section-wrapper">
          <h2 className="section-title">Latest from Our Blog</h2>
          <div className="blog-posts">
            <article className="blog-post">
              <h3 className="blog-post-title">How to Scale Your Business in 2026</h3>
              <p className="blog-post-date">Feb 1, 2026</p>
              <p className="blog-post-excerpt">
                Discover tips and strategies to confidently grow your business with data-driven insights.
              </p>
            </article>
            <article className="blog-post">
              <h3 className="blog-post-title">Top 10 Growth Strategies</h3>
              <p className="blog-post-date">Jan 20, 2026</p>
              <p className="blog-post-excerpt">
                Start your growth journey with these carefully selected strategies designed for success.
              </p>
            </article>
            <article className="blog-post">
              <h3 className="blog-post-title">Analytics Best Practices</h3>
              <p className="blog-post-date">Jan 5, 2026</p>
              <p className="blog-post-excerpt">
                Learn how to leverage analytics to make smarter business decisions and drive growth.
              </p>
            </article>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="about-section section-wrapper">
          <h2 className="section-title">About SkyGrow</h2>
          <p className="section-text">
            SkyGrow is a comprehensive platform designed to empower businesses with the tools,
            insights, and strategies needed to achieve sustainable growth. Our mission is to bridge the gap between
            ambition and achievement by offering AI-powered analytics, smart automation, and personalized growth recommendations.
          </p>
        </section>

        {/* Contact Section */}
        <section id="contact" className="contact-section section-wrapper">
          <h2 className="section-title">Contact Us</h2>
          <p className="section-text">Have questions or want to work with us? Reach out!</p>
          <form className="contact-form" action="#" method="post">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" type="text" placeholder="Your full name" required />

            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" placeholder="Your email address" required />

            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows="4" placeholder="Your message..." required />

            <button type="submit" className="btn-primary">Send Message</button>
          </form>
        </section>

        {/* Modals */}
        {activeModal === 'login' && (
          <Login closeModal={closeModal} switchToSignup={switchToSignup} />
        )}
        {activeModal === 'signup' && (
          <Signup closeModal={closeModal} switchToLogin={switchToLogin} />
        )}
      </main>

      {/* Footer - Outside main container */}
      {shouldShowNavbar() && <Footer />}
    </>
  );
};

export default Home;
