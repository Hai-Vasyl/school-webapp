import React from "react"
// @ts-ignore
import { CKEditor } from "@ckeditor/ckeditor5-react"
// @ts-ignore
import ClassicEditor from "@ckeditor/ckeditor5-build-classic"
// @ts-ignore
import styles from "../styles/field.module"
import { BiError } from "react-icons/bi"
import { IField } from "../interfaces"
import useChangeInput from "../hooks/useChangeInput"

interface IFieldEditProps {
  field: IField
  change: any
  check?: any
  exClass?: string
  transparent?: boolean
  isImportant?: boolean
}

const FieldEditor: React.FC<IFieldEditProps> = ({
  field,
  change,
  check,
  isImportant,
  exClass,
  transparent,
}) => {
  const { changeEditor } = useChangeInput()
  const editorConfiguration = {
    toolbar: [
      "heading",
      "|",
      "bold",
      "italic",
      "link",
      "bulletedList",
      "numberedList",
      "blockQuote",
      "insertTable",
      "mediaEmbed",
      "undo",
      "redo",
    ],
  }

  const handleChange = (value: string) => {
    check && check()
    changeEditor(change, field.param, value)
  }

  return (
    <div
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
        <CKEditor
          editor={ClassicEditor}
          data={field.value}
          config={editorConfiguration}
          onChange={(event: any, editor: any) => {
            handleChange(editor.getData())
          }}
        />
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

export default FieldEditor
