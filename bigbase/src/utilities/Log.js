export default class Log {
    static debug(text) {
        console.debug(`|#| WINDS DEBUG: ${text}`)
    }

    static error(text) {
        console.error(`|!!| WINDS ERROR: ${text}`)
    }
}