import { Decal } from "../../model/worldItems/Decal";
import { WorldItemNode } from "./WorldItemNode";
import { _decorator } from "cc";

const { ccclass } = _decorator;

@ccclass
export class DecalNode extends WorldItemNode<Decal> { }