import { IGenerationCollectablesData } from "../../interfaces/Data";
import { LoaderService } from "../../services/LoaderService";
import { LocationService } from "../../services/LocationService";
import { SystemType } from "../../services/SystemService";
import { TrajectoryService } from "../../services/TrajectoryService";
import { inject } from "../../utils/DIUtils";
import { getRandomInRange, vec2 } from "../../utils/Utils";
import { System } from "../core/System";

export default class GenerationCollectablesSystem extends System {
    @inject(() => LocationService) private readonly _locationService: LocationService;
    @inject(() => LoaderService) private readonly _loaderService: LoaderService; 
    @inject(() => TrajectoryService) private readonly _trajectoryService: TrajectoryService

    protected _type: SystemType = SystemType.GENERATION_COLLECTABLES;
    private _generationData: IGenerationCollectablesData
    private _accTime: number = 0;

    async init() {
        this._locationService.onChangeLocation.add(this, async () => await this._setCurrentGenerationData());

        await this._setCurrentGenerationData();
    }

    update(dt: number) {
        if (!this.isEnabled) return;

        this._accTime += dt;
        if (this._accTime > this._generationData.period) {

            this._generate();
            this._accTime = 0;
        }
    }

    private _generate() {
        const spawnPoint = this._generateRandomPointInRect();
        const trajectoryData = this._trajectoryService.getRandomTrajectory();
        const collectableData = this._getRandomCollectablesData();  
        
        collectableData.trajectoryData = trajectoryData;
        collectableData.worldPosition = { ...spawnPoint }

        this._locationService.currentLocation.spawn(collectableData);
    }

    private _generateRandomPointInRect(): vec2 {
        return {
            x: this._generationData.spawnRect.x +  -this._generationData.spawnRect.width / 2 + Math.random() * this._generationData.spawnRect.width,
            y: this._generationData.spawnRect.y + -this._generationData.spawnRect.height / 2 + Math.random() * this._generationData.spawnRect.height
        }
    }

    private _getRandomCollectablesData() {
        const randomIndex = getRandomInRange(0, this._generationData.collectablesData.length - 1)
        return this._generationData.collectablesData[randomIndex];
    }

    private async _setCurrentGenerationData() {
        this.isEnabled = false;
        this._generationData = null;

        this._generationData = await this._loaderService.loadJson(this._locationService.currentLocation.generationCollectablesDataPath) as IGenerationCollectablesData;
        this.isEnabled = true;
    }

    onDestroy(): void { }
}