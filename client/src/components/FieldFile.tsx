import React from "react"
// @ts-ignore
import styles from "../styles/field.module"
import { BiError } from "react-icons/bi"
import { BsCheck, BsUpload } from "react-icons/bs"
import useChangeInput from "../hooks/useChangeInput"

interface IFieldFileProps {
  field: {
    title: string
    param: string
    msg: string
  }
  change: any
  check?: any
  afterChange?: any
  file: boolean
  isImportant?: boolean
  multiple?: boolean
  numFiles?: number
}

const FieldFile: React.FC<IFieldFileProps> = ({
  field,
  change,
  check,
  file,
  afterChange,
  isImportant,
  multiple,
  numFiles,
}) => {
  const { changeFile } = useChangeInput()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    check && check()
    if (event.target.files) {
      changeFile(
        change,
        field.param,
        multiple ? event.target.files : event.target.files[0]
      )
      afterChange &&
        afterChange(multiple ? event.target.files : event.target.files[0])
    }
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
        <label className={styles.field_file__label}>
          {file ? (
            <BsCheck className={styles.field_file__upload_icon} />
          ) : (
            <BsUpload className={styles.field_file__upload_icon} />
          )}
          <span>
            {file
              ? multiple
                ? `${numFiles} ${numFiles === 1 ? "Файл" : "Файли"} вибрано`
                : "Файл вибрано"
              : `Bиберіть ${multiple ? "файли" : "файл"}`}
          </span>
          <input
            className='btn-handler'
            name={field.param}
            type='file'
            onChange={handleChange}
            autoComplete='off'
            multiple={multiple}
          />
        </label>
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

export default FieldFile
