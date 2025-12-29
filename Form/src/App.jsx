import React, { useEffect, useState } from 'react';
import './App.css';

const App = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    message: ''
  });
  const [entries, setEntries] = useState([]);

  // Load entries from localStorage on component mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('formEntries');
    if (savedEntries) {
      try {
        const parsed = JSON.parse(savedEntries);
        if (Array.isArray(parsed)) {
          setEntries(parsed);
        }
      } catch (error) {
        console.error('Failed to parse localStorage data');
      }
    }
  }, []);

  // Save entries to localStorage whenever they change
  useEffect(() => {
    if (entries.length > 0) {
      localStorage.setItem('formEntries', JSON.stringify(entries));
    }
  }, [entries]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if required fields are filled
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    const newEntry = {
      id: Date.now(),
      ...formData,
      timestamp: new Date().toLocaleString()
    };

    setEntries([newEntry, ...entries]);
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: '',
      message: ''
    });
  };

  const handleDelete = (id) => {
    const updatedEntries = entries.filter(entry => entry.id !== id);
    setEntries(updatedEntries);
    localStorage.setItem('formEntries', JSON.stringify(updatedEntries));
  };

  const handleClearAll = () => {
    setEntries([]);
    localStorage.removeItem('formEntries');
  };

  return (
    <div className="app-container">
      <h1>Contact Information Form</h1>
      
      <form onSubmit={handleSubmit} className="form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              id="city"
              name="city"
              type="text"
              value={formData.city}
              onChange={handleChange}
              placeholder="Your city"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="address">Street Address</label>
          <input
            id="address"
            name="address"
            type="text"
            value={formData.address}
            onChange={handleChange}
            placeholder="123 Main Street, Apartment 4B"
          />
        </div>

        <div className="form-group">
          <label htmlFor="country">Country</label>
          <input
            id="country"
            name="country"
            type="text"
            value={formData.country}
            onChange={handleChange}
            placeholder="India"
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Additional comments or information..."
            rows="4"
          />
        </div>

        <button type="submit" className="btn-submit">Save</button>
      </form>

      <div className="saved-entries">
        <div className="entries-header">
          <h2>Saved Entries ({entries.length})</h2>
          {entries.length > 0 && (
            <button onClick={handleClearAll} className="btn-clear">
              Clear All
            </button>
          )}
        </div>

        {entries.length === 0 ? (
          <p className="no-entries">No entries saved yet. Fill the form above to get started!</p>
        ) : (
          <div className="entries-grid">
            {entries.map((entry) => (
              <div key={entry.id} className="entry-card">
                <div className="entry-header">
                  <h3>{entry.name}</h3>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="btn-delete"
                  >
                    ×
                  </button>
                </div>
                <div className="entry-details">
                  <p><strong>Email:</strong> {entry.email}</p>
                  <p><strong>Phone:</strong> {entry.phone}</p>
                  {entry.address && <p><strong>Address:</strong> {entry.address}</p>}
                  {entry.city && <p><strong>City:</strong> {entry.city}</p>}
                  {entry.country && <p><strong>Country:</strong> {entry.country}</p>}
                  {entry.message && <p><strong>Message:</strong> {entry.message}</p>}
                  <p className="entry-timestamp">Saved: {entry.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
