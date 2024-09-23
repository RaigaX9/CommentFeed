const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const DataAccessObject = require('./dataAccessObject');
const Comment = require('./comment');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const port = process.env.PORT || 3001;

// Middleware to allow cross-origin requests and parse JSON bodies
app.use(cors());
app.use(bodyParser.json());

const dataAccessObject = new DataAccessObject('./database.sqlite3');
const comment = new Comment(dataAccessObject);

// WebSocket connection handler
wss.on('connection', (ws) => {
  console.log('New WebSocket client connected');

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});

// Broadcast function to send data to all connected WebSocket clients
const broadcast = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

// Get a single comment by ID from the SQLite database
app.get('/api/getComment', async (req, res) => {
  const { id } = req.query; // Assume the ID is passed as a query parameter

  if (!id) {
    return res.status(400).json({ error: 'Comment ID is required' });
  }

  try {
    const result = await comment.getComment(id);
    if (!result) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    res.status(200).json(result);
  } catch (error) {
    console.error('Error retrieving comment:', error);
    res.status(500).json({ error: 'Failed to retrieve comment' });
  }
});

// Get all comments from the SQLite database
app.get('/api/getComments', async (req, res) => {
  try {
    const allComments = await comment.getComments();
    res.status(200).json(allComments);
  } catch (error) {
    console.error('Error retrieving comments:', error);  // Log error for debugging
    res.status(500).json({ error: 'Failed to retrieve comments' });
  }
});

// Create a new comment in the SQLite database
app.post('/api/createComment', async (req, res) => {
  const { name, message } = req.body;

  if (!name || !message) {
    return res.status(400).json({ error: 'Name and message are required' });
  }

  try {
    // Insert the new comment into the database
    await comment.createComment({ name, message });

    // Fetch the most recent comment (the one just inserted)
    const allComments = await comment.getComments();
    const savedComment = allComments[allComments.length - 1];  // Get the last inserted comment

    // Broadcast the full comment to WebSocket clients
    broadcast(savedComment);

    // Respond with the full saved comment
    res.status(201).json(savedComment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
});


// Delete all comments
app.delete('/api/deleteComments', async (req, res) => {
  try {
    await comment.deleteComments();
    res.status(200).json({ message: 'All comments deleted' });
  } catch (error) {
    console.error('Error deleting comments:', error);  // Log error for debugging
    res.status(500).json({ error: 'Failed to delete comments' });
  }
});

// Start the server on port 3001
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
