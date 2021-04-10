import {
  ToggleReducerTypes,
  WARNING_OPEN,
  WARNING_CLOSE,
  MODIMAGE_OPEN,
  MODIMAGE_CLOSE,
  DROPDOWN_TOGGLE,
  AUTHFORM_TOGGLE,
  RESET_TOGGLE,
  NOTIFICATIONS_TOGGLE,
  CHAT_OPEN,
  CHAT_TOGGLE,
  LIGHTBOX_OPEN,
  LIGHTBOX_CLOSE,
  LIGHTBOX_MOVE,
  MENU_PAGE_TOGGLE,
  LIGHTBOX_LIGHT_OPEN,
  LIGHTBOX_LIGHT_CLOSE,
} from "./toggleTypes"

interface IInitState {
  dropDown: boolean
  authForm: boolean
  chat: boolean
  notifications: boolean
  menuPage: boolean
  warning: {
    toggle: boolean
    action(): any
    title: string
  }
  modImage: {
    toggle: boolean
    id: string
    content: string
    type: string
    singleImg: boolean
    onCreate?(): any
    onEdit?(): any
    onRemove?(): any
    isFile?: boolean
  }
  lightbox: {
    toggle: boolean
    imageId: string
    singleImg: boolean
    onMove(isRight: boolean, imageId: string): any
    isLeft: boolean
    isRight: boolean
    handleEditImage(imageId: string): any
  }
  lightboxlight: {
    image: string
    title: string
    toggle: boolean
  }
}

const initState: IInitState = {
  dropDown: false,
  authForm: false,
  chat: false,
  notifications: false,
  menuPage: false,
  warning: {
    toggle: false,
    action: () => {},
    title: "",
  },
  modImage: {
    toggle: false,
    id: "",
    content: "",
    type: "",
    singleImg: false,
    onCreate: () => {},
    onEdit: () => {},
    onRemove: () => {},
    isFile: false,
  },
  lightbox: {
    toggle: false,
    imageId: "",
    singleImg: false,
    onMove: () => {},
    isLeft: false,
    isRight: false,
    handleEditImage: () => {},
  },
  lightboxlight: {
    toggle: false,
    image: "",
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
    case LIGHTBOX_OPEN:
      return {
        ...initState,
        lightbox: {
          ...state.lightbox,
          toggle: true,
          imageId: action.payload.imageId,
          singleImg: !!action.payload.singleImg,
          onMove: action.payload.onMove,
          isLeft: action.payload.isLeft,
          isRight: action.payload.isRight,
          handleEditImage: action.payload.handleEditImage,
        },
      }
    case LIGHTBOX_LIGHT_OPEN:
      return {
        ...initState,
        lightboxlight: {
          ...state.lightboxlight,
          toggle: true,
          image: action.payload.image,
          title: action.payload.title,
        },
      }
    case LIGHTBOX_LIGHT_CLOSE:
      return {
        ...initState,
        lightboxlight: {
          ...state.lightboxlight,
          toggle: false,
        },
      }
    case LIGHTBOX_CLOSE:
      return {
        ...initState,
        lightbox: {
          ...state.lightbox,
          toggle: false,
          handleEditImage: () => {},
        },
      }
    case LIGHTBOX_MOVE:
      return {
        ...initState,
        lightbox: {
          ...state.lightbox,
          imageId: action.payload.imageId,
          isLeft: action.payload.isLeft,
          isRight: action.payload.isRight,
        },
      }
    case CHAT_TOGGLE:
      return {
        ...initState,
        chat: !state.chat,
      }
    case MENU_PAGE_TOGGLE:
      return {
        ...initState,
        menuPage: !state.menuPage,
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
    case MODIMAGE_OPEN:
      return {
        ...initState,
        modImage: {
          toggle: true,
          id: action.payload.id,
          content: action.payload.content,
          type: action.payload.type,
          singleImg: !!action.payload.singleImg,
          onCreate: action.payload.onCreate,
          onEdit: action.payload.onEdit,
          onRemove: action.payload.onRemove,
          isFile: !!action.payload.isFile,
        },
      }
    case MODIMAGE_CLOSE:
      return {
        ...initState,
        modImage: {
          ...state.modImage,
          toggle: false,
          onCreate: () => {},
          onEdit: () => {},
          onRemove: () => {},
        },
      }
    case RESET_TOGGLE:
      return {
        ...initState,
        warning: { ...state.warning, action: () => {}, toggle: false },
        modImage: {
          ...state.modImage,
          toggle: false,
          onCreate: () => {},
          onEdit: () => {},
          onRemove: () => {},
        },
        lightbox: {
          ...state.lightbox,
          toggle: false,
          handleEditImage: () => {},
        },
      }
    default:
      return state
  }
}

export default toggleReducer
