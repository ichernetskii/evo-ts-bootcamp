export interface IAction {
    type: string,
    payload?: any
}

enum ActionType {
    Increment = "Increment",
    Reset = "Reset"
}

export const IncrementRoachCounter  = () => ({ type: ActionType.Increment  })
export const ResetRoachCounter = () => ({ type: ActionType.Reset })

export function stateReducer( state: number, action: IAction): number {
    switch (action.type) {
        case ActionType.Increment:  return state + 1;
        case ActionType.Reset:      return 0;
        default:                    return state;
    }
}
