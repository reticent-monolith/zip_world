export default class Dispatch {
    constructor(dispatchState) {
        this.date = dispatchState.date || new Date().toLocaleDateString()
        this.time = dispatchState.time || new Date().toLocaleTimeString()
        this.riders = dispatchState.riders
        this.windSpeed = dispatchState.windSpeed
        this.windDegrees = dispatchState.windDegrees
        this.windsInstructor = dispatchState.windsInstructor
        this.btRadio = dispatchState.btRadio
        this.comment = dispatchState.comment
        this._id = dispatchState._id || null
    }
}