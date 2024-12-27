import axios from 'axios';

const API_URL = "http://3.109.83.51:8000/";


export const submitAdminForm = async (formData) => {
    return await axios.post(`${API_URL}/details`, formData);
}