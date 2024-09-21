import React, { useState } from 'react';

function CarDetailsForm() {
  const [formData, setFormData] = useState({
    registernum: '',
    carname: '',
    carmake: '',
    carcompany: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        console.log('Car details submitted successfully!');
      } else {
        console.error('Error submitting car details');
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  return (
    <div>
      <h2>Car Details Form</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Registration Number" 
          name="registernum" 
          value={formData.registernum} 
          onChange={handleChange} 
        />
        <input 
          type="text" 
          placeholder="Car Name" 
          name="carname" 
          value={formData.carname} 
          onChange={handleChange} 
        />
        <input 
          type="text" 
          placeholder="Car Make" 
          name="carmake" 
          value={formData.carmake} 
          onChange={handleChange} 
        />
        <input 
          type="text" 
          placeholder="Company" 
          name="carcompany" 
          value={formData.carcompany} 
          onChange={handleChange} 
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CarDetailsForm;
