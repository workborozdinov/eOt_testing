import { IWorldItemData } from "../../interfaces/Data";
import { Event } from "../../utils/Event";
import { IDestroyable } from "../../utils/interfaces/IDestroyable";
import { size, v2, vec2 } from "../../utils/Utils";
import { UuidUtils } from "../../utils/UuidUtils";
import { WorldItemType } from "../enums/WorldItemType";


export abstract class WorldItem implements IDestroyable {
    readonly uuid = UuidUtils.generate();
    
    readonly onDestroyEvent = new Event(this);
    readonly onWorldPositionChanged = new Event<vec2>(this);
    readonly onScaleChanged = new Event<number>(this);
    readonly onRotationChanged = new Event<number>(this);
    readonly onOpacityChanged = new Event<number>(this);

    get type(): WorldItemType { return this._type; }
    protected _type: WorldItemType;
    
    get prefabPath(): string { return this._prefabPath; }
    protected _prefabPath: string;
    
    get destroyed(): boolean { return this._destroyed; }
    protected _destroyed: boolean = false;

    get worldPosition(): vec2 { return this._worldPosition; }
    protected _worldPosition: vec2 = { x: 0, y: 0 };

    get scale(): number { return this._scale; }
    protected _scale: number = 1;

    get size(): size { return this._size; }
    protected _size: size = { width: 100, height: 100 }

    get rotation(): number { return this._rotation; }
    protected _rotation: number = 0;

    get opacity(): number { return this._opacity; }
    protected _opacity: number = 255;

    get allEvents(): Event[] { return [this.onDestroyEvent, this.onOpacityChanged, this.onRotationChanged, this.onScaleChanged, this.onWorldPositionChanged] }

    applyData(data: IWorldItemData) {
        this._type = data.type;
        this._prefabPath = data.prefabPath;

        data.worldPosition && (this._worldPosition = { ...data.worldPosition });
        data.scale && (this._scale = data.scale);
        data.rotation && (this._rotation = data.rotation);
        data.opacity && (this._opacity = data.opacity);
        data.size && (this._size = data.size);
    }

    changeOpacity(opacity: number) {
        if (opacity === this._opacity) return;

        this._opacity = opacity;
        this.onOpacityChanged.dispatch(this._opacity);
    }

    changeRotation(rotation: number) {
        if (rotation === this._rotation) return;

        this._rotation = rotation;
        this.onRotationChanged.dispatch(this._rotation);
    }

    changeScale(scale: number) {
        if (scale === this._scale) return;

        this._scale = scale;
        this.onScaleChanged.dispatch(this._scale);
    }

    changeWorldPosition(worldPosition: vec2) {
        if (v2.pointsEqual(worldPosition, this._worldPosition)) return;

        this._worldPosition = worldPosition;
        this.onWorldPositionChanged.dispatch(this._worldPosition);
    }

    destroy() {
        if (this._destroyed) return;

        this._destroyed = true;
        this.onDestroyEvent.dispatch();
        this.onDestroy();
    }

    onDestroy(): void { }
}