import { Prop } from "../../model/worldItems/Prop";
import { WorldItemNode } from "./WorldItemNode";
import { _decorator } from "cc";

const { ccclass } = _decorator;

@ccclass
export class PropNode<T extends Prop = Prop> extends WorldItemNode<T> { }