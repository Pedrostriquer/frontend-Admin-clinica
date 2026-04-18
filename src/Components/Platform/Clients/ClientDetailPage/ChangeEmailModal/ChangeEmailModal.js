import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import styles from './ChangeEmailModalStyle';

const ChangeEmailModal = ({ client, onClose, onSave }) => {
    const [email, setEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');

    const handleSubmit = () => {
        if (!email || !confirmEmail) {
            alert('Preencha os dois campos de email.');
            return;
        }
        if (email !== confirmEmail) {
            alert('Os emails não coincidem.');
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Insira um email válido.');
            return;
        }
        onSave({ email });
    };

    return ReactDOM.createPortal(
        <>
            <style>{styles.globalStyles}</style>
            <div style={styles.modalBackdrop} onClick={onClose}>
                <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
                    <div style={styles.modalHeader}>
                        <h2 style={styles.modalHeaderH2}>Alterar Email de {client.name}</h2>
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Novo Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={styles.formInput}
                            placeholder="novo@email.com"
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Confirmar Novo Email</label>
                        <input
                            type="email"
                            value={confirmEmail}
                            onChange={(e) => setConfirmEmail(e.target.value)}
                            style={styles.formInput}
                            placeholder="novo@email.com"
                        />
                    </div>
                    <div style={styles.modalFooter}>
                        <button style={{ ...styles.actionButton, ...styles.buttonCancel }} onClick={onClose}>Cancelar</button>
                        <button style={{ ...styles.actionButton, ...styles.buttonSave }} onClick={handleSubmit}>
                            <i className="fa-solid fa-check" style={{ marginRight: '8px' }}></i>
                            Salvar Novo Email
                        </button>
                    </div>
                </div>
            </div>
        </>,
        document.body
    );
};

export default ChangeEmailModal;
