import React from "react"
// @ts-ignore
import styles from "../styles/field.module"
import { BiError } from "react-icons/bi"

interface IFieldDateProps {
  field?: {
    param: string
    type?: string
    value?: string
    title: string
    msg?: string
  }
  change(event: React.ChangeEvent<HTMLInputElement>): any
  isImportant?: boolean
  noError?: boolean
  error?: boolean
  exClass?: string
}

const FieldDate: React.FC<IFieldDateProps> = ({
  field,
  change,
  isImportant,
  noError,
  exClass,
  error,
}) => {
  return (
    <div
      className={`${styles.field_file} ${exClass} ${
        noError && styles.field_file__noerrror
      }`}
    >
      <div
        className={`${styles.field_file__file_wrapper} ${
          error && styles.field_file__file_wrapper__error
        }`}
      >
        <div className={styles.field_file__title}>
          <span
            className={`${styles.field__title} ${
              isImportant && styles.field__title__important
            }`}
          >
            {field?.title}
          </span>
        </div>
        <input
          className={`${styles.field_file__label} ${styles.field_date__label}`}
          type='date'
          value={field?.value}
          onChange={change}
          name={field?.param}
        />
      </div>
      {!noError && (
        <span
          className={`${styles.field__msg} ${
            field?.msg?.length && styles.field__msg__error
          }`}
        >
          <BiError className={styles.field__error} /> <span>{field?.msg}</span>
        </span>
      )}
    </div>
  )
}

export default FieldDate
