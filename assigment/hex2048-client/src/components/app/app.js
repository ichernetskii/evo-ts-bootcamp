import React, {useEffect, useRef, useState} from "react";

// Components
import Hexagon from "../hexagon";

// CSS
import "normalize.css";
import CSSModules from "react-css-modules";
import s from "./app.module.scss";

// Config
import {servers} from "../../js/config.js";

// Utils
import {
    centralHex,
    cube_distance,
    evenq_to_cube,
    flat_hex_to_pixel,
    compareHexArray,
    checkGameOver,
    fetchNewData,
    checkWin,
    turn
} from "../../js/utils.js";

function App() {
    // State
    const [data, setData] = useState([]);
    const [radius, setRadius] = useState(2);
    const [gameStatus, setGameStatus] = useState("initial");
    const [server, setServer] = useState(servers.localdata);
    const [isGameFieldLoading, setGameFieldLoading] = useState(false);
    const ref = useRef(null);

    const width = 600;
    const sizeX = (2 * width) / (3 * radius - 1);
    const sizeY = sizeX * Math.sqrt(3)/2;
    const height = sizeY * (2 * radius - 1);

    // get radius from URI
    useEffect(() => {
        ref.current.focus();
        if (window.location.hash.slice(0, 5) === "#test") {
            const r = window.location.hash.slice(5);
            if (r) setRadius(+r);
        }
    }, []);

    // Update if new radius or server selected
    useEffect(() => {
        setGameFieldLoading(true);
        const newData = [];

        // fill new hexagons
        for (let row = 1 - radius; row <= radius - 1; row++) {
            for (let col = 1 - radius; col <= radius - 1; col++) {
                const cell = evenq_to_cube({row, col});
                if (cube_distance(cell, centralHex) <= radius - 1) newData.push({...cell, value: 0});
            }
        }

        setGameStatus("loading");
        fetchNewData(newData, server, radius)
            .then(fetchedData => {
                setData(fetchedData);
                setGameStatus("playing");
                setGameFieldLoading(false);
            })
            .catch(error => {
                setGameStatus("offline");
            })
    }, [radius, server]);

    const onKeyPressHandler = async e => {
        let direction, up;
        if (["game-over", "win"].includes(gameStatus)) return;

        if (checkGameOver(data)) {
            setGameStatus("game-over");
            return;
        }

        switch (e.key.toUpperCase()) {
            case "W":
                direction = "x";
                up = true;
                break;
            case "S":
                direction = "x";
                up = false;
                break;
            case "Q":
                direction = "z";
                up = true;
                break;
            case "D":
                direction = "z";
                up = false;
                break;
            case "E":
                direction = "y";
                up = false;
                break;
            case "A":
                direction = "y";
                up = true;
                break;
            default: return;
        }

        const dataAfterTurn = turn(data, direction, up, radius);

        if (!compareHexArray(data, dataAfterTurn)) {
            if (checkWin(dataAfterTurn)) {
                setGameStatus("win");
                return;
            }

            setGameStatus("loading");
            try {
                const fetchedData = await fetchNewData(dataAfterTurn, server, radius);
                setGameStatus("playing");
                if (checkGameOver(fetchedData)) {
                    setGameStatus("game-over");
                }
                setData(fetchedData);
            } catch {
                setGameStatus("offline");
            }
        }
    }

    return (
        <div styleName="app" onKeyDown={onKeyPressHandler} tabIndex={0} ref={ref}>
            <div styleName="wrapper">
                <div>
                    Game Status: <span data-status={ gameStatus }>{ gameStatus }</span>
                </div>
                <div>
                    <label>Radius: </label>
                    <select styleName="select" onChange={e => setRadius(+e.target.value)} value={radius} >}
                        {
                            Array(7)
                                .fill(0)
                                .map((_, idx) => idx + 2)
                                .map(item => <option value={item} key={item}>{item}</option>)
                        }
                    </select>
                </div>
                <select id="url-server" defaultValue={servers.localdata} styleName="select select_server" onChange={e => setServer(e.target.value)}>
                    <option id="localdata" value={servers.localdata}>Local data</option>
                    <option id="remote" value={servers.remote}>Remote server</option>
                    <option id="localhost" value={servers.local}>Local server</option>
                </select>
            </div>
            <div styleName="game-field" style={{ width, height: height+5 }}>
                {
                    isGameFieldLoading ?
                        (gameStatus === "offline" ? "OFFLINE" : "LOADING ...") :
                        data.map(item => {
                            const {x, y} = flat_hex_to_pixel(item, sizeX);

                            return <Hexagon
                                x={(x + width  - sizeX)/2}
                                y={(y + height - sizeY)/2}
                                width={sizeX}
                                data={item}
                                key={`${item.x}-${item.y}-${item.value}`}
                                appeared={item.appeared}
                                added={item.added}
                            />
                        })
                }
            </div>
        </div>
    );
}

export default CSSModules(App, s, {
    allowMultiple: true
});
