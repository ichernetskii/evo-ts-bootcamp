import {program} from "commander";
import {createReadStream, createWriteStream} from "fs";
import {CaesarStream, IAction} from "./caesar";
import {pipeline} from "stream";

interface IOptions {
    shift: number,
    action: IAction
    input?: string,
    output?: string,
}

program
    .version("1.0.0")
    .option("-i, --input <string>", "Specify the file where to get the data from. If option is omitted console will be used as an input source. Use Ctrl+C for break input.")
    .option("-o, --output <string>", "Specify the file to save the data to. If option is omitted console will be used as an output source.")
    .option("-s, --shift <number>", "Set the shift for decode/encode data")
    .option("-a, --action <IAction>", "Specify what action you want to perform");

program.parse(process.argv);
const options: IOptions = program.opts() as IOptions;
const {input, output, shift, action} = options;
const readStream = input ? createReadStream(input, "utf8") : process.stdin;
const writeStream = output ? createWriteStream(output,"utf8") : process.stdout;
const caesarStream = new CaesarStream(shift, action);

pipeline(
    readStream,
    caesarStream,
    writeStream,
    err => console.error(err)
)
