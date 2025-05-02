import axios from "axios";

console.log("baseUrl", import.meta.env.VITE_BACKEND_URL);

export default axios.create({
	baseURL: import.meta.env.VITE_BACKEND_URL,
});
