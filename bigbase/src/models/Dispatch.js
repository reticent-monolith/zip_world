export default class Dispatch {
    constructor(dispatchState) {
        let date = new Date().toLocaleDateString('en-GB').split("/").map(x => {
            let n = x.toString();
            n = n.length < 2 ? `0${n}` : n;
            return n
        })
        date = [date[2], date[1], date[0]].join('-')
        let time = new Date().toLocaleTimeString().split(" ")[0].split(":").map(x => {
            let n = x.toString();
            n = n.length < 2 ? `0${n}` : n;
            return n
        })
        time = [time[0], time[1], time[2]].join(":")
        this.date = dispatchState.date || date
        this.time = dispatchState.time || time
        this.riders = dispatchState.riders
        this.windSpeed = dispatchState.windSpeed === '' ? 0.0 : dispatchState.windSpeed
        this.windDegrees = dispatchState.windDegrees === '' ? 0 : dispatchState.windDegrees
        this.windsInstructor = dispatchState.windsInstructor
        this.btRadio = dispatchState.btRadio
        this.comment = dispatchState.comment
        this._id = dispatchState._id || null
    }
}