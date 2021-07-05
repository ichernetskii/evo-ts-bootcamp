import * as React from "react";
import { useState } from "react";
import { render } from "react-dom";
import {logger1} from "./shared-file1";
import {logger2} from "./shared-file2";

function App() {
    logger1();
    logger2();

    const [count, setCounter] = useState(0);

    return <>
        <button onClick={() => setCounter(count + 1)}>{`Clicked ${count}`}</button>
    </>;
}

render(<App />, document.getElementById("root"));
