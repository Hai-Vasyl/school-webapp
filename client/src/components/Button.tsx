import React from "react"
// @ts-ignore
import styles from "../styles/button.module"

interface IButtonProps {
  click(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): any
  Icon: any
  title?: string
  exClass?: string
  type?: any
  disabled?: boolean
}

const Button: React.FC<IButtonProps> = ({
  Icon,
  click,
  title,
  exClass,
  type,
  disabled,
}) => {
  return (
    <button
      className={`${styles.btn} ${exClass}`}
      onClick={click}
      type={type}
      disabled={disabled}
    >
      <Icon className={styles.btn__icon} />
      {title && <span className={styles.btn__title}>{title}</span>}
    </button>
  )
}

export default Button
