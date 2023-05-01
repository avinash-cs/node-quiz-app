const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, body, validationResult } = require('express-validator');
const Quiz = require('../models/quiz');
const User = require('../models/users');
// Create a new quiz
router.post('/quizzes', [auth, [
  body('question', 'Question is required').notEmpty(),
  body('options', 'Options are required and must be an array with at least 2 items')
    .isArray({ min: 2 })
    .custom((value, { req }) => {
      if (value.length !== new Set(value).size) {
        throw new Error('Options must be unique');
      }
      return true;
    }),
  body(
    'rightAnswer',
    'Right answer is required and must be a number within the range of options'
  ).isInt({ min: 0 }).custom((value, { req }) => {
    const { options } = req.body;
    if (value >= options.length) {
      throw new Error('Right answer must be within the range of options');
    }
    return true;
  }),
  body('startDate', 'Start date is required and must be a valid ISO 8601 date string')
    .notEmpty()
    .isISO8601(),
  body('endDate', 'End date is required and must be a valid ISO 8601 date string')
    .notEmpty()
    .isISO8601(),
],
], async (req, res) => {
  try {
    // Check if validation errors occurred
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Extract the fields from the request body
    const { question, options, rightAnswer, startDate, endDate } = req.body;
    // Create a new quiz document with the extracted fields
    // console.log(options);

    const quiz = new Quiz({
      question,
      options,
      rightAnswer,
      startDate,
      endDate
    });
    // Save the new quiz document to the database

    await quiz.save();
    // Return a success response with the created quiz document

    res.status(201).json(quiz);

  } catch (err) {
    // Handle any errors that occur and return an error response
    console.error(err);
    res.status(500).json({ message: 'Failed to create quiz' });
  }
});

router.get('/quizzes/active', auth, async (req, res) => {
  try {
    const now = new Date();
    const quiz = await Quiz.findOne({
      startDate: { $lte: now },
      endDate: { $gt: now }
    });

    if (!quiz) {
      return res.status(404).json({ message: 'No active quiz found' });
    }

    res.json(quiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/quizzes/:id/result', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const now = new Date();
    if (now < quiz.endDate) {
      return res.status(400).json({ message: 'Quiz is not finished yet' });
    }

    res.json({ rightAnswer: quiz.options[quiz.rightAnswer] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/quizzes/all', auth,async (req, res) => {
  try {
    // Find all quizzes in the database
    const quizzes = await Quiz.find();
    // Return a success response with the quizzes array
    res.status(200).json(quizzes);
  } catch (err) {
    // Handle any errors that occur and return an error response
    console.error(err);
    res.status(500).json({ message: 'Failed to retrieve quizzes' });
  }
});

module.exports = router;
