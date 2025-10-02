import Axios from 'axios'

const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

const axios = Axios.create({
    baseURL: base,
    withCredentials: true,
})

export default axios
