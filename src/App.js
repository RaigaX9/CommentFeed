import React from 'react';
import CommentsFeed from './components/CommentsFeed';
import './App.css';

function App() {
    return (
        <div className="App">
            <h1 className="comments-feed-title">Comment Feed</h1>
            <CommentsFeed />
        </div>
    );
}

export default App;
