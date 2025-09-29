import { _decorator, Component, instantiate, UIOpacity, v3 } from "cc";
import { WorldItem } from "../../model/worldItems/WorldItem";
import { LoaderService } from "../../services/LoaderService";
import { inject } from "../../utils/DIUtils";

const { requireComponent } = _decorator;

@requireComponent(UIOpacity)
export abstract class WorldItemNode<T extends WorldItem = WorldItem> extends Component {
    @inject(() => LoaderService) private readonly _loaderService: LoaderService;

    get model() { return this._model; }
    private _model: T;

    async setModel(model: T) {
        this._unsubscribeModelEvent();
        this._model = model;
        this._subscribeModelEvents();
        
        await this._updateVisual();
    }

    private _updatePosition() { this.node.setPosition(this._model.worldPosition.x, this._model.worldPosition.y); }
    private _updateRotation() { this.node.angle = this._model.rotation; }
    private _updateScale() { this.node.setScale(v3(this._model.scale, this._model.scale, this.node.scale.z)); }
    private _updateOpacity() { this.node.getComponent(UIOpacity).opacity = this._model.opacity; }
    private _updateAll() {
        this._updatePosition();
        this._updateRotation();
        this._updateScale();
        this._updateOpacity();
    }

    private _subscribeModelEvents() {
        this._model.onDestroyEvent.add(this, () => this.node.destroy() );
        this._model.onWorldPositionChanged.add(this, () => this._updatePosition() );
        this._model.onRotationChanged.add(this, () => this._updateRotation() );
        this._model.onScaleChanged.add(this, () => this._updateScale() );
        this._model.onOpacityChanged.add(this, () => this._updateOpacity() );
    }

    private _unsubscribeModelEvent() { this._model?.allEvents.forEach(e => e.removeAll(this)); }

    private async _updateVisual() {
        const prefab = await this._loaderService.loadPrefab(`world/${this._model.prefabPath}`);
        this.node.addChild(instantiate(prefab));

        this._updateAll();
    }

    onDestroy(): void { }
}