import React from 'react'
import './App.css'
import Avatar from './assets/Avatar.png'
import Navbar from './components/Navbar.jsx'
import { Github, Linkedin, Instagram, Mail, Code, Database, Layers } from 'lucide-react'

const App = () => {
  return (
    <>
      <Navbar />
      <main className="portfolio-main">
        {/* Hero Section with Grid */}
        <section id="home" className="hero-grid">
          <div className="hero-text">
            <span className="greeting">👋 Hello, I'm</span>
            <h1>Shivam Singh Tomar</h1>
            <p className="tagline">Full Stack Developer | MERN Stack Specialist</p>
            <p className="description">
              Crafting dynamic and responsive web applications with a passion for creating elegant solutions.
            </p>
            <div className="cta-buttons">
              <a href="#projects" className="btn-primary">View Projects</a>
              <a href="#contact" className="btn-secondary">Contact Me</a>
            </div>
          </div>
          <div className="hero-image">
            <div className="image-wrapper">
              <img src={Avatar} alt="Shivam Singh Tomar" />
              <div className="glow-effect"></div>
            </div>
          </div>
        </section>

        {/* About Section with Grid */}
        <section id="about" className="about-grid">
          <div className="section-header">
            <h2>About Me</h2>
            <div className="header-line"></div>
          </div>
          
          <div className="about-content-grid">
            <div className="about-text">
              <p>
                I'm a dedicated <strong>Computer Science student</strong> with a strong passion for software development and problem-solving. Currently building my career as a Full Stack Developer with hands-on experience in Java, MERN Stack, DSA, and Web Development.
              </p>
              <p>
                I create real-world applications that combine clean UI with efficient backend logic. My projects range from innovative voice assistants to comprehensive e-learning platforms.
              </p>
              <p>
                I'm highly motivated, disciplined, and eager to learn from real industry challenges. Currently open to <strong>internship and entry-level opportunities</strong> where I can contribute, grow, and create impact through technology.
              </p>
            </div>
            
            <div className="skills-cards">
              <div className="skill-card frontend">
                <div className="skill-icon">
                  <Code size={32} />
                </div>
                <h3>Frontend</h3>
                <ul>
                  <li>React & Vite</li>
                  <li>JavaScript (ES6+)</li>
                  <li>HTML5 & CSS3</li>
                  <li>Tailwind CSS</li>
                </ul>
              </div>
              
              <div className="skill-card backend">
                <div className="skill-icon">
                  <Layers size={32} />
                </div>
                <h3>Backend</h3>
                <ul>
                  <li>Node.js & Express</li>
                  <li>RESTful APIs</li>
                  <li>Authentication</li>
                  <li>Java</li>
                </ul>
              </div>
              
              <div className="skill-card database">
                <div className="skill-icon">
                  <Database size={32} />
                </div>
                <h3>Database & Tools</h3>
                <ul>
                  <li>MongoDB</li>
                  <li>MySQL</li>
                  <li>Git & GitHub</li>
                  <li>DSA</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section with Masonry Grid */}
        <section id="projects" className="projects-grid-section">
          <div className="section-header">
            <h2>Featured Projects</h2>
            <div className="header-line"></div>
          </div>
          
          <div className="projects-masonry">
            <div className="project-card tall">
              <div className="project-image face-recognition">
                <div className="project-overlay">
                  <span className="project-status completed">Completed</span>
                </div>
              </div>
              <div className="project-details">
                <h3>Face Recognition Attendance System</h3>
                <p>
                  Developed and showcased at <strong>Technogenesis 2024</strong>. Built an automated attendance tracking system using facial recognition technology with real-time detection capabilities.
                </p>
                <div className="tech-stack">
                  <span className="tech-tag">Computer Vision</span>
                  <span className="tech-tag">Python</span>
                  <span className="tech-tag">OpenCV</span>
                  <span className="tech-tag">ML</span>
                </div>
                <div className="project-links">
                  {/* <a href="#" className="link-btn">
                    <Github size={18} />
                    View Code
                  </a> */}
                  {/* <a href="#" className="link-btn">
                    Live Demo →
                  </a> */}
                </div>
              </div>
            </div>

            <div className="project-card wide">
              <div className="project-image elearning">
                <div className="project-overlay">
                  <span className="project-status progress">In Progress</span>
                </div>
              </div>
              <div className="project-details">
                <h3>E-Learning Platform</h3>
                <p>
                  Comprehensive online learning platform with user authentication, course management, progress tracking, and interactive content delivery. Built with modern MERN stack architecture.
                </p>
                <div className="tech-stack">
                  <span className="tech-tag">React</span>
                  <span className="tech-tag">Node.js</span>
                  <span className="tech-tag">MongoDB</span>
                  <span className="tech-tag">Express</span>
                </div>
                <div className="project-links">
                  {/* <a href="#" className="link-btn">
                    <Github size={18} />
                    View Code
                  </a> */}
                </div>
              </div>
            </div>

            <div className="project-card">
              <div className="project-image voice-assistant">
                <div className="project-overlay">
                  <span className="project-status completed">Completed</span>
                </div>
              </div>
              <div className="project-details">
                <h3>Tourism Voice Assistant</h3>
                <p>
                  Voice-enabled web application for tourism information with natural language processing capabilities.
                </p>
                <div className="tech-stack">
                  <span className="tech-tag">Web Speech API</span>
                  <span className="tech-tag">JavaScript</span>
                  <span className="tech-tag">React</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section with Grid */}
        <section id="contact" className="contact-grid">
          <div className="section-header">
            <h2>Let's Connect</h2>
            <div className="header-line"></div>
          </div>
          
          <p className="contact-intro">
            I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
          </p>
          
          <div className="contact-cards">
            <a href="https://www.linkedin.com/in/shivam-singh-tomar-1716b7291/" className="contact-card linkedin">
              <Linkedin size={32} />
              <h3>LinkedIn</h3>
              <p>Connect professionally</p>
            </a>
            
            <a href="https://github.com/ShivamSinghT21" className="contact-card github">
              <Github size={32} />
              <h3>GitHub</h3>
              <p>View my code</p>
            </a>
            
            <a href="https://www.instagram.com/shivam_singh_t21/?igsh=MWVla2VxYjdtaHR1cQ%3D%3D#" className="contact-card instagram">
              <Instagram size={32} />
              <h3>Instagram</h3>
              <p>Follow my journey</p>
            </a>
            
            <a href="shivamsinght21@gmail.com" className="contact-card email">
              <Mail size={32} />
              <h3>Email</h3>
              <p>Send a message</p>
            </a>
          </div>
        </section>
      </main>
    </>
  )
}

export default App
