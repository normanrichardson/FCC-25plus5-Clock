
//The selctor component for the Break Length component 
//and the Session Length.
class Selector extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="selector">
        <div
          id={this.props.id_prefex + "-label"}
          className="none_select">
          {this.props.name}
        </div>
        <div className="selector_row">
          <div
            className="control selector_item"
            id={this.props.id_prefex + "-increment"}
            onClick={this.props.clickBackUp}>
            <i className="fa fa-arrow-up" aria-hidden="true"></i>
          </div>
          <div
            id={this.props.id_prefex + "-length"}
            className="none_select selector_item">
            {this.props.number / 60}
          </div>
          <div
            className="control selector_item"
            id={this.props.id_prefex + "-decrement"}
            onClick={this.props.clickBackDown}>
            <i className="fa fa-arrow-down" aria-hidden="true"></i>
          </div>
        </div>
      </div>
    )
  }
}

//The timer application
class Presentational extends React.Component {
  constructor(props) {
    super(props);
    //initial state
    this.state = {
      //the break timer length in sec
      break_length: 300,
      //the session timer length in sec
      session_length: 1500,
      //the mode 0: session timer and 1: break timer
      mode: 0,
      //labels for the active timer
      current_label: ["Session", "Break"],
      //timer values for when the timer is running in sec
      time_value: [1500, 300],
      //the id used to track the interval timer
      interval_id: null,
      //true if the timer is running
      run: false
    };
    this.handleIncrement = this.handleIncrement.bind(this);
    this.handleDecrement = this.handleDecrement.bind(this);
    this.updateCount = this.updateCount.bind(this);
    this.beginCountDown = this.beginCountDown.bind(this);
    this.stopCountDown = this.stopCountDown.bind(this);
    this.convertTimer = this.convertTimer.bind(this);
  }

  //handles the increment operation from the selector component
  handleIncrement(event) {
    //if the timer is running do nothing
    if (this.state.run) { return }
    //if it is the break selector
    if (event.currentTarget.id == "break-increment") {
      //check it is not over incrementing (based on spec 60min)
      if (this.state.break_length < 3600) {
        this.setState(state => ({
          //update the break length by 60sec
          break_length: state.break_length + 60,
          //update the time_value by 60sec
          time_value: [state.session_length, state.break_length + 60]
        }))
      }
    }
    //if it is the session selector
    else if (event.currentTarget.id == "session-increment") {
      //check it is not over incrementing (based on spec 60min)
      if (this.state.session_length < 3600) {
        this.setState(state => ({
          //update the session length by 60sec
          session_length: state.session_length + 60,
          //update the time_value by 60sec
          time_value: [state.session_length + 60, state.break_length]
        }))
      }
    }
  }

  //handles the decrement operation from the selector component
  handleDecrement(event) {
    //if the timer is running do nothing
    if (this.state.run) { return }
    //if it is the break selector
    if (event.currentTarget.id == "break-decrement") {
      //check it is not over decrementing (based on spec 1min)
      if (this.state.break_length > 60) {
        this.setState(state => ({
          //update the session length by 60sec
          break_length: state.break_length - 60,
          //update the time_value by 60sec
          time_value: [state.session_length, state.break_length - 60]
        }))
      }
    }
    //if it is the session selector
    else if (event.currentTarget.id == "session-decrement") {
      //check it is not over decrementing (based on spec 1min)
      if (this.state.session_length > 60) {
        this.setState(state => ({
          //update the session length by 60sec
          session_length: state.session_length - 60,
          //update the time_value by 60sec
          time_value: [state.session_length - 60, state.break_length]
        }))
      }
    }
  }

  //the callback for the setInterval that updates the state
  updateCount() {
    //if there is still time on the active mode
    if (this.state.time_value[this.state.mode] > 0) {
      this.setState(state => {
        //copy the state
        let new_state = Object.assign({}, state);
        //reduce the active timer by 1sec
        new_state.time_value[new_state.mode] = Math.round((new_state.time_value[new_state.mode] - 1));
        return new_state;
      })
    }
    else {
      //Its the end of the timer. Play audio
      document.getElementById("beep").play();
      //update the state
      //1. reset the time_value to the original value
      //2. change the mode to the new active mode
      this.setState(state => {
        let new_state = Object.assign({}, state);
        new_state.time_value = [state.session_length, state.break_length];
        new_state.mode = state.mode == 1 ? 0 : 1
        return new_state;
      })
    }
  }

  //begin the timer countdown
  beginCountDown(event) {
    //if the timer is not running
    if (!this.state.run) {
      //setup the setInterval and track the id
      this.setState(state => ({
        interval_id: setInterval(this.updateCount, 1000),
        run: true
      }));
    }
    else {
      //if the timer is running clear the setInterval
      clearInterval(this.state.interval_id)
      this.setState(state => ({
        run: false
      }));
    }
  }

  //stop the countdown
  stopCountDown(event) {
    //if the timer is running clear the setInterval
    clearInterval(this.state.interval_id)
    //by spec stop and rewind the rewind the audio
    let audio = document.getElementById("beep")
    audio.pause();
    audio.currentTime = 0;
    //set the modes timer values back to original values
    this.setState(state => ({
      break_length: 300,
      session_length: 1500,
      mode: 0,
      current_label: ["Session", "Break"],
      time_value: [1500, 300],
      interval_id: null,
      run: false
    }))
  }

  //converts the timer value in seconds to mm:ss
  convertTimer() {
    let min = Math.floor(this.state.time_value[this.state.mode] / 60);
    let sec = this.state.time_value[this.state.mode] % 60
    return (min < 10 ? "0" : "") + min.toString() + ":" + (sec < 10 ? "0" : "") + sec.toString();
  }

  render() {
    return (
      <div id="timer_container">
        <div id="controls">
          <Selector name="Break Length" id_prefex="break" number={this.state.break_length} clickBackUp={this.handleIncrement} clickBackDown={this.handleDecrement} />
          <Selector name="Session Length" id_prefex="session" number={this.state.session_length} clickBackUp={this.handleIncrement} clickBackDown={this.handleDecrement} />
        </div>

        <div id="timer">
          <div
            id="timer-label"
            className="none_select">
            {this.state.current_label[this.state.mode]}
          </div>
          <div
            id="time-left"
            className="none_select">
            {
              this.convertTimer()
            }
          </div>
          <div id="timer_controls">
            <div
              id="start_stop"
              onClick={this.beginCountDown}
              className="control">
              <i className={this.state.run ? "fa fa-pause" : "fa fa-play"}
                aria-hidden="true"></i>
            </div>
            <div
              id="reset"
              onClick={this.stopCountDown}
              className="control">
              <i className="fa fa-stop" aria-hidden="true"></i>
            </div>
          </div>
        </div>
        {/*audio clip that is played when the timer reaches 00:00*/}
        <audio id="beep" preload="auto" src="121800__boss-music__gong.wav"></audio>
      </div>
    )
  }
}

//Render to app to the root element
ReactDOM.render(<Presentational />, document.getElementById('root'))