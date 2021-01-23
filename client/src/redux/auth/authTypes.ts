export const SET_AUTH = "SET_AUTH"

export type User = {
  id: string
  username: string
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
  group?: {
    owner?: {
      id: string
      username: string
      email: string
      ava: string
      color: string
      firstname: string
      lastname: string
      middlename: string
      role: string
    }
    name: string
    date: string
  }
}

export type Auth = {
  user: User
  token: string
}

export interface SetAuth {
  type: typeof SET_AUTH
  payload: { auth: Auth; init: boolean }
}

export type AuthReducerTypes = SetAuth
