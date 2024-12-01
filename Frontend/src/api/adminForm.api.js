import axios from 'axios';

const API_URL = "http://65.2.150.123:8000/";


export const submitAdminForm = async (formData) => {
    return await axios.post(`${API_URL}/details`, formData);
}