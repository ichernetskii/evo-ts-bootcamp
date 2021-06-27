import * as React from "react";
import {useLayoutEffect} from "react";
import {World3d} from "../../assets/world3d";
import {useStore} from "../../store/store";
import s from  "./app.module.scss";

const App: React.FC = () => {
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
    const world3d = React.useRef<World3d | null>(null);
    const store = useStore("gameStore");

    useLayoutEffect(() => {
        if (canvasRef.current) {
            canvasRef.current.focus();
            world3d.current = new World3d(canvasRef.current, store);
        }
    }, []);

    return (
        <div className={s.app}>
            <canvas ref={canvasRef} tabIndex={0} />
        </div>
    );
};

export default App;
