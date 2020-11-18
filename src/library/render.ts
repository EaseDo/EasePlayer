import { EasePlayerStatus } from "./enum";
import { Helper } from "./helper";
import { Log } from "./log";
import { EasePlayerOptions } from "./type";

export class Render {

    private static _instance: Render;

    static Load() {
        Render._instance || (Render._instance = new Render());
        return Render._instance;
    }

    container: HTMLDivElement;
    player: HTMLDivElement;
    video: HTMLVideoElement;
    cover: HTMLDivElement;
    loading: HTMLDivElement;
    controller: HTMLDivElement;

    btnPlay: HTMLDivElement;
    btnPause: HTMLDivElement;
    btnFullscreen: HTMLDivElement;
    bar: HTMLDivElement;
    barLoaded: HTMLDivElement;
    barPlayed: HTMLDivElement;
    pTime: HTMLDivElement;
    dTime: HTMLDivElement;
    bezelPlay: HTMLDivElement;
    
    private controllerHideTimer;

    renderPlayer(options: EasePlayerOptions) {

        this.container = options.container;
        this.container.innerHTML = require('./jade/player.jade')();

        this.elementExtract();

        // set player theme
        let themeName = 'ep-theme-pc';

        if (options.theme == 'mobile' || Helper.isMobile()) {
            themeName = 'ep-theme-mobile';
        }

        Log.info('current player there is', themeName);

        this.player.classList.add(themeName);

        // set video cover
        this.cover.style.backgroundImage = `url(${options.video.pic})`;

        this.loading.hidden = true;

    }

    moveLoadedBar(percentage: number) {
        this.barLoaded.style.width = `${percentage}%`
    }

    movePlayedBar(percentage: number) {
        this.barPlayed.style.width = `${percentage}%`
    }

    elementExtract() {

        this.player = this.container.querySelector('.ease-player');
        this.cover = this.player.querySelector('.ep-cover');
        this.video = this.player.querySelector('video'); 
        this.btnPlay = this.elementQuery('.ep-btn-play');
        this.btnPause = this.elementQuery('.ep-btn-pause');
        this.loading = this.elementQuery('.ep-loading');
        this.bar = this.elementQuery('.ep-bar');
        this.barLoaded = this.elementQuery('.ep-bar-loaded');
        this.barPlayed = this.elementQuery('.ep-bar-played');
        this.controller = this.elementQuery('.ep-controller');
        this.pTime = this.elementQuery('.ep-ptime')
        this.dTime = this.elementQuery('.ep-dtime')
        this.bezelPlay = this.elementQuery('.ep-play');
    }

    elementQuery(selector: string) : HTMLDivElement {
        const element = this.player.querySelector(selector) as HTMLDivElement;
        Object.defineProperty(element, 'hidden', {
            set: (v) => {
                element.style.display = v ? 'none' : '';
                return v;
            },
            get: () => {
                return element.style.display == 'none';
            }
        });
        return element;
    }

    controllerShow() {
        clearTimeout(this.controllerHideTimer);
        this.controller.hidden = false;
    }

    controllerAutoHide() {
        if (!this.video.paused) {
            this.controllerShow();
            this.controllerHideTimer = setTimeout(() => {
                this.controller.hidden = true;
            }, 3000);
        }
    }

    fullscreen(mode: boolean) {
        const className = 'ep-player-fullscreen';
        mode ? this.player.classList.add(className) : this.player.classList.remove(className);
    }

    changePlayerStatus(status: EasePlayerStatus) {
        this.btnPlay.hidden = [EasePlayerStatus.LOADING, EasePlayerStatus.PLAYING].indexOf(status) > 0;
        this.loading.hidden = status != EasePlayerStatus.LOADING;
        this.btnPause.hidden = !this.btnPlay.hidden;
        this.bezelPlay.hidden = !Helper.isMobile() || this.btnPlay.hidden;
        
        // show controller if video paused
        if (status == EasePlayerStatus.PAUSED) {
            this.controllerShow();
        }
    }

    destroy() {
        clearTimeout(this.controllerHideTimer);
        this.container.innerHTML = '';
    }


}