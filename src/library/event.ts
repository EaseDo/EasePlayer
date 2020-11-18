import { Log } from "./log";

interface RegisterEventInterface {
    className: string,
    handle: (target: HTMLElement) => boolean
}

export class Event {

    static videoEvents = [
        'abort',
        'canplay',
        'canplaythrough',
        'durationchange',
        'emptied',
        'ended',
        'error',
        'loadeddata',
        'loadedmetadata',
        'loadstart',
        'mozaudioavailable',
        'pause',
        'play',
        'playing',
        'progress',
        'ratechange',
        'seeked',
        'seeking',
        'stalled',
        'suspend',
        'timeupdate',
        'volumechange',
        'waiting'
    ];

    static add(type: string, target: HTMLElement) : DomEvent {
        const domEvent = new DomEvent();
        target.addEventListener(type, (event: MouseEvent) => {
            domEvent.parse(event);
        });
        return domEvent;
    }

    static video(target: HTMLVideoElement, handle: (type: string, event) => void) {
        Event.videoEvents.forEach((type) => {
            target.addEventListener(type, (event) => {
                Log.info('video event', type);
                handle && handle(type, event);
            });
        });
    }

}

export class DomEvent {

    private events: RegisterEventInterface[] = []

    register(className: string, handle: (element: HTMLElement) => boolean) {
        this.events.push({className: className, handle: handle});
        return this;
    }

    parse(event: MouseEvent) {

        console.log('page click:', event);

        let target: HTMLElement = (event.target as HTMLElement),
            find = false;

        while(target) {

            if (!target.classList) break;
            
            this.events.forEach((item: RegisterEventInterface) => {
                if (target.classList.contains(item.className) && item.handle(target)) {
                    find = true;
                }
            });

            if (find) break;

            target = target.parentElement;

        }

    }

}