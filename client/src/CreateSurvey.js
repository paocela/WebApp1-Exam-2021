import { ListGroup } from 'react-bootstrap'
import './App.css';
import './LeftSide.css';
import { Col, Row, Button, Form, Badge } from "react-bootstrap"
import { Link } from 'react-router-dom';
import { useState } from 'react';
import React from 'react';
import { arrowUp, arrowDown, deleteIcon } from './Icons.js'

/*
questions: [
      {
        question: "How are you?",
        answers: ["Good", "Tired", "Bored"],
        numAnswers: 3,
        min: 0,
        max: -1,
        responses: [
          {
            response: [0, 1, 0]
          },
          {
            response: [1, 0, 0]
          },
          {
            response: [0, 0, 1]
          },
        ]
      },
      {
        question: "Describe your day?",
        answers: ["I've been programming a web app all day!"],
        min: 0,
        max: -1,
        responses: [
          {
            response: ["nothing to do"]
          },
          {
            response: ["study all day"]
          },
          {
            response: ["crazy"]
          },
        ]
      }
    ]
*/


function CreateSurvey(props) {
    // global use states needed througout the whole page
    let [questionList, setQuestionList] = useState([]);
    let [numberAnswers, setNumberAnswers] = useState(""); // number answers of a question
    let [minClosed, setMinClosed] = useState(""); // set if optional or mandatory
    let [maxClosed, setMaxClosed] = useState(""); // set if single response or multiple possible
    let [optionalOpen, setOptionalOpen] = useState(""); // set if optional or mandatory

    let [surveyTitle, setSurveyTitle] = useState("");





    return (
        <React.Fragment>
            <CreateLeftSide setQuestionList={setQuestionList} setOptionalOpen={setOptionalOpen} optionalOpen={optionalOpen} setMinClosed={setMinClosed} minClosed={minClosed} setNumberAnswers={setNumberAnswers} numberAnswers={numberAnswers} setMaxClosed={setMaxClosed} maxClosed={maxClosed} />
            <CreateRightSide questionList={questionList} setQuestionList={setQuestionList} setSurveyTitle={setSurveyTitle} surveyTitle={surveyTitle} />
        </React.Fragment>
    );
}

