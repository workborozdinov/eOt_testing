import { ICatcherData } from "../../interfaces/Data";
import { LocationService } from "../../services/LocationService";
import { inject } from "../../utils/DIUtils";
import { vec2 } from "../../utils/Utils";
import { CollectableType } from "../enums/CollectableType";
import { Collectable } from "./Collectable";
import { Prop } from "./Prop";

export class Catcher extends Prop {
    @inject(() => LocationService) private readonly _locationService: LocationService;

    get movementVector(): vec2 { return this._movementVector; }
    protected _movementVector: vec2 = { x: 0, y: 0 };

    get fixedPosition(): vec2 { return this._fixedPosition; }
    protected _fixedPosition: vec2;

    applyData(data: ICatcherData): void {
        super.applyData(data)

        this._movementVector = data.movementVector;
    }

    saveCurrentPosition() {
        this._fixedPosition = { ...this._worldPosition };
    }

    resetFixPosition() {
        this._fixedPosition = null;
    }

    readonly onCollision = (other: Prop) => {
        if (other instanceof Collectable) {
            switch (other.collectableType) {
                case CollectableType.DANGEROUS: {
                    this._locationService.currentLocation.decreaseHealth(other.value);
                    other.destroy();
                    break;
                }
                case CollectableType.REWARD: {
                    this._locationService.currentLocation.addToScore(other.value);
                    other.destroy();
                    break;
                }
                default: break
            }
        } 
    };
}