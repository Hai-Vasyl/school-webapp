import { BsCheckCircle, BsExclamationCircle, BsXCircle } from "react-icons/bs"

export const types = {
  success: {
    keyWord: "success",
    title: "Успіх",
    Icon: BsCheckCircle,
  },
  warning: {
    keyWord: "warning",
    title: "Попередження",
    Icon: BsExclamationCircle,
  },
  error: {
    keyWord: "error",
    title: "Помилка",
    Icon: BsXCircle,
  },
}

export const geMessagePropsByType = (type: string) => {
  switch (type) {
    case types.success.keyWord:
      return types.success
    case types.warning.keyWord:
      return types.warning
    case types.error.keyWord:
      return types.error
  }
}
