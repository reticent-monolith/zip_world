import React from "react"
import Button from 'react-bootstrap/Button';
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { enGB } from 'date-fns/esm/locale'
import {config} from "../config"
import Log from "../utilities/Log";
import CommentModal from "../components/modals/CommentModal"
import MqttService from "../mqtt/MqttService";
import drip from "../res/sounds/drip.mp3"
import UIfx from "uifx"

// Register locale for DatePickers
registerLocale('enGB', enGB)

let WS_URL = "wss://broker.reticent-monolith.com"

export default class Controls extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dispatch: {
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
                windSpeed: 0,
                windDegrees: 0,
                windsInstructor: "",
                btRadio: "",
                comment: ""
            },
            confirmations: {
                4: false,
                3: false,
                2: false,
                1: false
            },
            commentModalIsOpen: false,
            startDate: new Date(),
            endDate: new Date()
        }

        this.styles = {
            lineDiv: {
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                borderRadius: "5px",
                padding: "5px",
                marginRight: "5px",
            },
            label: {
                color: "white",
                fontWeight: "bold",
                fontSize: "1em",
                paddingBottom: "0",
                height: "1.1em"
            },
            input: {
                width: "40px",
                borderRadius: "5px",
                border: "1px solid",
                textAlign: "center",
                height: "1.2em",
                fontSize: "1.2em",
                backgroundColor: config.colors.light,
                borderColor: config.colors.dark

            },
            inputL: {
                width: "80px",
                borderRadius: "5px",
                border: "1px solid",
                textAlign: "center",
                height: "1.2em",
                fontSize: "1.2em",
                backgroundColor: config.colors.light,
                borderColor: config.colors.dark
            },
            select: {
                width: "60px",
                borderRadius: "5px",
                border: "1px solid",
                textAlign: "center",
                height: "1.3em",
                fontSize: "1.2em",
                background: "white",
                borderColor: config.colors.dark
            },
            container: {
                display: "flex",
                justifyContent: "center",
                width: "100%",
                minWidth: "1080px",
                height: "200px",
                padding: "5px",
                background: "white",
                zIndex: "2",
                position: "fixed",
                top: "0px",
                paddingBottom: "20px"
            },
            lineContainer: {
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                width: "400px",
                height: "100%"
            },
            windContainer: {
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                margin: "0 10px",
                width: "200px",
                height: "100%",
                borderRadius: "5px",
                row: {
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "5px",
                    label: {
                        color: "black",
                        fontSize: "0.7em"
                    }
                }
            },
            textArea: {
                border: "none",
                borderRadius: "5px",
                width: "500px",
                height: "300px"
            },
            
            topLabels: {
                fontSize: "0.7em",
                width: "90%",
                textAlign: "center",
                display: "flex",
                padding: "0 15px 0 30px",
                justifyContent: "space-between",
                weight: {width: "34px"},
                front: {width: "60px"},
                middle: {width: "60px"},
                rear: {width: "60px"},
                added: {width: "44px"},
                trolley: {width: "44px"},
            },
            buttonContainer: {
                display: "flex",
                flexDirection: "column",
                width: "200px",
                justifyContent: "space-between"
            },
            button: {
                height: "40px"
            },
            confirmed: {
                fontSize: "0.7em",
                fontWeight: "bold"
            },
            dateContainer: {
                display: "none",
                flexDirection: "column",
                width: "200px",
                justifyContent: "space-between"
            },
        }

        // set up drip sound effect
        this.confirmSound = new UIfx(
            drip,
            {volume: 1}
        )
        this.unconfirmSound = new UIfx(
            drip,
            {volume: 1}
        );
        this.dataReceivedSound = new UIfx(
            drip,
            {volume: 1}
        );
    }

    //   +-------------+
    //  | App Methods |
    // +-------------+

    goodToGo = () => {
        // Check if lines with entered weights are ready
        const riders = this.state.dispatch.riders
        if (
            riders[4].weight === 0 &&
            riders[3].weight === 0 &&
            riders[2].weight === 0 &&
            riders[1].weight === 0
        ) return false
        const goodToGo = {
            4:true,
            3:true,
            2:true,
            1:true
        }
        for (let line of [4,3,2,1]) {
            if (riders[line].weight !== 0 && !this.state.confirmations[line]) {
                goodToGo[line] = false
            }
                
        }
        let result = true;
        for (let i in goodToGo) {
            if (goodToGo[i] === false) {
                result = false;
                break;
           }
        }
        return result
    }

    sendToBT = () => {
        // Send a JSON string payload of setups to the big top clients
        const payload = {
            4: {
               frontSlider: this.state.dispatch.riders[4].frontSlider,
               middleSlider: this.state.dispatch.riders[4].middleSlider, 
               rearSlider: this.state.dispatch.riders[4].rearSlider, 
               addedWeight: this.state.dispatch.riders[4].addedWeight,
               confirmed: false
            },
            3: {
                frontSlider: this.state.dispatch.riders[3].frontSlider,
                middleSlider: this.state.dispatch.riders[3].middleSlider,
                rearSlider: this.state.dispatch.riders[3].rearSlider,
                addedWeight: this.state.dispatch.riders[3].addedWeight,
                confirmed: false
            },
            2: {
                frontSlider: this.state.dispatch.riders[2].frontSlider,
                middleSlider: this.state.dispatch.riders[2].middleSlider,
                rearSlider: this.state.dispatch.riders[2].rearSlider,
                addedWeight: this.state.dispatch.riders[2].addedWeight,
                confirmed: false
            },
            1: {
                frontSlider: this.state.dispatch.riders[1].frontSlider,
                middleSlider: this.state.dispatch.riders[1].middleSlider,
                rearSlider: this.state.dispatch.riders[1].rearSlider,
                addedWeight: this.state.dispatch.riders[1].addedWeight,
                confirmed: false
            },
        }
        this.client.send("setups", JSON.stringify(payload))
        this.setState({
            ...this.state,
            confirmations: {
                1: false,
                2: false,
                3: false,
                4: false,
            }
        })
    }

    handleMessage = (topicString, message) => {
        // Handle incoming messages
        let [line, topic] = topicString.split("/")

        try {
            line = parseInt(line, 10)
        } catch (err) {
            Log.error(err)
            return
        }
        if (topic === "newRider") {
            message = JSON.parse(message)
            message.weight = parseInt( message.weight)
            message.trolley = parseInt( message.trolley)
            this.setState({
                ...this.state,
                dispatch: {
                    ...this.state.dispatch,
                    riders: {
                        ...this.state.dispatch.riders,
                        [line]: {
                            ...this.state.dispatch.riders[line],
                            ...message
                        }
                    }
                }
            })
            // this.dataReceivedSound.play()
        } else if (topic === "confirmation") {
            Log.debug(`Confimation message: ${message.toString()}`)
            this.setState({
                ...this.state,
                confirmations: {
                    ...this.state.confirmations,
                    [line]: message.toString() === "true" ? true : false
                }
            })
            if (message.toString() === "true") {
                this.confirmSound.play()
            } else {
                this.unconfirmSound.play()
            }
        } else if (topic === "poll") {
            const payload = this.state.dispatch.riders
            delete payload[4].speed
            delete payload[3].speed
            delete payload[2].speed
            delete payload[1].speed
            
            this.client.send("pollResponse", JSON.stringify(payload))
            Log.debug("sent poll response")
            console.log(payload)
        }
    }

    clearInputs = () => {
        // Clear all inputs
        this.setState({
            ...this.state,
            dispatch: {
                riders: {
                    4: {
                        weight: 0,
                        trolley: 0,
                        addedWeight: 0
                    },
                    3: {
                        weight: 0,
                        trolley: 0,
                        addedWeight: 0
                    },
                    2: {
                        weight: 0,
                        trolley: 0,
                        addedWeight: 0
                    },
                    1: {
                        weight: 0,
                        trolley: 0,
                        addedWeight: 0
                    }
                },
                windSpeed: "",
                windDegrees: "",
                windsInstructor: "",
                btRadio: "",
                comment: ""
            },
            confirmations: {
                4: false,
                3: false,
                2: false,
                1: false
            }
        })
        this.client.send("clear", "clear")
    }

    checkIfConfirmed = line => {
        // Check if a line is confirmed and display READY if it is
        let style = {
            fontSize: "0.7em",
            fontWeight: "bold",
            color: "white"
        }
        if (this.state.confirmations[line] === true) {
            style.visibility = "visible"
        } else {
            style.visibility = "hidden"
        }
        return style
    }
    
    // Modal stuff
    openCommentModal = () => {
        this.setState({
            commentModalIsOpen: true
        })
    }
    editComment = (comment) => {
        this.setState({
            ...this.state,
            dispatch: {
                ...this.state.dispatch,
                comment: comment
            }
        })
    }
    closeCommentModal = () => {
        this.setState({
            commentModalIsOpen: false
        })
    }



    //   +-----------------+
    //  | React Lifecycle |
    // +-----------------+

    componentDidMount() {
        this.client = new MqttService(WS_URL, this.handleMessage)
        this.setState({
            ...this.state,
            dispatch: JSON.parse(sessionStorage.getItem("savedData")) || {
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
            }
        })
    }

    componentWillUnmount() {
        this.client.end()
    }

    componentDidUpdate() {
        const savedData = this.state
        delete savedData.dispatch.startDate
        delete savedData.dispatch.endDate
        sessionStorage.setItem("savedData", JSON.stringify(this.state.dispatch))
    }


    render() {
        const {dispatch, startDate, endDate} = this.state
        return (
            <div style={this.styles.container}>
                <CommentModal 
                    isOpen={this.state.commentModalIsOpen}
                    close={this.closeCommentModal}
                    editComment={this.editComment}
                />


                <div style={this.styles.dateContainer}>
                    {/* date picker */}
                    <DatePicker
                        selected={startDate}
                        dateFormat="yyyy-MM-dd"
                        locale="enGB"
                        onChange={date => {
                            this.setState({
                                startDate: new Date(date),
                                endDate: new Date(date)
                            })
                        }}
                    >
                    </DatePicker>

                    <DatePicker
                        selected={endDate}
                        dateFormat="yyyy-MM-dd"
                        locale="enGB"
                        onChange={date => {
                            this.setState({ endDate: new Date(date) })
                        }}
                    >
                    </DatePicker>

                    <Button
                        style={this.styles.button}
                        variant="primary"
                        onClick={e => {
                            Log.debug(new Date(startDate).toJSON())
                            Log.debug(endDate)
                            this.props.getByRange(
                                new Date(startDate).toJSON().toString().split("T")[0], 
                                new Date(endDate).toJSON().toString().split("T")[0]
                            )
                        }}
                    >Apply</Button>
                </div>


                <div style={this.styles.lineContainer}>
                    <div style={this.styles.topLabels}>
                        <span style={this.styles.topLabels.weight}>Weight</span>
                        <span style={this.styles.topLabels.front}>Front</span>
                        <span style={this.styles.topLabels.middle}>Middle</span>
                        <span style={this.styles.topLabels.rear}>Rear</span>
                        <span style={this.styles.topLabels.added}>Added</span>
                        <span style={this.styles.topLabels.trolley}>Trolley</span>
                    </div>
                    
                    {[4,3,2,1].map(line => {
                        return (
                            <div key={`line${line}`} style={{
                                ...this.styles.lineDiv,
                                backgroundColor: config.colors[line]
                            }}>
                                {/* label */}
                                <label style={this.styles.label}>{`${line}`}</label>

                                {/* weight */}
                                <input
                                    style={this.styles.input}
                                    type="number"
                                    value={dispatch.riders[line].weight === 0 ? "" : dispatch.riders[line].weight}
                                    onFocus={e => e.currentTarget.select()}
                                    onChange={e => {
                                        this.setState({
                                            ...this.state,
                                            dispatch: {
                                                ...dispatch,
                                                riders: {
                                                    ...dispatch.riders,
                                                    [line]: {
                                                        ...dispatch.riders[line],
                                                        weight: parseInt(e.target.value)
                                                    }
                                                }
                                            }
                                        })
                                    }}
                                ></input>

                                {/* front slider */}
                                <select
                                    style={this.styles.select}
                                    value={dispatch.riders[line].frontSlider || ""}
                                    onChange={e => {
                                        this.setState({
                                            ...this.state,
                                            dispatch: {
                                                ...dispatch,
                                                riders: {
                                                    ...dispatch.riders,
                                                    [line]: {
                                                        ...dispatch.riders[line],
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

                                {/* middle slider */}
                                <select
                                    style={this.styles.select}
                                    value={dispatch.riders[line].middleSlider || ""}
                                    onChange={e => {
                                        this.setState({
                                            ...this.state,
                                            dispatch: {
                                                ...dispatch,
                                                riders: {
                                                    ...dispatch.riders,
                                                    [line]: {
                                                        ...dispatch.riders[line],
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

                                {/* rear slider */}
                                <select
                                    style={this.styles.select}
                                    value={dispatch.riders[line].rearSlider || ""}
                                    onChange={e => {
                                        this.setState({
                                            ...this.state,
                                            dispatch: {
                                                ...dispatch,
                                                riders: {
                                                    ...dispatch.riders,
                                                    [line]: {
                                                        ...dispatch.riders[line],
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

                                {/* added weight */}
                                <input
                                    style={this.styles.input}
                                    type="number"
                                    value={dispatch.riders[line].addedWeight === 0 ? "" : dispatch.riders[line].addedWeight}
                                    onFocus={e => e.currentTarget.select()}
                                    onChange={e => {
                                        this.setState({
                                            ...this.state,
                                            dispatch: {
                                                ...dispatch,
                                                riders: {
                                                    ...dispatch.riders,
                                                    [line]: {
                                                        ...dispatch.riders[line],
                                                        addedWeight: parseInt(e.target.value),
                                                        frontSlider: null,
                                                        middleSlider: null,
                                                        rearSlider: null
                                                    }
                                                }
                                            }
                                        })
                                    }}
                                ></input>

                                {/* trolley */}
                                <input
                                    style={this.styles.input}
                                    type="number"
                                    value={dispatch.riders[line].trolley === 0 ? "" : dispatch.riders[line].trolley}
                                    onFocus={e => e.currentTarget.select()}
                                    onChange={e => {
                                        this.setState({
                                            ...this.state,
                                            dispatch: {
                                                ...dispatch,
                                                riders: {
                                                    ...dispatch.riders,
                                                    [line]: {
                                                        ...dispatch.riders[line],
                                                        trolley: parseInt(e.target.value)
                                                    }
                                                }
                                            }
                                        })
                                    }}
                                ></input>

                                <span
                                    style={this.checkIfConfirmed(line)}
                                >READY</span> 

                            </div>
                        )
                    })}
                </div>

                <div style={this.styles.windContainer}>
                    <div style={this.styles.windContainer.row}>
                        {/* wind speed input */}
                        <label style={this.styles.windContainer.row.label}>Wind Speed (mph)</label>
                        <input
                            type="number"
                            style={this.styles.input}
                            value={dispatch.windSpeed}
                            onFocus={e => e.currentTarget.select()}
                            onChange={e => {
                                this.setState({
                                    ...this.state, 
                                    dispatch: {
                                        ...dispatch,
                                        windSpeed: parseInt(e.target.value)
                                    }
                                })
                            }}
                        ></input>
                    </div>

                    <div style={this.styles.windContainer.row}>
                        {/* wind degrees input */}
                        <label style={this.styles.windContainer.row.label}>Wind Degrees</label>
                        <input
                            type="number"
                            style={this.styles.input}
                            value={dispatch.windDegrees}
                            onFocus={e => e.currentTarget.select()}
                            onChange={e => {
                                this.setState({
                                    ...this.state,
                                    dispatch: {
                                        ...dispatch,
                                        windDegrees: parseInt(e.target.value)
                                    }
                                })
                            }}
                        ></input>
                    </div>


                    <div style={this.styles.windContainer.row}>
                        {/* winds instructor */}
                        <label style={this.styles.windContainer.row.label}>Winds Instructor</label>
                        <input
                            type="text"
                            style={this.styles.inputL}
                            value={dispatch.windsInstructor}
                            onFocus={e => e.currentTarget.select()}
                            onChange={e => {
                                this.setState({
                                    ...this.state,
                                    dispatch: {
                                        ...dispatch,
                                        windsInstructor: e.target.value
                                    }
                                })
                            }}
                        ></input>
                    </div>

                    <div style={this.styles.windContainer.row}>
                        {/* bt radio */}
                        <label style={this.styles.windContainer.row.label}>Big Top Radio</label>
                        <input
                            type="text"
                            style={this.styles.inputL}
                            value={dispatch.btRadio}
                            onFocus={e => e.currentTarget.select()}
                            onChange={e => {
                                this.setState({
                                    ...this.state,
                                    dispatch: {
                                        ...dispatch,
                                        btRadio: e.target.value
                                    }
                                })
                            }}
                        ></input>
                    </div>

                    <Button
                        style={this.styles.button}
                        onClick={this.openCommentModal}
                    >Add a comment</Button> 
                </div>
                
                <div style={this.styles.buttonContainer}>
                    <Button
                        style={this.styles.button}
                        variant="primary"
                        onClick={this.sendToBT}
                    >Send to Big Top</Button>
                    <Button
                        style={this.styles.button}
                        variant="success"
                        onClick={e => {
                            if (this.goodToGo()) {
                                this.props.createDispatch(dispatch)
                                this.clearInputs()
                            } else {
                                //TODO: add a modal here
                                Log.error("Dispatch is not ready!")
                            }
                        }}
                    >Dispatch</Button>
                    <Button
                        style={this.styles.button}
                        variant="warning"
                        onClick={this.clearInputs}
                    >Clear</Button>
                </div>
            </div>
        )
    }
}
