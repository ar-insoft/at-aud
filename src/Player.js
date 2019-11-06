import React, { Component } from 'react'

class Player extends Component {

    onTimeUpdate = () => {
        const tracktime = document.getElementById('tracktime')
        const audio = document.getElementById('track')
        tracktime.innerHTML = (audio.currentTime) + ' / ' + Math.floor(audio.duration);
    }

    volumeUpDown = (value) => {
        const audio = document.getElementById('track')
        audio.volume += value

    }

    addPart = () => {
        const parts = document.getElementById('parts')
        const audio = document.getElementById('track')
        parts.value += 'abc'
   }

    render() {
        //const src = "http://upload.wikimedia.org/wikipedia/commons/a/a9/Tromboon-sample.ogg"
        const src = "/data/ep06.mp3"
        return (
            <div>
                <audio id="track" src={src}
                    onTimeUpdate={this.onTimeUpdate}>
                    <p>Your browser does not support the audio element</p>
                </audio>
                <span id="tracktime">0 / 0</span>
                <button onClick={() => document.getElementById('track').play()}>Play</button>
                <button onClick={() => document.getElementById('track').pause()}>Pause</button>
                <button onclick={() => this.volumeUpDown(0.1)}>Vol+ </button>
                <button onclick={() => this.volumeUpDown(-0.1)}>Vol- </button>
                <div>
                    <textarea name="parts" id="parts" cols={40} rows={10}></textarea>
                    <button onClick={() => this.addPart()}>Add </button>
                </div>
            </div>
        )
    }
}

export default Player