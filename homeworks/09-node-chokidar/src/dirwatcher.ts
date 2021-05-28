import * as fs from "fs/promises";
import * as path from "path";
import {EventEmitter} from "events";

interface IFile {
    filename: string,
    modified: number
}
type IFiles = IFile[];
export const changedEventName = "changed" as const;

const changedFiles = (array1: IFiles, array2: IFiles): boolean => {
    if (!array1 || !array2 || array1.length !== array2.length) return true;
    for (let i = 0; i < array1.length; i++) {
        if (array1[i].filename !== array2[i].filename || array1[i].modified !== array2[i].modified) {
            return true
        }
    }
    return false;
}

export class DirWatcher {
    files: IFiles = [];
    eventEmitter: EventEmitter;

    constructor() {
        this.eventEmitter = new EventEmitter();
    }

    watch(dir: string = "src/data", delay: number = 1000): void {
        setInterval(async () => {
            const filenames = await fs.readdir(dir);
            if (!filenames || !filenames.length) {
                this.eventEmitter.emit(changedEventName);
                return;
            }

            const files: IFiles = [];
            for (let i = 0; i < filenames.length; i++) {
                const filename = filenames[i];
                const globalPath = path.resolve(dir, filename);
                const modified = (await fs.stat(globalPath)).mtimeMs;
                files.push({ filename: globalPath, modified });
            }

            if (changedFiles(files, this.files)) {
                this.files = files;
                this.eventEmitter.emit(changedEventName);
                return;
            }
        }, delay);
    }
}
