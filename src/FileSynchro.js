import React, { Component, useState, useEffect } from 'react'
import { saveAs } from 'file-saver'
import { Divider } from 'semantic-ui-react'
import Player from './Player';

export const SynchroEffect = ({ epNo }) => {
    const [textEn, setTextEn] = useState('')
    const [textPl, setTextPl] = useState('')
    const [linesPl, setLinesPl] = useState([])
    const [showPlayer, setShowPlayer] = useState(false)

    useEffect(() => {
        loadEn(epNo)
        loadInLang(epNo, 'pl')
    }, [epNo])

    useEffect(() => {
        setLinesPl(textPl.split("\n"))
    }, [textPl])

    useEffect(() => {
        setShowPlayer(false)
        sprawdzCzyJestJson(epNo)
    }, [epNo])

    /**
     * @param {string} epNo
     * @param {string} lang
     */
    async function loadInLang(epNo, lang) {
        const jsonName = '/data/FileSynchro/ep' + epNo + '_'+lang+'.txt'
        const response = await fetch(jsonName);
        const text = await response.text();
        switch (lang) {
            case 'pl':
                setTextPl(text)
                break;
            case 'en':
                setTextEn(text)
                break;
        }
    }

    /**
     * @param {string} epNo
     */
    async function loadEn(epNo) {
        const jsonName = '/data/FileSynchro/ep' + epNo + '_en.txt'
        const response = await fetch(jsonName);
        const text = await response.text();
        setTextEn(text)
    }

    async function sprawdzCzyJestJson(epNo) {
        const jsonName = '/data/FileSynchro/ep' + epNo + '.json'
        const response = await fetch(jsonName);
        if (response.ok) {
            setShowPlayer(true)
        } else {
            setShowPlayer(false)
        }
    }

    /**
     * @param {{ target: { name: string; value: React.SetStateAction<string>; }; }} event
     */
    const handleChange = (event) => {
        if (event.target.name === 'textEn')
            setTextEn(event.target.value);
        if (event.target.name === 'textPl')
            setTextPl(event.target.value);
    }

    /**
     * @param {number} nr
     */
    const liniaPl = (nr) => {
        return nr < linesPl.length ? linesPl[nr] : '' 
    }

    const save = () => {
        // {
        //     "lineNo": 0,
        //         "linePl": "Anna: \"Czekamy na wiadomość od ciebie wkrótce. Z poważaniem, Anna.",
        //             "mp3End": "10.1",
        //                 "lineEn": "Anna: ‘Look forward to hearing from you soon. Kind regards, Anna.’",
        //                     "mp3Start": "3.5"
        // },
        const fileName = 'ep' + epNo + '.json'
        const result = textEn.split("\n").map((lineEn, index) => {
            return { lineNo: index, lineEn, linePl: liniaPl(index), mp3Start: '', mp3End: '' }
        })

        var blob = new Blob([JSON.stringify(result)], { type: "text/plain;charset=utf-8" });
        saveAs(blob, fileName);
    }

    /**
     * @param {number} lineNo
     */
    const joinNextLine = (lineNo) => {
        const newEn = textEn.split("\n").reduce((previousValue, currentValue, index, array) => {
            return previousValue + (index !== lineNo ? '\n' : ' ') + currentValue
        })
        setTextEn(newEn)

        const newPl = linesPl.reduce((previousValue, currentValue, index) => {
            return previousValue + (index !== lineNo ? '\n' : ' ') + currentValue
        })
        setTextPl(newPl)
    }

    return (
        <>
            <div>
                {showPlayer && 
                    <Player epNo={epNo} />
                }
            </div>
            <div>
                <button onClick={() => save()} className="header-button"><strong>Save</strong></button>
                 {
                    //const liniePl = textPl.split("\n")
                    textEn.split("\n").map((line, index) => {
                        return (
                            <div className="line" key={index}>
                                <div className="line_index">{index}</div>
                                <div className="line_en">
                                    <textarea id={"epEn" + index} name='textEn' value={line} readOnly
                                        className="file_synchro_textarea"/>
                                </div>
                                <div className="line_index">
                                    <button onClick={() => joinNextLine(index+1)} className="header-button"><strong>x</strong></button>
                                </div>
                                <div className="line_en">
                                    <textarea id={"epPl" + index} name='textPl' value={liniaPl(index)} readOnly
                                        className="file_synchro_textarea" />
                                </div>
                                <div className="line_index">
                                    {index}
                                </div>
                            </div>)
                    })
                 }
            </div>
            <div className="file_synchro_main">
                <div className="file_synchro_left">
                    <textarea id="epEn" name='textEn' value={textEn} onChange={handleChange} className="file_synchro_textarea" />
                </div>
                <div className="file_synchro_left">
                    <textarea id="epEn" name='textPl' value={textPl} onChange={handleChange} className="file_synchro_textarea" />
                </div>
            </div>
        </>    
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