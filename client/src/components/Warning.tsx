import React from "react"
import { useSelector, useDispatch } from "react-redux"
import { RootStore } from "../redux/store"
// @ts-ignore
import styles from "../styles/warning.module"
// @ts-ignore
import stylesBtn from "../styles/button.module"
import { RiErrorWarningLine } from "react-icons/ri"
import { BsX, BsCheck } from "react-icons/bs"
import Button from "./Button"
import { WARNING_CLOSE } from "../redux/toggle/toggleTypes"

const Warning: React.FC = () => {
  const {
    toggle: {
      warning: { toggle, title, action },
    },
  } = useSelector((state: RootStore) => state)
  const dispatch = useDispatch()

  return (
    <div className={`${styles.warning} ${toggle && styles.warning__active}`}>
      <div className={styles.warning__header}>
        <div className={styles.warning__icon}>
          <RiErrorWarningLine />
        </div>
        <div className={styles.warning__title}>Ви впевнені?</div>
      </div>
      <p className={styles.warning__body}>{title}</p>
      <div className={styles.warning__footer}>
        <Button
          exClass={stylesBtn.btn_primary}
          click={() => dispatch({ type: WARNING_CLOSE })}
          title='Скасувати'
          Icon={BsX}
        />
        <Button
          click={action}
          exClass={stylesBtn.btn_simple}
          title='Так'
          Icon={BsCheck}
        />
      </div>
    </div>
  )
}

export default Warning
