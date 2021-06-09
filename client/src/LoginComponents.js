import { Form, Button, Alert, Col, Row, Badge } from 'react-bootstrap';
import { useState } from 'react';
import { Link } from  'react-router-dom';
import "./App.css"

//import { Redirect } from 'react-router';

function validateCredentials(username, password) {
  const reUsername = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const rePassword = /(?=.{6,15})/;
  if (!reUsername.test(username) || !rePassword.test(password)) {
    return false;
  }
  return true;
}

function LoginForm(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    let valid = true;
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

  // Link "Go back as user" button: position to the rigth of the container
  return (<>
    <Row>
      <Col></Col>
      <Col className="logIn-title">
        <div>
          <h1 pill bg="failure">Survey LogIn</h1>
        </div>

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
              <Link className='justify-content-end'  type="submit" to="/" key="/login">
                <Button variant="secondary" type="submit">
                Go back as user
                </Button>
              </Link>
            </Col>
          </Row>
        </Form></Col>
      <Col></Col></Row></>)
}

export { LoginForm };