import React from 'react';
// import AdvicePost from './AdvicePost';
import axios from 'axios';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';

import PubNub from "pubnub";
import ReactHover from 'react-hover';

import AdvicePost from './AdvicePost';
import ChatHistory from './ChatHistory';
import PubNubService from "./PubNubService";
import fire from '../fire';

const optionsCursorTrueWithMargin = {
  followCursor: true,
  shiftX: -90,
  shiftY: -10
}

class Denial extends React.Component {
  constructor () {
    super()
    this.state = {
      // advicePosts : [],
      messages: [{ text:"" }],
      currentMessage: "",
      username: "",
      users:[]
    };

    this.pubnub = new PubNub({
      publishKey: 'pub-c-50b2965a-2ab4-407f-b560-217a00a43e81',
      subscribeKey: 'sub-c-eb8a716c-d9e3-11e7-9445-0e38ba8011c7',
      presenceTimeout: 30
    })
     //  init presence service
    this.service = new PubNubService({
      pubnub: this.pubnub,
      channel: 'denial-chat'
    })
      //  on users update, trigger screen refresh
    this.service.onUserChange((users) => this.setState({ users: users }))
    this.service.onMessage((evt) => {
      this.state.messages.push({
        text: evt.message.text,
        sender: evt.publisher
      })
      this.setState({
        messages: this.state.messages
      })
    })
    this.service.fetchHistory(10, (messages) => { this.setState({messages: messages}) })

    this.service.getSelfInfo((info) => {
      if (info.username) this.setState({username: info.username})
    })
  }

   componentWillMount(){
    if (this.state.messages.length <= 1) {
      const messages = []
      let messagesRef = fire.database().ref('messages').orderByKey().limitToLast(100);

      messagesRef.on('child_added', snapshot => {
        let message = { text: snapshot.val(), id: snapshot.key };
        messages.push(message)
        this.setState({messages: messages});
      })
    }
  }

    changedMessage() {
    this.setState({ currentMessage:this.refs.input.value })
  }

  sendMessage() {
    fire.database().ref('messages').push( this.refs.input.value );
    this.pubnub.publish({
      channel: 'denial-chat',
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



  // toggleAdvicePostFormState () {
  //   this.setState(prevState => ({
  //     advicePosts: !prevState.displayNewAdvicePostForm
  //   }))
  // }

  // componentDidMount () {
  //   axios.get('http://localhost:3001/api/advice_posts')
  //   .then(res => {
  //     const advicePosts = res.data.map((post) =>
  //       ({id: post.id, content: post.content}))
  //     this.setState({advicePosts})
  //   })
  // }

  render () {
    return (
      <div className='stage-container'>
        <span className='stage-name'>
          <h1>The DENIAL Stage</h1>
        </span>

        <h3 className='subheader'>Helpful Apps</h3>
        <div>
          <ul className='helpful-apps'>
            <li>
              <ReactHover
                options={optionsCursorTrueWithMargin}>
                <ReactHover.Trigger type='trigger'>
                  <img className='denial-image' width='250' height='115' src={require('../denial_images/blockYourEx.png')} />
                </ReactHover.Trigger>
                <ReactHover.Hover type='hover'>
                  <p className='app-details'><p className='app-name'>Block Your Ex</p> A Chrome and Firefox-based plugin that allows you to remove an ex’s Twitter, Facebook and blog from your view in one go.</p>
                </ReactHover.Hover>
              </ReactHover>
            </li>
            <li>
              <ReactHover
                options={optionsCursorTrueWithMargin}>
                <ReactHover.Trigger type='trigger'>
                  <img className='denial-image' width='250' height='100' src={require('../denial_images/killSwitch.png')} />
                </ReactHover.Trigger>
                <ReactHover.Hover type='hover'>
                  <p className='app-details'><p className='app-name'>Killswitch</p> A mobile app that removes all traces of your ex from your Facebook by deleting pictures, videos, posts and status updates that tagged both of you.</p>
                </ReactHover.Hover>
              </ReactHover>
            </li>
            <li>
              <ReactHover
                options={optionsCursorTrueWithMargin}>
                <ReactHover.Trigger type='trigger'>
                  <img className='denial-image' width='250' height='100' src={require('../denial_images/massPasswordReset.png')} />
                </ReactHover.Trigger>
                <ReactHover.Hover type='hover'>
                  <p className='app-details'><p className='app-name'>Mass Password Reset</p> A Firefox extension that allows you to change the password for numerous shared accounts at once.</p>
                </ReactHover.Hover>
              </ReactHover>
            </li>
          </ul>
        </div>

        <hr />

        <h3 className='subheader'>Helpful Articles</h3>
        <div className='helpful-articles'>
          <ol className='ordered-list'>
            <li className='links'><span className='number'>1.</span><a href='https://www.psychologytoday.com/blog/me-we/201501/the-9-stages-grieving-breakup-no-2-denial' target='blank'>All About Denial</a></li>
            <li className='links'><span className='number'>2.</span><a href='https://pairedlife.com/breakups/Feelings-of-Denial-When-a-Relationship-Ends' target='blank'>Feelings of Denial When a Relationship Ends</a></li>
            <li className='links'><span className='number'>3.</span><a href='https://datingtips.match.com/over-denial-breakup-42642.html' target='blank'>How to Get Over Denial About a Breakup</a></li>
          </ol>
        </div>

        {/* <div className='advice-posts'>
          <h3>Helpful Advice</h3>
          <ul>
            {this.state.advicePosts.map(key =>
              <AdvicePost id={key.id} content={key.content} />
            )}
          </ul>
        </div> */}

        <p className='move-on-sentence'> Ready to Move on to Anger? Take the
        <Link className='quiz-link' to="/denial_quiz"> DENIAL QUIZ </Link>
        to see if you are ready.
        </p>

        <hr />


        <h3 className='subheader'>Denial Chat Room</h3>
        <div className="vbox fill">
         <div className='scroll grow'>
            <ChatHistory messages={this.state.messages} service={this.service} />
          </div>
          <div className='hbox'>
            <input className='username-field' placeholder='enter username' type='text' ref='username' value={this.state.username}
              onChange={this.changedUsername.bind(this)}
                    />
            <button className='set-button' onClick={this.setUsername.bind(this)}>set username</button>
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

export default Denial
