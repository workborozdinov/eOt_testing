import { CollectableType } from "../model/enums/CollectableType";
import { TrajectoryType } from "../services/enums/TrajectoryType";
import { WorldItemType } from "../model/enums/WorldItemType";
import { OBB, rect, size, vec2 } from "../utils/Utils";

export interface ILocationData {
    playtime: number;
    health: number;
    generationCollectablesDataPath: string;
    worldItems: IWorldItemData[];
}

export interface IWorldItemData {
    prefabPath: string;
    type: WorldItemType;
    worldPosition?: vec2;
    scale?: number;
    rotation?: number;
    opacity?: number;
    size?: size;
}

export interface IDecalData extends IWorldItemData { }

export interface IPropData extends IWorldItemData {
    obb: OBB;
}

export interface ICollectableData extends IPropData {
    collectableType: CollectableType;
    value: number;
    trajectoryData?: ITrajectoryData;
}

export interface ICatcherData extends IPropData {
    movementVector: vec2;
}

export interface IZoneData extends IPropData { }

export interface ITrajectoryData {
    type: TrajectoryType;
    velocity: number;
    direction: vec2;
    initVelocity: number;
}

export interface ILinearTrajectoryData extends ITrajectoryData { }

export interface AccelerateTrajectoriesData extends ILinearTrajectoryData {
    acceleration: number;
}

export interface IZigZagTrajectoriesData extends ILinearTrajectoryData {
    amplitude: number;
    frequency: number;
}

export interface IGenerationCollectablesData {
    spawnRect: rect;
    period: number;
    collectablesData: ICollectableData[];
}