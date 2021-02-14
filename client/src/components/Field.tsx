import React, { useState } from "react"
import { BiError } from "react-icons/bi"
import { BsEye, BsEyeSlash } from "react-icons/bs"
// @ts-ignore
import styles from "../styles/field.module"
import ButtonTab from "./ButtonTab"
import useChangeInput from "../hooks/useChangeInput"
import { IField } from "../interfaces"

interface IFieldProps {
  field: IField
  change: any
  check?(event: React.ChangeEvent<HTMLInputElement>): any
  exClass?: string
  transparent?: boolean
  isImportant?: boolean
}

const Field: React.FC<IFieldProps> = ({
  field,
  change,
  check,
  exClass,
  transparent,
  isImportant,
}) => {
  const [viewPass, setViewPass] = useState(false)

  const handleViewPassword = () => {
    setViewPass((prev) => !prev)
  }

  const { changeInput } = useChangeInput()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    check && check(event)
    changeInput(event, change)
  }

  const isPassword = field.type === "password"
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
        <input
          className={`${styles.field__input} ${
            field?.msg && styles.field__input__error
          } ${isPassword && styles.field__input_password}`}
          name={field.param}
          type={viewPass && isPassword ? "text" : field.type}
          value={field.value}
          onChange={handleChange}
          autoComplete='off'
        />
        {isPassword && (
          <ButtonTab
            Icon={viewPass ? BsEye : BsEyeSlash}
            click={handleViewPassword}
            exClass={styles.field__btn_password}
          />
        )}
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

export default Field
