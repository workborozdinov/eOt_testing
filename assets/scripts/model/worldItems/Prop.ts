import { IPropData } from "../../interfaces/Data";
import { AABB, OBB } from "../../utils/Utils";
import { WorldItem } from "./WorldItem";
import { Colliders } from "../../utils/Colliders";

export class Prop extends WorldItem {
    protected _obb: OBB;

    aabb = (): AABB => {
        const aabb = Colliders.AABBFromOBB(this._obb);

        aabb.max.x += this.worldPosition.x;
        aabb.min.x += this.worldPosition.x;

        aabb.max.y += this.worldPosition.y;
        aabb.min.y += this.worldPosition.y;
    
        return aabb;
    }

    applyData(data: IPropData): void {
        super.applyData(data);

        this._obb = { ... data.obb };
    }

    readonly onCollision = (other: Prop) => { }
}