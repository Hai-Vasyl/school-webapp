import React from "react"
// @ts-ignore
import { CKEditor } from "@ckeditor/ckeditor5-react"
// @ts-ignore
import ClassicEditor from "@ckeditor/ckeditor5-build-classic"
// @ts-ignore
import styles from "../styles/field.module"
import { BiError } from "react-icons/bi"

interface IFieldEditProps {
  field: {
    param: string
    type?: string
    value?: string
    title: string
    msg?: string
  }
  change: (value: string) => any
  exClass?: string
  transparent?: boolean
  isImportant?: boolean
}

const FieldEditor: React.FC<IFieldEditProps> = ({
  field,
  change,
  isImportant,
  exClass,
  transparent,
}) => {
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
      "undo",
      "redo",
    ],
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
            change(editor.getData())
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
