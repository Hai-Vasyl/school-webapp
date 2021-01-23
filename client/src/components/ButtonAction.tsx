import React from "react"
// @ts-ignore
import styles from "../styles/button.module.scss"

interface IButtonActionProps {
  Icon: any
  click(): any
}

const ButtonAction: React.FC<IButtonActionProps> = ({ Icon, click }) => {
  return (
    <button onClick={click} className={styles.btn_action}>
      <Icon />
    </button>
  )
}

export default ButtonAction
