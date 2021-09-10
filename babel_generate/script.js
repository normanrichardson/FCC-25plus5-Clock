var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//The selctor component for the Break Length component 
//and the Session Length.
var Selector = function (_React$Component) {
  _inherits(Selector, _React$Component);

  function Selector(props) {
    _classCallCheck(this, Selector);

    return _possibleConstructorReturn(this, (Selector.__proto__ || Object.getPrototypeOf(Selector)).call(this, props));
  }

  _createClass(Selector, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: "selector" },
        React.createElement(
          "div",
          {
            id: this.props.id_prefex + "-label",
            className: "none_select" },
          this.props.name
        ),
        React.createElement(
          "div",
          { className: "selector_row" },
          React.createElement(
            "div",
            {
              className: "control selector_item",
              id: this.props.id_prefex + "-increment",
              onClick: this.props.clickBackUp },
            React.createElement("i", { className: "fa fa-arrow-up", "aria-hidden": "true" })
          ),
          React.createElement(
            "div",
            {
              id: this.props.id_prefex + "-length",
              className: "none_select selector_item" },
            this.props.number / 60
          ),
          React.createElement(
            "div",
            {
              className: "control selector_item",
              id: this.props.id_prefex + "-decrement",
              onClick: this.props.clickBackDown },
            React.createElement("i", { className: "fa fa-arrow-down", "aria-hidden": "true" })
          )
        )
      );
    }
  }]);

  return Selector;
}(React.Component);

//The timer application


