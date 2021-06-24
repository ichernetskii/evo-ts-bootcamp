import * as React from "react";
import s from  "./app.module.scss";
import {IWorld3d, World3d} from "../../assets/world3d";
import {useStore} from "../../store/store";
import {useEffect} from "react";

const App: React.FC<{}> = () => {
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
    const world3d = React.useRef<IWorld3d | null>(null);
    const store = useStore("gameField");
    React.useLayoutEffect(() => {
        if (canvasRef.current) {
            world3d.current = new World3d(canvasRef.current, store);
        }
    }, []);

    useEffect(() => {
        canvasRef.current?.focus();
    }, []);

    return (
        <div className={s.app}>
            <canvas ref={canvasRef} tabIndex={0} />
        </div>
    );
};

export default App;
