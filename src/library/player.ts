import { EasePlayerStatus } from './enum';
import { Event } from './event';
import { Helper } from './helper';
import { Log } from './log';
import { Render } from './render';
import './style/player.less'
import { EasePlayerOptions } from './type';

class EasePlayer {

    private render: Render;
    private options: EasePlayerOptions;
    private status: number = 0;
    private fullscreenMode: boolean = false;
    private barMoveing: boolean = false;
    private regEvents: Map<string, void> = new Map();

    get video() {
        return this.render.video;
    }

    constructor(options: EasePlayerOptions) {

        Log.debug = options.debug || false;

        if (!options.container) {
            console.error('not found container');
            return;
        }

        this.options = options;
        this.render = Render.Load();
        this.render.renderPlayer(options);

        this.render.controller.hidden = Helper.isMobile();

        this.initVideo();
        this.bindEvent();

    }

    initVideo() {
        this.video.src = this.options.video.url;
    }

    bindEvent() {

        Event.add('click', this.render.container)
        .register('ep-btn-play', () => {
            this.play();
            return true;
        })
        .register('ep-btn-pause', () => {
            this.pause();
            return true;
        })
        .register('ep-btn-fullscreen', () => {
            this.fullscreenMode = !this.fullscreenMode;
            this.render.fullscreen(this.fullscreenMode);
            return true;
        })
        .register('ep-bezel', () => {
            if (this.render.video.paused) {
                this.play()
            }
            else if (!Helper.isMobile()) {
                this.pause();
            }
            this.render.controllerAutoHide();
            return true;
        })

        Event.video(this.render.video, (type, event) => {

            this.dispatchEvent('pause', event)
            
            const updateBufferLoaded = () => {
                let time = this.video.currentTime;
                for(let i=0; i<this.video.buffered.length; i++) {
                    if (this.video.buffered.start(i) <= time && this.render.video.buffered.end(i) >= time) {
                        let percentage = this.render.video.buffered.end(i) / this.video.duration;
                        this.render.moveLoadedBar(percentage * 100);
                    }
                }
            }

            if (type == 'loadeddata') {
                this.render.dTime.innerHTML = Helper.formatTime(this.video.duration);
            }
            else if (type == 'waiting') {
                this.setPlayerStatus(EasePlayerStatus.LOADING);
            }
            else if (type == 'playing') {
                this.setPlayerStatus(EasePlayerStatus.PLAYING);
            }
            else if (type == 'pause') {
                this.setPlayerStatus(EasePlayerStatus.PAUSED);
            }
            else if (type == 'progress') {
                updateBufferLoaded();
            }
            else if (type == 'timeupdate') {
                if (!this.barMoveing) {
                    this.render.movePlayedBar(this.video.currentTime / this.video.duration * 100);
                }
                updateBufferLoaded();
            }
        
        });

        let thumb = this.render.barPlayed.querySelector('.ep-bar-thumb'),
            barMovePercentage = 0,
            isTouch = Helper.isMobile(),
            thumbMove = (event: MouseEvent) => {
                let rect = this.render.bar.getBoundingClientRect(),
                    x = Helper.isMobile() ? event['touches'][0].pageX : event.pageX + 4,
                    offset = Math.min(Math.max((x - rect.left), 0), rect.width);
                
                barMovePercentage = offset / rect.width * 100;
                this.render.movePlayedBar(barMovePercentage);
            },
            thumbUp = () => {
                this.barMoveing = false;
                this.video.currentTime = this.video.duration * barMovePercentage / 100;   
                document.removeEventListener(isTouch ? 'touchmove' : 'mousemove', thumbMove);
            }
        
        thumb.addEventListener(isTouch ? 'touchstart' : 'mousedown', () => {
            this.barMoveing = true;
            document.addEventListener(isTouch ? 'touchmove' : 'mousemove', thumbMove);
        })
        document.addEventListener(isTouch ? 'touchend' : 'mouseup', () => {
            this.barMoveing && thumbUp(); 
        })

        if (!isTouch) {
            this.render.player.addEventListener('mouseover', () => {
                this.render.controllerShow();
            })
            this.render.player.addEventListener('mouseout', () => {
                this.render.controllerAutoHide();
            })
        }
           
    }

    on(name: string, handle: (event) => void) {
        this.regEvents[name] = handle;
    }

    play() {
        this.setPlayerStatus(EasePlayerStatus.LOADING);
        this.render.cover.hidden = true;
        this.render.video.play();
    }

    pause() {
        this.render.video.played && this.render.video.pause();
    }

    seek(time: number) {
        time = Math.max(time, 0);
        if (this.video.duration) {
            time = Math.min(time, this.video.duration);
        }
        this.video.currentTime = time;
    }

    speed() {

    }

    destroy() {
        this.pause();
        this.video.src = '';
        this.render.destroy();
    }

    private setPlayerStatus(status: EasePlayerStatus) {
        this.status = status;
        this.render.changePlayerStatus(status);
    }

    private dispatchEvent(eventName: string, event) {
        this.regEvents[eventName] && this.regEvents[eventName](event);
    }

}

module.exports = EasePlayer;