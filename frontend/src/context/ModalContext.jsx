import { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within ModalProvider');
    }
    return context;
};

export const ModalProvider = ({ children }) => {
    const [modal, setModal] = useState({ isOpen: false, message: '', onConfirm: null });

    const showConfirm = (message, onConfirm) => {
        setModal({ isOpen: true, message, onConfirm });
    };

    const handleConfirm = () => {
        if (modal.onConfirm) modal.onConfirm();
        closeModal();
    };

    const closeModal = () => {
        setModal({ isOpen: false, message: '', onConfirm: null });
    };

    return (
        <ModalContext.Provider value={{ showConfirm }}>
            {children}
            {modal.isOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0, 0, 0, 0.8)', zIndex: 10000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backdropFilter: 'blur(5px)'
                }}>
                    <div className="hud-card" style={{ maxWidth: '400px', width: '90%', border: '2px solid #ff4d00', boxShadow: '0 0 30px rgba(255, 77, 0, 0.2)' }}>
                        <h3 style={{ color: '#ff4d00', marginTop: 0 }}>CONFIRM_ACTION</h3>
                        <p style={{ fontSize: '1.1rem', margin: '1.5rem 0' }}>{modal.message}</p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                            <button onClick={closeModal} style={{ background: 'transparent', border: '1px solid #8da2b5', color: '#8da2b5', padding: '0.5rem 1.5rem', cursor: 'pointer', fontWeight: 'bold' }}>CANCEL</button>
                            <button onClick={handleConfirm} style={{ background: '#ff4d00', border: 'none', color: '#000', padding: '0.5rem 1.5rem', cursor: 'pointer', fontWeight: 'bold' }}>CONFIRM</button>
                        </div>
                    </div>
                </div>
            )}
        </ModalContext.Provider>
    );
};
