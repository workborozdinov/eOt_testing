import { Component } from "cc";
import { IDestroyable } from "./interfaces/IDestroyable";

class EventInfo<T = any> {
    constructor(
        public subscriber: IDestroyable, 
        public cbOnEvent: (t: T) => void = null,
    ) { }
}
// CocosComponent subscribe in lifecycle callback - stable link
export class Event<T = any, TEventHolder extends IDestroyable = any> {
    static globalSelfMap: Map<IDestroyable, Set<Event>> = new Map(); 
    static globalSubMap: Map<IDestroyable, Set<Event>> = new Map();

    private _isInit: boolean = false;
    constructor(protected _eventHolder: TEventHolder) {
        if (this._eventHolder instanceof Component) return;
        
        this._init();
    }

    infos: EventInfo[] = [];

    readonly dispatch = (args?: T) => {
        this._init()
        this.infos.forEach(info => info.cbOnEvent(args));
    }

    add(subscriber: IDestroyable, cb: (t: T) => void) {
        this.addInfo(new EventInfo(subscriber, cb));
        
        const subEvent = Event.globalSubMap.get(subscriber);
        if (subEvent) subEvent.add(this);
        else Event.globalSubMap.set(subscriber, new Set([this]));
    }

    removeAll(subscriber?: IDestroyable) {
        if (subscriber) {
            Event.globalSelfMap.get(subscriber)?.delete(this);
            this.infos = this.infos.filter(info => info.subscriber !== subscriber);
        } else {
            this.infos.forEach(info => Event.globalSelfMap.get(info.subscriber)?.delete(this))
            this.infos = [];
        }
    }
    //init for stupid cocos 
    private _init() { 
        if (this._isInit) return;

        const origDestroy = this._eventHolder.onDestroy;
        this._eventHolder.onDestroy = () => {
            origDestroy.apply(this._eventHolder);
            Event.globalSubMap.get(this._eventHolder)?.forEach(event => event.removeAll(this._eventHolder))
            
            Event.globalSubMap.delete(this._eventHolder);
            Event.globalSelfMap.delete(this._eventHolder);
        }

        const selfEvents = Event.globalSelfMap.get(this._eventHolder);
        if (selfEvents) selfEvents.add(this);
        else Event.globalSelfMap.set(this._eventHolder, new Set([this]));

        this._isInit = true;
    }

    protected addInfo(info: EventInfo) { this.infos.push(info); }
}