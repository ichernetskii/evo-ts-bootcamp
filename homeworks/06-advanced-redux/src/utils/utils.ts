import {Errors} from "./errors";
import {PizzaEvent} from "../types";

export function assertNever(arg: never): never {
    throw new Error(`${Errors.UnexpectedArg}: ${arg}`);
}

export const fetchServer = (data: PizzaEvent) => {
    fetch('http://localhost:3001/log', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then((json) => {
        console.log(json);
    }).catch((ex) => {
        console.log(ex)
    });
}