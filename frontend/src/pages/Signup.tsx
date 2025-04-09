import { createUserWithEmailAndPassword } from "firebase/auth";
import { Brain } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase"; // Import Firebase auth
import styles from "../styles/Signup.module.css";

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.glassContainer}>
        <div className={styles.header}>
          <Brain className={styles.logo} />
          <h1 className={styles.title}>MINDFUL AI</h1>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={styles.input} required />

          <label className={styles.label}>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={styles.input} required />

          <label className={styles.label}>Confirm Password</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={styles.input} required />

          <button type="submit" className={styles.button3d}>Sign Up</button>
        </form>

        <p className={styles.signupText}>
          Already have an account? <Link to="/" className={styles.signupLink}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
