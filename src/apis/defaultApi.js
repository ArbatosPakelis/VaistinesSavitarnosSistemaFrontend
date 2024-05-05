import axios from "axios";
const BASE_URL = "https://auto-pharma-backend-ce309b93007d.herokuapp.com"
// const BASE_URL = "http://localhost:5000"

export default axios.create({
    baseURL: BASE_URL
});

export const PrivateApi = axios.create({
    baseURL: BASE_URL,
    headers: {'Content-Type': 'application/json'},
    withCredentials: true
});