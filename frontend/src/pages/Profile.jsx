import { useState, useEffect } from 'react';
import { getMe, updateProfile, changePassword, getStudentClasses } from '../services/api';
import { useToast } from '../context/ToastContext';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [classes, setClasses] = useState([]);
    const [formData, setFormData] = useState({
        email: '',
        gender: '',
        student_class: ''
    });
    const [passwordData, setPasswordData] = useState({
        old_password: '',
        new_password: '',
        confirm_password: ''
    });
    const { showToast } = useToast();

    useEffect(() => {
        getMe().then(res => {
            setUser(res.data);
            setFormData({
                email: res.data.email || '',
                gender: res.data.gender,
                student_class: res.data.student_class_id || ''
            });
        });
        getStudentClasses().then(res => setClasses(res.data));
    }, []);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            await updateProfile(formData);
            showToast('Profile updated successfully!', 'success');
            const res = await getMe();
            setUser(res.data);
        } catch (err) {
            showToast('Failed to update profile', 'error');
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.new_password !== passwordData.confirm_password) {
            showToast('New passwords do not match', 'error');
            return;
        }
        try {
            await changePassword({
                old_password: passwordData.old_password,
                new_password: passwordData.new_password
            });
            showToast('Password changed successfully!', 'success');
            setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
        } catch (err) {
            showToast('Failed to change password. Check your old password.', 'error');
        }
    };

    if (!user) {
        return (
            <div className="container mt-5">
                <h1 className="glitch-text text-center">LOADING_PROFILE...</h1>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h1 className="glitch-text mb-4">USER_PROFILE</h1>

            <div className="row g-4">
                {/* Academic Info Card */}
                <div className="col-12 col-lg-4">
                    <div className="card h-100">
                        <div className="card-header">
                            <h5 className="mb-0">ACADEMIC_INFO</h5>
                        </div>
                        <div className="card-body">
                            <p className="text-muted mb-2">
                                CLASS: <span className="text-white">
                                    {user.student_class_name ? `${user.student_class_name} (${user.student_class_year})` : 'N/A'}
                                </span>
                            </p>
                            <p className="text-muted mb-2">
                                YEAR LEVEL: <span className="text-white">{user.student_class_year || 'N/A'}</span>
                            </p>
                            <p className="text-muted mb-0">
                                STATUS: <span className="text-primary">ACTIVE</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Edit Profile Card */}
                <div className="col-12 col-lg-4">
                    <div className="card h-100">
                        <div className="card-header">
                            <h5 className="mb-0">EDIT_DETAILS</h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleProfileUpdate}>
                                <div className="mb-3">
                                    <label className="form-label">EMAIL</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">GENDER</label>
                                    <select
                                        className="form-select"
                                        value={formData.gender}
                                        onChange={e => setFormData({ ...formData, gender: e.target.value })}
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">CLASS</label>
                                    <select
                                        className="form-select"
                                        value={formData.student_class}
                                        onChange={e => setFormData({ ...formData, student_class: e.target.value })}
                                    >
                                        {classes.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <button type="submit" className="btn btn-primary w-100">
                                    UPDATE_PROFILE
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Security Settings Card */}
                <div className="col-12 col-lg-4">
                    <div className="card h-100">
                        <div className="card-header">
                            <h5 className="mb-0">SECURITY_SETTINGS</h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handlePasswordChange}>
                                <div className="mb-3">
                                    <label className="form-label">CURRENT_PASSWORD</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={passwordData.old_password}
                                        onChange={e => setPasswordData({ ...passwordData, old_password: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">NEW_PASSWORD</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={passwordData.new_password}
                                        onChange={e => setPasswordData({ ...passwordData, new_password: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">CONFIRM_PASSWORD</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={passwordData.confirm_password}
                                        onChange={e => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-outline-danger w-100">
                                    CHANGE_PASSWORD
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
