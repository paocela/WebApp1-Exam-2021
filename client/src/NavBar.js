import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import './NavBar.css';
import { iconSurvey, iconLogin, iconLogout } from './Icons.js'
import { Container, Form, FormControl } from "react-bootstrap";
import { Redirect } from "react-router";
import { Link } from  'react-router-dom';


function NavBar(props) {
    return (
        <Navbar className="navbar navbar-dark navbar-expand-sm bg-primary fixed-top" expand="lg">
            <Navbar.Brand className="iconSurvey">
                {iconSurvey}
            </Navbar.Brand>
            <div inline className="title form-inline my-2 my-lg-0 mx-auto d-sm-block">
                {props.title}
            </div>
            <Navbar.Brand className="navbar-nav ml-md-auto">
                <span className="text-white justify-content-center align-self-center ">{props.message}</span>
                <Link to="/login" key="/login" className="nav-item nav-link">
                    {iconLogin}
                </Link>
                <Nav.Link className="nav-item nav-link" href="#" onClick={props.doLogOut}>
                    {iconLogout}
                </Nav.Link>
            </Navbar.Brand>

        </Navbar>
    );
}

export default NavBar;