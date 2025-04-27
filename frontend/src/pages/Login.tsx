

import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import styles from "../styles/Login.module.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const authInstance = auth;
    try {
      // First try to sign in
      const result = await signInWithEmailAndPassword(authInstance, email, password);
      const userEmail = result.user.email;
      if (userEmail) {
        localStorage.setItem('userEmail', userEmail);
      }
      navigate("/dashboard");
    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        // If user not found, automatically create account
        try {
          const signupResult = await createUserWithEmailAndPassword(authInstance, email, password);
          const newUserEmail = signupResult.user.email;
          if (newUserEmail) {
            localStorage.setItem('userEmail', newUserEmail);
          }
          navigate("/dashboard");
        } catch (signupError: any) {
          console.error(signupError);
          setError(signupError.message);
        }
      } else {
        console.error(err);
        setError("Invalid credentials or login failed.");
      }
    }
  };
  

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const userEmail = result.user.email;
      if (userEmail) {
        localStorage.setItem('userEmail', userEmail);
      }
      navigate("/dashboard");
    } catch (err: any) {
      setError("Google sign-in failed.");
    }
  };

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className={styles.logo}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🧠
        </motion.div>
        <h1 className={styles.title}>MINDFUL AI</h1>
        <form onSubmit={handleLogin} className={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span onClick={() => setShowPassword(!showPassword)} className={styles.togglePassword}>
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit">Sign In</button>
        </form>

        <button className={styles.socialButton} onClick={handleGoogleSignIn}>
          🔓 Sign in with Google
        </button>

        <div className={styles.linksRow}>
          <a href="/forgot-password" className={styles.smallLink}>Forgot Password?</a>
          <span>•</span>
          <a href="/signup" className={styles.smallLink}>Sign up</a>
        </div>
      </motion.div>
    </div>
  );
}
