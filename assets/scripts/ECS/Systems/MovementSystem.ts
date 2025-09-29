import { clamp, Size } from "cc";
import { Catcher } from "../../model/worldItems/Catcher";
import { Collectable } from "../../model/worldItems/Collectable";
import { WorldItemType } from "../../model/enums/WorldItemType";
import { LocationService } from "../../services/LocationService";
import { MouseService } from "../../services/MouseService";
import { SystemType } from "../../services/SystemService";
import { TrajectoryService } from "../../services/TrajectoryService";
import { inject } from "../../utils/DIUtils";
import { System } from "../Core/System";
import WorldViewService from "../../view/WorldViewService";

export default class MovementSystem extends System {
    @inject(() => LocationService) private readonly _locationService: LocationService;
    @inject(() => TrajectoryService) private readonly _trajectoryService: TrajectoryService 
    @inject(() => MouseService) private readonly _mouseService: MouseService;
    @inject(() => WorldViewService) private readonly _worldViewService: WorldViewService;

    protected _type: SystemType = SystemType.MOVEMENT;
    protected _targetType: WorldItemType = WorldItemType.COLLECTABLE;

    private _borderSize: Size;

    async init() { 
        this._borderSize = this._worldViewService.worldSize;
    
        this._mouseService.onMouseDown.add(this, () => this._fixCatchersPositions());
        this._mouseService.onMouseUp.add(this, () => this._resetCatchersFixPositions());
    }

    update(dt: number) {
        if (!this.isEnabled) return;

        this._updateCatchersPositions();
        this._updateCollectablePositions(dt);       
    }

    private _fixCatchersPositions() {
        (this._locationService.currentLocation.models.get(WorldItemType.CATCHER) as Catcher[] ?? [])
            .forEach(catcher => catcher.saveCurrentPosition())
    }

    private _resetCatchersFixPositions() {
        (this._locationService.currentLocation.models.get(WorldItemType.CATCHER) as Catcher[] ?? [])
            .forEach(catcher => catcher.resetFixPosition())
    }

    private _updateCatchersPositions() {
        const catchers = this._locationService.currentLocation.models.get(WorldItemType.CATCHER) as Catcher[] ?? [];

        const currentDelta = this._mouseService.currentDelta;

        this._mouseService.leftPressed && currentDelta && catchers.forEach(catcher => {
            if (!catcher.fixedPosition) return;

            const currentPosition = {
                x: clamp(
                    catcher.fixedPosition.x + currentDelta.x * catcher.movementVector.x,
                    -this._borderSize.width / 2 + catcher.size.width / 2,
                    this._borderSize.width / 2 - catcher.size.width / 2),
                y: clamp(
                    catcher.fixedPosition.y + currentDelta.y * catcher.movementVector.y,
                    -this._borderSize.height / 2 + catcher.size.height / 2,
                    this._borderSize.height / 2 - catcher.size.height / 2)
            }

            catcher.changeWorldPosition(currentPosition);
        });
    }

    private _updateCollectablePositions(dt: number) {
        const collectables = this._locationService.currentLocation.models.get(WorldItemType.COLLECTABLE) as Collectable[] ?? [];

        collectables.forEach(model => {
            if (!model.destroyed && model.trajectoryData) {
                model.changeMovementTime(dt);
                model.changeWorldPosition(this._trajectoryService.getPosition(model.trajectoryData, model.spawnPosition, model.time))
            }
        });
    }
 
    onDestroy() {}
}