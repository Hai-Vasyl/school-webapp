import { combineReducers } from "redux"
import authReducer from "./auth/authReducer"
import toggleReducer from "./toggle/toggleReducer"
import toastsReducer from "./toasts/toastsReducer"

const rootReducer = combineReducers({
  auth: authReducer,
  toggle: toggleReducer,
  toasts: toastsReducer,
})

export default rootReducer
