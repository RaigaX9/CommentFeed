import React from 'react';

const CommentForm = ({ onSubmit, name, setName, message, setMessage }) => {
    return (
        <form onSubmit={onSubmit} className="comment-form">
            <input
                type="text"
                className="name-input"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-label="Your name"
            />
            <textarea
                className="comment-input"
                placeholder="Your comment"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                aria-label="Your comment"
            />
            <button type="submit" className="submit-button">
                Post Comment
            </button>
        </form>
    );
};

export default CommentForm;
