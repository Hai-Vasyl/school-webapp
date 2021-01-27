import {
  ToggleReducerTypes,
  WARNING_OPEN,
  WARNING_CLOSE,
  DROPDOWN_TOGGLE,
  AUTHFORM_TOGGLE,
  RESET_TOGGLE,
  NOTIFICATIONS_TOGGLE,
  CHAT_OPEN,
  CHAT_TOGGLE,
} from "./toggleTypes"

interface IInitState {
  dropDown: boolean
  authForm: boolean
  chat: boolean
  notifications: boolean
  warning: {
    toggle: boolean
    action(): any
    title: string
  }
}

const initState: IInitState = {
  dropDown: false,
  authForm: false,
  chat: false,
  notifications: false,
  warning: {
    toggle: false,
    action: () => {},
    title: "",
  },
}

const toggleReducer = (
  state = initState,
  action: ToggleReducerTypes
): IInitState => {
  switch (action.type) {
    case DROPDOWN_TOGGLE:
      return {
        ...initState,
        dropDown: !state.dropDown,
      }
    case AUTHFORM_TOGGLE:
      return {
        ...initState,
        authForm: !state.authForm,
      }
    case NOTIFICATIONS_TOGGLE:
      return {
        ...initState,
        notifications: !state.notifications,
      }
    case CHAT_TOGGLE:
      return {
        ...initState,
        chat: !state.chat,
      }
    case CHAT_OPEN:
      return {
        ...initState,
        chat: true,
      }
    case WARNING_OPEN:
      const { action: funcAction, title } = action.payload
      return {
        ...initState,
        warning: {
          toggle: true,
          action: funcAction,
          title,
        },
      }
    case WARNING_CLOSE:
      return {
        ...initState,
        warning: {
          ...state.warning,
          toggle: false,
          action: () => {},
        },
      }
    case RESET_TOGGLE:
      return {
        ...initState,
        warning: { ...state.warning, action: () => {}, toggle: false },
      }
    default:
      return state
  }
}

export default toggleReducer
