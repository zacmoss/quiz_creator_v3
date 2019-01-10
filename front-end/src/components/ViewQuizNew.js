import React from 'react';
import '../style.css';
import axios from 'axios';
import Header from './Header';
import EditQuestionComponent from './EditQuestionComponent';
import { Link } from 'react-router-dom';




/* Discussion

The new renderSwitch function outputs a conditional render for three scenarios

If mode is "edit", "scores", or default

Default just shows the quiz
Edit is if user clicked edit from default
Scores is if user clicked scores from default

We always have access to the particular quizId stored in state and use that
when transitioning to edit to grab a particular question in the quizObject that
was sent on the server call on ComponentWillMount(). We also use the quizObject
when grabbing scores


To Do

Should simplify this by saving scoresRender when we getQuestions and just displaying
that render / just change mode state when we click scores

*/


class ViewQuizNew extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: "view",
            quizId: null,
            school: null,
            teacher: null,
            title: null,
            numberOfQuestions: null,
            questionsRender: [],
            questionPassed: null,
            numberPassed: null,
            scores: null,
            scoresRender: []
        }
        this.backClick = this.backClick.bind(this);
        this.seeScores = this.seeScores.bind(this);
    }

    componentWillMount() {
        this.getQuestions();
    }

    editQuestion(ele, number) {
        this.setState(() => ({ mode: "edit", questionPassed: ele, numberPassed: number }));
    }
    seeScores() {
        this.setState(() => ({ mode: "scores" }));
    }
    backClick() {
        if (this.state.mode === "view") {
            this.props.history.push('/dashboard');
        } else {
            this.getQuestions();
            this.setState(() => ({ mode: "view" }));
        }
    }
    getQuestions() {
        let quizId = this.props.location.search.slice(8);
        let self = this;
        let data = { "quizId": quizId };

        axios.post('/getQuizData', data).then(function(result) {
            let questionsRender = self.renderQuestions(result.data.quizObject.questionsArray);
            
            let scores = result.data.quizObject.studentsTaken;
            let scoresRender = [];
            let i = 0;
            for (i = 0; i < scores.length; i++) {
                let firstName = scores[i].firstName;
                let lastName = scores[i].lastName;
                let score = scores[i].score;
                scoresRender.push(
                    <div className="scores_list_item" key={i}>
                        <div className="scores_row1">{firstName}</div>
                        <div className="scores_row2">{lastName}</div>
                        <div className="scores_row3">{score}</div>
                    </div>
                )
            }

            self.setState(() => ({
                quizId: quizId,
                teacher: result.data.quizObject.teacher,
                school: result.data.quizObject.school,
                title: result.data.quizObject.title,
                numberOfQuestions: result.data.quizObject.numberOfQuestions,
                questionsRender: questionsRender,
                questionPassed: null,
                numberPassed: null,
                scores: result.data.quizObject.studentsTaken,
                scoresRender: scoresRender
            }));
        }).catch(function(err) {
            console.log(err);
        });
    }


    
    renderQuestions(questionsArray) {
        let self = this;
        let count = 0;
        let array = questionsArray;
        let questionsRender = array.map(function(ele) {
            count ++;
            let number = count;
            return (
                <div key={ele._id} className="question_container">
                    
                    <div className="question_top_row">
                        <p className="view_question">{number}. {ele.question}</p>
                        <p className="edit_button" onClick={() => self.editQuestion(ele, number)}>Edit</p>
                    </div>
                    
                    <div>
                        <div>a {ele.answerA}</div>
                        <div>b {ele.answerB}</div>
                        <div>c {ele.answerC}</div>
                        <div>d {ele.answerD}</div>
                    </div>
                    <div className="question_bottom_row">
                        <div>Correct Answer: {ele.correctAnswer}</div>
                    </div>
                    
                    
                </div>
            )
        })
        return questionsRender;
    }

    renderSwitch() {
        switch(this.state.mode) {
          case 'edit':
            return (
                <div className="form">
                    <div className="student_form_inputs_container">
                        <div>
                            <EditQuestionComponent mode={"edit"} quizId={this.state.quizId} number={this.state.numberPassed} object={this.state.questionPassed} backClick={this.backClick}/>
                        </div>
                    </div>
                </div>
            )
          case 'scores':
            return (
                <div>
                    <div className="quiz_list_header">
                        <div className="scores_row1">First Name</div>
                        <div className="scores_row2">Last Name</div>
                        <div className="scores_row3">Score</div>
                    </div>
                    {this.state.scoresRender}
                </div>
            )
          default:
            return (
                <div className="view_form">
                    <div className="view_quiz_form_inputs_container">
                        <div>
                            {this.state.questionsRender}
                        </div>
                    </div>
                </div>
            )
        }
    }

    render() {
        return (
            <div>
                <Header />
            
                {/*<div className="view_quiz_page_container">*/}
                <div className="dashboard_container">
                    <div className="teacher_dashboard"> 
                        <div className="view_quiz_top_row">
                            {this.state.mode == "view" ? <Link className="td_link" to="/dashboard"><button className="back_button">&#8592; Back to Dashboard</button></Link> : <button className="back_button" onClick={this.backClick}>&#8592; Back</button>}
                            {this.state.mode == "view" ? <button className="scores_button" onClick={this.seeScores}>See Scores</button> : null}
                        </div>
                        
                        {/*<div className="view_quiz_2">*/}
                        <div className="my_quizzes_container">
                            {/*<div className="view_quiz_form_container">*/}
                            {this.state.title !== null && <h2>{this.state.title}</h2>}
                            {/*this.state.mode == "edit" ? null : <h2>{this.state.title}</h2>*/}
                            {/*this.state.teacher !== null && <div className="teacher_text"><p>Teacher - {this.state.teacher}</p></div>*/}
                            <div className="quiz_list">
                                
                                
                                {this.renderSwitch()}
                                {/*this.state.mode === "edit" ?
                                    <div className="form">
                                        <div className="student_form_inputs_container">
                                            <div>
                                                <EditQuestionComponent mode={"edit"} quizId={this.state.quizId} number={this.state.numberPassed} object={this.state.questionPassed} backClick={this.backClick}/>
                                            </div>
                                        </div>
                                    </div>
                                :
                                    <div className="view_form">
                                        <div className="view_quiz_form_inputs_container">
                                            <div>
                                                {this.state.questionsRender}
                                            </div>
                                        </div>
                                    </div>
                                
                                */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )

    }
}

export default ViewQuizNew;