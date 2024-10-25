import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export function Maintainance({ registernumber, onMaintenanceAdded }) {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [files, setFiles] = useState([]);
    const [maintainanceDate, setMaintainanceDate] = useState('');
    const [role, setRole] = useState('');
    const [adding, setAdding] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('registerNumber', registernumber);
        formData.append('maintainanceType', description);
        formData.append('maintainanceCost', price);
        formData.append('doneby', role);
        formData.append('maintainancedate', maintainanceDate);

        files.forEach((file) => {
            formData.append('documents', file);
        });

        try {
            setAdding(true);
            const response = await axios.post('http://localhost:8000/maintainance', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success('Maintenance record added successfully!');
            console.log(response.data);

            // Clear form fields
            setTitle('');
            setPrice('');
            setDescription('');
            setFiles([]);
            setMaintainanceDate('');
            setRole('');

            // Call the parent callback to refresh maintenance records
            if (onMaintenanceAdded) onMaintenanceAdded();
        } catch (error) {
            console.error('Error adding maintenance record:', error);
            toast.error('Failed to add maintenance record.');
        } finally {
            setAdding(false);
        }
    };

    return (
        <>
            <h2 className="text-2xl font-bold mb-4">Add Maintenance Record</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Maintenance Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="border border-gray-300 rounded p-2 w-full"
                    ></textarea>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Price</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        className="border border-gray-300 rounded p-2 w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Role</label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                        className="border border-gray-300 rounded p-2 w-full text-sm md:text-base"
                    >
                        <option value="" disabled>Select role</option>
                        <option value="admin">Admin</option>
                        <option value="employee">Employee</option>
                        <option value="driver">Driver</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Maintenance Date</label>
                    <input
                        type="date"
                        value={maintainanceDate}
                        onChange={(e) => setMaintainanceDate(e.target.value)}
                        required
                        className="border border-gray-300 rounded p-2 w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Upload Documents</label>
                    <input
                        type="file"
                        multiple
                        onChange={(e) => setFiles([...e.target.files])}
                        className="border border-gray-300 rounded p-2 w-full"
                    />
                </div>
                <button
                    type="submit"
                    className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${adding ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={adding}
                >
                    {adding ? 'Adding...' : 'Add Maintenance Record'}
                </button>
            </form>
        </>
    );
}
