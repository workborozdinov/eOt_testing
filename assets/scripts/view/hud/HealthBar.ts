import { _decorator, Component, Prefab, instantiate } from 'cc';
import { Health } from './Health';
const { ccclass, property } = _decorator;

@ccclass('HealthBar')
export class HealthBar extends Component {
    @property(Prefab) private readonly healthPrefab: Prefab = null;
    
    private _healths: Health[] = [];

    init(amountHealth: number) {
        this.clear(); 
 
        while (amountHealth--) {
            const health = this._createHealth();
            this.node.addChild(health.node);
            this._healths.push(health);
        }
    }
    
    async increaseHealth(increaseValue: number) {
        for (const health of this._healths) {
            if (!health.isCharge && increaseValue != 0) {
                await health.charging();
                increaseValue--;
            }
        }
    }
    async decreaseHealth(decreaseValue: number) {
        for (const health of this._healths) {
            if (health.isCharge && decreaseValue !== 0) {
                await health.discharging();
                decreaseValue--;
            }
        }
    }

    clear() { this._healths.map(health => health.node.destroy()).length = 0; }

    private readonly _createHealth = () => instantiate(this.healthPrefab).getComponent(Health);

    onDestroy() { }
}


