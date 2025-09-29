import { Constructor } from "cc";
import { Event } from "../utils/Event";
import { WorldItem } from "./worldItems/WorldItem";
import { WorldItemType } from "./enums/WorldItemType";
import { Decal } from "./worldItems/Decal";
import { IWorldItemData, ILocationData } from "../interfaces/Data";
import { Catcher } from "./worldItems/Catcher";
import { Collectable } from "./worldItems/Collectable";
import { DestroyZone } from "./worldItems/DestroyZone";

const WORLD_ITEM_CONSTRUCTOR_MAP = new Map<WorldItemType, Constructor<WorldItem>> ([
    [WorldItemType.DECAL, Decal],
    [WorldItemType.CATCHER, Catcher],
    [WorldItemType.COLLECTABLE, Collectable],
    [WorldItemType.DESTROY_ZONE, DestroyZone],
]);

export class LocationModel {
    readonly onStartSession = new Event(this);
    readonly onPauseSession = new Event(this);
    readonly onResumeSession = new Event(this);
    readonly onEndSession = new Event(this);

    readonly onIncreaseHealth = new Event<number>(this);
    readonly onDecreaseHealth = new Event<number>(this);

    readonly onChangeScore = new Event<number>(this);

    readonly onSpawnNewModel = new Event<WorldItem>(this);

    get health(): number { return this._health; }
    private _health: number
    
    get playtime(): number { return this._playtime; }
    private _playtime: number

    get currentHealth(): number { return this._currentHealth; }
    private _currentHealth: number;

    get score(): number { return this._score; }
    private _score: number = 0;

    get generationCollectablesDataPath(): string { return this._generationCollectablesDataPath; }
    private _generationCollectablesDataPath: string

    get allIModels(): WorldItem[] { return Array.from(this._models.values()).flat(); }
    get models(): ReadonlyMap<WorldItemType, WorldItem[]> { return this._models; }
    private _models: Map<WorldItemType, WorldItem[]> = new Map();

    addToScore(addValue: number) {
        this._score += addValue;

        this.onChangeScore.dispatch(this._score);
    }

    decreaseHealth(decreaseValue: number) {
        if (this._currentHealth <= 0) return;
        
        const newHealth = this._currentHealth - decreaseValue;
        this._currentHealth = newHealth < 0 ? 0 : newHealth;

        !this._currentHealth && this.onEndSession.dispatch();
        this.onDecreaseHealth.dispatch(decreaseValue);
    }

    increaseHealth(increaseHealth: number) {
        if (this._currentHealth === this._health) return;
        
        const newHealth = this._currentHealth + increaseHealth;
        this._currentHealth = newHealth > this._health ? this._health : newHealth;
        
        this.onDecreaseHealth.dispatch(increaseHealth);
    }

    async init(locationData: ILocationData) {
        this._health = this._currentHealth = locationData.health;
        this._playtime = locationData.playtime;
        this._generationCollectablesDataPath = locationData.generationCollectablesDataPath; 

        this._models = locationData.worldItems.reduce((map, worldItemData) => {
            const model = this._createModel(worldItemData);
            const itemsByType = map.get(model.type);

            if (itemsByType) itemsByType.push(model)
            else map.set(model.type, [model]);

            return map;
        }, new Map<WorldItemType, WorldItem[]>());
    }

    private _createModel<T extends IWorldItemData>(data: T): WorldItem | null {
        if (!WORLD_ITEM_CONSTRUCTOR_MAP.has(data.type)) return null;

        const constructor = WORLD_ITEM_CONSTRUCTOR_MAP.get(data.type);
        const worldItemModel = new constructor();
        worldItemModel.applyData(data);

        return worldItemModel;
    }

    spawn(data: IWorldItemData) {
        const model = this._createModel(data);
        const itemsByType = this._models.get(model.type);

        if (itemsByType) itemsByType.push(model)
        else this._models.set(model.type, [model]);

        this.onSpawnNewModel.dispatch(model);
    }

    onDestroy() { }
}