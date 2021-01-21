import React from "react"
// @ts-ignore
import styles from "../styles/buttontab.module"

interface ButtonTabProps {
  Icon: any
  click(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): any
  exClass?: string
}

const ButtonTab: React.FC<ButtonTabProps> = ({ Icon, click, exClass }) => {
  return (
    <button
      type='button'
      className={`${styles.wrapper} ${exClass}`}
      onClick={click}
    >
      <Icon />
    </button>
  )
}

export default ButtonTab
