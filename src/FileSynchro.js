import React, { Component, useState, useEffect } from 'react'
import { saveAs } from 'file-saver'

export const SynchroEffect = ({ epNo }) => {
    const [textEn, setTextEn] = useState('')
    const [textPl, setTextPl] = useState('')

    useEffect(() => {
        loadEn(epNo)
    }, [epNo])

    async function loadEn(epNo) {
        const jsonName = '/data/FileSynchro/ep' + epNo + '_en.txt'
        const response = await fetch(jsonName);
        const text = await response.text();
        setTextEn(text)
    }

    const handleChange = (event) => {
        if (event.target.name === 'textEn')
            setTextEn(event.target.value);
        if (event.target.name === 'textPl')
            setTextPl(event.target.value);
    }

    return (
        <div className="file_synchro_main">
            <div className="file_synchro_left">
                <textarea id="epEn" name='textEn' value={textEn} onChange={handleChange} className="file_synchro_textarea" />
            </div>
            <div className="file_synchro_left">
                <textarea id="epEn" name='textPl' value={textPl} onChange={handleChange} className="file_synchro_textarea" />
            </div>
        </div>
    )
}

class FileSynchro extends Component {
    constructor(props) {
        super(props)

        this.state = {
            parts: [],
            epEn: [],
            epPl: null,
        }
    }

    componentDidMount() {
        this.loadEn()
    }

    async loadEn() {
        const epNo = this.props.epNo
        const jsonName = '/data/FileSynchro/ep' + epNo + '_en.txt'
        const response = await fetch(jsonName);
        const myJson = await response.text();
        this.setState({ epEn: myJson })
    }

    render() {
        return (
            <div className="file_synchro_main">
                <div className="file_synchro_left">
                    <textarea id="epEn" value={this.state.epEn} readOnly className="file_synchro_textarea"/>
                </div>
                <div className="file_synchro_left">
                    <textarea id="epEn" rows={40} value={this.state.epPl} readOnly className="file_synchro_textarea"/>
                </div>
            </div>
        )
    }
}

export default FileSynchro