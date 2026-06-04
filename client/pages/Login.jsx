"use client"

import { useState } from "react"
import styles from "./auth.module.css"
//import styles from "../index.css"
export function Login({ onLogin, onSwitchToRegister }) {
  const [account, setAccount] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")

    if (!account || !password) {
      setError("Please fill in all fields")
      return
    }
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "accountNumber": account,
      "password": password
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch("http://localhost:5189/api/login", requestOptions)
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));

    onLogin?.(account, password)
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Welcome Back</h2>
        <p className={styles.subtitle}>Sign in to your account</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="login-account" className={styles.label}>
              Account
            </label>
            <input
              id="login-account"
              type="account"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              className={styles.input}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="login-password" className={styles.label}>
              Password
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.button}>
            Sign In
          </button>
        </form>

        <p className={styles.footer}>
          Don&apos;t have an account?{" "}
          <button onClick={onSwitchToRegister} className={styles.link}>
            Register
          </button>
        </p>
      </div>
    </div>
  )
}
