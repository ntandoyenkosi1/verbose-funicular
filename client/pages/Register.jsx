"use client"

import { useState } from "react"
import styles from "./auth.module.css"

export function Register({ onRegister, onSwitchToLogin }) {
  const [fullName, setFullName] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [idNumber, setIdNumber] = useState("")
  const [password, setPassword] = useState("")
  const [loginMessage, setMessage]=useState("No message yet")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "fullName": fullName,
      "idNumber": idNumber,
      "accountNumber": accountNumber,
      "password":password
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch("http://localhost:5189/api/register", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setMessage(result.message)
      })
      .catch((error) => console.error(error));

    
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Create Account</h2>
        <p className={styles.subtitle}>Sign up to get started</p>

        <form onSubmit={handleSubmit} className={styles.form}>

          {/* Full Name Field */}
          <div className={styles.field}>
            <label htmlFor="fullName" className={styles.label}>
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={styles.input}
              placeholder="John Doe"
              required
            />
          </div>

          {/* Account Number Field */}
          <div className={styles.field}>
            <label htmlFor="accountNumber" className={styles.label}>
              Account Number
            </label>
            <input
              id="accountNumber"
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className={styles.input}
              placeholder="1234567890"
              required
            />
          </div>

          {/* ID Number Field */}
          <div className={styles.field}>
            <label htmlFor="idNumber" className={styles.label}>
              ID Number
            </label>
            <input
              id="idNumber"
              type="text"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              className={styles.input}
              placeholder="A1234567B"
              required
            />
          </div>

          {/* Password Field */}
          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder="••••••••"
              required
            />
          </div>

          {/* Confirm Password Field */}
          <div className={styles.field}>
            <label htmlFor="confirmPassword" className={styles.label}>
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={styles.input}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.button}>
            Register
          </button>
        </form>

        <p className={styles.footer}>
          Already have an account?{" "}
          <button onClick={onSwitchToLogin} className={styles.link}>
            Sign in
          </button>
        </p>
        <p className={styles.footer}>
          Login Message: {loginMessage}
        </p>
      </div>
    </div>
  )
}