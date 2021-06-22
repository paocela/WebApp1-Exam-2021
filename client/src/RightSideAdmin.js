import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, ListGroup, Badge, OverlayTrigger, Tooltip } from "react-bootstrap";
import { switchUserRight, switchUserLeft } from './Icons.js'
import './RightSide.css';
import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import Button from "react-bootstrap/Button"

/* Survey Example Format
  {
    title: "Mood",
    users: ["paolo", "luca", "laura"],
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
    ],
  },
*/


function RightSideAdmin(props) {
    let questions = [];
    let singleQuestion;

    // build questions
    for (let index in props.currentSurvey.QuestionsAndAnswers) {
        singleQuestion = props.currentSurvey.QuestionsAndAnswers[index];
        if (singleQuestion.answers.length == 1 && singleQuestion.answers[0] == "") {
            // open question
            questions.push(<div><OpenQuestion singleQuestion={singleQuestion} indexCurrentUser={props.indexCurrentUser} /><br /></div>)
        } else if (singleQuestion.answers.length >= 2) {
            // closed question
            questions.push(<div><ClosedQuestion singleQuestion={singleQuestion} indexCurrentUser={props.indexCurrentUser} /><br /></div>)

        } else {
            // PANIC
        }
    }

    // function to allow moving between different users
    let calculateNextUser = (flag) => {
        if (flag == 0) {
            // decrement index - move left
            if (props.indexCurrentUser - 1 < 0) {
                props.setIndexCurrentUser(props.currentSurvey.Users.length - 1);
            } else {
                props.setIndexCurrentUser((i) => i - 1);
            }
        } else {
            // increment index - move right
            if (props.indexCurrentUser + 1 >= props.currentSurvey.Users.length) {
                props.setIndexCurrentUser(0);
            } else {
                props.setIndexCurrentUser((i) => i + 1);
            }
        }
    }

    // TODO Form.Group "Enter username here..." textbox: position to the rigth of the container
    return (
        <React.Fragment>
            <Col sm={8} className="below-nav vheight-100">
                <Row>
                    <Col><h2>{props.currentSurvey.Title}</h2></Col>
                    <Col></Col>
                    <Col>
                        <Row>
                            <Col>
                                <OverlayTrigger placement="left" overlay={<Tooltip id="tooltip-disabled">Previous!</Tooltip>}>
                                    <Button className="btn btn-md switch-user-left" variant="outline-primary" onClick={() => { calculateNextUser(0) }}>{switchUserLeft}</Button>
                                </OverlayTrigger>
                            </Col>
                            <Col>
                                <h4>
                                    <Badge pill variant="primary">User: {props.currentSurvey.Users[props.indexCurrentUser]}</Badge>
                                </h4>
                            </Col>
                            <Col>
                                <OverlayTrigger placement="right" overlay={<Tooltip id="tooltip-disabled">Next!</Tooltip>}>
                                    <Button className="btn btn-md switch-user-left form-inline" variant="outline-primary" onClick={() => { calculateNextUser(1) }}>{switchUserRight}</Button>
                                </OverlayTrigger>
                            </Col>
                        </Row>
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
    let optional = "mandatory";
    let multiple = "";

    optional = props.singleQuestion.min;
    multiple = props.singleQuestion.max;
    // build answers for single question
    for (let index in props.singleQuestion.answers) {
        answer = props.singleQuestion.answers[index];
        // TODO: fix radio buttons (don't force single option and don't allow to deselect, for optional case)
        answerRowList.push(<ListGroup.Item as="li">
            <Form.Check type={"checkbox"} checked={props.singleQuestion.responses[props.indexCurrentUser].response[index]} label={answer} id={answer} />
        </ListGroup.Item>);
    }

    return (
        <ListGroup as="ul">
            <ListGroup.Item as="li" variant="secondary">
                <Row>
                    <Col>{props.singleQuestion.question}</Col>
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
                <Form.Control as="textarea" plaintext readOnly value={props.singleQuestion.responses[props.indexCurrentUser].response == null ? "" : props.singleQuestion.responses[props.indexCurrentUser].response} />
            </ListGroup.Item>
        </ListGroup>
    );
}

export default RightSideAdmin;