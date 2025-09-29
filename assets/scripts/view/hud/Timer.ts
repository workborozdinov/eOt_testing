import { _decorator, Component, Sprite } from 'cc';
import { Event } from '../../utils/Event';
const { ccclass, property } = _decorator;

const DEFAULT_TIME = 10;

@ccclass('Timer')
export class Timer extends Component {
    @property(Sprite) private readonly fillSprite: Sprite = null;  
    
    private _time: number = DEFAULT_TIME;
    private _currentTime: number = 0;  
    
    get isActive() { return this._isActive }
    private _isActive: boolean = false;

    readonly onEndTime = new Event(this);

    update(dt: number) {
        if (!this._isActive) return;
        if (this._currentTime > this._time) { 
            this._currentTime = this._time;
            this.stopTimer().updateView();

            this.onEndTime.dispatch();
            return;
        }

        this._currentTime += dt;
        this.updateView();
    }

    setTime(time: number) {
        this._time = time;
        return this; 
    }
 
    startTimer() { 
        this._isActive = true;
        return this;
     }

    stopTimer() {
        this._isActive = false;
        return this;
    }

    resetTimer() {
        this._currentTime = 0;
        return this;
    }

    updateView() { 
        this.fillSprite.fillRange = 1 - this._currentTime / this._time;
        return this;
    }

    onDestroy() { }
}


