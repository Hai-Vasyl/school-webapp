import React from "react"
// @ts-ignore
import styles from "../styles/button.module"

interface ButtonTabProps {
  Icon: any
  click(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): any
  exClass?: string
}

const ButtonTab: React.FC<ButtonTabProps> = ({ Icon, click, exClass }) => {
  return (
    <button
      type='button'
      className={`${styles.btn_tab} ${exClass}`}
      onClick={click}
    >
      <Icon />
    </button>
  )
}

export default ButtonTab
