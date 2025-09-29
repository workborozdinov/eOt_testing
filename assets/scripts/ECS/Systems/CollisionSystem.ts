import { Catcher } from "../../model/worldItems/Catcher";
import { Collectable } from "../../model/worldItems/Collectable";
import { DestroyZone } from "../../model/worldItems/DestroyZone";
import { WorldItemType } from "../../model/enums/WorldItemType";
import { LocationService } from "../../services/LocationService";
import { SystemType } from "../../services/SystemService";
import { Colliders } from "../../utils/Colliders";
import { inject } from "../../utils/DIUtils";
import { System } from "../core/System";

export default class CollisionSystem extends System {
    @inject(() => LocationService) private readonly _locationService: LocationService;

    protected _type: SystemType = SystemType.COLLISION;

    async init() { }
    update(dt: number) {
        if (!this.isEnabled) return;

        const catchers = this._locationService.currentLocation.models.get(WorldItemType.CATCHER) as Catcher[] ?? [];
        const collectable = this._locationService.currentLocation.models.get(WorldItemType.COLLECTABLE) as Collectable[] ?? [];
        const destroyZones = this._locationService.currentLocation.models.get(WorldItemType.DESTROY_ZONE) as DestroyZone[] ?? [];

        collectable.forEach(collectable => {
            catchers.forEach(catcher => {
                if (!collectable.destroyed && Colliders.checkAABBCollision(catcher.aabb(), collectable.aabb())) {
                    catcher.onCollision(collectable);
                    collectable.onCollision(catcher);
                }
            });
            destroyZones.forEach(destroyZone => {
                if (!collectable.destroyed && Colliders.checkAABBCollision(destroyZone.aabb(), collectable.aabb())) {
                    destroyZone.onCollision(collectable);
                    collectable.onCollision(destroyZone);
                }
            });
        });
    }
}