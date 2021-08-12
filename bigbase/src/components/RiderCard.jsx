import React from "react"
import {config} from "../config"


export default class RiderCard extends React.Component {

    styles = {
        card: {
            display: "flex",
            backgroundColor: this.props.color,
            borderRadius: "5px",
            width: "300px",
            padding: "5px",
            margin: "5px",
            height: "30px",
            alignItems: "center",
            justifyContent: "space-between"
        },
        disabled: {
            display: "flex",
            backgroundColor: config.colors.light,
            borderRadius: "5px",
            width: "300px",
            margin: "5px",
            height: "30px",
            alignItems: "center"
        },
        text: {
            color: config.colors.white,
            fontWeight: "bold",
            width: "50px",
            textAlign: "center"
        },
        kg: {
            fontSize: "0.7em",
            fontWeight: "normal"
        },
        setup: {
            color: config.colors.white,
            fontWeight: "bold",
        }
    }

    render() {
        if (this.props.rider.weight !== 0) {
            return (
                <div style={this.styles.card}>
                    <span style={this.styles.text}>{this.props.rider.weight} <span style={this.styles.kg}>kg</span></span>
                    <span style={this.styles.setup}>{this.setup()}</span>
                    <span style={this.styles.text}>{this.props.rider.speed}</span>
                </div>
        ) 
        } else return ( // a blank card for neatness
            <div style={this.styles.disabled}>
                <span></span>
            </div>
        )
    }

    setup() {
        const sl = {
            "BLACK": "S1",
            "OLD_RED": "SO2",
            "NEW_RED": "SN2",
            "YELLOW": "S3",
        }
        const front = this.props.rider.frontSlider
        const mid = this.props.rider.middleSlider
        const rear = this.props.rider.rearSlider
        const added = this.props.rider.addedWeight
        let sliderString = ""
        if (added !== 0 && (
            front !== null || mid !== null || rear !== null
        )) {
            return "INVALID"
        } else if ( front !== null || mid !== null || rear !== null) {
            sliderString = `${sl[front] || ""} ${sl[mid] || ""} ${sl[rear] || ""}`
            return sliderString
        } else if (added > 0) {
            return `+${added} kg`
        } else return "x"
    }
}