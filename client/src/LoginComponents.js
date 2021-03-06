import { Form, Button, Alert, Col, Row, Badge } from 'react-bootstrap';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import "./App.css"

//import { Redirect } from 'react-router';

// sanity checks on username and password
function validateCredentials(username, password) {
  const reUsername = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const rePassword = /(?=.{6,15})/;
  if (!reUsername.test(username) || !rePassword.test(password)) {
    return false;
  }
  return true;
}

function LoginForm(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // reset states error messages
  props.setValidationMessage("");
  props.setErrorMessageUsername("");
  props.setErrorMessageClosed("");
  props.setErrorMessageOpen("");

  // function to handle submit of login form - will interact with app and then with server
  const handleSubmit = (event) => {
    let valid = true;
    props.setErrorMessage("");
    event.preventDefault();
    const credentials = { username, password };

    valid = validateCredentials(username, password);

    if (valid) {
      props.login(credentials);
    }
    else {
      props.setErrorMessage('Format not valid')
    }
  };

  const resetErrorMessage = () => {
    props.setErrorMessage("");
  }

  // Link "Go back as user" button: position to the rigth of the container
  return (<>
    <Row>
      <Col></Col>
      <Col className="logIn-title">
        <h1>
          <Badge pill variant="primary">Survey LogIn</Badge>
        </h1>
      </Col>
      <Col></Col>
    </Row>
    <Row className='mt-5'>
      <Col></Col>
      <Col className='col-5'>
        <Form >
          <Form.Group controlId='email' className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type='email' placeholder="Enter email..." value={username} onChange={ev => setUsername(ev.target.value)} />
          </Form.Group>
          <Form.Group controlId='password' className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type='password' placeholder="Enter password..." value={password} onChange={ev => setPassword(ev.target.value)} />
          </Form.Group>
          {props.errorMessage ? <Alert variant='danger'>{props.errorMessage}</Alert> : ''}
          <Row>
            <Col>
              <Button className='justify-content-end' variant="primary" type="submit" onClick={handleSubmit}>Login</Button>
            </Col>
            <Col></Col>
            <Col>
              <Link className='justify-content-end form-inline' type="submit" to="/" key="/login">
                <Button variant="secondary" type="submit" onClick={resetErrorMessage}>
                  Go back as user
                </Button>
              </Link>
            </Col>
          </Row>
        </Form></Col>
      <Col></Col></Row></>)
}

export { LoginForm };