

import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import styles from "../styles/Login.module.css";
import axios from "../hooks/axios/axios";
import { setUser } from "../redux/slices/userSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";

const Login = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
    setError("");
    setLoading(true);
		axios
			.post("/users/login", { email, password }, {withCredentials: true})
			.then(({ data }) => {
				console.log(data);
				dispatch(setUser(data.data));
				toast.success("Login successful!");
				navigate("/dashboard");
			})
			.catch((error: any) => {
        setError("Login failed!");
        toast.error("Login failed!");
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
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
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className={styles.input}
						required
					/>

					<label className={styles.label}>Password</label>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className={styles.input}
						required
					/>

					<button type="submit" className={styles.button3d}>
						Sign In
					</button>
				</form>

				<p className={styles.signupText}>
					Don't have an account?{" "}
					<Link to="/signup" className={styles.signupLink}>
						{loading ? "Logging in" : "Sign up"}
					</Link>
				</p>
			</div>
		</div>
	);
};

export default Login;
