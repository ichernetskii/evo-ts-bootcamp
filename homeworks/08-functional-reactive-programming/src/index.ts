import {BehaviorSubject, fromEvent, Observable, timer} from "rxjs";
import {map, mapTo, scan, startWith, switchMap, tap, withLatestFrom} from "rxjs/operators";

import "./index.scss";
import {
    addRandomRoach,
    addRandomWindows,
    getRoachPosition,
    IGameField,
    initializeGameField, isShootSuccessful,
    removeRoach
} from "./gameTransforms";
import {IncrementRoachCounter, IAction, ResetRoachCounter, stateReducer} from "./state/state";
import {$btnNewHouse, $canvas, $imageRoach, $imageWall, $imageWindow, $score, renderGameField} from "./render";

const imagesLoaded$ = new Observable(subscriber => {
    const imagesArray = [$imageWindow, $imageWall, $imageRoach];
    let loadedImages = 0;
    imagesArray.forEach(image => image.onload = () => {
        loadedImages++;
        if (loadedImages === imagesArray.length) subscriber.complete();
    })
})

imagesLoaded$.subscribe({
    complete: () => {
        if ($btnNewHouse) {
            const actions$ = new BehaviorSubject<IAction>(ResetRoachCounter());
            const state$ = actions$
                .pipe(
                    startWith(0),
                    scan(stateReducer)
                )
                .subscribe((value) => {
                    $score && ($score.textContent = value.toString());
                })

            const gameField$ = fromEvent($btnNewHouse, "click")
                .pipe(
                    tap(() => actions$.next(ResetRoachCounter())),
                    startWith(42),
                    map(initializeGameField(10, 8)),
                    map(addRandomWindows(10)),
                    switchMap((gameField: IGameField) => timer(0, 1500)
                        .pipe(
                            mapTo(gameField),
                            map(removeRoach),
                            map(addRandomRoach),
                            tap(renderGameField),
                            map(getRoachPosition)
                        )),
                );

            const player$ = fromEvent<MouseEvent>($canvas, "click")
                .pipe(
                    map(({offsetX, offsetY}) => ({
                        x: offsetX, y: offsetY
                    })),
                    withLatestFrom(gameField$),
                    tap(([player, roach]) => {
                        if (isShootSuccessful(player, roach)) {
                            actions$.next(IncrementRoachCounter())
                        }
                    })
                )
                .subscribe();
        }
    }
})
