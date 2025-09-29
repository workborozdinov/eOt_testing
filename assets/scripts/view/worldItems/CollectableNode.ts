import { Collectable } from "../../model/worldItems/Collectable";
import { PropNode } from "./PropNode";
import { _decorator } from "cc";

const { ccclass } = _decorator;

@ccclass
export class CollectableNode extends PropNode<Collectable> {
    
}