import { injectable, inject, DI as DI_utils, Service  } from "../utils/DIUtils";
import { Event } from "../utils/Event";
import { Node, Canvas, director } from "cc";
import UIView from "../view/UIViewService";
import { LoaderService } from "./LoaderService";
import { MouseService } from "./MouseService";
import WorldViewService from "../view/WorldViewService";
import { LocationService } from "./LocationService";
import { SystemService } from "./SystemService";

const DI = DI_utils.container;



@injectable('BootstrapService')
export class BootstrapService implements Service {
    @inject(() => LoaderService) private readonly _loaderService: LoaderService;
    @inject(() => LocationService) private readonly _locationService: LocationService;

    readonly whenLoadServices = new Event(this);

    private _loadPromise: Promise<any>;
    private _loadUIPromise: Promise<any>;
    private _loadWorldPromise: Promise<any>;

    get diPromise() { return this._loadPromise; }
    
    get mainCanvas() { return this._mainCanvas ??= director.getScene().getComponentInChildren(Canvas); }
    private _mainCanvas: Canvas;

    load() {
        this._loadPromise = DI.loadServices().then(() => this.whenLoadServices.dispatch());
        this._loadUIPromise = this._loadPromise.then(this._loadUI.bind(this));
        this._loadWorldPromise = this._loadUIPromise.then(this._loadWorld.bind(this));

        return this._loadWorldPromise;
    }

    private async _loadUI() {
        const ui = (await this._addWithLoad("ui/UI")).getComponent(UIView);
        DI.bindInstance(ui).toSelf();
        DI.bindInstance(ui.getComponentInChildren(MouseService)).toSelf();
    }
    
    private async _loadWorld() {
        const worldViewService = (await this._addWithLoad("world/WorldNode")).getComponent(WorldViewService);
        DI.bindInstance(worldViewService).toSelf();
        await worldViewService.init();

        const systemService = worldViewService.node.getComponentInChildren(SystemService);
        DI.bindInstance(systemService).toSelf();
        await systemService.init();
        systemService.enableAllSystem();

        this._locationService.currentLocation.onStartSession.dispatch();
    }

    private readonly _addWithLoad = async (path: string) => this._addToRoot(await this._loaderService.loadNode(path));
    private readonly _addToRoot = (node: Node) => {
        this.mainCanvas.node.addChild(node);
        return node;
    }

    onDestroy() {}
}