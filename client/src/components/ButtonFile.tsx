import React from "react"
// @ts-ignore
import styles from "../styles/button.module"

interface IButtonFileProps {
  Icon: any
  change(event: React.ChangeEvent<HTMLInputElement>): any
  exClass?: string
}

const ButtonFile: React.FC<IButtonFileProps> = ({ Icon, change, exClass }) => {
  return (
    <label className={`${styles.btn_tab} ${exClass}`}>
      <Icon />
      <input className='btn-handler' type='file' onChange={change} />
    </label>
  )
}

export default ButtonFile
