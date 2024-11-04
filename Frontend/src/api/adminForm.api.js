import axios from 'axios';

const API_URL = "https://ab7609wbx8.execute-api.ap-south-1.amazonaws.com/default/VehicleDealership";


export const submitAdminForm = async(formData)=>{
    return await axios.post(`${API_URL}/details`, formData);
}