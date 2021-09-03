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

console.log(process.env)

// Set where the application is communicating with
const URL = process.env.NODE_ENV === "development" ? "http://192.168.1.133:8000" : process.env.REACT_APP_BACKEND_URL
// Today's date for initial getDispatches call
const timestamp = new Date().toLocaleDateString('en-GB').split("/").map(x => {
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
            editModalIsOpen: false,
            user: {
                name: sessionStorage.getItem("name"),
                email: sessionStorage.getItem("email")
            },
            loginDetails: {
                username: "",
                password: ""
            }
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
        // THis is fusionauth TODO clean up if not using
        // // Get the logged in user's info
        // fetch(`${URL}/user`, {credentials: "include"})
        //     .then(res => res.json())
        //     .then(res => this.setState({
        //         ...this.state,
        //         user: res
        //     }))
        // Get today's dispatches
        this.getDispatches(TODAY)
    }
    
    render() {
        const {dispatches, id, editModalIsOpen, editing, user} = this.state
        console.log(this.state)
        if (sessionStorage.getItem("token")) {
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
                        user={this.state.user}
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
                            {/* TODO remove this */}
                            <p>Logged in as {user.email}</p>
                            <button 
                                onClick={this.logout}>Logout</button>
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
        } else {
            return (
                <div>
                    <input 
                        type="text" 
                        name="username"
                        onChange={ e => {
                            this.setState({
                                ...this.state,
                                loginDetails: {
                                    ...this.state.loginDetails,
                                    username: e.target.value
                                }
                            })
                        }}></input>
                    <input 
                        type="password" 
                        name="password"
                        onChange={e => {
                            this.setState({
                                ...this.state,
                                loginDetails: {
                                    ...this.state.loginDetails,
                                    password: e.target.value
                                }
                            })
                        }}></input>
                    <button 
                        onClick={ async () => {
                            try {
                                const response = await axios.post(`${URL}/login`, this.state.loginDetails)
                                console.log(response.data)
                                if (response.data.token) {
                                    window.sessionStorage.setItem("token", response.data.token)
                                    window.sessionStorage.setItem("email", response.data.email)
                                    window.sessionStorage.setItem("name", response.data.name)
                                    window.location.assign(window.location)
                                }
                            } catch (error) {
                                Log.error(error)
                            }
                        }}>Login</button>
                </div>
            )
        }
        
    }

    //   +-----------------+
    //  | Network Methods |
    // +-----------------+

    async getDispatches(date) {
        try {
            const response = await axios.get(`${URL}/bydate?date=${date}&token=${sessionStorage.getItem("token")}`)
            console.log(response)
            if (response.data.error === "session_expired") {
                console.log("Need to logout here")
                window.sessionStorage.clear()
                window.location.assign(window.location)
            } else if (response.data.error === "no_session") {
                
            } else {
                this.setState({dispatches: response.data.reverse().map( d => {
                    return new Dispatch(d)
                })}) 
            }
        } catch (error) {
            Log.error(error)
        }
    }

    async getDispatchesByRange(start, end) {
        try {
            const response = await axios.get(
                `${URL}/bydaterange`,
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
        dispatchPayload.windsInstructor = this.state.user.user.name
        delete dispatchPayload._id
        const arr = [1,2,3,4]
        arr.forEach(i => {
            if (dispatchPayload.riders[i].frontSlider === "") delete dispatchPayload.riders[i].frontSlider
            if (dispatchPayload.riders[i].middleSlider === "") delete dispatchPayload.riders[i].middleSlider
            if (dispatchPayload.riders[i].rearSlider === "") delete dispatchPayload.riders[i].rearSlider
        })
        try {
            await axios.post(`${URL}/add?token=${sessionStorage.getItem("token")}`, dispatchPayload)
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
            await axios.post(`${URL}/update?token=${sessionStorage.getItem("token")}`, dispatch)
            this.getDispatches(TODAY)
        } catch (error) {
            Log.error(error)
        }
    }

    async deleteDispatch(id) {
        try {
            await axios.post(`${URL}/delete?token=${sessionStorage.getItem("token")}`, id)
            this.getDispatches(TODAY)
        } catch (error) {
            Log.error(error)
        }
    }

    async purgeDatabase() {
        try {
            await axios.delete(`${URL}/purge`)
            this.getDispatches(TODAY)
        } catch (error) {
            Log.error(error)
        }
    }

    async getDispatchById(id) {
        try {
            const dispatch = await axios.get(`${URL}/byid?id=${id}&token=${sessionStorage.getItem("token")}`)
            this.getDispatches(TODAY)
            return dispatch
        } catch (error) {
            Log.error(error)
        }
    }

    async logout() {
        let response = await axios.get(`${URL}/logout`)
        Log.debug(response.data)
        sessionStorage.clear()  
        window.location.assign(window.location)
    }
}
