import React from "react"
import { IField } from "../interfaces"
import useChangeInput from "../hooks/useChangeInput"
// @ts-ignore
import styles from "../styles/field.module"
import { BiError } from "react-icons/bi"

interface IFielAreadProps {
  field: IField
  change: any
  check?(
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ): any
  exClass?: string
  transparent?: boolean
  isImportant?: boolean
}

const FieldArea: React.FC<IFielAreadProps> = ({
  field,
  change,
  check,
  exClass,
  transparent,
  isImportant,
}) => {
  const { changeInput } = useChangeInput()

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    check && check(event)
    changeInput(event, change)
  }

  return (
    <label
      className={`${styles.field} ${
        transparent && styles.field_transparent
      } ${exClass}`}
    >
      <span
        className={`${styles.field__title} ${
          isImportant && styles.field__title__important
        }`}
      >
        {field.title}
      </span>
      <div className={styles.field__wrapper_input}>
        <textarea
          className={`${styles.field__input} ${styles.field_area__input} ${
            field?.msg && styles.field__input__error
          }`}
          onChange={handleChange}
          name={field.param}
          value={field.value}
        ></textarea>
      </div>
      <span
        className={`${styles.field__msg} ${
          field.msg?.length && styles.field__msg__error
        }`}
      >
        <BiError className={styles.field__error} /> <span>{field.msg}</span>
      </span>
    </label>
  )
}

export default FieldArea
