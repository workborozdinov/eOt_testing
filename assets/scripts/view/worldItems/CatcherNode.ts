import { Catcher } from "../../model/worldItems/Catcher";
import { _decorator } from "cc";
import { WorldItemNode } from "./WorldItemNode";

const { ccclass } = _decorator;

@ccclass
export class CatcherNode extends WorldItemNode<Catcher> { }