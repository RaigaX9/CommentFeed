import React from 'react';

const CommentList = ({ comments }) => {
    return (
        <ul className="comments-list" role="list" aria-label="Comments list">
            {comments.length > 0 ? (
                comments.map((comment) => (
                    <li key={comment.id} className="comment-item" role="listitem">
                        <p>
                            <strong>{comment.name}</strong> {comment.message}
                        </p>
                        <small>{new Date(comment.created).toLocaleString()}</small>
                    </li>
                ))
            ) : (
                <p>No comments yet. Be the first to comment!</p>
            )}
        </ul>
    );
};

export default CommentList;
