import { WorldItem } from "../model/worldItems/WorldItem";
import { WorldItemType } from "../model/enums/WorldItemType";
import { injectable, Service } from "../utils/DIUtils";
import { AssetManager, assetManager, SpriteFrame, Asset, instantiate, Prefab, JsonAsset, Node } from "cc";
import { capitalizeFirstSafe, getEnumKeyByValue } from "../utils/Utils";
import { WorldItemNode } from "../view/worldItems/WorldItemNode";

export enum CC_BUNDLE {
    RESOURCES = "resources",
}

@injectable('LoaderService')
export class LoaderService implements Service {
    no_textureSF: SpriteFrame = null;

    async load(): Promise<any> {
        await this.loadBundle(CC_BUNDLE.RESOURCES);
        return  Promise.all([
            this.no_textureSF = await this.loadSpriteFrame('ui/no_texture'),
        ]);
    }

    readonly loadPrefab = (url: string, bundleName = CC_BUNDLE.RESOURCES) => this.loadRes<Prefab>(`prefabs/${url}`, bundleName);
    readonly loadJson = (url: string, bundleName = CC_BUNDLE.RESOURCES) => this.loadRes<JsonAsset>(`json/${url}`, bundleName).then(jsonAsset => jsonAsset.json as Object);
    readonly loadNode = async (url: string, bundleName = CC_BUNDLE.RESOURCES) => instantiate(await this.loadPrefab(url, bundleName));
    readonly loadSpriteFrame = (url: string, bundleName = CC_BUNDLE.RESOURCES) => this.loadRes<SpriteFrame>(`textures/${url}/spriteFrame`, bundleName, SpriteFrame).catch(() => this.no_textureSF);
    readonly loadBundle = (name: CC_BUNDLE) => new Promise<AssetManager.Bundle>(async (resolve, reject) => {
        const params = { cacheAsset: false, cacheEnabled: false };
        const existed = assetManager.getBundle(name);

        if (existed) return resolve(existed);
        
        return assetManager.loadBundle(name, params, (err, bundle) => err ? (console.log(bundle), reject(err)) : (console.log(bundle), resolve(bundle)))
    });

    readonly loadRes = <T extends Asset>(url: string, bundleName: CC_BUNDLE = CC_BUNDLE.RESOURCES, type?: typeof Asset) => new Promise<T>(async (resolve, reject) => 
        (await this.loadBundle(bundleName)).load(url, type, (err, asset) => {
            if (err) { console.warn(`no res for: ${url} in ${bundleName}`, err); return reject(err); }
            resolve(asset as T);
        })
    );

    readonly loadResDir = <T extends Asset>(url: string, bundleName = CC_BUNDLE.RESOURCES, type?: typeof Asset) => new Promise<T[]>(async (resolve, reject) =>
        (await this.loadBundle(bundleName)).loadDir(url, type, (err, assets) => err ? reject(err) : resolve(assets as T[]))
    );

    async loadWorldItemNode(model: WorldItem): Promise<Node> {
        const node = new Node();
        const name = capitalizeFirstSafe(getEnumKeyByValue(WorldItemType, model.type));
        const component: WorldItemNode = node.addComponent(`${name}Node`) as WorldItemNode;
        await component.setModel(model);
        return node;
    }

    onDestroy(): void { }
}


