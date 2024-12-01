import axios from 'axios';

const API_URL = "http://43.204.107.186:8000/";


export const submitAdminForm = async (formData) => {
    return await axios.post(`${API_URL}/details`, formData);
}