# node-quiz-app
Nodejs Quiz App : Node.js application that allows users to create and participate in timed quizzes. The application should have a RESTful API that provides functionalities for creating and retrieving quizzes.
Functionalities:

1) User Authenticaton.
2) Create a Quiz: Users should be able to create a quiz by sending a POST request to the API with the following fields:

question: the text of the question

options: an array of the answer options for the question

rightAnswer: the index of the correct answer in the options array

startDate: the date and time when the quiz should start

endDate: the date and time when the quiz should end

3) Get Active Quiz: Users should be able to retrieve the active quiz (the quiz that is currently within its start and end time).

4) Get Quiz Result: After the 5 minute of end time of a quiz, users should be able to retrieve the result of the quiz. The result is basically the right answer .

API endpoints:

  POST /api/users - to create a new user

  POST /api/authenticate - to authenticate a user using email and password

  POST /api/quizzes - to create a new quiz

  GET /api/quizzes/active - to retrieve the active quiz (the quiz that is currently within its start and end time)

  GET /api/quizzes/:id/result - to retrieve the result of a quiz by its ID

  GET /api/quizzes/all - to retrieve the all quizes
 
 How to run project : 
    
        git clone https://github.com/avinash-cs/node-quiz-app.git
    
        cd node-quiz-app
    
        npm install
    
 create a .env file in root folder and add
 
    1) MONGODB_URI = "<your_mongodb_connection_url>"
    
    2) JWT_SECRET = <your secret>
    
 API Documentation : https://documenter.getpostman.com/view/26003930/2s93eU2DvC
 
 
