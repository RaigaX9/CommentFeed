import React from 'react';

const DeleteCommentsButton = ({ onClick }) => {
    return (
        <button onClick={onClick} className="delete-button" aria-label="Delete all comments">
            Delete All Comments
        </button>
    );
};

export default DeleteCommentsButton;
