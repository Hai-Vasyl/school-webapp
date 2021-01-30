import React from "react"
// @ts-ignore
import styles from "../styles/field.module"
import { BiError } from "react-icons/bi"
import { BsCheck, BsUpload } from "react-icons/bs"

interface IFieldFileProps {
  field: {
    title: string
    param: string
    msg: string
  }
  change(event: React.ChangeEvent<HTMLInputElement>): any
  file: boolean
  isImportant?: boolean
  multiple?: boolean
  numFiles?: number
}

const FieldFile: React.FC<IFieldFileProps> = ({
  field,
  change,
  file,
  isImportant,
  multiple,
  numFiles,
}) => {
  return (
    <div className={styles.field_file}>
      <div className={styles.field_file__fileWrapper}>
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
                ? `${numFiles} ${numFiles === 1 ? "File" : "Files"} chosen`
                : "File chosen"
              : `Choose ${multiple ? "files" : "file"}`}
          </span>
          <input
            className='btn-handler'
            name={field.param}
            type='file'
            onChange={change}
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
