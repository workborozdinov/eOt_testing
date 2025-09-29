import { _decorator, Component } from 'cc';
import { inject, injectable } from '../utils/DIUtils';
import { Service } from '../utils/DIUtils';
import MovementSystem from '../ECS/Systems/MovementSystem';
import { System } from '../ECS/Core/System';
import CollisionSystem from '../ECS/Systems/CollisionSystem';
import { LocationService } from './LocationService';
import GenerationCollectablesSystem from '../ECS/Systems/GenerationCollectablesSystem';
const { ccclass } = _decorator;

export enum SystemType {
    MOVEMENT,
    COLLISION,
    GENERATION_COLLECTABLES
}

@injectable('SystemService')
@ccclass
export class SystemService extends Component implements Service {    
    @inject(() => LocationService) private readonly _locationService: LocationService;

    private get _allSystems() { return Array.from(this._systems.values()) }
    private _systems: Map<SystemType, System> = new Map();

    async init() {
        await this.initSystems();

        this._locationService.currentLocation.onEndSession.add(this, () => this.disableAllSystem());
    }

    async initSystems() {
        const movementSystem = new MovementSystem();
        const collisionSystem = new CollisionSystem();
        const generationCollectablesSystem = new GenerationCollectablesSystem();
        
        await generationCollectablesSystem.init();
        await movementSystem.init();
        await collisionSystem.init();

        this._systems.set(SystemType.MOVEMENT, movementSystem);
        this._systems.set(SystemType.COLLISION, collisionSystem);
        this._systems.set(SystemType.GENERATION_COLLECTABLES, generationCollectablesSystem);
    }

    enableAllSystem() {
        this._allSystems.forEach(system => system.isEnabled = true);
    }

    disableAllSystem() {
        this._allSystems.forEach(system => system.isEnabled = false);
    }

    update(dt: number) {
        this._allSystems.forEach(system => system.update(dt));
    }

    onDestroy(): void {
        
    }
}


