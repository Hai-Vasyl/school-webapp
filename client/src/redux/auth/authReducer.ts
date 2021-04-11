import {
  AuthReducerTypes,
  SET_AUTH,
  RESET_AUTH,
  SET_USER_DATA,
  User,
} from "./authTypes"

interface IInitState {
  token: string
  user: User
}

const initState: IInitState = {
  token: "",
  user: {
    id: "",
    email: "",
    ava: "",
    firstname: "",
    lastname: "",
    phone: "",
    address: "",
    birth: "",
    date: "",
    color: "",
    confirmed: true,
    middlename: "",
    role: "unregistered",
  },
}

const authReducer = (
  state = initState,
  action: AuthReducerTypes
): IInitState => {
  switch (action.type) {
    case SET_USER_DATA:
      return {
        ...state,
        user: action.payload,
      }
    case SET_AUTH:
      const token = action.payload.token
      const userId = action.payload.userId
      if (!action.payload.init) {
        localStorage.setItem("auth", JSON.stringify({ token, userId }))
      }
      return {
        ...state,
        token,
        user: { ...state.user, id: userId },
      }
    case RESET_AUTH:
      localStorage.setItem("auth", JSON.stringify({ token: "", userId: "" }))
      return initState
    default:
      return state
  }
}

export default authReducer
