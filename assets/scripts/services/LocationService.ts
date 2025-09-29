import { _decorator, JsonAsset } from 'cc';
import { inject, injectable, Service } from '../utils/DIUtils';
import { LoaderService } from './LoaderService';
import { LocationModel } from '../model/Location';
import { Event } from '../utils/Event';
import { ILocationData } from '../interfaces/Data';

const DEFAULT_LOCATION_NAME = 'defaultLocation';
const DIR_LOCATIONS_PATH = 'json/config/locations';

@injectable('LocationService')
export class LocationService implements Service {
    @inject(() => LoaderService) private readonly _loaderService: LoaderService;
    
    private _locationsData: Map<string, ILocationData> = new Map();

    get currentLocation() { return this._currentLocation; }
    private _currentLocation: LocationModel;

    readonly onChangeLocation = new Event(this);

    async load() {
        const jsonLocations = (await this._loaderService.loadResDir(DIR_LOCATIONS_PATH)) as JsonAsset[];
        jsonLocations.map(jsonLocation => this._locationsData.set(jsonLocation.name, jsonLocation.json as ILocationData));

        await this.setLocation();
    }

    async setLocation(name: string = DEFAULT_LOCATION_NAME) {
        this._currentLocation?.onDestroy();
        this._currentLocation = null;
        
        if (!this._locationsData.has(name)) return;

        this._currentLocation = new LocationModel();
        
        await this._currentLocation.init(this._locationsData.get(name));

        this.onChangeLocation.dispatch();
    }

    onDestroy(): void { }
}


