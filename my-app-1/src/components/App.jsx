import React from 'react';
import '../index.css';
// import Button from './Button';
import IatRecorder from '../recorder';
import config from '../recorder/config';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recorder: new IatRecorder({
        onClose: (e) => {
          console.log('on close ' + JSON.stringify(e));
          this.setState({recordState: 'stopped'});
        },
        onError: (e) => {
          console.log('on error ' + JSON.stringify(e));
          this.setState({recordState: 'stopped'});
        },
        onMessage: (e) => {
          console.log('on message');
        },
        onStart: () => {
          console.log('on start');
        },
        appId: config.props['appId'],
        apiKey: config.props['apiKey'],
        apiSecret: config.props['apiSecret'],
        accent: config.props['accent'],
        language: config.props['language'],
        pd: config.props['pd'],
        rlang: config.props['rlang'],
        ptt: config.props['ptt'],
        nunum: config.props['nunum'],
        vad_eos: config.props['vad_eos']
      }),
      recordState: 'stopped'
    };
    this.buttonClick = this.buttonClick.bind(this);
    console.log('constructor called');
  }

  componentWillMount() {
    console.log('component will mount');
  }

  componentDidMount() {
    console.log('component did mount');
  }

  componentWillUnmount() {
    console.log('component will unmount');
  }

  startRecording() {
    console.log('start recording');
    this.setState({recordState: 'recording'});
    this.state.recorder.start();
  }

  stopRecording() {
    console.log('stop recording');
    this.setState({recordState: 'stopping'});
    this.state.recorder.stop();
  }

  buttonClick(e) {
    console.log('clicked');
    if (this.state.recordState === 'stopped') {
      this.startRecording();
    } else if (this.state.recordState === 'recording') {
      this.stopRecording();
    }
  }

  render() {
    return (
      <div>
          <button disabled={this.state.recordState === 'stopping '} type="button" className="button" onClick={this.buttonClick}>{this.state.recordState === 'stopped' ? 'Start' : 'Stop'} Recording</button>
          {/* <button id="stop" onClick={}>Stop</button> */}
      </div>
    );
  }
}

export default App;
