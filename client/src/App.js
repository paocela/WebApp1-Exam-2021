import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './NavBar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
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
import { Col } from 'react-bootstrap';

let initSurveyList = [
  {
    title: "Mood",
    questions: [
      {
        question: "How are you?",
        answers: ["Good", "Tired", "Bored"],
        min: 0,
        max: -1
      },
      {
        question: "Describe your day?",
        answers: ["I've been programming a web app all day!"]
      }
    ]
  },
  {
    title: "Interest",
    questions: [
      {
        question: "Your favourite sport? (select 2)",
        answers: ["Golf", "Basketball", "Soccer", "Others..."],
        min: 0,
        max: -1
      },
      {
        question: "Tell me a story",
        answers: ["I don't know any stories"]
      }
    ]
  },
  {
    title: "Personality",
    questions: [
      {
        question: "What's your name?",
        answers: ["Paolo"]
      },
      {
        question: "What do you like to eat?",
        answers: ["Pasta", "Nutella", "Insalata"],
        min: 1,
        max: 1
      }
    ]
  }
]


function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [message, setMessage] = useState('');
  const [surveyList, setSurveyList] = useState(initSurveyList);
  const [currentSurvey, setCurrentSurvey] = useState(initSurveyList[0])



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
                <LeftSide surveyList={surveyList} currentSurvey={currentSurvey} setCurrentSurvey={setCurrentSurvey} />
                <RightSide currentSurvey={currentSurvey} />
              </Row>
              <Row>
                <Col>
                  <Button className="btn btn-lg fixed-right-bottom" variant="outline-primary" onClick={() => { }}>SUBMIT</Button>
                </Col>
              </Row>
            </Container>
          </>
        } />

        <Route exact path="/admin" render={() =>
          <>
            <NavBar title="Survey Manager - Admin" doLogOut={doLogOut} />
            <Row>

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
