import { Form, ListGroup } from "react-bootstrap";
import React from 'react';
import Col from "react-bootstrap/Col"





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
    console.log(props.currentSurvey)
    // build questions
    for (let singleQuestion in props.currentSurvey.questions) {
        if (singleQuestion.answers.length == 1) {
            // open question
            questions.push(<OpenQuestion singleQuestion={singleQuestion} />)
        } else if (singleQuestion.answers.length >= 2) {
            // closed question
            questions.push(<ClosedQuestion singleQuestion={singleQuestion} />)

        } else {
            // PANIC
        }
    }

    return (
        <React.Fragment>
            <Col sm={8} className="below-nav vheight-100">
                <h1>{props.title}</h1>
                <ListGroup variant="flush">
                    {questions}
                </ListGroup>
            </Col>
        </React.Fragment>
    )
}

function ClosedQuestion(props) {
    let answerRowList = [];
    let type = "";
    for (let answer in props.singleQuestion.answers) {
        if (props.singleQuestion.max == 1) {
            // only single answer allowed --> radio button
            type = "radio";
        } else {
            // multiple answers allowed --> checkbox button
            type = "checkbox";
        }
        answerRowList.push(<ListGroup.Item as="li"><Form.Check type={type} label={answer} /></ListGroup.Item>);

    }
    return (
        <ListGroup as="ul">
            <ListGroup.Item as="li" active>
                {props.singleQuestion.question}
            </ListGroup.Item>
            {answerRowList}
        </ListGroup>
    );
}

function OpenQuestion(props) {
return (
    <Form>
        <Form.Group className="mb-3" controlId="question">
            <Form.Label>{props.question}</Form.Label>
            <Form.Control type="answer" placeholder="Enter answer here..." />
        </Form.Group>
    </Form>
    );
}

export default RightSide;