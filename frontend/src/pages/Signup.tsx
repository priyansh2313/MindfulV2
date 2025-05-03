import { Brain } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "../hooks/axios/axios";
import { setUser } from "../redux/slices/userSlice";
import styles from "../styles/Signup.module.css";

const Signup = () => {
	const dispatch = useDispatch(); 
	const navigate = useNavigate();
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const [formData, setFormData] = useState({
		name: "",
		phone: "",
		email: "",
		password: "",
		dob: "",
	});
	const [loading, setLoading] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (formData.password !== confirmPassword) {
			setError("Passwords do not match!");
			return;
		}
		setLoading(true);
		axios
			.post("/users/register", formData, { withCredentials: true })
			.then(({ data }) => {
				console.log(data);
				toast.success("Account created successfully!")
				localStorage.setItem("user", JSON.stringify(data.data));
				dispatch(setUser(data.data)); 
				navigate("/case-history");
			})
			.catch((error: any) => {
				setError("Signup failed!");
				toast.error("Signup failed!")
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
						value={formData.email}
						name="email"
						onChange={handleChange}
						className={styles.input}
						required
					/>

					<label className={styles.label}>Password</label>
					<input
						type="password"
						value={formData.password}
						name="password"
						onChange={handleChange}
						className={styles.input}
						required
					/>

					<label className={styles.label}>Confirm Password</label>
					<input
						type="password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						className={styles.input}
						required
					/>

					<label className={styles.label}>DOB</label>
					<input
						type="date"
						value={formData.dob}
						name="dob"
						onChange={handleChange}
						className={styles.input}
						required
					/>

					<label className={styles.label}>Phone</label>
					<input
						type="phone"
						value={formData.phone}
						name="phone"
						onChange={handleChange}
						className={styles.input}
						required
					/>

					<label className={styles.label}>Full Name</label>
					<input
						type="text"
						value={formData.name}
						name="name"
						onChange={handleChange}
						className={styles.input}
						required
					/>

					<button type="submit" className={styles.button3d}>
						{loading ? "Signing Up" : "Sign Up"}
					</button>
				</form>

				<p className={styles.signupText}>
					Already have an account?{" "}
					<Link to="/" className={styles.signupLink}>
						Sign in
					</Link>
				</p>
			</div>
		</div>
	);
};

export default Signup;
