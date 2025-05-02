

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "../hooks/axios/axios";
import { setUser } from "../redux/slices/userSlice";
import { toast } from "react-hot-toast";
import { Brain } from "lucide-react";
import styles from "../styles/Login.module.css"

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
				console.log(data.data);
				localStorage.setItem("user", JSON.stringify(data.data));
				dispatch(setUser(data.data));
				toast.success("Login successful!");
				navigate("/case-history");
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
						placeholder="email"
						required
					/>

					<label className={styles.label}>Password</label>
					<input
						type="password"
						value={password}
						placeholder="password"
						onChange={(e) => setPassword(e.target.value)}
						className={styles.input}
						required
					/>

					<button type="submit" className={styles.button3d}>
						{loading? "Logging in..." : "Login"}
					</button>
				</form>

				<p className={styles.signupText}>
					Don't have an account?{" "}
					<Link to="/signup" className={styles.signupLink}>
						Sign up
					</Link>
				</p>
			</div>
		</div>
	);
};

export default Login;
