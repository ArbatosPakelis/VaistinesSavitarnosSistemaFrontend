import axios from "axios";
const BASE_URL = "https://auto-pharma-backend-ce309b93007d.herokuapp.com"

export default axios.create({
    baseURL: BASE_URL
});

export const PrivateApi = axios.create({
    baseURL: BASE_URL,
    headers: {'Content-Type': 'application/json'},
    withCredentials: true
});