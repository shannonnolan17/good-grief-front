import React from 'react';
import axios from 'axios';
// import AdvicePost from './AdvicePost';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';

import PubNub from "pubnub";
import ReactHover from 'react-hover';

import ChatHistory from './ChatHistory';
import PubNubService from "./PubNubService";
import fire from '../fire';

const optionsCursorTrueWithMargin = {
  followCursor: true,
  shiftX: -90,
  shiftY: -10
}

class Bargaining extends React.Component {
  constructor() {
    super();
    this.state = {
     // advicePosts : [],
     bargainingMessages: [{ text:"" }],
     currentMessage: "",
     username:"",
     users:[]
    }

  this.pubnub = new PubNub({
      publishKey: 'pub-c-50b2965a-2ab4-407f-b560-217a00a43e81',
      subscribeKey: 'sub-c-eb8a716c-d9e3-11e7-9445-0e38ba8011c7',
      presenceTimeout: 30
    })
     //  init presence service
    this.service = new PubNubService({
      pubnub: this.pubnub,
      channel: 'bargaining-chat'
    })
      //  on users update, trigger screen refresh
    this.service.onUserChange((users) => this.setState({ users: users }))
    this.service.onMessage((evt) => {
      this.state.bargainingMessages.push({
        text: evt.message.text,
        sender: evt.publisher
      })
      this.setState({
        bargainingMessages: this.state.bargainingMessages
      })
    })
    this.service.fetchHistory(10, (messages) => { this.setState({bargainingMessages: messages}) })

    this.service.getSelfInfo((info) => {
      if (info.username) this.setState({username: info.username})
    })
  }

componentWillMount(){
    if (this.state.bargainingMessages.length <= 1) {
      const messages = []
      let messagesRef = fire.database().ref('bargainingMessages').orderByKey().limitToLast(100);

      messagesRef.on('child_added', snapshot => {
        let message = { text: snapshot.val(), id: snapshot.key };
        messages.push(message)
        this.setState({bargainingMessages: messages});
      })
    }
  }

    changedMessage() {
        this.setState({ currentMessage:this.refs.input.value })
    }

  changedMessage() {
    this.setState({ currentMessage:this.refs.input.value })
  }

  sendMessage() {
    fire.database().ref('bargainingMessages').push( this.refs.input.value );
    this.pubnub.publish({
      channel: 'bargaining-chat',
      message: {
        // text: this.refs.input.value,
        sender: this.pubnub.getUUID()

      }
    })
    this.setState({ currentMessage:"" })

    this.refs.input.value = '';
    }

  changedUsername () {
    this.setState({ username: this.refs.username.value })
  }

  setUsername () {
    this.service.setUserState({username: this.state.username})
  }

  renderUsers () {
    var users = this.state.users.map((user, i) => {
      return <span key={i}>{user.username}</span>
    })
    return <div className='user-list'>{users}</div>
  }



  // componentDidMount() {
  //   axios.get('http://localhost:3001/api/advice_posts')
  //   .then(res => {
  //     const advicePosts = res.data.map ( (post) =>
  //       ({id: post.id, content: post.content}))
  //     this.setState( {advicePosts})
  //   })
  // }

  render() {
    return(
      <div className="stage-container">
        <span className="stage-name">
          <h1>The BARGAINING Stage</h1>
        </span>

        <h3 className='subheader'>Helpful Apps</h3>
        <div>
          <ul className="helpful-apps">
            <li>
              <ReactHover
                options={optionsCursorTrueWithMargin}>
                <ReactHover.Trigger type='trigger'>
                  <img className="bargaining-image" width='185' height='185' src={require("../bargaining_images/drunkBlocker.png")} />
                </ReactHover.Trigger>
                <ReactHover.Hover type='hover'>
                  <p className='app-details'><p className='app-name'>DrunkDial</p> A mobile app that stops you from drunk dialing your ex by blocking calls to the numbers you selected in the app.</p>
                </ReactHover.Hover>
              </ReactHover>
            </li>
            <li>
              <ReactHover
                options={optionsCursorTrueWithMargin}>
                <ReactHover.Trigger type='trigger'>
                  <img className="bargaining-image" width='200' height='200' src={require("../bargaining_images/dontText.png")} />
                </ReactHover.Trigger>
                <ReactHover.Hover type='hover'>
                  <p className='app-details'><p className='app-name'>Don’t Text That Man!</p> An app that helps you control your urges to text your ex by providing motivational or wise quotes, as well as measures the time that has passed since you last texted your ex.</p>
                </ReactHover.Hover>
              </ReactHover>
            </li>
            <li>
              <ReactHover
              options={optionsCursorTrueWithMargin}>
                <ReactHover.Trigger type='trigger'>
                  <img className="bargaining-image" width='185' height='185' src={require("../bargaining_images/exLoverBlocker.png")} />
                </ReactHover.Trigger>
                <ReactHover.Hover type='hover'>
                  <p className='app-details'><p className='app-name'>Ex-Lover Blocker</p> A mobile app that sends a text message to your closest friends and posts a status update on Facebook when you try to call your ex.</p>
                </ReactHover.Hover>
              </ReactHover>
            </li>
          </ul>
        </div>

        <hr />

        <h3 className='subheader'>Helpful Articles</h3>
        <div className="helpful-articles">
          <ol className='ordered-list'>
            <li className='links'><span className='number'>1.</span><a href="https://www.psychologytoday.com/blog/me-we/201501/9-stages-grieving-breakup-no-3-desperate-answers" target='blank'>Desperate for Answers</a></li>
            <li className='links'><span className='number'>2.</span><a href="https://www.psychologytoday.com/blog/me-we/201501/9-stages-grieving-breakup-no-4-external-bargaining" target='blank'>External Bargaining</a></li>
            <li className='links'><span className='number'>3.</span><a href="https://www.psychologytoday.com/blog/me-we/201501/9-stages-grieving-breakup-no-5-internal-bargaining" target='blank'>Internal Bargaining</a></li>
          </ol>
        </div>
        {/* <div className='advice-posts'>
          <h3>Helpful Advice</h3>
          <ul>
            {this.state.advicePosts.map (key =>
              <AdvicePost id={key.id} content={key.content} />
            )}
          </ul>
        </div> */}

        <p className='move-on-sentence'> Ready to Move on to Depression? Take the
        <Link className='quiz-link' to="/bargaining_quiz"> BARGAINING QUIZ </Link>
        to see if you are ready.
        </p>

        <hr />

        <h3 className='subheader'>Bargaining Chat Room</h3>
        <div className="vbox fill">
     <div className='scroll grow'>
            <ChatHistory messages={this.state.bargainingMessages} service={this.service} />

          </div>
          <div className='hbox'>
            <input className='username-field' placeholder='enter username' type='text' ref='username' value={this.state.username}
              onChange={this.changedUsername.bind(this)}
                    />
            <button className='set-button' onClick={this.setUsername.bind(this)}>set</button>
          </div>
          <div className='hbox'>
            <input className='grow'
              ref='input'
              type='text'
              value={this.state.currentMessage}
              onChange={this.changedMessage.bind(this)}
                    />
            <button
              className='send-button'
              onClick={this.sendMessage.bind(this)}
                    >send</button>
          </div>
          <div className='hbox'>
            {this.renderUsers()}
          </div>
        </div>

      </div>
    )
  }
}

export default Bargaining;
