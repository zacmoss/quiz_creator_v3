import React from 'react';
import '../style.css';
import axios from 'axios';
import Header from './Header';
import EditQuestionComponent from './EditQuestionComponent';
import { Link } from 'react-router-dom';



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
            numberPassed: null
        }
        this.backClick = this.backClick.bind(this);
    }

    componentWillMount() {
        this.getQuestions();
    }

    editQuestion(ele, number) {
        this.setState(() => ({ mode: "edit", questionPassed: ele, numberPassed: number }));
        
    }
    backClick() {
        //e.preventDefault();
        // need to re-render questions here
        if (this.state.mode === "view") {
            this.props.history.push('/dashboard');
        } else {
            this.getQuestions(); // contains a synchronous function so this lags....
            // could put the mode state change inside the above function to not change view until updated
            this.setState(() => ({ mode: "view" }));
        }
    }
    getQuestions() {
        let quizId = this.props.location.search.slice(8);
        let self = this;
        let data = { "quizId": quizId };
        axios.post('/getQuizData', data).then(function(result) {
            let questionsRender = self.renderQuestions(result.data.quizObject.questionsArray);
            self.setState(() => ({
                quizId: quizId,
                teacher: result.data.quizObject.teacher,
                school: result.data.quizObject.school,
                title: result.data.quizObject.title,
                numberOfQuestions: result.data.quizObject.numberOfQuestions,
                questionsRender: questionsRender,
                questionPassed: null,
                numberPassed: null
            }));
        }).catch(function(err) {
            console.log(err);
        });
    }


    
    renderQuestions(questionsArray) {
        let self = this;
        let number = 0;
        let array = questionsArray;
        let questionsRender = array.map(function(ele) {
            number ++;
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

    render() {
        return (
            <div>
                <Header />
            
                <div className="view_quiz_page_container">
                    <div>
                        <div className="view_quiz_top_row">
                            <Link to="/dashboard"><button className="back_button">&#8592; Back to Dashboard</button></Link>
                            <button className="scores_button">See Scores</button>
                        </div>
                        <div className="view_quiz_2">
                            <div className="view_quiz_form_container">
                                {this.state.title !== null && <h2>{this.state.title}</h2>}
                                {this.state.teacher !== null && <div className="center"><p>Teacher - {this.state.teacher}</p></div>}
                                {this.state.mode === "edit" ?
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
                                
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )

    }
}

export default ViewQuizNew;