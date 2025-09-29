import { _decorator, Component, Sprite, tween } from 'cc';
const { ccclass, property } = _decorator;

const CHARGING_ANIMATION_TIME = 0.5;

@ccclass('Health')
export class Health extends Component {
    @property(Sprite) private readonly fillSprite: Sprite = null;

    get isCharge(): boolean { return !!this.fillSprite.fillRange; }

    readonly charging = () => new Promise(resolve => {
        tween(this.fillSprite)
            .to(CHARGING_ANIMATION_TIME, { fillRange: 1 })
            .call(resolve)
            .start()
    });
    
    readonly discharging = () => new Promise(resolve => {
        tween(this.fillSprite)
            .to(CHARGING_ANIMATION_TIME, { fillRange: 0 })
            .call(resolve)
            .start()
    });
}


