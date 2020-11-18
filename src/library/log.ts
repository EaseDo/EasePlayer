export class Log {

    static debug: boolean = false;

    static info(...msgs) {
        this.debug && console.log('EasePlayer Debug:', ...msgs)
    }

}