import React, { useState, useEffect } from "react"
// @ts-ignore
import styles from "../styles/field.module"
import { BiError } from "react-icons/bi"
import { BsCaretDownFill } from "react-icons/bs"
import useChangeInput from "../hooks/useChangeInput"

interface IFieldPickerProps {
  field: {
    title: string
    param: string
    msg: string
    value?: string
  }
  options: {
    value: string
    label: string
  }[]
  change: any
  check?: any
  Icon?: any
  isImportant?: boolean
  noError?: boolean
  submit?: boolean
  exClass?: string
}

const FieldPicker: React.FC<IFieldPickerProps> = ({
  change,
  field,
  options,
  Icon,
  check,
  isImportant,
  noError,
  submit,
  exClass,
}) => {
  const [toggleDrop, setToggleDrop] = useState(false)
  const { pichOpton } = useChangeInput()

  const handleToggleDrop = () => {
    setToggleDrop((prev) => !prev)
  }

  useEffect(() => {
    if (toggleDrop) {
      window.addEventListener("click", handleToggleDrop)
    }
    return () => window.removeEventListener("click", handleToggleDrop)
  }, [handleToggleDrop, toggleDrop])

  const getLabelOption = (value: string) => {
    let label = ""
    options.forEach((option) => {
      if (option.value === value) {
        label = option.label
      }
    })
    return label
  }

  const handlePickOption = (value: string) => {
    check && check()
    pichOpton(change, field.param, value)
  }

  return (
    <div
      className={`${styles.field_file} ${exClass} ${
        noError && styles.field_file__noerrror
      }`}
    >
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
        <div className={styles.field_picker}>
          <button
            type='button'
            className={styles.field_picker__button}
            onClick={() => setToggleDrop((prev) => !prev)}
          >
            {Icon && <Icon className={styles.field_file__upload_icon} />}
            <span>{getLabelOption(field.value || "")}</span>
            <BsCaretDownFill
              className={`${styles.field_picker__triangle} ${
                !toggleDrop && styles.field_picker__triangle__rotate
              }`}
            />
          </button>
          <div
            className={`${styles.field_picker__select} ${
              toggleDrop && styles.field_picker__select__open
            }`}
          >
            {options.map((option) => {
              return (
                <button
                  type={submit ? "submit" : "button"}
                  title={option.label}
                  key={option.value}
                  className={`${styles.field_picker__option} ${
                    option.value === field.value &&
                    styles.field_picker__option__active
                  }`}
                  onClick={() => handlePickOption(option.value)}
                >
                  <span>{option.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
      {!noError && (
        <span
          className={`${styles.field__msg} ${
            field.msg?.length && styles.field__msg__error
          }`}
        >
          <BiError className={styles.field__error} /> <span>{field.msg}</span>
        </span>
      )}
    </div>
  )
}

export default FieldPicker
