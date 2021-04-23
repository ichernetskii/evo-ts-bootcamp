export const delay = (ms: number) => new Promise(resolve => { setTimeout(resolve, ms) });

export function randomIntFromInterval(min: number, max: number):number {
// min and max included 
return Math.floor(Math.random() * (max - min + 1) + min);
}

export function randomArray(length: number = 10, from: number = 0, to: number = 100):number[] {
    return Array.from({length}, () => randomIntFromInterval(from, to));
}
