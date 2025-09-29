import { LoadServicePriority, DI as DI_utils } from "../utils/DIUtils";
import { BootstrapService } from "./BootstrapService";
import { LoaderService } from "./LoaderService";
import { LocationService } from "./LocationService";
import { TrajectoryService } from "./TrajectoryService";

const DI = DI_utils.container;

export namespace ServiceInstaller {
    export function bindModel() {
        bindDefaults();
    }

    function bindDefaults() {
        DI.bindInstance(new BootstrapService()).toSelf();
        DI.bindInstance(new TrajectoryService()).toSelf();
        DI.bindInstance(new LocationService()).toSelf().withLoad(LoadServicePriority.MIDDLE);
        DI.bindInstance(new LoaderService()).toSelf().withLoad(LoadServicePriority.HIGH);
    }
}