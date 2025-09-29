import { _decorator, Component, Node } from 'cc';
import { WorldItemType } from '../model/enums/WorldItemType';
import { WorldItemNode } from './worldItems/WorldItemNode';

const { ccclass } = _decorator;

const FX_LAYER = 'fx';
const DECAL_LAYER = 'decals';
const OBJECT_LAYER = 'objects';

@ccclass('LayersNode')
export class LayersNode extends Component {
    get objectLayer(): Node { return this._objectLayer; }
    private _objectLayer: Node;

    get fxLayer(): Node { return this._fxLayer; }
    private _fxLayer: Node;

    get decalLayer(): Node { return this._decalLayer; }
    private _decalLayer: Node;
    
    init() {
        this._prepareLayers();
    }

    private _prepareLayers() {
        this._decalLayer = new Node(DECAL_LAYER);
        this._objectLayer = new Node(OBJECT_LAYER);
        this._fxLayer = new Node(FX_LAYER);
        
        this.node.addChild(this._decalLayer);
        this.node.addChild(this._objectLayer);
        this.node.addChild(this._fxLayer);
    }

    private _getParentLayer(type: WorldItemType) {
        switch (type) {
            case WorldItemType.DECAL: return this._decalLayer;
            default: return this._objectLayer;
        }
    }

    addWorldItem(node: Node) {
        const model = node.getComponent(WorldItemNode).model;
        const parent = this._getParentLayer(model.type);

        parent.addChild(node);
    }
}


