import React from "react"
// @ts-ignore
import styles from "../styles/button.module.scss"
import { AiOutlineCheck } from "react-icons/ai"

interface IButtonCheckBox {
  click(...rest: any): any
  title?: string
  type?: "submit" | "reset" | "button"
  status: boolean
}

const ButtonCheckBox: React.FC<IButtonCheckBox> = ({
  click,
  title,
  type = "button",
  status,
}) => {
  return (
    <button className={styles.btn_check} onClick={click} type={type}>
      <span className={styles.btn_check__check}>
        <AiOutlineCheck
          className={`${styles.btn_check__icon} ${
            status && styles.btn_check__icon__active
          }`}
        />
      </span>
      <span className={styles.btn_check__title}>{title}</span>
    </button>
  )
}

export default ButtonCheckBox
