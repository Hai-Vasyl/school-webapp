import React from "react"
// @ts-ignore
import styles from "../styles/field.module"
import { BiError } from "react-icons/bi"
import { IField } from "../interfaces"
import useChangeInput from "../hooks/useChangeInput"

interface IFieldNumberProps {
  field: {
    title: string
    param: string
    msg: string
    value: string
  }
  change: any
  check?: any
  isImportant?: boolean
  exClass?: string
}

const FieldNumber: React.FC<IFieldNumberProps> = ({
  field,
  change,
  isImportant,
  check,
  exClass,
}) => {
  const { changeNumber } = useChangeInput()

  const handleChange = (isAddition: boolean) => {
    check && check()
    changeNumber(change, field.param, isAddition)
  }

  return (
    <div className={styles.field_file}>
      <div className={styles.field_file__file_wrapper}>
        <div className={styles.field_file__title}>
          <span
            className={`${styles.field__title} ${
              isImportant && styles.field__title__important
            }`}
          >
            {field.title}
          </span>
        </div>
        <div className={styles.field_number__btns}>
          <button onClick={() => handleChange(true)}>+</button>
          <span>{field.value}</span>
          <button onClick={() => handleChange(false)}>-</button>
        </div>
      </div>
      <span
        className={`${styles.field__msg} ${
          field.msg?.length && styles.field__msg__error
        }`}
      >
        <BiError className={styles.field__error} /> <span>{field.msg}</span>
      </span>
    </div>
  )
}

export default FieldNumber