function CreateRightSide(props) {
    let questions = [];
    let singleQuestion;

    let handleSurveyTitle = (event) => (props.setSurveyTitle(event.target.value));

    let swapQuestions = (verse, index) => {
        let temp;
        let list;
        list = [...props.questionList];
        index = parseInt(index);


        // swap with above
        if (verse == 0) {
            if (index - 1 < 0) {
                return;
            } else {
                temp = list[index - 1];
                list[index - 1] = list[index];
                list[index] = temp;
                props.setQuestionList(list);
            }
        } else {
            // swap with below
            if (index + 1 >= props.questionList.length) {
                return;
            } else {
                temp = list[index + 1];
                list[index + 1] = list[index];
                list[index] = temp;
                props.setQuestionList(list);
            }
        }
    }

    let deleteQuestion = (index) => {
        let list;
        list = [...props.questionList];

        // remove 1 element/s starting from index element
        list.splice(index, 1);
        props.setQuestionList(list);
    }

    // TODO center words / style title

    // build questions
    for (let index in props.questionList) {
        singleQuestion = props.questionList[index];
        if (singleQuestion.max == -1) {
            // open question
            questions.push(<div>
                <Row>
                    <Col sm={11}>
                        <OpenQuestion singleQuestion={singleQuestion} setQuestionList={props.setQuestionList} questionList={props.questionList} index={index} /><br />
                    </Col>
                    <Col sm={1}>
                        <Row>
                            <Button className="btn btn-md switch-user-left" variant="outline-primary" onClick={() => { swapQuestions(0, index) }}>{arrowUp}</Button>
                        </Row>
                        <Row>
                            <Button className="btn btn-md switch-user-left" variant="outline-primary" onClick={() => { swapQuestions(1, index) }}>{arrowDown}</Button>
                        </Row>
                        <Row>
                            <Button className="btn btn-md switch-user-left" variant="outline-danger" onClick={() => { deleteQuestion(index) }}>{deleteIcon}</Button>
                        </Row>
                        <br/>
                    </Col>
                </Row>
            </div>)
        } else {
            // closed question
            questions.push(<div>
                <Row>
                    <Col sm={11}>
                        <ClosedQuestion singleQuestion={singleQuestion} setQuestionList={props.setQuestionList} questionList={props.questionList} index={index} /><br />
                    </Col>
                    <Col sm={1}>
                        <Row>
                            <Button className="btn btn-md switch-user-left" variant="outline-primary" onClick={() => { swapQuestions(0, index) }}>{arrowUp}</Button>
                        </Row>
                        <Row>
                            <Button className="btn btn-md switch-user-left" variant="outline-primary" onClick={() => { swapQuestions(1, index) }}>{arrowDown}</Button>
                        </Row>
                        <Row>
                            <Button className="btn btn-md switch-user-left" variant="outline-danger" onClick={() => { deleteQuestion(index) }}>{deleteIcon}</Button>
                        </Row>
                    </Col>
                    
                </Row>
            </div>)
        }
    }
    // Form.Group "Enter username here..." textbox: position to the rigth of the container
    return (
        <React.Fragment>
            <Col sm={8} className="below-nav vheight-100">
                <Row>
                    <Col sm={9}>
                        <Row>
                            <Col className="form-element" sm={3} className="form-element">
                                <h3>
                                    Survey Title
                                </h3>
                            </Col>
                            <Col sm={8}><Form.Control onChange={handleSurveyTitle} value={props.surveyTitle} size="md" placeholder="..." /></Col>
                            <Col sm={1}></Col>
                        </Row>
                    </Col>
                    <Col sm={3}>
                        <Form.Group className="mb-3">
                            <Button className="btn btn-new-survey btn-md btn-block" variant="outline-primary" onClick={() => { }}>SUBMIT</Button>
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
    let singleQuestion;

    let handleQuestionAnswers = i => (event) => {
        let temp = [...props.questionList];
        temp[props.index].answers[i] = event.target.value;
        props.setQuestionList(temp);
    }

    const handleQuestionTitle = (event) => {
        let temp = [...props.questionList];
        temp[props.index].question = event.target.value;
        props.setQuestionList(temp);
    }

    for (let i = 0; i < props.singleQuestion.numberAnswers; i++) {
        answerRowList.push(<ListGroup.Item as="li">
            <Row>
                <Col className="form-element" sm={2}>Answer {i}:</Col>
                <Col sm={10}>
                    <Form.Control size="md" onChange={handleQuestionAnswers(i)} value={props.singleQuestion.answers[i]} placeholder="..." />
                </Col>
            </Row>
        </ListGroup.Item>);
    }

    return (
        <ListGroup as="ul">
            <ListGroup.Item as="li" variant="secondary">
                <Row>
                    <Col className="form-element" sm={2}>Question {props.index}:</Col>
                    <Col sm={10}>
                        <Form.Control size="md" onChange={handleQuestionTitle} value={props.singleQuestion.question} placeholder="..." />
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

    const handleQuestionTitle = (event) => {
        let temp = [...props.questionList];
        temp[props.index].question = event.target.value;
        props.setQuestionList(temp);
    }

    if (props.singleQuestion.min == 0) {
        optional = "optional";
    }

    return (
        <ListGroup as="ul">
            <ListGroup.Item as="li" variant="secondary">
                <Row>
                    <Col sm={2}>Question {props.index}:</Col>
                    <Col sm={10}>
                        <Form.Control onChange={handleQuestionTitle} value={props.singleQuestion.question} size="md" placeholder="..." />
                    </Col>
                </Row>
            </ListGroup.Item>
        </ListGroup>
    );
}


function CreateLeftSide(props) {
    let [errorMessageClosed, setErrorMessageClosed] = useState("");
    let [errorMessageOpen, setErrorMessageOpen] = useState("");

    // labda-functions to handle dynamically value changes in input form
    const handleNumberAnswers = (event) => { props.setNumberAnswers(event.target.value) };
    const handleMinClosed = (event) => { props.setMinClosed(event.target.value) };
    const handleMaxClosed = (event) => { props.setMaxClosed(event.target.value) };
    const handleOptionalOpen = (event) => { props.setOptionalOpen(event.target.value) };

    // control input fields from wrong input values (sanity checks)
    let checkCreateFields = (questionType) => {


        // insert new question
        let optional, multiple;

        // closed question --> questionType = 0
        if (questionType == 0) {

            // TODO check input and display error with message
            if (props.minClosed == "" || props.maxClosed == "" || props.numberAnswers == "") {
                setErrorMessageClosed("Input cannot be NULL");
                return;
            }

            if (props.minClosed > props.maxClosed) {
                setErrorMessageClosed("MIN must be <= then MAX");
                return;
            }
            if (props.maxClosed > props.numberAnswers) {
                setErrorMessageClosed("MAX must be <= then number of questions");
                return;
            }

            setErrorMessageClosed();

            let question = {
                question: "",
                answers: [],
                numberAnswers: props.numberAnswers,
                min: props.minClosed,
                max: props.maxClosed,
                responses: []
            };

            // initialize answers to avoid problems in inserting 3rd answer before 1st
            for(let i = 0; i < question.numberAnswers; i++) {
                question.answers.push("");
            }

            props.setQuestionList((l) => ([...l, question]));

        } else {

            // TODO check input and display error with message
            if (props.optionalOpen == "") {
                setErrorMessageOpen("Input cannot be NULL");
                return;
            }

            setErrorMessageOpen();

            if (props.OptionalClosed == "optional") {
                optional = 0;
            } else {
                optional = 1;
            }

            let question = {
                question: "",
                answers: [],
                numberAnswers: props.numberAnswers,
                min: optional,
                max: -1,
                responses: []
            };

            props.setQuestionList((l) => ([...l, question]));
        }

        // open question --> questionType = 1;
    };

    return (
        <Col sm={3} className="  d-sm-block below-nav vheight-100 leftDiv" >
            <h4 class="leftSide-title">Actions</h4>
            <ListGroup variant="flush" className="trans">
                <ListGroup.Item active >
                    Closed question
                </ListGroup.Item>
                <ListGroup.Item>
                    <Form>
                        <Row>
                            <Col className="form-element">Number of answers: </Col>
                            <Col><Form.Control type='number' min={1} max={10} onChange={handleNumberAnswers} size="sm" placeholder="..." /></Col>
                        </Row>
                    </Form>
                </ListGroup.Item>
                <ListGroup.Item>
                    <Form>
                        <Row>
                            <Col className="form-element">Constrain MIN: </Col>
                            <Col><Form.Control type='number' min={0} max={10} onChange={handleMinClosed} size="sm" placeholder="..." /></Col>
                        </Row>
                    </Form>
                </ListGroup.Item>
                <ListGroup.Item>
                    <Form>
                        <Row>
                            <Col className="form-element">Constrain MAX: </Col>
                            <Col><Form.Control type='number' min={1} max={10} onChange={handleMaxClosed} size="sm" placeholder="..." /></Col>
                        </Row>
                    </Form>
                </ListGroup.Item>
                <ListGroup.Item>
                    <Button className="btn btn-new-survey btn-md btn-block" variant="outline-primary" onClick={() => { checkCreateFields(0) }}>CREATE QUESTION</Button>
                </ListGroup.Item>
                <ListGroup.Item>
                    <Badge variant="danger">{errorMessageClosed}</Badge>
                </ListGroup.Item>

                <ListGroup.Item active >
                    Open question
                </ListGroup.Item>
                <ListGroup.Item>
                    <Form.Group as={Row} className="mb-3">
                        <Row>
                            <Col className="form-element">Constraints (min):</Col>
                            <Col>
                                <Form.Check
                                    onChange={handleOptionalOpen}
                                    type="radio"
                                    label="optional"
                                    name="constraints"
                                    id="formHorizontalRadios1"
                                    value="optional"
                                />
                                <Form.Check
                                    onChange={handleOptionalOpen}
                                    type="radio"
                                    label="mandatory"
                                    name="constraints"
                                    id="formHorizontalRadios2"
                                    value="mandatory"
                                />
                            </Col>
                        </Row>
                    </Form.Group>
                </ListGroup.Item>
                <ListGroup.Item>
                    <Button className="btn btn-new-survey btn-md btn-block" variant="outline-primary" onClick={() => { checkCreateFields(1) }}>CREATE QUESTION</Button>
                </ListGroup.Item>
                <ListGroup.Item>
                    <Badge variant="danger">{errorMessageOpen}</Badge>
                </ListGroup.Item>
            </ListGroup>
        </Col>
    );
}

export default CreateSurvey;