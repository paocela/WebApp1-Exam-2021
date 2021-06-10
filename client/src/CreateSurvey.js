import { ListGroup } from 'react-bootstrap'
import './App.css';
import './LeftSide.css';
import { Col, Row, Button, Form } from "react-bootstrap"
import { Link } from 'react-router-dom';
import { useState } from 'react';
import React from 'react';

/*
questions: [
      {
        question: "How are you?",
        answers: ["Good", "Tired", "Bored"],
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
    let [questionList, setQuestionList] = useState([]);
    let [optional, setOptional] = useState(false); // set if optional or mandatory
    let [numberAnswers, setNumberAnswers] = useState(-1); // number answers of a question
    let [multipleResponses, setMultipleResponses] = useState(false); // set if single response or multiple possible


    return (
        <>
            <Row>
                <CreateLeftSide  setOptional={setOptional} setNumberAnswers={setNumberAnswers} setMultipleResponses={setMultipleResponses}/>
                <CreateRightSide  />
            </Row>
        </>
    );
}

function CreateRightSide(props) {
    let questions = [];
    let singleQuestion;
    // build questions
    for (let index in props.currentSurvey.questions) {
        singleQuestion = props.currentSurvey.questions[index];
        if (singleQuestion.answers.length == 1) {
            // open question
            questions.push(<div><OpenQuestion singleQuestion={singleQuestion} /><br /></div>)
        } else if (singleQuestion.answers.length >= 2) {
            // closed question
            questions.push(<div><ClosedQuestion singleQuestion={singleQuestion} /><br /></div>)

        } else {
            // PANIC
        }
    }
    // Form.Group "Enter username here..." textbox: position to the rigth of the container
    return (
        <React.Fragment>
            <Col sm={8} className="below-nav vheight-100">
                <Row>
                    <Col>
                        <h2>{props.currentSurvey.title}</h2>
                    </Col>
                    <Col></Col>
                    <Col>
                        <Form.Group className="mb-3">
                            <Row>
                                <Col sm="8">
                                    <Form.Control placeholder="Enter username here..." />
                                </Col>
                                <Col>
                                    <Button className="btn btn-md" variant="outline-primary" onClick={() => { }}>SUBMIT</Button>
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
    let type = "";
    let optional = "mandatory";
    let multiple = "";

    if (props.singleQuestion.max == 1) {
        // only single answer allowed --> radio button
        type = "radio";
    } else {
        // multiple answers allowed --> checkbox button
        type = "checkbox";
        multiple = "multiple answers allowed";
    }

    if (props.singleQuestion.min == 0) {
        optional = "optional";
    }

    for (let index in props.singleQuestion.answers) {
        answer = props.singleQuestion.answers[index];
        // TODO: fix radio buttons (don't force single option and don't allow to deselect, for optional case)
        answerRowList.push(<ListGroup.Item as="li"><Form.Check type={type} label={answer} id={answer} /></ListGroup.Item>);
    }

    return (
        <ListGroup as="ul">
            <ListGroup.Item as="li" variant="secondary">
                <Row>
                    <Col>{props.singleQuestion.question}</Col>
                    <Col></Col>
                    <Col></Col>
                    <Col >
                        <span className="badge rounded-pill bg-info">{multiple}</span>
                        <span className="badge rounded-pill bg-info">{optional}</span>
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

    if (props.singleQuestion.min == 0) {
        optional = "optional";
    }

    return (
        <ListGroup as="ul">
            <ListGroup.Item as="li" variant="secondary">
                <Row>
                    <Col>{props.singleQuestion.question}</Col>
                    <Col></Col>
                    <Col></Col>
                    <Col >
                        <span className="badge rounded-pill bg-info">{optional}</span>
                    </Col>
                </Row>
            </ListGroup.Item>
            <ListGroup.Item as="li">
                <Form.Control as="textarea" rows={3} placeholder="Enter answer here..." />
            </ListGroup.Item>
        </ListGroup>
    );
}


function CreateLeftSide(props) {
    let [optional, setOptional] = useState(false); // set if optional or mandatory
    let [numberAnswers, setNumberAnswers] = useState(-1); // number answers of a question
    let [multipleResponses, setMultipleResponses] = useState(false); // set if single response or multiple possible


    let checkCreateFields = () => {

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
                            <Col><Form.Control size="sm" placeholder="..." /></Col>
                        </Row>
                    </Form>
                </ListGroup.Item>
                <ListGroup.Item>
                    <Form.Group as={Row} className="mb-3">
                        <Row>
                            <Col className="form-element">Constraints (min):</Col>
                            <Col>
                                <Form.Check
                                    type="radio"
                                    label="optional"
                                    name="constraintsClosed"
                                    id="formHorizontalRadios1"
                                />
                                <Form.Check
                                    type="radio"
                                    label="mandatory"
                                    name="constraintsClosed"
                                    id="formHorizontalRadios2"
                                />
                            </Col>
                        </Row>
                    </Form.Group>
                </ListGroup.Item>
                <ListGroup.Item>
                    <Form.Group as={Row} className="mb-3">
                        <Row>
                            <Col className="form-element">Number answers (max):</Col>
                            <Col>
                                <Form.Check
                                    type="radio"
                                    label="single"
                                    name="numAnswersClosed"
                                    id="formHorizontalRadios1"
                                />
                                <Form.Check
                                    type="radio"
                                    label="multiple"
                                    name="numAnswersClosed"
                                    id="formHorizontalRadios2"
                                />
                            </Col>
                        </Row>
                    </Form.Group>
                </ListGroup.Item>
                <ListGroup.Item>
                    <Button className="btn btn-new-survey btn-md btn-block" variant="outline-primary" onClick={() => { }}>CREATE QUESTION</Button>
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
                                    type="radio"
                                    label="optional"
                                    name="constraints"
                                    id="formHorizontalRadios1"
                                />
                                <Form.Check
                                    type="radio"
                                    label="mandatory"
                                    name="constraints"
                                    id="formHorizontalRadios2"
                                />
                            </Col>
                        </Row>
                    </Form.Group>
                </ListGroup.Item>
                <ListGroup.Item>
                    <Button className="btn btn-new-survey btn-md btn-block" variant="outline-primary" onClick={() => {checkCreateFields}}>CREATE QUESTION</Button>
                </ListGroup.Item>
            </ListGroup>
        </Col>
    );
}

export default CreateSurvey;