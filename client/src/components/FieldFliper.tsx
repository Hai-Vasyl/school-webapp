import React, { useState } from "react"
import FieldPicher from "./FieldPicker"
import Field from "./Field"
import FieldDate from "./FieldDate"
import { IField } from "../interfaces"
// @ts-ignore
import styles from "../styles/field.module"
import ButtonTab from "./ButtonTab"
import { BsArrowLeft, BsPlus } from "react-icons/bs"

interface FieldFliperProps {
  field: IField
  change: any
}

const FieldFliper: React.FC<FieldFliperProps> = ({ field, change }) => {
  const [flip, setFlip] = useState(false)

  return (
    <div className={styles.field_fliper}>
      <ButtonTab
        exClass={`${styles.field_fliper__btn_new} ${
          (flip || !(field.options && field.options.length)) &&
          styles.field_fliper__btn_new__close
        }`}
        Icon={flip ? BsArrowLeft : BsPlus}
        click={() => setFlip((prev) => !prev)}
      />
      {!flip && field.options && field.options.length ? (
        <FieldPicher
          isImportant={field.isImportant}
          options={field.options}
          exClass={""}
          change={change}
          field={field}
        />
      ) : field.type === "text" ? (
        <Field
          isImportant={field.isImportant}
          exClass={""}
          field={field}
          change={change}
        />
      ) : (
        <FieldDate
          isImportant={field.isImportant}
          exClass={""}
          field={field}
          change={change}
        />
      )}
    </div>
  )
}

export default FieldFliper
