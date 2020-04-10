import React, { Component } from "react";
import { Tab } from "semantic-ui-react";
import Player from './Player';
import FileSynchro from './FileSynchro';
import { SynchroEffect } from './FileSynchro'
//import Lesson from './Lesson';
//import { LessonEffect } from './LessonEffect'
//mport {Boxes} from './development/Boxes'

class Tabs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            tabActiveIndex: 0,

        }
    }
    tab1 = Array.from({ length: 59 }, (v, k) => k < 9 ? '0' + (k + 1) : '' + (k + 1));

    taby = () => [
        ...this.tab1.map((lessonNo, index) => { //['06','30']
            //const 
            return ({
                menuItem: '' + lessonNo,
                render: () =>
                    <Tab.Pane>
                        {
                            index < 0 ?
                                <FileSynchro epNo={lessonNo} />
                                :
                                <SynchroEffect epNo={lessonNo} />
                        }
                    </Tab.Pane>
                    
            })
        }),
        {
            menuItem: 'Boxes',
            render: () =>
                <Tab.Pane>
                    <Player epNo={'06'} />
                </Tab.Pane>
        },
    ]

    handleTabChange = (e, { activeIndex }) => this.setState({ tabActiveIndex: activeIndex })

    render() {

        return (
            <>
                <Tab panes={this.taby()} activeIndex={this.state.tabActiveIndex} onTabChange={this.handleTabChange}
                    menu={{ pointing: true, className: "wrapped" }} />
                {/*  loading={this.state.loading} */}

            </>
        )
    }
}

export default Tabs