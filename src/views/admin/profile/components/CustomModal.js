import React, { useState } from 'react';
import Modal from 'react-modal';
import Dropzone from './Dropzone'; // Import your Dropzone component

const CustomModal = ({ isOpen, onClose }) => {
    const handleDropzoneSubmit = () => {
        // Logic for handling Dropzone submission
        onClose(); // Close the modal after submission
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Upload Profile Photo"
        >
            <h2>Upload Profile Photo</h2>
            <Dropzone onSubmit={handleDropzoneSubmit} />
            <button onClick={onClose}>Close Modal</button>
        </Modal>
    );
};

export default CustomModal;
