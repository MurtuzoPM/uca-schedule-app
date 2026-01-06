import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
    baseURL: API_URL,
    withCredentials: false,                    // important for cookies if used
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

const clearAuthTokens = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
};

export const refreshToken = () => {
    const refresh = localStorage.getItem('refresh_token');
    const access = localStorage.getItem('access_token');
    if (!refresh) {
        return Promise.reject(new Error('No refresh token'));
    }
    return api.post('/token/refresh/', { access: access || '', refresh });
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If unauthorized, try refresh once.
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const res = await refreshToken();
                if (res?.data?.access) {
                    localStorage.setItem('access_token', res.data.access);
                }
                if (res?.data?.refresh) {
                    localStorage.setItem('refresh_token', res.data.refresh);
                }
                originalRequest.headers = {
                    ...(originalRequest.headers || {}),
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                };
                return api(originalRequest);
            } catch (refreshErr) {
                clearAuthTokens();
                return Promise.reject(refreshErr);
            }
        }

        return Promise.reject(error);
    }
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

// Timetable
export const getMyTimetable = () => api.get('/timetable/');
export const updateMyTimetable = (scheduleIds) => api.post('/timetable/', { schedule_ids: scheduleIds });
export const downloadMyTimetableIcs = () => api.get('/timetable/ics/', { responseType: 'blob' });

// Notifications
export const getNotifications = () => api.get('/notifications/');
export const getUnreadNotificationCount = () => api.get('/notifications/unread-count/');
export const markNotificationRead = (id) => api.post(`/notifications/${id}/read/`);
export const markAllNotificationsRead = () => api.post('/notifications/read-all/');

export default api;
