import { EasePlayerTheme } from "./enum"

export type EasePlayerOptions = {
    container: HTMLDivElement,
    live?: boolean,
    theme?: EasePlayerTheme,
    debug?: boolean,
    video: EasePlayerVideoOptions
}

export type EasePlayerVideoOptions = {
    url: string,
    pic?: string
}