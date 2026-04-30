import React, { useState } from 'react';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    idNumber: '',
    accountNumber: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevents the form from reloading when pressing the submit button
    try {
      // We will add the code for sending data to the backend here
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        "fullName": formData.fullName,
        "idNumber": formData.idNumber,
        "accountNumber": formData.accountNumber,
        "password": formData.password
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      fetch("/api/register", requestOptions)
        .then((response) => response.json())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
    } catch (error) {
      console.error('Error registering:', error);
      alert('Registration failed.');
    }
  };
  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="fullName" placeholder="Full Name" onChange={handleChange} required /><br />
        <input type="text" name="idNumber" placeholder="ID Number" onChange={handleChange} required /><br />
        <input type="text" name="accountNumber" placeholder="Account Number" onChange={handleChange} required /><br />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required /><br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};
export default Register;
