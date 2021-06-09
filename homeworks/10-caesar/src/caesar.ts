import {Transform, TransformCallback} from "stream";

export class Caesar {
    public constructor(private text: string) { }

    set setText(text: string) {
        this.text = text;
    }

    private action(shift: number) {
        Array.from(this.text).forEach(letter => {
            if (letter.search(/[a-zA-Z\s]/g) !== 0) throw new Error(`${letter} isn't a letter`);
        });

        const code_a = "a".charCodeAt(0);
        const code_A = "A".charCodeAt(0);

        return Array.from(this.text).map(letter => {
            if (letter.search(/\s/g) !== -1) return letter;
            const firstLetter = (letter.search("[a-z]") === 0) ? code_a : code_A;
            const newCharCode = (letter.charCodeAt(0) + shift - firstLetter + 26) % 26 + firstLetter;
            return String.fromCharCode(newCharCode);
        }).join("");
    }

    public encode(shift: number) {
        return this.action(shift);
    }

    public decode(shift: number) {
        return this.action(-shift);
    }
}

export enum IAction {
    Encode = "encode",
    Decode = "decode"
}

export class CaesarStream extends Transform {
    private data: string;

    constructor(private shift: number, private mode: IAction) {
        super();
    }

    _transform(chunk: string, encoding: string, callback: () => void) {
        const caesar = new Caesar(chunk.toString());
        this.data = this.mode === IAction.Encode ? caesar.encode(+this.shift) : caesar.decode(+this.shift);
        this.push(this.data);
        callback();
    }
}
