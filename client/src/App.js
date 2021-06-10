import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import NavBar from './NavBar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { Badge } from 'react-bootstrap'
import { useState } from 'react';
import React from 'react';
//import dayjs from 'dayjs';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route } from 'react-router-dom';
import { Switch } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import { LoginForm, LogoutButton } from './LoginComponents';
import LeftSide from './LeftSide';
import RightSide from './RightSide';
import RightSideAdmin from './RightSideAdmin';
import { Col } from 'react-bootstrap';
import CreateSurvey from './CreateSurvey';

let initSurveyList = [
  {
    title: "Mood",
    users: ["paolo", "luca", "laura"],
    questions: [
      {
        question: "How are you?",
        answers: ["Good", "Tired", "Bored"],
        min: 0,
        max: -1,
        responses: [
          {
            response: [0, 1, 0]
          },
          {
            response: [1, 0, 0]
          },
          {
            response: [0, 0, 1]
          },
        ]
      },
      {
        question: "Describe your day?",
        answers: ["I've been programming a web app all day!"],
        min: 0,
        max: -1,
        responses: [
          {
            response: ["nothing to do"]
          },
          {
            response: ["study all day"]
          },
          {
            response: ["crazy"]
          },
        ]
      }
    ],
  },
  {
    title: "Interest",
    users: ["paolo", "luca", "laura"],
    questions: [
      {
        question: "Your favourite sport? (select 2)",
        answers: ["Golf", "Basketball", "Soccer", "Others..."],
        min: 0,
        max: -1,
        responses: [
          {
            response: [1, 1, 0, 0]
          },
          {
            response: [1, 0, 1, 1]
          },
          {
            response: [0, 0, 1, 0]
          },
        ]
      },
      {
        question: "Tell me a story",
        answers: ["I don't know any stories"],
        min: 1,
        max: -1,
        responses: [
          {
            response: ["no story"]
          },
          {
            response: ["once upon a time in hollywood"]
          },
          {
            response: ["this story is long"]
          },
        ]
      }
    ]
  },
  {
    title: "Personality",
    users: ["paolo", "luca", "laura", "gigino"],
    questions: [
      {
        question: "What's your name?",
        answers: ["Paolo"],
        min: 1,
        max: -1,
        responses: [
          {
            response: ["my name is paolo"]
          },
          {
            response: ["my name is luca"]
          },
          {
            response: ["my name is laura"]
          },
          {
            response: ["my name is gigino"]
          }
        ]
      },
      {
        question: "What do you like to eat?",
        answers: ["Pasta", "Nutella", "Insalata"],
        min: 1,
        max: 1,
        responses: [
          {
            response: [0, 1, 0]
          },
          {
            response: [1, 0, 0]
          },
          {
            response: [0, 0, 1]
          },
          {
            response: [1, 0, 1]
          },
        ]
      },
      {
        question: "What's your favourite color?",
        answers: ["Blue", "Red", "Orange", "Yellow", "Black"],
        min: 1,
        max: 1,
        responses: [
          {
            response: [0, 1, 0, 1, 1]
          },
          {
            response: [1, 0, 0, 0, 0]
          },
          {
            response: [0, 0, 1, 1, 0]
          },
          {
            response: [0, 1, 0, 1, 0]
          },
        ]
      }
    ]
  }
]




function App() {
  // global useState for handling of users, surveys and admins
  const [loggedIn, setLoggedIn] = useState(true); // TODO set to false when completed
  const [errorMessage, setErrorMessage] = useState('');
  const [message, setMessage] = useState('');
  const [surveyList, setSurveyList] = useState(initSurveyList);
  const [currentSurvey, setCurrentSurvey] = useState(initSurveyList[0])
  const [indexCurrentUser, setIndexCurrentUser] = useState(currentSurvey.users.length == 0 ? null : 0)


  // functions to handle login and logout - interact with server
  const doLogIn = async (credentials) => {
    try {
      const user = await logIn(credentials);
      setLoggedIn(true);
      setMessage({ msg: `Welcome, ${user}!`, type: 'success' });
    } catch (err) {
      setMessage({ msg: err, type: 'danger' });
    }
  }

  const doLogOut = async () => {
    if (loggedIn) {
      await logOut();
      setLoggedIn(false);
      // clean up everything
    }
  }

  async function logIn(credentials) {
    let response = await fetch('/API/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    if (response.ok) {
      const user = await response.json();
      return user.name;
    }
    else {
      setErrorMessage("Invalid username and/or password");
      try {
        const errDetail = await response.json();
        throw errDetail.message;
      }
      catch (err) {
        throw err;
      }
    }
  }

  async function logOut() {
    await fetch('/API/login/current', { method: 'DELETE' });
  }

  // main app components - with routes
  return (
    <Router>
      <Switch>

        <Route path="/login" render={() =>
          <>{loggedIn ?
            <Redirect to="/admin" /> :
            <>
              <LoginForm login={doLogIn} setErrorMessage={setErrorMessage} errorMessage={errorMessage} />
            </>
          }</>

        } />

        <Route exact path="/" render={() =>
          <>
            <Container fluid>
              <NavBar title="Survey Manager" doLogOut={doLogOut} />
              <Row>
                <LeftSide surveyList={surveyList} currentSurvey={currentSurvey} setCurrentSurvey={setCurrentSurvey} admin={false} setIndexCurrentUser={setIndexCurrentUser} />
                <RightSide currentSurvey={currentSurvey} admin={true} />
              </Row>
            </Container>
          </>
        } />

        <Route exact path="/admin" render={() =>
          <>
            <NavBar title="Survey Manager - Admin" doLogOut={doLogOut} />
            <Row>
              <LeftSide surveyList={surveyList} currentSurvey={currentSurvey} setCurrentSurvey={setCurrentSurvey} admin={true} setIndexCurrentUser={setIndexCurrentUser} />
              <RightSideAdmin currentSurvey={currentSurvey} indexCurrentUser={indexCurrentUser} setIndexCurrentUser={setIndexCurrentUser} />
            </Row>

          </>
        } />

        <Route exact path="/survey" render={() =>
          <>
            <NavBar title="Survey Manager" doLogOut={doLogOut} />
            <Row>

            </Row>
          </>
        } />

        <Route exact path="/admin/create" render={() =>
          <>
            {loggedIn ?
              <React.Fragment>
                <NavBar title="Survey Manager - Admin" doLogOut={doLogOut} />
                <Row>
                  <CreateSurvey surveyList={surveyList} setSurveyList={setSurveyList} />

                </Row>

              </React.Fragment>
              : <Redirect to="/login" />}
          </>
        } />

        <Route exact path="/admin/results" render={() =>
          <>
            {loggedIn ?
              <React.Fragment>
                <NavBar title="Survey Manager - Admin" doLogOut={doLogOut} />
                <Row>

                </Row>

              </React.Fragment>
              : <Redirect to="/login" />}
          </>
        } />

      </Switch>
    </Router>
  );
}

export default App;
