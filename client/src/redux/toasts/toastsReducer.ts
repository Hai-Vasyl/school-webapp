import { ToastsReducerTypes, SET_TOASTS, SET_TOAST } from "./toastsTypes"
import { IToast } from "../../interfaces"

interface IInitState {
  toasts: IToast[]
}

const initState: IInitState = {
  toasts: [],
}

const toastsReducer = (state = initState, action: ToastsReducerTypes) => {
  switch (action.type) {
    case SET_TOAST:
      return {
        ...state,
        toasts: [...state.toasts, action.payload],
      }
    case SET_TOASTS:
      return {
        ...state,
        toasts: action.payload,
      }
    default:
      return state
  }
}

export default toastsReducer
