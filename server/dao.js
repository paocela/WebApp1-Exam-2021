'use strict';
/* Data Access Object (DAO) module for accessing courses and exams */

const sqlite = require('sqlite3');

// open the database
const db = new sqlite.Database('./newSurveys.db', (err) => {
  if (err) throw err;
});

// Retrieve all available surveys - called by a regular user
exports.getListSurveysUser = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT Id, Title, NumberQuestions, QuestionsAndAnswers FROM Surveys';
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      for (let indexRow in rows) {
        rows[indexRow].QuestionsAndAnswers = JSON.parse(rows[indexRow].QuestionsAndAnswers);
      }
      resolve(rows);
    });
  });
};

// Retrieve all available surveys - called by a regular user
exports.getListSurveysAdmin = (adminId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM Surveys WHERE AdminId = ?';
    db.all(sql, [adminId], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      for (let indexRow in rows) {
        rows[indexRow].QuestionsAndAnswers = JSON.parse(rows[indexRow].QuestionsAndAnswers);
      }
      resolve(rows);
    });
  });
};

// retrieve all available responses to a survey
exports.getResponses = (surveyId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT R.Id, SurveyId, Username, Response, AdminId FROM Responses R, Surveys S WHERE R.SurveyId = ? AND S.Id = R.SurveyId';
    db.all(sql, [surveyId], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      for (let indexRow in rows) {
        rows[indexRow].Response = JSON.parse(rows[indexRow].Response);
      }
      resolve(rows);
    });
  });
};

// add a response to a survey
exports.addResponse = (response) => {
  return new Promise(async (resolve, reject) => {
    try {
      let updated = await updateNumberResponses(response.SurveyId);
      if (updated === true) {
        const sql = 'INSERT INTO Responses(SurveyId, Username, Response) VALUES(?, ?, ?)';
        db.run(sql, [response.SurveyId, response.Username, response.Response], function (err) {
          if (err) {
            reject(err);
            return;
          } else {
            resolve(1);
          }
        });
      } else {
        reject(updated)
      }
    } catch (err) {
      reject(err);
    }
  });
};

// add a new survey
exports.addSurvey = (survey) => {

  return new Promise(async (resolve, reject) => {
    const sql = 'INSERT INTO Surveys(Title, AdminId, NumberQuestions, QuestionsAndAnswers, NumberResponses) VALUES(?, ?, ?, ?, ?);';
    db.run(sql, [survey.Title, survey.AdminId, survey.NumberQuestions, survey.QuestionsAndAnswers, survey.NumberResponses], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(1);
    });
  });
};

const updateNumberResponses = (surveyId) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE surveys SET NumberResponses = NumberResponses + 1 WHERE Id = ?';
    db.get(sql, [surveyId], (err, rows) => {
      if (err) {
        reject(err);
        return;
      } else
        resolve(true);
    });
  });
}
