import {changedEventName, DirWatcher} from "./dirwatcher";
import * as fs from "fs";
import * as fsPromises from "fs/promises";
import * as csv from "csvtojson";

export class Importer {
    listen(dirWatcher: DirWatcher) {
        dirWatcher.eventEmitter.on(changedEventName, () => {
            dirWatcher.files.forEach(async file => {
                const json = await this.import(file.filename);
                console.log(json);
            })
        })
    }

    async import(path: string) {
        const file = await fsPromises.readFile(path);
        return csv({delimiter: ";"}).fromString(file.toString());
    }

    importSync(path: string): any {
        const file = fs.readFileSync(path);
        return csv({delimiter: ";"}).fromString(file.toString());
    }
}