import getRNGPoints from "./fieldUtils";
import {servers} from "./config";

export async function request(url, body = null, method = "POST", headers = {}) {
    if (body) {
        body = JSON.stringify(body);
        headers["Content-Type"] = "application/json;charset=utf-8";
    }

    const response = await fetch(url, {method, headers, body});
    const data = await response.json();

    if (!response.ok) {
        const e = new Error();
        e.message = data.message || "Error";
        if (Array.isArray(data.errors) && data.errors.length !== 0) e.errors = data.errors;
        throw e;
    }

    return data;
}

export const cube_distance = (a, b) => Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y), Math.abs(a.z - b.z));

export const evenq_to_cube = ({row, col}) => {
    const x = col;
    const z = row - (col + (col&1)) / 2;
    const y = -x-z;
    return { x, y, z }
}

export const cube_to_evenq = cube => {
    const col = cube.x;
    const row = cube.z + (cube.x + (cube.x & 1)) / 2;
    return {row, col}
}

export const flat_hex_to_pixel = (hex, size) => {
    const x = size * (3. / 2 * hex.x)
    const y = size * (Math.sqrt(3) / 2 * hex.x + Math.sqrt(3) * hex.z)
    return { x, y }
}

export const evenq_offset_to_pixel = (size, col, row, radius) => {
    const x = (size * 3/2 * (col + radius-1))/2;
    const y = (size * Math.sqrt(3) * ((row+radius-1) - 0.5 * (col&1)))/2;
    return { x, y }
}

export const centralHex = { x: 0, y: 0, z: 0 };

export const findHex = (dataArray, item) => {
    if (!item || !("x" in item) || !("y" in item) || !("z" in item)) return null;
    return dataArray.find(d => d.x === item.x && d.y === item.y && d.z === item.z)
}

export const sortHex = (arr, field) => {
    arr.sort((a, b) => {
        return cube_to_evenq(a)[field] - cube_to_evenq(b)[field];
    })
}

export const compareHexArray = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;
    // ex: [ {x: 1, y: 0, z: -1, data: 8}, { ... }, { ... } ]
    for (let item1 of arr1) {
        if (!arr2.find(
            item2 =>
                item1.x === item2.x &&
                item1.y === item2.y &&
                item1.z === item2.z &&
                item1.value === item2.value
        )) return false;
    }
    return true;
}

export const isValuesDifferentHexArray = arr => {
    return arr.every(item => arr.filter(f => f.value === item.value).length === 1);
}

export const getHexNeighbors = hex => {
    let result = [];

    ["x", "y", "z"].forEach((direction, _, arrDirections) => {
        [-1, 1].forEach(operation => {
            const neighbor = {
                [direction]: hex[direction],
                ...Object.fromEntries(arrDirections
                    .filter(dir => dir !== direction)
                    .map((dir, i) => [[dir], hex[dir] + operation*(i%2*2 - 1)])
                )
            }
            result.push(neighbor);
        })
    })

    return result;
}

/**
 * Checks that game is over or not
 * @param data Array with hexagons
 * @returns {boolean} Game is over or not
 */
export const checkGameOver = data => {
    let flagGameOver = true;
    // check all hexes has different values
    data.forEach(hex => {
        getHexNeighbors(hex).forEach(coords => {
            const neighbor = findHex(data, coords);
            if (neighbor && neighbor.value === hex.value) flagGameOver = false;
        })
    })
    // check all hexes has values
    data.forEach(hex => {
        if (!hex.value) flagGameOver = false;
    })

    return flagGameOver;
}

/**
 * Checks that game was won or not
 * @param data Array with hexagons
 * @return {boolean} Game was won or not
 */
export const checkWin = data => {
    for(let hex of data) {
        if (hex.value === 2048) {
            return true;
        }
    }
    return false;
}

/**
 * Get new hexagon data from server
 * @param data Array with hexagons
 * @param server Server name
 * @param radius Radius of game field
 * @returns {Promise} Updated hexagon data
 */
export const fetchNewData = async (data, server, radius) => {
    const result = [...data];
    if (!result.length) return [];

    // filter empty items
    const filteredRequest = result.filter(r => r.value);

    const response = server === servers.localdata
        ? getRNGPoints(radius, filteredRequest)
        : await request(`${server}/${radius}`, filteredRequest);

    data.forEach(item => delete item.appeared);

    response.forEach(item => {
        const elem = findHex(result, item);
        if (elem) {
            elem.value = item.value;
            elem.appeared = true
        }
    })

    return result;
}

/**
 * Makes turn in game 2048
 * @param data Array with initial position of hexagons
 * @param {string} direction Direction of turn: "x", "y" or "z"
 * @param {boolean} up Up or down
 * @param radius {number} Radius of game field
 * @returns Array with new positions
 */
export const turn = (data, direction, up, radius) => {
    let acc = [];

    // delete animation class from previous cycle
    data.forEach(d => delete d.added);

    for (let i = 1 - radius; i <= radius - 1; i++) {
        // initial vector - stored data for next use
        // select needed direction & add "0"-value
        let initialVector = data
            .filter(item => item[direction] === i)
            .map(item => ({...item, value: 0}));

        // vector with data to be changed
        let vector = data
            .filter(item => item[direction] === i)
            .filter(v => v.value);

        // sort vector
        if (direction === "x") {
            sortHex(vector, "row");
            sortHex(initialVector, "row");
        } else {
            sortHex(vector, "col");
            sortHex(initialVector, "col");
        }

        // change directions if needed
        if (!up) {
            vector = vector.reverse();
            initialVector = initialVector.reverse();
        }

        // swap values
        for (let i = 0; i < vector.length - 1; i++) {
            if (vector[i].value === vector[i + 1].value) {
                vector[i].value += vector[i + 1].value;
                vector[i].added = true;
                vector[i + 1].value = null;
                i++;
            }
        }

        // filter nulls from prev step
        vector = vector.filter(v => v.value);

        // build result from initialVector & vector
        vector.forEach((item, idx) => {
            initialVector[idx].value = item.value;
            initialVector[idx].added = item.added;
        });

        acc = [...acc, ...initialVector];
    }

    return acc;
}
