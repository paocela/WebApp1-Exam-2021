import { ListGroup } from 'react-bootstrap'
import './App.css';
import './LeftSide.css';
import { Col, Row, Button, Badge, Alert } from "react-bootstrap"
import { Link } from 'react-router-dom';


// list of surveys titles - map each survey to a list element (with Link to allow proper setting of URL)
function LeftSide(props) {

    return (
        <Col sm={3} className="  d-sm-block below-nav vheight-100 leftDiv" >
            <h4 className="leftSide-title">Survey List</h4>
            <ListGroup variant="flush" className="trans">
                {props.surveyList.map(
                    (x, index) => {
                        return (<SurveyRow key={x.Id} setColorSubmitSurveyMessage={props.setColorSubmitSurveyMessage} setSubmitSurveyMessage={props.setSubmitSurveyMessage} setErrorMessageUsername={props.setErrorMessageUsername} setErrorMessageClosed={props.setErrorMessageClosed} setErrorMessageOpen={props.setErrorMessageOpen} setValidationMessage={props.setValidationMessage} setCurrentSurveyIndex={props.setCurrentSurveyIndex} index={index} survey={x} currentSurvey={props.currentSurvey} setCurrentSurvey={props.setCurrentSurvey} admin={props.admin} setIndexCurrentUser={props.setIndexCurrentUser} setResponses={props.setResponses} setGetUsersTrigger={props.setGetUsersTrigger} setLoadingAdmin={props.setLoadingAdmin} />)
                    })
                }
                {!props.admin ? "" :
                    <>
                        <ListGroup.Item className="bg-transparent">
                            <Link type="submit" to="/admin/create" key="/admin/create">
                                <Button className="btn btn-new-survey btn-md btn-block" variant="outline-primary" onClick={() => { }}>ADD NEW SURVEY</Button>
                            </Link>
                        </ListGroup.Item>
                        {props.submitSurveyMessage ?
                            <ListGroup.Item className="bg-transparent">
                                <Alert variant={props.colorSubmitSurveyMessage}>{props.submitSurveyMessage}</Alert>
                            </ListGroup.Item>
                            : ''}
                    </>

                }

            </ListGroup>
        </Col>
    );
}

// single survey in survey list
function SurveyRow(props) {
    let active = false;
    let numResponses = null;

    // differentiate among leftSide for user and for admin
    if (props.admin) {
        numResponses = props.survey.NumberResponses;
    }

    // select currect active list element
    if (props.currentSurvey.Id === props.survey.Id) {
        active = true;
    }

    // onClick allows to properly select a different element and switch among surveys
    return (<ListGroup.Item onClick={() => {
        if (props.admin) {
            if (props.survey.NumberResponses > 0) {
                props.setCurrentSurveyIndex(props.index);
                props.setCurrentSurvey(props.survey);
                props.setGetUsersTrigger((x) => (!x));
                props.setLoadingAdmin(true);
                props.setSubmitSurveyMessage("");
            } else if (props.survey.NumberResponses === 0) {
                props.setSubmitSurveyMessage("This survey has no responses yet");
                props.setColorSubmitSurveyMessage("warning");
            }
        } else {
            props.setCurrentSurveyIndex(props.index);
            props.setCurrentSurvey(props.survey);
            props.setResponses([]);
            props.setErrorMessageUsername("");
            props.setErrorMessageClosed("");
            props.setErrorMessageOpen("");
            props.setValidationMessage("");
        }

        props.setIndexCurrentUser(0);
    }} action active={active} className="leftButton bg-transparent">
        <Row>
            <Col>{props.survey.Title}</Col>
            <Col></Col>
            <Col>
                <Badge pill variant="info">{numResponses}</Badge>
            </Col>
        </Row>
    </ListGroup.Item>);
}


export default LeftSide;