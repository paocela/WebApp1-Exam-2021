import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, ListGroup, Button, Badge } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import React from 'react';
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import { useState, useEffect } from 'react';



function RightSide(props) {
    let questions = [];
    let singleQuestion;
    const [userName, setUserName] = useState("");
    const [messageColor, setMessageColor] = useState("");
    const [addResponseTrigger, setAddResponseTrigger] = useState();
    const [isLoaded, setIsLoaded] = useState(false)

    // post request to add survey's response to server
    useEffect(() => {
        const postResponse = async () => {
            const response = await fetch('/api/surveys/' + addResponseTrigger.surveyId, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(addResponseTrigger)
            });
            if (response.status == 500) {
                console.log(response.err);
            }
        }
        if (isLoaded) {
            postResponse();
            setUserName("");
            props.setResponses([]);
        } else {
            setIsLoaded((x) => !x);
        }
    }, [addResponseTrigger]);



    // function called when sumbitting responses
    function checkFieldsAndSubmit() {
        let errorFound = false;

        props.setErrorMessageUsername("");
        props.setErrorMessageOpen("");
        props.setErrorMessageClosed("");
        props.setValidationMessage("");

        if(userName == "") {
            props.setErrorMessageUsername((m) => (m + "Please insert username"))
            setMessageColor("danger");
            errorFound = true;
        }
        for (let questionIndex in props.currentSurvey.QuestionsAndAnswers) {
            if (props.currentSurvey.QuestionsAndAnswers[questionIndex].max == -1) {
                // open question
                if (props.currentSurvey.QuestionsAndAnswers[questionIndex].min == 1 && props.responses[questionIndex] == "") {
                    props.setErrorMessageOpen((m) => (m + "Mandatory (q. " + questionIndex + ") "));
                    setMessageColor("danger");
                    errorFound = true;
                } else if(props.responses[questionIndex].length > 200) {
                    props.setErrorMessageOpen((m) => (m + "Exceeded max 200 chars (q. " + questionIndex + ") "));
                    setMessageColor("danger");
                }
                
            } else {
                // closed question
                let countTrue = 0;
                for(let res of props.responses[questionIndex]) {
                    if(res === true) {
                        countTrue++;
                    }
                }
                if(countTrue < props.currentSurvey.QuestionsAndAnswers[questionIndex].min) {
                    props.setErrorMessageClosed((m) => (m + "Min value not respected (q. " + questionIndex + ") "))
                    setMessageColor("danger");
                    errorFound = true;
                }
                if(countTrue > props.currentSurvey.QuestionsAndAnswers[questionIndex].max) {
                    props.setErrorMessageClosed((m) => (m + "Max value not respected (q. " + questionIndex + ") "))
                    setMessageColor("danger");
                    errorFound = true;
                }
            }
        }
        if(errorFound) {
            return;
        }

        let response = {
            surveyId: props.currentSurvey.Id,
            username: userName,
            response: props.responses
        }

        setAddResponseTrigger(response);
        setMessageColor("success");
        props.setValidationMessage("Survey submitted correctly!");

    }

    // build questions
    for (let index in props.currentSurvey.QuestionsAndAnswers) {
        singleQuestion = props.currentSurvey.QuestionsAndAnswers[index];
        if (singleQuestion.answers.length == 1) {
            // open question
            questions.push(<div><OpenQuestion singleQuestion={singleQuestion} responses={props.responses} setResponses={props.setResponses} index={index} /><br /></div>)
        } else if (singleQuestion.answers.length >= 2) {
            // closed question
            let elem = [];
            for (let i = 0; i < singleQuestion.answers.length; i++) {
                elem.push(0);
            }
            questions.push(<div><ClosedQuestion singleQuestion={singleQuestion} responses={props.responses} setResponses={props.setResponses} index={index} /><br /></div>)

        }
    }
    return (
        <React.Fragment>
            <Col sm={8} className="below-nav vheight-100">
                <Row>
                    <Col>
                        <h2>{props.currentSurvey.Title}</h2>
                    </Col>
                    <Col>
                        <Row><Badge pill variant={messageColor}>{props.errorMessageUsername}{props.validationMessage}</Badge></Row>
                        <Row><Badge pill variant={messageColor}>{props.errorMessageOpen}</Badge></Row>
                        <Row><Badge pill variant={messageColor}>{props.errorMessageClosed}</Badge></Row>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3">
                            <Row>
                                <Col sm="7">
                                    <Form.Control placeholder="Enter username..." onChange={(event) => (setUserName(event.target.value))} value={userName} />
                                </Col>
                                <Col>
                                    <Button className="btn btn-md" variant="outline-primary" onClick={checkFieldsAndSubmit}>SUBMIT</Button>
                                </Col>
                            </Row>
                        </Form.Group>
                    </Col>
                </Row>
                <ListGroup variant="flush">
                    {questions}
                </ListGroup>
            </Col>
        </React.Fragment>
    )
}

function ClosedQuestion(props) {
    let answerRowList = [];
    let answer;
    let optional;
    let multiple;

    const handleResponseClosed = answerIndex => (event) => {
        let a = [...props.responses];
        a[props.index][answerIndex] = !a[props.index][answerIndex];
        props.setResponses(a);
    }

    optional = props.singleQuestion.min;
    multiple = props.singleQuestion.max;

    // init response array
    let a = [...props.responses];
    if (a[props.index] == undefined) {
        a[props.index] = [];
        for (let i = 0; i < props.singleQuestion.answers.length; i++) {
            a[props.index].push(false);
        }
        props.setResponses(a)
    }


    // build answers for single question
    for (let index in props.singleQuestion.answers) {
        answer = props.singleQuestion.answers[index];
        // TODO: fix radio buttons (don't force single option and don't allow to deselect, for optional case)
        answerRowList.push(<ListGroup.Item ><Form.Check type={"checkbox"} label={answer} id={answer} onChange={handleResponseClosed(index)} checked={props.responses[props.index] == undefined ? false : props.responses[props.index][index]} /></ListGroup.Item>);
    }

    return (
        <ListGroup as="ul">
            <ListGroup.Item as="li" variant="secondary">
                <Row>
                    <Col>{props.singleQuestion.question}</Col>
                    <Col></Col>
                    <Col></Col>
                    <Col >
                        <Badge pill variant="info">min = {optional}</Badge>
                        <Badge pill variant="info">max = {multiple}</Badge>
                    </Col>
                </Row>
            </ListGroup.Item>
            <Form.Group >
                {answerRowList}
            </Form.Group>
        </ListGroup>
    );
}

function OpenQuestion(props) {
    let optional = "mandatory";

    const handleResponseOpen = (event) => {
        let a = [...props.responses];
        a[props.index] = event.target.value;
        props.setResponses(a);
    }

    if (props.singleQuestion.min == 0) {
        optional = "optional";
    }

    // init open response
    let a = [...props.responses];
    if (a[props.index] == undefined) {
        a[props.index] = "";
        props.setResponses(a);
    }

    return (
        <ListGroup as="ul">
            <ListGroup.Item as="li" variant="secondary">
                <Row>
                    <Col>{props.singleQuestion.question}</Col>
                    <Col></Col>
                    <Col></Col>
                    <Col >
                        <Badge pill variant="info">{optional}</Badge>
                    </Col>
                </Row>
            </ListGroup.Item>
            <ListGroup.Item as="li">
                <Form.Control as="textarea" rows={3} placeholder="Enter answer here..." onChange={handleResponseOpen} value={props.responses[props.index] == undefined ? "" : props.responses[props.index]} />
            </ListGroup.Item>
        </ListGroup>
    );
}

export default RightSide;