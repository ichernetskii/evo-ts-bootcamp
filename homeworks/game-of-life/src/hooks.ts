import {useLayoutEffect, useRef} from "react";

export const useCanvas = (draw: Function) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	useLayoutEffect(() => {
		const $canvas = canvasRef.current;
		if (!$canvas) return;

		const ctx = $canvas.getContext("2d");
		if (!ctx) return;

		// fix quality
		const dpr = window.devicePixelRatio || 1;
		const {width, height} = $canvas.getBoundingClientRect();

		$canvas.width = width * dpr;
		$canvas.height = height * dpr;

		ctx.scale(dpr, dpr);
		$canvas.style.height = height + "px";
		$canvas.style.width = width + "px";

		draw(ctx);
	}, [draw]);

	return canvasRef;
}
