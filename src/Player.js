import React, { Component } from 'react'
import { saveAs } from 'file-saver'

class Player extends Component {
    constructor (props) {
        super(props)
        
        this.state = {
            parts: [],
            lesson: [],
            stopPlayingPart: null,
        }
    }

    componentDidMount() {
        this.load()
    }

    async load() {
        const epNo = this.props.epNo
        const jsonName = '/data/ep' + epNo + '.json'
        const response = await fetch(jsonName);
        const myJson = await response.json();
        this.setState({lesson: myJson})
    }

    onTimeUpdate = () => {
        const audio = document.getElementById('track')
        const duration = audio.duration
        const currentTime = Math.round(audio.currentTime * 10) / 10;

        this.updateTrackTime(currentTime, duration)
        this.stopPlayingPart(currentTime)
    }
    updateTrackTime = (currentTime, duration) => {
        const tracktime = document.getElementById('tracktime')
        tracktime.innerHTML = (currentTime) + ' / ' + Math.floor(duration);
    }
    stopPlayingPart = (currentTime) => {
        const stopPlayingPart = this.state.stopPlayingPart
        if (stopPlayingPart && stopPlayingPart <= currentTime) {
            this.setState({ stopPlayingPart: null })
            document.getElementById('track').pause()
        }
    }

    volumeUpDown = (value) => {
        const audio = document.getElementById('track')
        audio.volume += value
    }

    addPart = () => {
        const audio = document.getElementById('track')
        const currentTime = Math.round(audio.currentTime * 10) / 10;
        this.setState({ parts: this.state.parts.concat(currentTime) })
   }

    saveParts = () => {
        const epNo = this.props.epNo
        const fileName = 'ep' + epNo + '_mp3splited.txt'
        const parts = this.state.parts
        const reducer = (acc, part) => acc + '\n' + part
        const lines = parts.reduce(reducer, '1.5')
        var blob = new Blob([lines], { type: "text/plain;charset=utf-8" });
        saveAs(blob, fileName);
    }

    saveJson = () => {
        const epNo = this.props.epNo
        const fileName = 'ep' + epNo + '_mp3test.json'
        const parts = this.state.parts
        const reducer = (acc, part) => acc + '\n' + part
        const lines = parts.reduce(reducer, '1.5')
        var blob = new Blob([JSON.stringify(this.state.lesson)], { type: "text/plain;charset=utf-8" });
        saveAs(blob, fileName);
    }

    playPart = (index) => {
        const parts = this.state.parts
        if (index > 0 && index < parts.length) {
            const audio = document.getElementById('track')
            this.startPlayingPart(audio, parts[index - 1], parts[index])
        }
    }
    startPlayingPart = (player, start, end) => {
        player.currentTime = start
        this.setState({ stopPlayingPart: end})
        player.play()
    }

    addToPart = (index, value) => {
        const parts = [...this.state.parts]
        if (index >= 0 && index < parts.length) {
            parts[index] = Math.round((parts[index] + value) * 10) / 10
            this.setState({ parts })
        }
    }

    render() {
        const epNo = this.props.epNo
        const mp3Path = '/data/ep' + epNo + '.mp3'
        //const src = "/data/ep06.mp3"
        return (
            <>
                <header className="header">
                    <div className="App-header">
                        <span id="tracktime">0 / 0</span>
                        <button onClick={() => this.addPart()} className="header-button"><strong>Add</strong></button>
                        <button onClick={() => document.getElementById('track').play()} className="header-button">Play</button>
                        <button onClick={() => document.getElementById('track').pause()} className="header-button">Pause</button>
                        <button onClick={() => this.volumeUpDown(0.1)} className="header-button">Vol+ </button>
                        <button onClick={() => this.volumeUpDown(-0.1)} className="header-button">Vol- </button>
                        <button onClick={() => this.saveParts()} className="header-button"><strong>Save</strong></button>
                        <button onClick={() => this.saveJson()} className="header-button"><strong>SaveJson</strong></button>
                    </div>
            </header>
            <div className="content">
                    <audio id="track" src={mp3Path}
                    onTimeUpdate={this.onTimeUpdate}>
                    <p>Your browser does not support the audio element</p>
                </audio>
                <div>
                        <div className="flex-container">
                            <div className="audioPart">
                                <button type="button" disabled>{'<'}</button>
                                <input type="text" value={0} className="edit" readOnly />
                                <button type="button" disabled>{'>'}</button>
                                
                            </div>
                            <div className="linia"></div>
                        </div>
                    {this.state.lesson.map((linia, index) => {
                        let audioPart = (this.state.parts.length > index) ? this.state.parts[index] : ''
                        return (
                            <div className="flex-container" key={index}>
                                <div className="audioPart">
                                    <button type="button" onClick={() => this.addToPart(index, -0.1)}>{'<'}</button>
                                    <input type="text" value={audioPart} className="edit" readOnly/>
                                    <button type="button" onClick={() => this.addToPart(index, 0.1)}>{'>'}</button>
                                    <button type="button" onClick={() => this.playPart(index)} >play</button>
                                </div>
                                <div className="linia">{linia.lineNo}: <strong>{linia.lineEn}</strong></div>
                            </div>
                        )
                    })}
                </div>
            </div>
            </>
        )
    }
}

export default Player