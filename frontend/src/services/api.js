/**
 * API Service Layer — All server communication goes through here.
 * If we ever swap Axios for fetch(), or change the base URL, we only touch this file.
 * To add auth headers: configure the axios instance below.
 */

import axios from 'axios';

const API = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Fetch all medicines from the backend.
 * @returns {Promise<Array>} Array of medicine objects
 */
export const getMedicines = async () => {
    const response = await API.get('/medicine');
    return response.data;
};

/**
 * Add a new medicine.
 * @param {Object} medicineData - { medicine_name, dosage, reminder_time }
 * @returns {Promise<Object>} Created medicine object with ID
 */
export const addMedicine = async (medicineData) => {
    const response = await API.post('/medicine', medicineData);
    return response.data;
};

/**
 * Delete a medicine by its ID.
 * @param {number} id - Medicine ID to delete
 * @returns {Promise<Object>} Deletion confirmation message
 */
export const deleteMedicine = async (id) => {
    const response = await API.delete(`/medicine/${id}`);
    return response.data;
};

/**
 * Fetch recently triggered reminders.
 * @returns {Promise<Array>} Array of triggered reminder objects
 */
export const getTriggeredReminders = async () => {
    const response = await API.get('/reminders');
    return response.data;
};

export default API;
