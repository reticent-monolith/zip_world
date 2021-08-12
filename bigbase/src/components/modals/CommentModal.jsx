import React from "react"
import Modal from "react-modal"
import { config } from "../../config"
import Log from "../../utilities/Log"

export default class EditModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
        this.styles = {
            commentModal: {
                overlay: {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.75)',
                    zIndex: "3"
                },
                content: {
                    position: 'absolute',
                    top: '30%',
                    left: '30%',
                    right: 'auto',
                    bottom: 'auto',
                    border: '1px solid #ccc',
                    background: '#fff',
                    overflow: 'auto',
                    WebkitOverflowScrolling: 'touch',
                    borderRadius: '4px',
                    outline: 'none',
                    padding: '20px',
                    zIndex: "4"
                }
            }
        }
    }

    //   +-------------+
    //  | App Methods |
    // +-------------+

    //   +-----------------+
    //  | React Lifecycle |
    // +-----------------+
    render() {
        return (
            <Modal
                isOpen={this.props.isOpen}
                onRequestClose={this.props.close}
                contentLabel="Add a comment"
                style={this.styles.commentModal}
            >
            {/* Comment Input */}
                <textarea
                    style={this.styles.textArea}
                    value={this.props.comment}
                    placeholder="Add a comment"
                    onChange={e => {
                        this.props.editComment(e.target.value)
                    }}
                ></textarea>
            </Modal>
        )
    }
    

}



