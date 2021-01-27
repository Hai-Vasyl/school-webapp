import React from "react"
import { types, geMessagePropsByType } from "../modules/messageTypes"
// @ts-ignore
import styles from "../styles/toast.module"

interface IToastInfoProps {
  type: string
  message: string
}

const ToastInfo: React.FC<IToastInfoProps> = ({ type, message }) => {
  const typeNotif = geMessagePropsByType(type)

  const getStyle = () => {
    switch (typeNotif && typeNotif.keyWord) {
      case types.success.keyWord:
        return styles.info__success
      case types.warning.keyWord:
        return styles.info__warning
      case types.error.keyWord:
        return styles.info__error
    }
  }

  return (
    <div className={`${styles.info} ${getStyle()}`}>
      <div className={styles.info__header}>
        <div className={styles.info__icon}>
          {typeNotif && <typeNotif.Icon />}
        </div>
        <div className={styles.info__title}>{typeNotif && typeNotif.title}</div>
      </div>
      <div className={styles.info__body}>{message}</div>
    </div>
  )
}

export default ToastInfo
