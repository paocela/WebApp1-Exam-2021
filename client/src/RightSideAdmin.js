import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, ListGroup, Badge } from "react-bootstrap";
import { switchUserRight, switchUserLeft } from './Icons.js'
import './RightSide.css';
import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import Button from "react-bootstrap/Button"

//<span class="badge badge-pill badge-primary">multiple answers allowedoptional</span>
//<span class="badge badge-pill badge-success">Add New Task</span>
//<span class="badge badge-pill badge-success">multiple answers allowedoptional</span>
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
    for (let index in props.currentSurvey.questions) {
        singleQuestion = props.currentSurvey.questions[index];
        if (singleQuestion.answers.length == 1) {
            // open question
            questions.push(<div><OpenQuestion singleQuestion={singleQuestion} indexCurrentUser={props.indexCurrentUser} /><br /></div>)
        } else if (singleQuestion.answers.length >= 2) {
            // closed question
            questions.push(<div><ClosedQuestion singleQuestion={singleQuestion} indexCurrentUser={props.indexCurrentUser} /><br /></div>)

        } else {
            // PANIC
        }
    }

    let calculateNextUser = (flag) => {
        if (flag == 0) {
            // decrement index
            if (props.indexCurrentUser - 1 < 0) {
                props.setIndexCurrentUser(props.currentSurvey.users.length - 1);
            } else {
                props.setIndexCurrentUser((i) => i - 1);
            }
        } else {
            // increment index
            if (props.indexCurrentUser + 1 >= props.currentSurvey.users.length) {
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
                    <Col><h2>{props.currentSurvey.title}</h2></Col>
                    <Col></Col>
                    <Col>
                        <Row>
                            <Col>
                                <Button className="btn btn-md switch-user-left" variant="outline-primary" onClick={() => { calculateNextUser(0) }}>{switchUserLeft}</Button>
                            </Col>
                            <Col>
                                <h3>
                                    <span className="badge rounded-pill bg-primary">User: {props.currentSurvey.users[props.indexCurrentUser]}</span>
                                </h3>
                            </Col>
                            <Col>
                                <Button className="btn btn-md switch-user-left" variant="outline-primary" onClick={() => { calculateNextUser(1) }}>{switchUserRight}</Button>
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
        answerRowList.push(<ListGroup.Item as="li">
            <Form.Check type={type} checked={props.singleQuestion.responses[props.indexCurrentUser].response[index]} label={answer} id={answer} />
        </ListGroup.Item>);
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

    console.log(props.singleQuestion.responses[props.indexCurrentUser].response[0])

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
                <Form.Control as="textarea" plaintext readOnly value={props.singleQuestion.responses[props.indexCurrentUser].response[0]} />
            </ListGroup.Item>
        </ListGroup>
    );
}

export default RightSideAdmin;