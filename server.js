require("dotenv").config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer'); // Import Nodemailer
const app = express();
const port = process.env.PORT || 3001;

// Replace this with your MongoDB connection string
const dbURI = process.env.MONGO_URL || 'mongodb+srv://mohitkediawebtrial:mohitkediawebtrial@cluster0.1ojfc5h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

const commentSchema = new mongoose.Schema({
    name: String,
    message: String,
    date: String
});

const Comment = mongoose.model('Comment', commentSchema);

app.use(bodyParser.json());

// Serve static files (CSS, JS, images) from the root 'Website' directory
app.use(express.static(path.join(__dirname)));

// Define routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Get comments
app.get('/comments', async (req, res) => {
    try {
        const comments = await Comment.find();
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Post a comment
app.post('/comments', async (req, res) => {
    const comment = new Comment({
        name: req.body.name,
        message: req.body.message,
        date: req.body.date
    });

    try {
        const newComment = await comment.save();
        res.status(201).json(newComment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Handle the contact form submission
app.post('/send-email', (req, res) => {
    const { userEmail, subject, messageContent } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL, // Sent from your email
        to: 'camohitkedia@gmail.com',
        subject: subject, // Subject provided by the user
        text: `From: ${userEmail}\n\n${messageContent}`, // Plain text content with user's email included
        html: `<p><strong>From:</strong> ${userEmail}</p><p>${messageContent.replace(/\n/g, '<br>')}</p>`, // HTML version with user's email
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).send('Error sending email.');
        }
        console.log('Email sent:', info.response);
        res.send('Message sent successfully!');
    });
});
// Catch all other routes and serve the about.html file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'about.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});