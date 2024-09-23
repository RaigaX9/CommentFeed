import React from 'react';
import './DeleteModal.css'; // We will add styles for the modal

const DeleteModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null; // Don't render the modal if it's not open

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Are you sure you want to delete all the comments?</h2>
                <div className="modal-buttons">
                    <button className="confirm-button" onClick={onConfirm}>
                        Yes
                    </button>
                    <button className="cancel-button" onClick={onClose}>
                        No
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;
