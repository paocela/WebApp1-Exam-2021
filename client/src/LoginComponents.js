import { Form, Button, Alert, Col, Row } from 'react-bootstrap';
import { useState } from 'react';
//import { Redirect } from 'react-router';

function validateCredentials(username, password) {
    const reUsername = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const rePassword = /(?=.{6,15})/;
    if(!reUsername.test(username) || !rePassword.test(password)) {
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
      
      if(valid)
      {
        props.login(credentials);
      }
      else {
        props.setErrorMessage('Format not valid')
      }
  };

  return (<>
    <Row className='mt-5'>
    <Col></Col>
    <Col className='col-5'>
    <Form>
      {props.errorMessage ? <Alert variant='danger'>{props.errorMessage}</Alert> : ''}
      <Form.Group controlId='username'>
          <Form.Label>Email</Form.Label>
          <Form.Control type='email' value={username} onChange={ev => setUsername(ev.target.value)} />
      </Form.Group>
      <Form.Group controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control type='password' value={password} onChange={ev => setPassword(ev.target.value)} />
      </Form.Group>
      <Button className='justify-content-end' onClick={handleSubmit}>Login</Button>
    </Form></Col>
    <Col></Col></Row></>)
}

function LogoutButton(props) {
  return(
    <Col>
      <Button variant="outline-primary" onClick={props.logout}>Logout</Button>
    </Col>
  )
}

export { LoginForm, LogoutButton };