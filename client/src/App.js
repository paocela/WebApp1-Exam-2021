import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './NavBar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert';
import { useState } from 'react';
import React from 'react';
//import dayjs from 'dayjs';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route } from 'react-router-dom';
import { Switch } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import { LoginForm, LogoutButton } from './LoginComponents';


function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <Router>
      <Switch>

        <Route path="/login" render={() =>
          <>{loggedIn ? <Redirect to="/admin" /> : <LoginForm />}</>
        } />

        <Route exact path="/" render={() =>
          <>
            <Container fluid>
              <NavBar title="Survey Manager" />
              <Row>
                
              </Row>
            </Container>
          </>
        } />

        <Route exact path="/admin" render={() =>
          <>
            <NavBar title="Survey Manager" />
            <Row>

            </Row>

          </>
        } />

        <Route exact path="/survey" render={() =>
          <>
            <NavBar title="Survey Manager" />
            <Row>

            </Row>
          </>
        } />

        <Route exact path="/admin/create" render={() =>
          <>
            {loggedIn ?
              <React.Fragment>
                <NavBar title="Survey Manager" />
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
                <NavBar title="Survey Manager" />
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
