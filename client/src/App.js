import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import NavBar from './NavBar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import { useState, useEffect } from 'react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route } from 'react-router-dom';
import { Switch } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import { LoginForm } from './LoginComponents';
import LeftSide from './LeftSide';
import RightSide from './RightSide';
import RightSideAdmin from './RightSideAdmin';
import CreateSurvey from './CreateSurvey';


function App() {
  // global useState for handling of users, surveys and admins
  const [loggedIn, setLoggedIn] = useState(false); // TODO set to false when completed
  const [errorMessage, setErrorMessage] = useState('');
  const [surveyList, setSurveyList] = useState([]);
  const [currentSurvey, setCurrentSurvey] = useState([])
  const [currentSurveyIndex, setCurrentSurveyIndex] = useState(0);
  const [indexCurrentUser, setIndexCurrentUser] = useState()
  const [responses, setResponses] = useState([]); // response of a survey, used in right side
  const [loading, setLoading] = useState(true);
  const [loadingAdmin, setLoadingAdmin] = useState(true);
  const [getUsersTrigger, setGetUsersTrigger] = useState(false);
  const [postNewSurveyTrigger, setPostNewSurveyTrigger] = useState(false);
  const [errorMessageUsername, setErrorMessageUsername] = useState("");
  const [errorMessageClosed, setErrorMessageClosed] = useState("");
  const [errorMessageOpen, setErrorMessageOpen] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const [submitSurveyMessage, setSubmitSurveyMessage] = useState(""); // message to confirm survey submission OR to inform admin he/she can't select empty survey
  const [colorSubmitSurveyMessage, setColorSubmitSurveyMessage] = useState(""); // either danger or yellow
  const [adminNoSurveys, setAdminNoSurveys] = useState(false); // used to redirect admin to create survey if it doesn't have any surveys yet
  const [adminNoResponses, setAdminNoResponses] = useState(false); // used to show only leftside when the survey has no responses

  /* 
  GET use effect. It performs 2 operations:
  - if regular user, it perform a GET in order to fetch all available surveys from the server, without responses
  - if admin, it perform a GET in order to fetch all his surveys previously created, and gets all questions and possible answers (it doesn't get yet answer from single users)
  */

  useEffect(() => {
    // get all surveys
    const fetchAllUser = async (x) => {
      const response = await fetch('/api/surveys');
      const responseBody = await response.json();
      const res = [...responseBody]
      setSurveyList(res);
      setCurrentSurvey(res[0]);
      setIndexCurrentUser(0);
      setLoading(false);
      setLoadingAdmin(true);
    }
    // get surveys created by admin (without responses)
    const fetchAllAdmin = async (x) => {
      const response = await fetch('/api/surveysAdmin');
      const responseBody = await response.json();
      const res = responseBody;
      if(res.length === 0) {
        setAdminNoSurveys(true);
      } else {
        setSurveyList(res);
        setCurrentSurvey(res[0]);
        setCurrentSurveyIndex(0);
        setIndexCurrentUser(0);
        setLoading(false);
      }
    }
    if (loggedIn) {
      fetchAllAdmin().then(() => { setGetUsersTrigger((x) => (!x)) });
    } else {
      fetchAllUser();
    }

  }, [loggedIn, postNewSurveyTrigger]);

  /* 
   GET use effect. It performs 1 single operation every time the admin select a single survey using the left sidebar:
   it gets all personal responses from users for a survey and it adds them to the useState survey list
   to do so every time it reset the list of users and responses, in order to get them again from the server to account for new users responses
  */
  useEffect(() => {
    const fetchAll = async (x) => {
      const response = await fetch('/api/surveysAdmin/' + currentSurvey.Id);
      const responseBody = await response.json();
      const res = [...responseBody]
      let temp = [...surveyList];
      if(res.length === 0) {
        setAdminNoResponses(true);
      } else {
        setAdminNoResponses(false);
      }

      // fix number of responses if while in /admin, a user responded to a survey
      // because number of responses on left side is fetched from server only when the page is loaded
      if (res.length !== temp[currentSurveyIndex].NumberResponses) {
        temp[currentSurveyIndex].NumberResponses = res.length;
      }

      // reset users and responses list
      temp[currentSurveyIndex]["Users"] = [];
      for (let questionIndex in surveyList[currentSurveyIndex].QuestionsAndAnswers) {
        temp[currentSurveyIndex].QuestionsAndAnswers[questionIndex]["responses"] = [];
      }

      // add users and responses
      for (let index in res) {
        temp[currentSurveyIndex]["Users"].push(res[index].Username);
        for (let questionIndex in surveyList[currentSurveyIndex].QuestionsAndAnswers) {
          let jsonResponse = { response: res[index].Response[questionIndex] }
          temp[currentSurveyIndex].QuestionsAndAnswers[questionIndex]["responses"].push(jsonResponse);
        }
      }
      setSurveyList(temp);
      setCurrentSurvey(surveyList[currentSurveyIndex])
      setLoadingAdmin(false)
    }
    if (loggedIn) {
      fetchAll();
    }
    // eslint-disable-next-line
  }, [getUsersTrigger]);

  // functions to handle login and logout - interact with server
  const doLogIn = async (credentials) => {
    try {
      await logIn(credentials);
      setLoggedIn(true);
    } catch (err) {
    }
  }

  const doLogOut = async () => {
    if (loggedIn) {
      await logOut();
      setLoggedIn(false);
      setSubmitSurveyMessage("");
    }
  }

  async function logIn(credentials) {
    let response = await fetch('/api/login', {
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
    await fetch('/api/login/current', { method: 'DELETE' });
  }

  // main app components - with routes
  return (
    <Router>
      <Switch>
        <Route path="/login" render={() =>
          <>{loggedIn ?
            <Redirect to="/admin" /> :
            <>
              <LoginForm login={doLogIn} setErrorMessage={setErrorMessage} errorMessage={errorMessage} setValidationMessage={setValidationMessage} setErrorMessageUsername={setErrorMessageUsername} setErrorMessageClosed={setErrorMessageClosed} setErrorMessageOpen={setErrorMessageOpen}/>
            </>
          }</>

        } />

        <Route exact path="/" render={() =>
          <>
            {
              loading ? <Container fluid>
                <Spinner animation="border" variant="primary" />
                <span>   Please wait, loading your surveys...   </span>
                <Spinner animation="border" variant="primary" />
              </Container> :
                <Container fluid>
                  <NavBar title="Survey Manager" doLogOut={doLogOut} />
                  <Row>
                    <LeftSide colorSubmitSurveyMessage={colorSubmitSurveyMessage} submitSurveyMessage={submitSurveyMessage} setSubmitSurveyMessage={setSubmitSurveyMessage} setErrorMessageUsername={setErrorMessageUsername} setErrorMessageClosed={setErrorMessageClosed} setErrorMessageOpen={setErrorMessageOpen} setValidationMessage={setValidationMessage} setCurrentSurveyIndex={setCurrentSurveyIndex} surveyList={surveyList} currentSurvey={currentSurvey} setCurrentSurvey={setCurrentSurvey} admin={false} setIndexCurrentUser={setIndexCurrentUser} setResponses={setResponses} />
                    <RightSide errorMessageUsername={errorMessageUsername} errorMessageClosed={errorMessageClosed} errorMessageOpen={errorMessageOpen} validationMessage={validationMessage} setErrorMessageUsername={setErrorMessageUsername} setErrorMessageClosed={setErrorMessageClosed} setErrorMessageOpen={setErrorMessageOpen} setValidationMessage={setValidationMessage} currentSurvey={currentSurvey} currentSurveyIndex={currentSurveyIndex} surveyList={surveyList} responses={responses} setResponses={setResponses} />
                  </Row>
                </Container>
            }

          </>
        } />

        <Route exact path="/admin" render={() =>
          <>{ /*
            if adminNoSurvey: redirect admin to create survey page
            if adminNoResponses: show only left side component and not right side
            */
            adminNoSurveys ? <Redirect to="/admin/create" /> : 
              loggedIn ?
                loadingAdmin ? <Container fluid>
                  <Spinner animation="border" variant="primary" />
                  <span>   Please wait, loading your surveys manager...   </span>
                  <Spinner animation="border" variant="primary" />
                </Container> :
                adminNoResponses ? 
                <Container fluid >
                    <NavBar title="Survey Manager - Admin" doLogOut={doLogOut} />
                    <Row>
                      <LeftSide colorSubmitSurveyMessage={colorSubmitSurveyMessage} setColorSubmitSurveyMessage={setColorSubmitSurveyMessage} submitSurveyMessage={submitSurveyMessage} setSubmitSurveyMessage={setSubmitSurveyMessage} setCurrentSurveyIndex={setCurrentSurveyIndex} surveyList={surveyList} currentSurvey={currentSurvey} setCurrentSurvey={setCurrentSurvey} admin={true} setIndexCurrentUser={setIndexCurrentUser} setGetUsersTrigger={setGetUsersTrigger} setLoadingAdmin={setLoadingAdmin} />
                    </Row>
                  </Container> :
                  <Container fluid >
                    <NavBar title="Survey Manager - Admin" doLogOut={doLogOut} />
                    <Row>
                      <LeftSide colorSubmitSurveyMessage={colorSubmitSurveyMessage} setColorSubmitSurveyMessage={setColorSubmitSurveyMessage} submitSurveyMessage={submitSurveyMessage} setSubmitSurveyMessage={setSubmitSurveyMessage} setCurrentSurveyIndex={setCurrentSurveyIndex} surveyList={surveyList} currentSurvey={currentSurvey} setCurrentSurvey={setCurrentSurvey} admin={true} setIndexCurrentUser={setIndexCurrentUser} setGetUsersTrigger={setGetUsersTrigger} setLoadingAdmin={setLoadingAdmin} />
                      <RightSideAdmin currentSurvey={currentSurvey} indexCurrentUser={indexCurrentUser} setIndexCurrentUser={setIndexCurrentUser} />
                    </Row>
                  </Container>
                :
                <Redirect to="/login" />
          }
          </>
        } />


        <Route exact path="/admin/create" render={() =>
          <>
            {loggedIn ?
              <React.Fragment>
                <NavBar title="Survey Manager - Admin" doLogOut={doLogOut} />
                <Row>
                  <CreateSurvey setAdminNoSurveys={setAdminNoSurveys} setColorSubmitSurveyMessage={setColorSubmitSurveyMessage} setSubmitSurveyMessage={setSubmitSurveyMessage} setLoadingAdmin={setLoadingAdmin} setPostNewSurveyTrigger={setPostNewSurveyTrigger} surveyList={surveyList} setSurveyList={setSurveyList} />
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
