import { ListGroup } from 'react-bootstrap'
import './App.css';
import './LeftSide.css';
import Col from "react-bootstrap/Col"
import { Link } from  'react-router-dom';
import { useState } from 'react';



function LeftSide(props) {
    return (
        <Col sm={3} className="  d-sm-block below-nav vheight-100 leftDiv" >
            <h4 class="leftSide-title">Survey List</h4>
            <ListGroup variant="flush" className="trans">
                {props.surveyList.map(
                    (x) => {
                    
                    let y = "/"+x.title;

                   return (<SurveyRow surveyTitle={x.title} currentSurvey={props.currentSurvey} setCurrentSurvey={props.setCurrentSurvey} key={x} />)
                })
                }
            </ListGroup>
        </Col>
    );
}

function SurveyRow(props) {

    let active=false;
    
    if (props.currentSurvey === props.surveyTitle) {
       active=true;
    }
    return (<ListGroup.Item onClick={() => props.setCurrentSurvey(props.surveyTitle)} action active={active} className="leftButton bg-transparent">{props.surveyTitle}</ListGroup.Item>);
}


export default LeftSide;