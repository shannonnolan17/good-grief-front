import React, { Component } from 'react';
import Question from './Question';
import Quiz from './Quiz';
import AcceptanceResults from './AcceptanceResults';
import QuestionCount from './QuestionCount';
import AnswerOption from './AnswerOption';
import acceptanceQuestions from '../api/acceptanceQuestions';
import update from 'react-addons-update';


class AcceptanceQuiz extends Component {

  constructor(props) {
    super(props);

    this.state = {
     // currentUserId: props.currentUser && props.currentUser.id,
     // currentStageId: props.currentUser && props.currentUser.stage_id
     counter: 0,
     questionId: 1,
     question: '',
     answerOptions: [],
     answer: '',
     answersCount: {
       'Acceptance': 0,
       'None': 0
     },
     result: ''
    };

    this.handleAnswerSelected = this.handleAnswerSelected.bind(this);
  }

  componentWillMount() {
    //get information by import at top
    const shuffledAnswerOptions = acceptanceQuestions.map((question) => this.shuffleArray(question.answers));

    this.setState({
      question: acceptanceQuestions[0].question,
      answerOptions: shuffledAnswerOptions[0]
    });
  }

  shuffleArray(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  };

  handleAnswerSelected(event) {
    this.setUserAnswer(event.currentTarget.value);
    if (this.state.questionId < acceptanceQuestions.length) {
        setTimeout(() => this.setNextQuestion(), 300);
      } else {
        setTimeout(() => this.setResults(this.getResults()), 300);
      }
  }

  setUserAnswer(answer) {
    const updatedAnswersCount = update(this.state.answersCount, {
      [answer]: {$apply: (currentValue) => currentValue + 1}
    });
    this.setState({
      answersCount: updatedAnswersCount,
      answer: answer
    });
  }

  setNextQuestion() {
    const counter = this.state.counter + 1;
    const questionId = this.state.questionId + 1;
    this.setState({
      counter: counter,
      questionId: questionId,
      question: acceptanceQuestions[counter].question,
      answerOptions: acceptanceQuestions[counter].answers,
      answer: ''
    });
  }

  getResults() {
    const answersCount = this.state.answersCount;
    const answersCountKeys = Object.keys(answersCount);
    const answersCountValues = answersCountKeys.map((key) => answersCount[key]);
    const maxAnswerCount = Math.max.apply(null, answersCountValues);

    return answersCountKeys.filter((key) => answersCount[key] === maxAnswerCount);
  }

  setResults (result) {
    if (result.length === 1) {
      this.setState({ result: result[0] });
    } else {
      this.setState({ result: 'Undetermined' });
    }
  }

  renderQuiz() {
    return (
      <Quiz
        answer={this.state.answer}
        answerOptions={this.state.answerOptions}
        questionId={this.state.questionId}
        question={this.state.question}
        questionTotal={acceptanceQuestions.length}
        onAnswerSelected={this.handleAnswerSelected}
      />
    );
  }

  renderResult() {
    return (
      <AcceptanceResults 
        acceptanceQuizResult={this.state.result} 
        updateCurrentUser={this.props.updateCurrentUser} 
      />
    );
  }


  render() {
    return (
      <div className="App">
        {this.state.result ? this.renderResult() : this.renderQuiz()}
      </div>
    );
  }

  currentUserId(){
    return this.props.currentUser && this.props.currentUser.id
  }

  // currentStageId() {
  //   return this.props.currentUser && this.props.currentUser.stage_id
  // }
}

export default AcceptanceQuiz;
