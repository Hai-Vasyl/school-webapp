export const SET_AUTH = "SET_AUTH"
export const SET_USER_DATA = "SET_USER_DATA"
export const RESET_AUTH = "RESET_AUTH"

export type User = {
  id: string
  email: string
  ava: string
  firstname: string
  lastname: string
  phone: string
  address: string
  birth: string
  date: string
  color: string
  confirmed: boolean
  middlename: string
  role: string
}

export type Auth = {
  userId: string
  token: string
  init: boolean
}

export interface SetAuth {
  type: typeof SET_AUTH
  payload: Auth
}

export interface SetUserData {
  type: typeof SET_USER_DATA
  payload: User
}

export interface ResetAuth {
  type: typeof RESET_AUTH
}

export type AuthReducerTypes = SetAuth | SetUserData | ResetAuth
