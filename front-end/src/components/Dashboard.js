import React from 'react';
import '../style.css';
import axios from 'axios';
import Header from './Header';
import { Link } from 'react-router-dom';



class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userType: null,
            quizzesArray: [],
            editQuizObject: null
        }
        //this.searchEvents = this.searchEvents.bind(this);
    }

    componentWillMount() {
        let self = this;
        axios.get('/getSignedInVar').then(function(x) { // if they're logged in
            if (x.data.signedIn) {
                axios.get('/getUserData').then(function(result) {
                    let type = result.data.type;
                    let array = result.data.array;
                    let renderArray = array.map(function(ele) {
                        return (
                            <div className="dashboard_quiz_list_item" key={ele._id} onClick={() => self.newClick(ele._id)}>{ele.title}</div>
                            );
                    });
                    
                    self.setState(() => ({ userType: type, quizzesArray: renderArray }));
                }).catch(function(err) {
                    console.log(err);
                })
            } else { // if not logged in push them to first page
                self.props.history.push('/');
            }
        }).catch(function(err) {
            console.log(err);
        })
        
    }

    
    newClick(quizId) {
        this.props.history.push('/viewQuizNew?quizId=' + quizId);
    }


    render() {
        return (
            <div>
                <div>
                    <Header />
                    <div className="dashboard_container">
                        <div className="teacher_dashboard">
                            <div className="link_container">
                                <Link className="td_link" to="/createQuizNew"><p className="td_button">Create Quiz</p></Link>
                            </div>
                            <div>
                                <h2>My Quizes</h2>
                                <div>
                                    {this.state.quizzesArray}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )

    }
    /* old render
    render() {
        return (
            <div>
                { this.state.userType === "student" ? 
                    <div>
                        <Header />
                        <div className="teacher_dashboard">
                            <div>
                                <h2>Student Dashboard</h2>
                                <div>
                                    <p>Quiz 1</p>
                                    <p>Quiz 2</p>
                                    <p>Quiz 3</p>
                                </div>
                            </div>
                        </div>
                    </div>
                :
                    <div>
                        <Header />
                        <div className="teacher_dashboard">
                            <Link className="td_link" to="/createQuizPage"><p className="td_button">Create Quiz</p></Link>
                            <div>
                                <h2>My Quizes</h2>
                                <div>
                                    {this.state.quizzesArray}
                                </div>
                            </div>
                        </div>
                    </div>
                }
                {this.state.editQuizObject !== null && <ViewQuiz object={this.state.editQuizObject} test="test" />}
            </div>
        )

    }*/
}

export default Dashboard;