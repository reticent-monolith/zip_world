import React from "react"
import Modal from "react-modal"
import { config } from "../../config"
import Log from "../../utilities/Log"

export default class EditModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentlyEditing: {
                riders: {
                    4: {
                        weight: 0,
                        trolley: 0,
                        addedWeight: 0,
                        frontSlider: "",
                        middleSlider: "",
                        rearSlider: "",
                        speed: 0
                    },
                    3: {
                        weight: 0,
                        trolley: 0,
                        addedWeight: 0,
                        frontSlider: "",
                        middleSlider: "",
                        rearSlider: "",
                        speed: 0
                    },
                    2: {
                        weight: 0,
                        trolley: 0,
                        addedWeight: 0,
                        frontSlider: "",
                        middleSlider: "",
                        rearSlider: "",
                        speed: 0
                    },
                    1: {
                        weight: 0,
                        trolley: 0,
                        addedWeight: 0,
                        frontSlider: "",
                        middleSlider: "",
                        rearSlider: "",
                        speed: 0
                    }
                },
                windSpeed: "",
                windDegrees: "",
                windsInstructor: "",
                btRadio: "",
                comment: ""
            },
        }
        this.styles = {
            overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.75)',
            zIndex: "10"
            },
            content: {
            position: 'absolute',
            top: '30%',
            left: '15%',
            right: 'auto',
            bottom: 'auto',
            border: '1px solid #ccc',
            background: '#fff',
            overflow: 'auto',
            WebkitOverflowScrolling: 'touch',
            borderRadius: '4px',
            outline: 'none',
            padding: '20px',
            zIndex: "11",
            display: "flex",
            fontSize: "0.8em"
            },
            generalDiv: {
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                width: "250px",
                marginRight: "10px"
            },
            row: {
                display: "flex",
                justifyContent: "space-between",
                margin: "5px 0"
            },
            ridersDiv: {
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
            },
            rider: {
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                borderRadius: "5px",
                padding: "5px",
                marginRight: "5px",
            },
            inputS: {
                width: "40px",
                textAlign: "center"
            }, 
            inputL: {
                width: "120px",
                textAlign: "center"
            },
            span: {
                color: "white",
                margin: "0 5px"
            }
        }
    }

    close = () => {
        this.props.update(this.state.currentlyEditing)
        this.props.close()
    }

    afterOpen = () => {
        Log.debug("open!")
        this.setState({currentlyEditing: this.props.editing})
        this.setState({
            beforeEdit: Object.assign({}, this.state.currentlyEditing)
        })
    }

    render() {
        return (
            <Modal
                isOpen={this.props.isOpen}
                onRequestClose={this.close}
                contentspan="Edit"
                style={this.styles}
                onAfterOpen={this.afterOpen}
            >
                <div style={this.styles.ridersDiv}>
                    {[4,3,2,1].map( l => {
                        return (
                            <div
                            key={l}
                            style={{
                                ...this.styles.rider,
                                backgroundColor: config.colors[l]
                            }}
                            >
                                <span style={this.styles.span}>Weight</span>
                                <input
                                    value={this.state.currentlyEditing.riders[l].weight}
                                    style={this.styles.inputS}
                                    onFocus={e => e.currentTarget.select()}
                                    onChange={e => {
                                        this.setState({
                                            ...this.state,
                                            currentlyEditing: {
                                                ...this.state.currentlyEditing,
                                                riders: {
                                                    ...this.state.currentlyEditing.riders,
                                                    [l]: {
                                                        ...this.state.currentlyEditing.riders[l],
                                                        weight: e.target.value
                                                    }
                                                }
                                            }
                                        })
                                    }}
                                    ></input>
                                <span style={this.styles.span}>Front</span>
                                <select
                                    // style={this.styles.editModal.select}
                                    value={this.state.currentlyEditing.riders[l].frontSlider || ""}
                                    onChange={e => {
                                        this.setState({
                                            ...this.state,
                                            currentlyEditing: {
                                                ...this.state.currentlyEditing,
                                                riders: {
                                                    ...this.state.currentlyEditing.riders,
                                                    [l]: {
                                                        ...this.state.currentlyEditing.riders[l],
                                                        frontSlider: e.target.value,
                                                        addedWeight: 0
                                                    }
                                                }
                                            }
                                        })
                                    }}
                                    >
                                    <option value="BLACK">S1</option>
                                    <option value="OLD_RED">SO2</option>
                                    <option value="NEW_RED">SN2</option>
                                    <option value=""></option>
                                </select>
                                <span style={this.styles.span}>Middle</span>
                                <select
                                    // style={this.styles.editModal.select}
                                    value={this.state.currentlyEditing.riders[l].middleSlider || ""}
                                    onChange={e => {
                                        this.setState({
                                            ...this.state,
                                            currentlyEditing: {
                                                ...this.state.currentlyEditing,
                                                riders: {
                                                    ...this.state.currentlyEditing.riders,
                                                    [l]: {
                                                        ...this.state.currentlyEditing.riders[l],
                                                        middleSlider: e.target.value,
                                                        addedWeight: 0
                                                    }
                                                }
                                            }
                                        })
                                    }}
                                    >
                                    <option value="OLD_RED">SO2</option>
                                    <option value="NEW_RED">SN2</option>
                                    <option value=""></option>
                                </select>
                                <span style={this.styles.span}>Rear</span>
                                <select
                                    // style={this.styles.editModal.select}
                                    value={this.state.currentlyEditing.riders[l].rearSlider || ""}
                                    onChange={e => {
                                        this.setState({
                                            ...this.state,
                                            currentlyEditing: {
                                                ...this.state.currentlyEditing,
                                                riders: {
                                                    ...this.state.currentlyEditing.riders,
                                                    [l]: {
                                                        ...this.state.currentlyEditing.riders[l],
                                                        rearSlider: e.target.value,
                                                        addedWeight: 0
                                                    }
                                                }
                                            }
                                        })
                                    }}
                                    >
                                    <option value="YELLOW">S3</option>
                                    <option value=""></option>
                                </select>
                                <span style={this.styles.span}>Added</span>
                                <input
                                    value={this.state.currentlyEditing.riders[l].addedWeight}
                                    style={this.styles.inputS}
                                    onFocus={e => e.currentTarget.select()}
                                    onChange={e => {
                                        this.setState({
                                            ...this.state,
                                            currentlyEditing: {
                                                ...this.state.currentlyEditing,
                                                riders: {
                                                    ...this.state.currentlyEditing.riders,
                                                    [l]: {
                                                        ...this.state.currentlyEditing.riders[l],
                                                        addedWeight: e.target.value,
                                                        frontSlider: "",
                                                        middleSlider: "",
                                                        rearSlider: ""
                                                        
                                                    }
                                                }
                                            }
                                        })
                                    }}
                                    ></input>
                                <span style={this.styles.span}>Speed</span>
                                <input
                                    value={this.state.currentlyEditing.riders[l].speed}
                                    style={this.styles.inputS}
                                    onFocus={e => e.currentTarget.select()}
                                    onChange={e => {
                                        this.setState({
                                            ...this.state,
                                            currentlyEditing: {
                                                ...this.state.currentlyEditing,
                                                riders: {
                                                    ...this.state.currentlyEditing.riders,
                                                    [l]: {
                                                        ...this.state.currentlyEditing.riders[l],
                                                        speed: e.target.value
                                                    }
                                                }
                                            }
                                        })
                                    }}
                                    ></input>
                                <span style={this.styles.span}>Trolley</span>
                                <input
                                    value={this.state.currentlyEditing.riders[l].trolley}
                                    style={this.styles.inputS}
                                    onFocus={e => e.currentTarget.select()}
                                    onChange={e => {
                                        this.setState({
                                            ...this.state,
                                            currentlyEditing: {
                                                ...this.state.currentlyEditing,
                                                riders: {
                                                    ...this.state.currentlyEditing.riders,
                                                    [l]: {
                                                        ...this.state.currentlyEditing.riders[l],
                                                        trolley: e.target.value
                                                    }
                                                }
                                            }
                                        })
                                    }}
                                    ></input>
                            </div>
                        )
                    })}
                </div>
                <div style={this.styles.generalDiv}>
                    <div style={this.styles.row}>
                        {/* windSpeed */}
                        <span>Wind Speed</span>
                        <input
                            value={this.state.currentlyEditing.windSpeed}
                            style={this.styles.inputS}
                            onFocus={e => e.currentTarget.select()}
                            onChange={e => {
                                this.setState({
                                    ...this.state,
                                    currentlyEditing: {
                                        ...this.state.currentlyEditing,
                                        windSpeed: e.target.value
                                    }
                                })
                            }}
                            ></input>
                    </div>

                    <div style={this.styles.row}>
                        {/* windDegrees */}
                        <span >Wind Degrees</span>
                        <input
                            value={this.state.currentlyEditing.windDegrees}
                            style={this.styles.inputS}
                            onFocus={e => e.currentTarget.select()}
                            onChange={e => {
                                this.setState({
                                    ...this.state,
                                    currentlyEditing: {
                                        ...this.state.currentlyEditing,
                                        windDegrees: e.target.value
                                    }
                                })
                            }}
                            ></input>
                    </div>

                    <div style={this.styles.row}>
                        {/* windsInstructor */}
                        <span>Winds Instructor</span>
                        <input
                            value={this.state.currentlyEditing.windsInstructor}
                            style={this.styles.inputL}
                            onFocus={e => e.currentTarget.select()}
                            onChange={e => {
                                this.setState({
                                    ...this.state,
                                    currentlyEditing: {
                                        ...this.state.currentlyEditing,
                                        windsInstructor: e.target.value
                                    }
                                })
                            }}
                            ></input>
                    </div>

                    <div style={this.styles.row}>
                        {/* btRadio */}
                        <span>Big Top Radio</span>
                        <input
                            value={this.state.currentlyEditing.btRadio}
                            style={this.styles.inputL}
                            onFocus={e => e.currentTarget.select()}
                            onChange={e => {
                                this.setState({
                                    ...this.state,
                                    currentlyEditing: {
                                        ...this.state.currentlyEditing,
                                        btRadio: e.target.value
                                    }
                                })
                            }}
                            ></input>
                    </div>

                    {/* comment */}
                    <div style={{
                        display: "flex",
                        flexDirection: "column"
                    }}>
                        <span>Comment</span>
                        <textarea
                            value={this.state.currentlyEditing.comment}
                            onChange={e => {
                                this.setState({
                                    ...this.state,
                                    currentlyEditing: {
                                        ...this.state.currentlyEditing,
                                        comment: e.target.value
                                    }
                                })
                            }}
                            ></textarea>
                    </div>
                </div>
            </Modal>
        )
    }
}