var Presentational = function (_React$Component2) {
  _inherits(Presentational, _React$Component2);

  function Presentational(props) {
    _classCallCheck(this, Presentational);

    //initial state
    var _this2 = _possibleConstructorReturn(this, (Presentational.__proto__ || Object.getPrototypeOf(Presentational)).call(this, props));

    _this2.state = {
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
    _this2.handleIncrement = _this2.handleIncrement.bind(_this2);
    _this2.handleDecrement = _this2.handleDecrement.bind(_this2);
    _this2.updateCount = _this2.updateCount.bind(_this2);
    _this2.beginCountDown = _this2.beginCountDown.bind(_this2);
    _this2.stopCountDown = _this2.stopCountDown.bind(_this2);
    _this2.convertTimer = _this2.convertTimer.bind(_this2);
    return _this2;
  }

  //handles the increment operation from the selector component


  _createClass(Presentational, [{
    key: "handleIncrement",
    value: function handleIncrement(event) {
      //if the timer is running do nothing
      if (this.state.run) {
        return;
      }
      //if it is the break selector
      if (event.currentTarget.id == "break-increment") {
        //check it is not over incrementing (based on spec 60min)
        if (this.state.break_length < 3600) {
          this.setState(function (state) {
            return {
              //update the break length by 60sec
              break_length: state.break_length + 60,
              //update the time_value by 60sec
              time_value: [state.session_length, state.break_length + 60]
            };
          });
        }
      }
      //if it is the session selector
      else if (event.currentTarget.id == "session-increment") {
          //check it is not over incrementing (based on spec 60min)
          if (this.state.session_length < 3600) {
            this.setState(function (state) {
              return {
                //update the session length by 60sec
                session_length: state.session_length + 60,
                //update the time_value by 60sec
                time_value: [state.session_length + 60, state.break_length]
              };
            });
          }
        }
    }

    //handles the decrement operation from the selector component

  }, {
    key: "handleDecrement",
    value: function handleDecrement(event) {
      //if the timer is running do nothing
      if (this.state.run) {
        return;
      }
      //if it is the break selector
      if (event.currentTarget.id == "break-decrement") {
        //check it is not over decrementing (based on spec 1min)
        if (this.state.break_length > 60) {
          this.setState(function (state) {
            return {
              //update the session length by 60sec
              break_length: state.break_length - 60,
              //update the time_value by 60sec
              time_value: [state.session_length, state.break_length - 60]
            };
          });
        }
      }
      //if it is the session selector
      else if (event.currentTarget.id == "session-decrement") {
          //check it is not over decrementing (based on spec 1min)
          if (this.state.session_length > 60) {
            this.setState(function (state) {
              return {
                //update the session length by 60sec
                session_length: state.session_length - 60,
                //update the time_value by 60sec
                time_value: [state.session_length - 60, state.break_length]
              };
            });
          }
        }
    }

    //the callback for the setInterval that updates the state

  }, {
    key: "updateCount",
    value: function updateCount() {
      //if there is still time on the active mode
      if (this.state.time_value[this.state.mode] > 0) {
        this.setState(function (state) {
          //copy the state
          var new_state = Object.assign({}, state);
          //reduce the active timer by 1sec
          new_state.time_value[new_state.mode] = Math.round(new_state.time_value[new_state.mode] - 1);
          return new_state;
        });
      } else {
        //Its the end of the timer. Play audio
        document.getElementById("beep").play();
        //update the state
        //1. reset the time_value to the original value
        //2. change the mode to the new active mode
        this.setState(function (state) {
          var new_state = Object.assign({}, state);
          new_state.time_value = [state.session_length, state.break_length];
          new_state.mode = state.mode == 1 ? 0 : 1;
          return new_state;
        });
      }
    }

    //begin the timer countdown

  }, {
    key: "beginCountDown",
    value: function beginCountDown(event) {
      var _this3 = this;

      //if the timer is not running
      if (!this.state.run) {
        //setup the setInterval and track the id
        this.setState(function (state) {
          return {
            interval_id: setInterval(_this3.updateCount, 1000),
            run: true
          };
        });
      } else {
        //if the timer is running clear the setInterval
        clearInterval(this.state.interval_id);
        this.setState(function (state) {
          return {
            run: false
          };
        });
      }
    }

    //stop the countdown

  }, {
    key: "stopCountDown",
    value: function stopCountDown(event) {
      //if the timer is running clear the setInterval
      clearInterval(this.state.interval_id);
      //by spec stop and rewind the rewind the audio
      var audio = document.getElementById("beep");
      audio.pause();
      audio.currentTime = 0;
      //set the modes timer values back to original values
      this.setState(function (state) {
        return {
          break_length: 300,
          session_length: 1500,
          mode: 0,
          current_label: ["Session", "Break"],
          time_value: [1500, 300],
          interval_id: null,
          run: false
        };
      });
    }

    //converts the timer value in seconds to mm:ss

  }, {
    key: "convertTimer",
    value: function convertTimer() {
      var min = Math.floor(this.state.time_value[this.state.mode] / 60);
      var sec = this.state.time_value[this.state.mode] % 60;
      return (min < 10 ? "0" : "") + min.toString() + ":" + (sec < 10 ? "0" : "") + sec.toString();
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { id: "timer_container" },
        React.createElement(
          "div",
          { id: "controls" },
          React.createElement(Selector, { name: "Break Length", id_prefex: "break", number: this.state.break_length, clickBackUp: this.handleIncrement, clickBackDown: this.handleDecrement }),
          React.createElement(Selector, { name: "Session Length", id_prefex: "session", number: this.state.session_length, clickBackUp: this.handleIncrement, clickBackDown: this.handleDecrement })
        ),
        React.createElement(
          "div",
          { id: "timer" },
          React.createElement(
            "div",
            {
              id: "timer-label",
              className: "none_select" },
            this.state.current_label[this.state.mode]
          ),
          React.createElement(
            "div",
            {
              id: "time-left",
              className: "none_select" },
            this.convertTimer()
          ),
          React.createElement(
            "div",
            { id: "timer_controls" },
            React.createElement(
              "div",
              {
                id: "start_stop",
                onClick: this.beginCountDown,
                className: "control" },
              React.createElement("i", { className: this.state.run ? "fa fa-pause" : "fa fa-play",
                "aria-hidden": "true" })
            ),
            React.createElement(
              "div",
              {
                id: "reset",
                onClick: this.stopCountDown,
                className: "control" },
              React.createElement("i", { className: "fa fa-stop", "aria-hidden": "true" })
            )
          )
        ),
        React.createElement("audio", { id: "beep", preload: "auto", src: "https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav" })
      );
    }
  }]);

  return Presentational;
}(React.Component);

//Render to app to the root element


ReactDOM.render(React.createElement(Presentational, null), document.getElementById('root'));