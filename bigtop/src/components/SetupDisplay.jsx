import React from 'react'
import BLACK from "../images/black.svg"
import OLD_RED from "../images/oldRed.svg"
import NEW_RED from "../images/newRed.svg"
import YELLOW from "../images/yellow.svg"
import empty from "../images/empty.svg"
import weightBag from "../images/weightBag.svg"

export default class SetupDisplay extends React.Component {

    styles = {
        container: {
            display: "flex",
            justifyContent: "space-around",
            height: "180px",
            width: "100%"
        },
        slider: {
            display: "flex",
            flexDirection: "column",
            height: "100%"
        },
        weightbag: {
            height: "10px",
            transform: "rotate(90deg)"
        },
        bags: {
            
        },
        weightbagContainer: {
            display: "flex",
            justifyContent: "space-around",
            flexDirection: "column",
            height: "180px"
        }
    }

    sliders = {
        "BLACK": BLACK,
        "OLD_RED": OLD_RED,
        "NEW_RED": NEW_RED,
        "YELLOW": YELLOW,
        "": empty
    }

    render() {
        if (this.props.added === 0) {

            return (
                <div style={this.styles.container}>
                    <div style={this.styles.slider}>
                        <p>Front</p>
                        <img src={this.sliders[this.props.front]} alt="derp"/>
                    </div>
                    <div style={this.styles.slider}>
                        <p>Middle</p>
                        <img src={this.sliders[this.props.middle]} alt="derp"/>
                    </div>
                    <div style={this.styles.slider}>
                        <p>Rear</p>
                        <img src={this.sliders[this.props.rear]} alt="derp" />
                    </div>
                </div> 
            )
        } else {
            let bags = []
            for (let i = 0; i < Math.floor(this.props.added/10); i++) bags.push(
                <img key={i} src={weightBag} style={this.styles.weightbag} alt="derp"/>
            )
            return (
                <div style={this.styles.weightbagContainer}>
                    <p>Weight Bags</p>
                    <div style={this.styles.bags}>
                        {bags}
                    </div>
                </div>
            )
        }
    }
}