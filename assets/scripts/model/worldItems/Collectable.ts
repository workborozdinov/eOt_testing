import { AccelerateTrajectoriesData, ICollectableData, ITrajectoryData } from "../../interfaces/Data";
import { vec2 } from "../../utils/Utils";
import { CollectableType } from "../enums/CollectableType";
import { Catcher } from "./Catcher";
import { Prop } from "./Prop";
import { DestroyZone } from "./DestroyZone";
import { TrajectoriesType } from "../enums/TrajectoriesType";

export class Collectable extends Prop {
    get collectableType(): CollectableType { return this._collectableType; }
    protected _collectableType: CollectableType;

    get value(): number { return this._value; }
    protected _value: number = 0;

    get trajectoryData() { return this._trajectoryData; }
    protected _trajectoryData: ITrajectoryData;

    get spawnPosition(): vec2 { return this._spawnPosition; }
    protected _spawnPosition: vec2;

    get time() { return this._time }
    protected _time: number = 0;
    
    get isCatch(): boolean { return this._isCatch; }
    protected _isCatch: boolean = false;

    protected _targetCather: Catcher;

    applyData(data: ICollectableData): void {
        super.applyData(data);

        this._collectableType = data.collectableType;
        this._value = data.value;
        this._spawnPosition = { ...data.worldPosition };
        
        data.trajectoryData && (this._trajectoryData = data.trajectoryData);
        data.trajectoryData && (this._trajectoryData.initVelocity = this._trajectoryData.velocity);
    }

    readonly onCollision = (other: Prop) => {
        if (other instanceof Catcher) {
        }
        if (other instanceof DestroyZone) {
            this.destroy();
        }
    };

    changeMovementTime(dt: number) {
        switch (this._trajectoryData.type) {
            case TrajectoriesType.ACCELERATE: {
                this._time += dt;
                this._trajectoryData.velocity = this._trajectoryData.initVelocity + (this._trajectoryData as AccelerateTrajectoriesData).acceleration * this._time;
                break;
            }
            default: {
                this._time += dt;
                break;
            }
        }
    }
}