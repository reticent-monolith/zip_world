import React from "react"
import Modal from 'react-modal'
import axios from "axios"
import Log from "./utilities/Log"
import Controls from "./components/Controls"
import DispatchCard from "./components/DispatchCard"
import Dispatch from "./models/Dispatch"
import ContextMenu from "./components/ContextMenu";
import EditModal from "./components/modals/EditModal";
import "./App.css"
import 'bootstrap/dist/css/bootstrap.min.css';

// Set where the application is communicating with
const RETMON = "http://192.168.1.133:5000/api/"
const SITE = "https://backend.reticent-monolith.com/"
let URL
if (process.env.NODE_ENV === "development") {
    URL = RETMON
} else {
    URL = SITE
}
// Today's date for initial getDispatches call
const timestamp = new Date().toLocaleDateString().split("/").map(x => {
    let n = x.toString();
    n = n.length < 2 ? `0${n}` : n;
    return n
})
const TODAY = [timestamp[2], timestamp[1], timestamp[0]].join('-')

// Stop the normal right click behaviour so ContextMenu can happen
document.addEventListener("contextmenu", e => {
    e.preventDefault()
})

export default class App extends React.Component {
    constructor(props) {
        super(props)

        // Create bindings for the async network methods
        // TODO: can these not be arrow functions to remove need to bind?
        this.getDispatches = this.getDispatches.bind(this)
        this.createDispatch = this.createDispatch.bind(this)
        this.updateDispatch = this.updateDispatch.bind(this)
        this.deleteDispatch = this.deleteDispatch.bind(this)
        this.purgeDatabase = this.purgeDatabase.bind(this)
        this.getDispatchById = this.getDispatchById.bind(this)
        this.getDispatchesByRange = this.getDispatchesByRange.bind(this)

        // For Modal accessibility
        Modal.setAppElement('#root');

        this.state = {
            dispatches: [], // received from server
            id: "",
            editing: null,
            editModalIsOpen: false
        }

        this.styles = {
            list: {
                marginTop: "200px",
                maxHeight: "calc(100vh-200px)",
                overflowY: "scroll"
            },
            
        }
    }

    //   +-------------+
    //  | App Methods |
    // +-------------+

    //  get the id of the dispatch the mouse is currently over so the ContextMenu knows what it's being called on
    handleMouseEnter = (id) => {
        this.setState({
            id: id 
        })
    }
    handleMouseLeave = () => {
        this.setState({
            id: ""
        })
    }

    // Handle the opening and closing of the EditModal, passing the dispatch the ContextMenu was called on
    openEditModal = (dispatch) => {
        this.setState({
            editModalIsOpen: true,
            editing: dispatch
        })
    }

    closeEditModal = () => {
        this.setState({
            editModalIsOpen: false
        })
    }

    //   +-----------------+
    //  | React Lifecycle |
    // +-----------------+

    // Get today's dispatches when page is opened
    componentDidMount() {
        this.getDispatches(TODAY)
    }
    
    render() {
        const {dispatches, id, editModalIsOpen, editing} = this.state
        return (
            <div style={{minWidth: "1080px"}}>
                <ContextMenu 
                    id={id} 
                    delete={this.deleteDispatch}
                    dispatches={dispatches}
                    get={this.getDispatchById}
                    openEditModal={this.openEditModal}
                />

                <EditModal 
                    isOpen={editModalIsOpen}
                    update={this.updateDispatch}
                    close={this.closeEditModal}
                    editing={editing}
                />

                <Controls 
                    createDispatch={this.createDispatch}
                    purge={this.purgeDatabase}
                    getByRange={this.getDispatchesByRange}
                />

                {/* The dispatches from today as cards */}
                <div style={{
                    position: "fixed",
                    top: "200px",
                    width: "100%",
                    maxHeight: "80vh",
                    overflowY: "scroll"
                }}>
                    <div>
                        {dispatches.map(d => {
                            const dispatch = new Dispatch(d)
                            return (
                                <DispatchCard 
                                    key={dispatch._id}
                                    data={dispatch}
                                    mouseEnter={this.handleMouseEnter}
                                    mouseLeave={this.handleMouseLeave}
                                />
                            )
                        })}
                    </div>
                </div>

            </div>
        )
    }

    //   +-----------------+
    //  | Network Methods |
    // +-----------------+

    async getDispatches(date) {
        try {
            const response = await axios.get(`${URL}bydate/${date}`)
            console.log(response)
            this.setState({dispatches: response.data.reverse().map( d => {
                return new Dispatch(d)
            })})
        } catch (error) {
            Log.error(error)
        }
    }

    async getDispatchesByRange(start, end) {
        try {
            const response = await axios.get(
                `${URL}bydaterange`,
                {params: {
                    start: start,
                    end: end
                }}
            )
            this.setState({dispatches: response.data.map( d => {
                return new Dispatch(d)
            })})
        } catch (error) {
            Log.error(error)
        }
    }

    async createDispatch(dispatch) {
        const dispatchPayload = new Dispatch(dispatch)
        delete dispatchPayload._id
        const arr = [1,2,3,4]
        arr.forEach(i => {
            if (dispatchPayload.riders[i].frontSlider === "") delete dispatchPayload.riders[i].frontSlider
            if (dispatchPayload.riders[i].middleSlider === "") delete dispatchPayload.riders[i].middleSlider
            if (dispatchPayload.riders[i].rearSlider === "") delete dispatchPayload.riders[i].rearSlider
        })
        try {
            await axios.post(`${URL}add`, dispatchPayload)
            this.getDispatches(TODAY)
        } catch (error) {
            Log.error(error)
        }
    }

    async updateDispatch(dispatch) {
        const arr = [1, 2, 3, 4]
        arr.forEach(i => {
            if (dispatch.riders[i].frontSlider === "") delete dispatch.riders[i].frontSlider
            if (dispatch.riders[i].middleSlider === "") delete dispatch.riders[i].middleSlider
            if (dispatch.riders[i].rearSlider === "") delete dispatch.riders[i].rearSlider
        })
        try {
            await axios.post(`${URL}update`, dispatch)
            this.getDispatches(TODAY)
        } catch (error) {
            Log.error(error)
        }
    }

    async deleteDispatch(id) {
        try {
            await axios.post(`${URL}delete`, id)
            this.getDispatches(TODAY)
        } catch (error) {
            Log.error(error)
        }
    }

    async purgeDatabase() {
        try {
            await axios.delete(`${URL}purge`)
            this.getDispatches(TODAY)
        } catch (error) {
            Log.error(error)
        }
    }

    async getDispatchById(id) {
        try {
            const dispatch = await axios.get(`${URL}byid/${id}`)
            this.getDispatches(TODAY)
            return dispatch
        } catch (error) {
            Log.error(error)
        }
    }
}
