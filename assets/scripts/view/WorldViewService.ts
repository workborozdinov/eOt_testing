import { _decorator, Component, Node, Size, UITransform } from 'cc';
import { inject, injectable, Service } from '../utils/DIUtils';
import { LocationService } from '../services/LocationService';
import { LayersNode } from './LayersNode';
import { WorldItem } from '../model/worldItems/WorldItem';
import { LoaderService } from '../services/LoaderService';
const { ccclass, property } = _decorator;

@injectable('WorldViewService')
@ccclass
export default class WorldViewService extends Component implements Service {    
    @inject(() => LocationService) private readonly _locationService: LocationService;
    @inject(() => LoaderService) private readonly _loaderService: LoaderService;

    @property(LayersNode) readonly layerNode: LayersNode = null;

    get worldSize(): Size { return this._worldSize; }
    private _worldSize: Size

    async init() {
        this.layerNode.init();
        await Promise.all(this._locationService.currentLocation.allIModels.map(item => this._addWorldItem(item)));
        this._worldSize = this.node.getComponent(UITransform).contentSize;

        this._locationService.currentLocation.onSpawnNewModel.add(this, model => this._addWorldItem(model));
    }

    private async _addWorldItem<T extends WorldItem>(model: T): Promise<Node> {
        const node = await this._loaderService.loadWorldItemNode(model);
        this.layerNode.addWorldItem(node);
        return node;
    }

    onDestroy(): void { }
}