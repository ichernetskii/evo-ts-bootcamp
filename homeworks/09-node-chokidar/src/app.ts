import {DirWatcher} from "./dirwatcher";
import {Importer} from "./importer";

const dirWatcher = new DirWatcher();
dirWatcher.watch("src/data", 1000);

const importer = new Importer();
importer.listen(dirWatcher);
