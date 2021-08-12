import React from "react"
import {config} from "../config"
import RiderCard from "./RiderCard"



export default class DispatchCard extends React.Component {

    styles = {
        container: {
            display: "flex",
            width: "95%",
            justifyContent: "space-between",
            margin: "0 auto"
        },
        time: {
            display: "flex",
            alignItems: "center"

        },
        wind: {
            display: "flex",
            justifyContent: "space-between",
            width: "100px",
            alignItems: "center",
            speed: {

            },
            fastSpeed: {
                color: "red",
                fontWeight: "bold"
            },
            mph: {
                fontSize: "0.7em"
            },
            degrees: {
                fontWeight: "bold"
            }
        }
    }

    render() {
        return (
            <div 
                style={this.styles.container}
                onMouseEnter={() => {
                    this.props.mouseEnter(this.props.data._id)
                }}
                onMouseLeave={() => {
                    this.props.mouseLeave()
                }}
            >
                {this.time()}
                <RiderCard color={config.colors.red} rider={this.props.data.riders[4]}/>
                <RiderCard color={config.colors.blue} rider={this.props.data.riders[3]}/>
                <RiderCard color={config.colors.green} rider={this.props.data.riders[2]}/>
                <RiderCard color={config.colors.yellow} rider={this.props.data.riders[1]}/>
                {this.wind()}
            </div>
        )
    }

    wind() {
        const speedStyle = this.props.data.windSpeed > 45 ? this.styles.wind.fastSpeed : this.styles.wind.speed
        const cardinals = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW", "N"]
        const direction = cardinals[Math.round(this.props.data.windDegrees / 22.5)]
        return (
            <div style={this.styles.wind}>
                <span style={speedStyle}>{this.props.data.windSpeed} <span style={speedStyle}>mph</span></span>
                <span style={this.styles.wind.degrees}>{direction}</span>
            </div>
        )
    }

    time() {

        const timeString = this.props.data.time
        return (
            <span style={this.styles.time}>{timeString}</span>
        )
    }

}