export const SET_TOAST = "SET_TOAST"
export const SET_TOASTS = "SET_TOASTS"
import { IToast } from "../../interfaces"

interface SetToast {
  type: typeof SET_TOAST
  payload: IToast
}

interface SetToasts {
  type: typeof SET_TOASTS
  payload: IToast[]
}

export type ToastsReducerTypes = SetToast | SetToasts
