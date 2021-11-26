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
          const msg = JSON.parse(e.data);
          if (msg.data && msg.data.result) {
            var output = []
            for (var i = 0; i < msg.data.result.ws.length; i++) {
              output.push(msg.data.result.ws[i].cw[0].w)
            }
            var sentence = output.join("");
            console.log(sentence);
            this.setState({textToShow: this.state.textToShow + sentence});
          }
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
      recordState: 'stopped',
      textToShow: '',
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
      this.setState({textToShow: ''})
    } else if (this.state.recordState === 'recording') {
      this.stopRecording();
    }
  }

  render() {
    return (
      <div className='button'>
          <button type="button" className={this.state.recordState === 'stopped' ? 'buttonStart' : 'buttonStop'} onClick={this.buttonClick}>{this.state.recordState === 'stopped' ? 'Start' : 'Stop'} Recording</button>
          {/* <button id="stop" onClick={}>Stop</button> */}
          <p className='sentence'>{this.state.textToShow}</p>
      </div>
    );
  }
}

export default App;
