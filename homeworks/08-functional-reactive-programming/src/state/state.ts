export interface IAction {
    type: string,
    payload?: any
}

enum ActionType {
    Add = "Add",
    Null = "Null"
}

export const Add  = () => ({ type: ActionType.Add  })
export const Null = () => ({ type: ActionType.Null })

export function stateReducer( state: number, action: IAction): number {
    switch (action.type) {
        case ActionType.Add:    return state + 1;
        case ActionType.Null:   return 0;
        default:                return state;
    }
}
