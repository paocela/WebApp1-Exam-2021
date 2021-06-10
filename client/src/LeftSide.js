import { ListGroup } from 'react-bootstrap'
import './App.css';
import './LeftSide.css';
import { Col, Row } from "react-bootstrap"
import { Link } from 'react-router-dom';
import { useState } from 'react';



function LeftSide(props) {

    return (
        <Col sm={3} className="  d-sm-block below-nav vheight-100 leftDiv" >
            <h4 class="leftSide-title">Survey List</h4>
            <ListGroup variant="flush" className="trans">
                {props.surveyList.map(
                    (x) => {

                        return (<SurveyRow survey={x} currentSurvey={props.currentSurvey} setCurrentSurvey={props.setCurrentSurvey} key={x} admin={props.admin} setIndexCurrentUser={props.setIndexCurrentUser} />)
                    })
                }
            </ListGroup>
        </Col>
    );
}

function SurveyRow(props) {
    let active = false;
    let numResponses = null;

    if (props.admin) {
        console.log(props.currentSurvey)
        numResponses = props.survey.users.length;
        console.log(numResponses)
    }

    if (props.currentSurvey.title === props.survey.title) {
        active = true;
    }
    return (<ListGroup.Item onClick={() => {
        props.setCurrentSurvey(props.survey);
        if(props.survey.users.length == 0) {
            props.setIndexCurrentUser(null);    
        }
        props.setIndexCurrentUser(0);
    }} action active={active} className="leftButton bg-transparent">
        <Row>
            <Col>{props.survey.title}</Col>
            <Col></Col>
            <Col>
                <span className="badge rounded-pill bg-info">{numResponses}</span>
            </Col>
        </Row>
    </ListGroup.Item>);
}


export default LeftSide;