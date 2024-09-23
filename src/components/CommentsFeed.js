import React, { useState, useEffect, useRef } from 'react';
import CommentForm from './form/CommentForm';
import CommentList from './list/CommentList';
import Alert from './alerts/Alert';
import ToastNotifications, { showToast } from './alerts/ToastNotifications';
import DeleteButton from './buttons/DeleteCommentsButton';
import DeleteModal from './modal/DeleteModal';

const CommentsFeed = () => {
    const [comments, setComments] = useState([]);
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [alertMessage, setAlertMessage] = useState(null);
    const [alertType, setAlertType] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);
    const alertTimeoutRef = useRef(null);
    const socketRef = useRef(null);

    // Fetch comments from the server
    const fetchComments = async () => {
        try {
            const res = await fetch('http://localhost:3001/api/getComments');
            if (!res.ok) {
                throw new Error('Failed to fetch comments');
            }
            const data = await res.json();
            const sortedComments = data.sort((a, b) => new Date(b.created) - new Date(a.created));
            setComments(sortedComments);
        } catch (error) {
            console.error('Error fetching comments:', error);
            showAlert('Failed to load comments. Please try again.', 'error');
        }
    };

    // WebSocket setup and fallback
    useEffect(() => {
        fetchComments(); // Fetch comments initially

        socketRef.current = new WebSocket('ws://localhost:3001');

        socketRef.current.onopen = () => {
            setIsWebSocketConnected(true);
            console.log('WebSocket connected');
        };

        socketRef.current.onmessage = (event) => {
            const newComment = JSON.parse(event.data);
            console.log('New comment received via WebSocket:', newComment);

            if (newComment.name && newComment.message && newComment.created) {
                setComments((prevComments) => {
                    const addComments = [newComment, ...prevComments].sort(
                        (a, b) => new Date(b.created) - new Date(a.created)
                    );
                    return addComments;
                });
                showToast(`New comment by ${newComment.name}`, 'info');
            } else {
                console.error('Incomplete comment data received:', newComment);
            }
        };

        socketRef.current.onclose = () => {
            setIsWebSocketConnected(false);
            console.log('WebSocket disconnected');
        };

        socketRef.current.onerror = () => {
            setIsWebSocketConnected(false);
            console.log('WebSocket error occurred');
        };

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, []);

    const showAlert = (message, type) => {
        if (alertTimeoutRef.current) {
            clearTimeout(alertTimeoutRef.current);
        }

        setAlertMessage(message);
        setAlertType(type);

        alertTimeoutRef.current = setTimeout(() => {
            setAlertMessage(null);
            setAlertType('');
        }, 5000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !message) {
            showAlert('Name and message are required.', 'error');
            return;
        }

        try {
            const res = await fetch('http://localhost:3001/api/createComment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, message }),
            });

            if (!res.ok) {
                throw new Error('Failed to post comment');
            }

            await res.json();
            setName('');
            setMessage('');
            showAlert('Comment posted successfully!', 'success');
            fetchComments();

            if (!isWebSocketConnected) {
                showToast(`New comment by ${name}`, 'info');
            }
        } catch (error) {
            console.error('Error posting comment:', error);
            showAlert('Failed to post comment. Please try again.', 'error');
        }
    };

    // Commented it out as delete functionality is for testing purposes only.
    // const handleDeleteComments = async () => {
    //     try {
    //         const res = await fetch('http://localhost:3001/api/deleteComments', {
    //             method: 'DELETE',
    //         });
    //         if (!res.ok) {
    //             throw new Error('Failed to delete comments');
    //         }
    //         setComments([]);
    //         showAlert('All comments deleted successfully!', 'success');
    //     } catch (error) {
    //         console.error('Error deleting comments:', error);
    //         showAlert('Failed to delete comments. Please try again.', 'error');
    //     }
    // };

    return (
        <div className="comments-feed-container">
            <ToastNotifications />
            <Alert message={alertMessage} type={alertType} />
            <CommentForm onSubmit={handleSubmit} name={name} setName={setName} message={message} setMessage={setMessage} />
            {/*Delete button functionality included for testing purposes only. Commented out to prevent accidental data loss.*/}
            {/*<DeleteButton onClick={() => setIsModalOpen(true)} />*/}
            {/*<DeleteModal*/}
            {/*    isOpen={isModalOpen}*/}
            {/*    onClose={() => setIsModalOpen(false)}*/}
            {/*    onConfirm={() => {*/}
            {/*        handleDeleteComments();*/}
            {/*        setIsModalOpen(false);*/}
            {/*    }}*/}
            {/*/>*/}
            <CommentList comments={comments} />
        </div>
    );
};

export default CommentsFeed;
