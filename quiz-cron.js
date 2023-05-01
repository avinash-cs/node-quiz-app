const cron = require('cron');
const Quiz = require('./models/quiz');

// Create a new cron job that runs every minute
const quizCronJob = new cron.CronJob('*/1 * * * *', async () => {
  try {
    // Get all quizzes from the database
    const quizzes = await Quiz.find();

    // Loop through each quiz and update its status based on its start and end time
    quizzes.forEach(async (quiz) => {
      const currentDate = new Date();

      if (currentDate < quiz.startDate) {
        // Quiz is inactive
        quiz.status = 'inactive';
      } else if (currentDate >= quiz.startDate && currentDate <= quiz.endDate) {
        // Quiz is active
        quiz.status = 'active';
      } else if (currentDate > quiz.endDate) {
        // Quiz is finished
        quiz.status = 'finished';
      }

      // Save the updated quiz to the database
      await quiz.save();
    });
  } catch (err) {
    console.error(err);
  }
});

// Start the cron job
quizCronJob.start();
