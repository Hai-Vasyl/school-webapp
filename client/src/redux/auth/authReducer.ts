import { AuthReducerTypes, SET_AUTH, Auth } from "./authTypes"

const initState: Auth = {
  token: "",
  user: {
    id: "",
    username: "",
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

const authReducer = (state = initState, action: AuthReducerTypes): Auth => {
  switch (action.type) {
    case SET_AUTH:
      if (action.payload.init) {
        return action.payload.auth
      }
      localStorage.setItem("auth", JSON.stringify(action.payload.auth))
      return action.payload.auth
    default:
      return state
  }
}

export default authReducer
