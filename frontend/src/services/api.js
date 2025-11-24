import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';


const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const login = (username, password) => api.post('/token/', { username, password });
export const register = (data) => api.post('/register/', data);
export const getMe = () => api.get('/me/');
export const updateProfile = (data) => api.put('/me/', data);
export const changePassword = (data) => api.post('/change-password/', data);
export const getStudentClasses = () => api.get('student-classes/');
export const createStudentClass = (data) => api.post('student-classes/', data);
export const deleteStudentClass = (id) => api.delete(`student-classes/${id}/`);

// User Management (Admin)
export const getUsers = () => api.get('users/');
export const deleteUser = (id) => api.delete(`users/${id}/`);
export const updateUser = (id, data) => api.patch(`users/${id}/`, data);

// Course Management
export const getCourses = () => api.get('courses/');
export const createCourse = (data) => api.post('courses/', data);
export const deleteCourse = (id) => api.delete(`courses/${id}/`);

export const getMeals = (params) => api.get('/meals/', { params });
export const createMeal = (data) => api.post('/meals/', data);
export const deleteMeal = (id) => api.delete(`/meals/${id}/`);

export const getGymSchedules = (params) => api.get('/gym/', { params });
export const createGymSchedule = (data) => api.post('/gym/', data);
export const deleteGymSchedule = (id) => api.delete(`/gym/${id}/`);

export const getClasses = (params) => api.get('/classes/', { params });
export const createClass = (data) => api.post('/classes/', data);
export const deleteClass = (id) => api.delete(`/classes/${id}/`);

export default api;
