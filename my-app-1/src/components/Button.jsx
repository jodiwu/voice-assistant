import React from 'react';
import '../index.css';

function Button() {
    function buttonClick(e) {
        const downloadLink = document.getElementById('download');
        const stopButton = document.getElementById('stop');

        const handleSuccess = function(stream) {
            const options = {mimeType: 'audio/webm'};
            const recordedChunks = [];
            const mediaRecorder = new MediaRecorder(stream, options);

            mediaRecorder.addEventListener('dataavailable', function(e) {
                if (e.data.size > 0) recordedChunks.push(e.data);
            });

            mediaRecorder.addEventListener('stop', function() {
                downloadLink.href = URL.createObjectURL(new Blob(recordedChunks));
                downloadLink.download = 'acetest.wav';
            });

            stopButton.addEventListener('click', function() {
                mediaRecorder.stop();
            });

            mediaRecorder.start();
        };

        navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(handleSuccess);
    }

    

    return (
        <div>
            <a id="download">Download</a>
            <button id="stop">Stop</button>
            <button type="button" className="button" onClick={buttonClick}>Click here</button>
        </div>
    );
}

export default Button;