CREATE DATABASE onlinetest;

CREATE TABLE users (
    userid SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE,
    password TEXT, 
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS CREATE TABLE tests (
    testid SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    creatorid INTEGER REFERENCES users(userid),
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    image TEXT
);

CREATE TABLE questions (
    questionid SERIAL PRIMARY KEY,
    testid INTEGER REFERENCES tests(testid) ON DELETE CASCADE,
    questiontext TEXT NOT NULL,
    questiontype TEXT NOT NULL CHECK (questiontype IN ('multiple-choice', 'open-ended')),
    options TEXT[],
    correctanswer TEXT,
    image TEXT
);

CREATE TABLE submissions (
    submissionid SERIAL PRIMARY KEY,
    testid INTEGER REFERENCES tests(testid),
    userid INTEGER REFERENCES users(userid),
    submittedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE answers (
    answerid SERIAL PRIMARY KEY,
    submissionid INTEGER REFERENCES submissions(submissionid) ON DELETE CASCADE,
    questionid INTEGER REFERENCES questions(questionid),
    answertext TEXT
);
