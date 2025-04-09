import { signInWithEmailAndPassword } from "firebase/auth";
import { Brain } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase"; // Import Firebase auth
import styles from "../styles/Login.module.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError("Invalid email or password!");
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

          <button type="submit" className={styles.button3d}>Sign In</button>
        </form>

        <p className={styles.signupText}>
          Don't have an account? <Link to="/signup" className={styles.signupLink}>Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
