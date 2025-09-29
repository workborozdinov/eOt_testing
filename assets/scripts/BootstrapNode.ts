import { _decorator, Component } from 'cc';
import { inject } from './utils/DIUtils';
import { BootstrapService } from './services/BootstrapService';
import { ServiceInstaller } from './services/ServiceInstaller';

const { ccclass } = _decorator;

@ccclass('BootstrapNode')
export class BootstrapNode extends Component {
    @inject(() => BootstrapService) private readonly _bootstrapService: BootstrapService;

    onLoad() {
        ServiceInstaller.bindModel();

        this._bootstrapService.load();

        this.destroy();
    }
}


