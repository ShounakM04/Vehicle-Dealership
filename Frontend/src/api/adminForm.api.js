import axios from 'axios';

const API_URL = "http://13.203.151.53:8000/";


export const submitAdminForm = async (formData) => {
    return await axios.post(`${API_URL}/details`, formData);
}