import { useEffect, useState } from 'react';
import { getMeals, createMeal, deleteMeal, getStudentClasses, getMe } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useModal } from '../context/ModalContext';

const Meals = () => {
    const [meals, setMeals] = useState([]);
    const [studentClasses, setStudentClasses] = useState([]);
    const [selectedClassIds, setSelectedClassIds] = useState([]);
    const [newMeal, setNewMeal] = useState({ type: 'breakfast', time_start: '', time_end: '', menu: '' });
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    const { showToast } = useToast();
    const { showConfirm } = useModal();

    useEffect(() => {
        checkUserRole();
    }, []);

    const checkUserRole = async () => {
        try {
            const res = await getMe();
            const admin = res.data.is_superuser;
            setIsAdmin(admin);

            if (admin) {
                const classesRes = await getStudentClasses();
                setStudentClasses(classesRes.data);
            }
            fetchMeals();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMeals = (classIds = null) => {
        if (classIds === null) {
            getMeals().then(res => setMeals(res.data)).catch(err => console.error(err));
            return;
        }

        if (classIds.length === 0) {
            setMeals([]);
            return;
        }

        Promise.all(classIds.map(id => getMeals({ student_class_id: id })))
            .then(responses => {
                const allMeals = responses.flatMap(res => res.data);
                setMeals(allMeals);
            })
            .catch(err => console.error(err));
    };

    const handleClassToggle = (classId) => {
        setSelectedClassIds(prev => {
            const newSelection = prev.includes(classId)
                ? prev.filter(id => id !== classId)
                : [...prev, classId];
            fetchMeals(newSelection);
            return newSelection;
        });
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (selectedClassIds.length === 0) {
            showToast('Please select at least one student class', 'error');
            return;
        }
        try {
            await createMeal({ ...newMeal, student_class_ids: selectedClassIds });
            setNewMeal({ type: 'breakfast', time_start: '', time_end: '', menu: '' });
            fetchMeals(selectedClassIds);
            showToast(`Meal added successfully for ${selectedClassIds.length} group(s)!`, 'success');
        } catch (err) {
            const errorMsg = err.response?.data?.student_class?.[0] || 'Error adding meal';
            showToast(errorMsg, 'error');
        }
    };

    const handleDelete = (id) => {
        showConfirm('Delete this meal?', async () => {
            try {
                await deleteMeal(id);
                fetchMeals(isAdmin ? selectedClassIds : []);
                showToast('Meal deleted successfully!', 'success');
            } catch (err) {
                showToast('Error deleting meal', 'error');
            }
        });
    };

    if (loading) {
        return (
            <div className="container mt-5">
                <h1 className="glitch-text text-center">LOADING_MODULE...</h1>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h1 className="glitch-text mb-4">{isAdmin ? 'MANAGE_MEAL_SCHEDULES' : 'MY_MEAL_SCHEDULE'}</h1>

            {/* Admin: Multi-select Class Groups */}
            {isAdmin && (
                <div className="card mb-4 border-primary">
                    <div className="card-header">
                        <h5 className="mb-0">SELECT_TARGET_CLASSES ({selectedClassIds.length} selected)</h5>
                    </div>
                    <div className="card-body" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        <div className="d-grid gap-2">
                            {studentClasses.map(c => (
                                <div key={c.id} className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id={`meal-class-${c.id}`}
                                        checked={selectedClassIds.includes(c.id)}
                                        onChange={() => handleClassToggle(c.id)}
                                    />
                                    <label className="form-check-label" htmlFor={`meal-class-${c.id}`}>
                                        {c.name} ({c.year_level})
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Admin: Add New Meal Form */}
            {isAdmin && selectedClassIds.length > 0 && (
                <div className="card mb-4">
                    <div className="card-header">
                        <h5 className="mb-0">ADD_NEW_ENTRY</h5>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleAdd}>
                            <div className="row g-3">
                                <div className="col-md-3">
                                    <select
                                        className="form-select"
                                        value={newMeal.type}
                                        onChange={e => setNewMeal({ ...newMeal, type: e.target.value })}
                                        required
                                    >
                                        <option value="breakfast">Breakfast</option>
                                        <option value="lunch">Lunch</option>
                                        <option value="dinner">Dinner</option>
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <input
                                        type="time"
                                        className="form-control"
                                        value={newMeal.time_start}
                                        onChange={e => setNewMeal({ ...newMeal, time_start: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="col-md-3">
                                    <input
                                        type="time"
                                        className="form-control"
                                        value={newMeal.time_end}
                                        onChange={e => setNewMeal({ ...newMeal, time_end: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="col-md-3">
                                    <button type="submit" className="btn btn-primary w-100">
                                        ADD_MEAL
                                    </button>
                                </div>
                                <div className="col-12">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Menu Description"
                                        value={newMeal.menu}
                                        onChange={e => setNewMeal({ ...newMeal, menu: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Meals Display */}
            <div className="row g-3">
                {meals.length === 0 ? (
                    <div className="col-12">
                        <p className="text-center text-muted">
                            {isAdmin && selectedClassIds.length === 0 ? 'Select class groups to view meals.' : 'NO_MEAL_DATA_FOUND'}
                        </p>
                    </div>
                ) : (
                    meals.map(meal => (
                        <div key={meal.id} className="col-12 col-md-6 col-lg-4">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title text-primary">{meal.type.toUpperCase()}</h5>
                                    <p className="card-text text-muted mb-1">
                                        TIME: <span className="text-white">{meal.time_start.slice(0, 5)} - {meal.time_end.slice(0, 5)}</span>
                                    </p>
                                    <p className="card-text text-muted mb-3">
                                        MENU: <span className="text-white">{meal.menu}</span>
                                    </p>
                                    {isAdmin && (
                                        <button
                                            onClick={() => handleDelete(meal.id)}
                                            className="btn btn-outline-danger w-100"
                                        >
                                            DELETE_ENTRY
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Meals;
