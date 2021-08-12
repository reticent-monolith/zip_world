import React from "react"
import ToggleButton from "react-bootstrap/ToggleButton"
import SetupDisplay from "./SetupDisplay"
import Button from "react-bootstrap/Button"
import { config } from "../config"


export default class Line extends React.Component {

    render() {
        return (
            <div className="Line" style={{
                    visibility: this.props.display,
                    border: "10px solid",
                    borderColor: config.colors[this.props.number]
                }}>
                <input
                value={this.props.weight !== 0 ? this.props.weight : ""}
                placeholder="Weight"
                className="input"
                type="number"
                onFocus={e => e.currentTarget.select()}
                onChange={e => {
                    this.props.changeWeight(e.target.value, this.props.number)
                }}
                ></input>
                <input
                value={this.props.trolley !== 0 ? this.props.trolley : ""}
                className="input"
                placeholder="Trolley"
                type="number"
                onFocus={e => e.currentTarget.select()}
                onChange={e => {
                    this.props.changeTrolley(e.target.value, this.props.number)
                }}
                ></input>
                <Button
                variant="primary"
                className="button"
                onClick={this.props.send}
                >Send</Button>

                <SetupDisplay 
                front={this.props.front}
                middle={this.props.middle}
                rear={this.props.rear}
                added={this.props.added}
                />

                <ToggleButton
                className="button"
                variant={this.props.confirmed ? "success" : "danger"}
                checked={this.props.confirmed}
                type="checkbox"
                onChange={(e) => {
                    this.props.confirm(e.currentTarget.checked, this.props.number)
                }}
                >{this.props.confirmed ? "Confirmed!" : "Tap to Confirm" }</ToggleButton>
                
            </div>
        )
    }
}