const express = require('express');
const connectDB = require('./db');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/users');
const quizRouter = require('./routes/quiz');
const app = express();
const PORT = process.env.PORT || 3000;
const rateLimit = require('express-rate-limit');
require('./quiz-cron');

require('dotenv').config();
const User = require('./models/users');
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // limit each IP to 100 requests per windowMs
  });
connectDB();

// Use middleware
app.use(express.json());
app.use(limiter);

app.use('/api', authRouter);
app.use('/api',userRouter);
app.use('/api',quizRouter);

// Create a new user
app.post('/api/users', async (req, res) => {
    const { name, email, password } = req.body;  
    // Create a new user with the provided name, email, and password    
    const user = new User({ name, email, password });
    await user.save();  
    // Return the new user as JSON
    res.json(user);
});


app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

module.exports = app;