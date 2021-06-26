'use strict';

const express = require('express');
const morgan = require('morgan'); // logging middleware
const { check, validationResult } = require('express-validator'); // validation middleware
const dao = require('./dao'); // module for accessing the DB
const adminDao = require('./adminDao'); // module for accessing the DB for users
const passport = require('passport'); // auth middleware
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const session = require('express-session'); // enable sessions

/*** Set up Passport ***/
// set up the "username and password" login strategy
// by setting a function to verify username and password
passport.use(new LocalStrategy(
  function (username, password, done) {
    adminDao.getAdmin(username, password).then((user) => {
      if (!user){
        return done(null, false, { message: 'Incorrect username and/or password.' });
      }
      return done(null, user);
    })
  }
));

// serialize and de-serialize the user (user object <-> session)
// we serialize the user id and we store it in the session: the session is very small in this way
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {
  adminDao.getAdminById(id)
    .then(admin => {
      done(null, admin); // this will be available in req.user
    }).catch(err => {
      done(err, null);
    });
});

// init express
const app = new express();
const port = 3001;

// set-up the middlewares
app.use(morgan('dev'));
app.use(express.json());

// custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated())
    return next();
    
  return res.status(401).json({ error: 'not authenticated' });
}

// set up the session
app.use(session({
  // by default, Passport uses a MemoryStore to keep track of the sessions
  secret: 'A very long long secret',
  resave: false,
  saveUninitialized: false
}));

// then, init passport
app.use(passport.initialize());
app.use(passport.session());

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

// API CALLS

// GET /api/surveys
// Retrieve all available surveys - called by a regular user
app.get('/api/surveys', async (req, res) => {
  dao.getListSurveysUser()
    .then((surveys) => { res.json(surveys); })
    .catch((error) => { res.status(500).json(error); });
});

// GET /api/surveysAdmin
// Retrieve all available surveys - called for a regular user
app.get('/api/surveysAdmin', /*isLoggedIn,*/ async (req, res) => {
  dao.getListSurveysAdmin(req.user.id)
    .then((surveys) => { res.json(surveys); })
    .catch((error) => { res.status(500).json(error); });
});

// GET /api/surveys/<surveyId>
// get responses for a given survey (identified with surveyId <surveyId>)
app.get('/api/surveysAdmin/:surveyId', isLoggedIn, async (req, res) => {
  try {
    const responses = await dao.getResponses(req.params.surveyId);
    
    if (responses.error) {
      res.status(404).json(responses);
    } else if (responses[0].AdminId == req.user.id) {
      res.json(responses);
    } else {
      res.status(401).send("Not authorized");
    }
  } catch (err) {
    res.status(500).end();
  }
});

// POST /api/surveys/<surveyId>
// submit a new response for a given survey (identified with surveyId <surveyId>)
app.post('/api/surveys/:surveyId', async (req, res) => {
  // create task
  let response = {
      SurveyId: req.body.surveyId,
      Username: req.body.username,
      Response: JSON.stringify(req.body.response) 
  }
  try {
    await dao.addResponse(response)
    res.status(200).end();
  } catch (err) {
    res.status(500).json({ error: 'Cannot create response' });
  }


});

// POST /api/surveys
// Create and add a single survey (passed) to the list of surveys
app.post('/api/surveys', isLoggedIn, async (req, res) => {
  // create survey
  let survey = {
      Title: req.body.title,
      AdminId: req.user.id,
      NumberQuestions: req.body.questionsAndAnswers.length,
      QuestionsAndAnswers: JSON.stringify(req.body.questionsAndAnswers),
      NumberResponses: 0 
  }

  try {
    await dao.addSurvey(survey)
    res.status(200).end();
  } catch (err) {
    res.status(500).json({ error: 'Cannot create survey' });
  }


});


// API LOGIN/LOGOUT

// POST api/login 
// login
app.post('/api/login', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
    if (!user) {
      // display wrong login messages
      return res.status(401).json(info);
    }
    // success, perform the login
    req.login(user, (err) => {
      if (err)
        return next(err);

      // req.user contains the authenticated user, we send all the user info back
      return res.json(req.user);
    });
  })(req, res, next);
});

// TODO add to markdown

// DELETE api/login/current 
// logout
app.delete('/api/login/current', (req, res) => {
  req.logout();
  res.end();
});

// GET api/login/current
// check whether the user is logged in or not
app.get('/api/login/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  }
  else
    res.status(401).json({ error: 'Unauthenticated user!' });;
});