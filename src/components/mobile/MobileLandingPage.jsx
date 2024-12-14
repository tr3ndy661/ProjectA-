import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Css/MobileLandingPage.css';

const testimonialData = [
  {
    text: "This AI is incredible! It's like having a genius friend who's always there to help.",
    name: "Sarah K.",
    title: "Student"
  },
  {
    text: "Finally, an AI service that's both powerful and free. Game changer!",
    name: "Mike R.",
    title: "Developer"
  },
  {
    text: "The response quality is outstanding. Better than paid alternatives!",
    name: "Alex M.",
    title: "Content Creator"
  },
  {
    text: "I'm amazed by how intuitive and helpful this AI is. Simply brilliant!",
    name: "Emma L.",
    title: "Writer"
  },
  {
    text: "This has become my go-to tool for brainstorming and problem-solving.",
    name: "David P.",
    title: "Entrepreneur"
  },
  {
    text: "The speed and accuracy are unmatched. Truly impressive work!",
    name: "Lisa M.",
    title: "Designer"
  }
];

const MobileLandingPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAI, setSelectedAI] = useState(null);
  const [activeSection, setActiveSection] = useState('hero');
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [currentTestimonials, setCurrentTestimonials] = useState(testimonialData.slice(0, 3));
  const testimonialsRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'benefits', 'generators', 'creator'];
      const currentSection = sections.find(section => {
        const element = document.getElementById(`mobile-${section}`);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (testimonialsRef.current) {
      observer.observe(testimonialsRef.current);
    }

    return () => {
      if (testimonialsRef.current) {
        observer.unobserve(testimonialsRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out
      setIsVisible(false);
      
      // Wait for fade out to complete
      setTimeout(() => {
        setCurrentTestimonials(prev => {
          const nextIndex = (testimonialData.indexOf(prev[0]) + 3) % testimonialData.length;
          return [
            ...testimonialData.slice(nextIndex, nextIndex + 3),
            ...testimonialData.slice(0, Math.max(0, 3 - (testimonialData.length - nextIndex)))
          ];
        });
        
        // Trigger fade in
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      }, 800); // Increased delay for smoother transition
      
    }, 6000); // Increased interval to give more time to read

    return () => clearInterval(interval);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  return (
    <div className="mobile-landing-page">
      <div className="complex-background">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      <div className="bg-animation">
        <div className="stars"></div>
        <div className="glow"></div>
      </div>

      <nav className={`mobile-nav ${isOpen ? 'active' : ''}`}>
        <div className={`hamburger ${isOpen ? 'active' : ''}`} onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className={`mobile-nav-menu ${isOpen ? 'active' : ''}`}>
          <ul>
            <li>
              <a href="#mobile-hero" onClick={toggleMenu}>Home</a>
            </li>
            <li>
              <a href="#mobile-benefits" onClick={toggleMenu}>Benefits</a>
            </li>
            <li>
              <a href="#mobile-generators" onClick={toggleMenu}>AI Lab</a>
            </li>
            <li>
              <a href="#mobile-testimonials" onClick={toggleMenu}>User Experiences</a>
            </li>
            <li>
              <a href="#mobile-creator" onClick={toggleMenu}>Meet the Creator</a>
            </li>
          </ul>
        </div>
      </nav>

      <section id="mobile-hero" className="mobile-hero">
        <div className="hero-content">
          <h1>Artificial<br/>Intelligence<br/>Reimagined</h1>
          <p>Stop paying to use AI</p>
          
          <div class="wrapper">
            <div class="watch">
            <div class="strap strap-top">
                <div class="mesh"></div>
                <div class="mesh"></div>
                <div class="mesh"></div>
                <div class="mesh"></div>
                <div class="mesh"></div>
            </div>
            <div class="case">
                <div className="crown"></div>
                <div className="power"></div>
                <div className="screen">
                  <div className="chat-container">
                    <div className="message user-message">
                      Start Chat
                    </div>
                    <div className="message ai-message">
                      <span className="typing-animation">Hi! I'm Makhs</span>
                      {/* <span className="cursor">|</span> */}
                    </div>
                  </div>
                </div>
            </div>
            <div class="strap strap-bottom">
                <div class="mesh"></div>
                <div class="mesh"></div>
                <div class="mesh"></div>
                <div class="mesh"></div>
                <div class="mesh"></div>
            </div>
            </div>
            </div>
        </div>




      </section>

      <div className="section-divider">
        <div className="pulsating-line"></div>
      </div>

      <section id="mobile-benefits" className="mobile-benefits">
        <h2>Benefits</h2>
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="card-icon">🔒</div>
            <h3>Complete Privacy</h3>
            <p>No sign-up, no tracking, just pure AI interaction</p>
          </div>
          <div className="benefit-card">
            <div className="card-icon">💎</div>
            <h3>Always Free</h3>
            <p>Premium features without the premium price</p>
          </div>
          <div className="benefit-card">
            <div className="card-icon">⚡</div>
            <h3>Lightning Fast</h3>
            <p>Instant responses powered by cutting-edge AI</p>
          </div>
        </div>
      </section>

      <div className="section-divider">
        <div className="pulsating-line"></div>
      </div>

      <section id="mobile-generators" className="mobile-generators">
        <h2>AI Lab</h2>
        <div className="generators-container">
          <div className="generator-card active">
            <h3>Chat AI</h3>
            <p>Advanced conversational AI for any task</p>
            <button className="try-btn" onClick={() => navigate('/test')}>
              Try Now
            </button>
          </div>
          <div className="generator-card coming-soon">
            <h3>Image AI</h3>
            <p>Coming soon...</p>
            <span className="badge">Soon</span>
          </div>
        </div>
      </section>

      <div className="section-divider">
        <div className="pulsating-line"></div>
      </div>

      <section 
        id="mobile-testimonials"
        className="mobile-testimonials" 
        ref={testimonialsRef}
      >
        <h2>User Experiences</h2>
        <div className="testimonial-container">
          {currentTestimonials.map((testimonial, index) => (
            <div 
              key={testimonial.name} 
              className={`testimonial-card ${isVisible ? 'animate' : ''}`}
            >
              <div className="testimonial-content">
                <p>"{testimonial.text}"</p>
                <div className="testimonial-author">
                  <span className="author-name">{testimonial.name}</span>
                  <span className="author-title">{testimonial.title}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="section-divider">
        <div className="pulsating-line"></div>
      </div>

      <section id="mobile-creator" className="mobile-creator">
        <div className="creator-content">
          <h2>Meet the Creator</h2>
          <div className="creator-card">
            <div className="creator-header">
              <div className="creator-title-group">
                <h3>Abdelmoneim</h3>
                <div className="creator-badge">22 yo</div>
              </div>
              <div className="creator-role">
                <span className="role-tag">Frontend Developer</span>
                <span className="role-tag">Creative Explorer</span>
              </div>
            </div>
            
            <div className="creator-details">
              <p className="creator-bio">
                Passionate about creating intuitive and engaging web experiences that push the boundaries of what's possible.
              </p>
            </div>

            <a href="mailto:trendypotato661@gmail.com" className="contact-btn">
              Let's Connect
              <span className="btn-icon">→</span>
            </a>
          </div>
        </div>
      </section>

      <footer className="mobile-footer">
        <p>© 2024 AI Reimagined. All rights reserved.</p>
        <p className="disclaimer">Currently in development</p>
      </footer>
    </div>
  );
};

export default MobileLandingPage;