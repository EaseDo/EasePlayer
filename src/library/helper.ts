export class Helper {

    static isMobile() {
        const u = navigator.userAgent;
        return u.indexOf('iPhone') > 0 || u.indexOf('Android') > 0;
    }

    static formatTime(secord: number) {

        let pad = (num: number) => {
            return '00'.substring(0, '00'.length - num.toString().length) + num.toString()
        }

        let minute = Math.floor(secord/60);
            secord = Math.floor(secord%60);

        return pad(minute) + ':' + pad(secord);

    }

}