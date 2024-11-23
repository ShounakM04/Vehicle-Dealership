import axios from 'axios';

const API_URL = "https://vehicle-dealership.vercel.app//";


export const submitAdminForm = async (formData) => {
    return await axios.post(`${API_URL}/details`, formData);
}