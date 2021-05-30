import {CaesarStream, IAction} from "./caesar";
import {PassThrough, pipeline} from "stream";

describe("CaesarStream test", () => {
    const mockedReadStream = new PassThrough();
    const mockedWriteStream = new PassThrough();

    afterEach(() => {
        mockedReadStream.unpipe();
        mockedWriteStream.removeAllListeners();
    })

    afterAll(() => {
        mockedReadStream.end();
        mockedReadStream.destroy();
    })

    test("basic encode test", done => {
        const caesarStream = new CaesarStream(2, IAction.Encode);
        mockedReadStream.pipe(caesarStream).pipe(mockedWriteStream);

        mockedReadStream.push("xyz abc");
        mockedWriteStream.on("data", (chunk) => {
            expect(chunk.toString()).toEqual("zab cde");
            done();
        })
    })

    test("basic decode test", done => {
        const caesarStream = new CaesarStream(2, IAction.Decode);
        mockedReadStream.pipe(caesarStream).pipe(mockedWriteStream);

        mockedReadStream.push("zabcde");
        mockedWriteStream.on("data", (chunk) => {
            expect(chunk.toString()).toEqual("xyzabc");
            done();
        })
    })

    test("multiline encode test", done => {
        const caesarStream = new CaesarStream(2, IAction.Encode);
        mockedReadStream.pipe(caesarStream).pipe(mockedWriteStream);

        mockedReadStream.push("abc\nXyZ\n\n");
        mockedWriteStream.on("data", (chunk) => {
            expect(chunk.toString()).toEqual("cde\nZaB\n\n");
            done();
        })
    })
})
