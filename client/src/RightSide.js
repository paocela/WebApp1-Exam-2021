import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, ListGroup, Button, Badge } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import React from 'react';
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"

/*
  {
    title: "Mood",
    questions: [
      {
        question: "How are you?",
        answers: ["Good", "Tired", "Bored"],
        min: 0,
        max: -1
      },
      {
        question: "Describe your day?",
        answers: ["I've been programming a web app all day!"]
      }
    ]
  }
*/


function RightSide(props) {
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
                                <Col sm="7">
                                    <Form.Control placeholder="Enter username..." />
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
    let optional;
    let multiple;

    if (props.singleQuestion.max == 1) {
        // only single answer allowed --> radio button
        type = "radio";
    } else {
        // multiple answers allowed --> checkbox button
        type = "checkbox";
        multiple = "multiple answers allowed";
    }

    optional = props.singleQuestion.min;
    multiple = props.singleQuestion.max;

    // build answers for single question
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
                        <Badge pill variant="info">{optional}</Badge>
                    </Col>
                </Row>
            </ListGroup.Item>
            <ListGroup.Item as="li">
                <Form.Control as="textarea" rows={3} placeholder="Enter answer here..." />
            </ListGroup.Item>
        </ListGroup>
    );
}

export default RightSide;