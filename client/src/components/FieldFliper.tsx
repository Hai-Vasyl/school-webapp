import React, { useState, useEffect } from "react"
import FieldPicker from "./FieldPicker"
import Field from "./Field"
import FieldDate from "./FieldDate"
import { IField } from "../interfaces"
// @ts-ignore
import styles from "../styles/field.module"
import ButtonTab from "./ButtonTab"
import { BsArrowLeft, BsPlus } from "react-icons/bs"
import useChangeInput from "../hooks/useChangeInput"

interface FieldFliperProps {
  field: IField
  change: any
  defaultField?: string
}

const FieldFliper: React.FC<FieldFliperProps> = ({
  field,
  change,
  defaultField,
}) => {
  const [flip, setFlip] = useState(false)
  const { pichOpton } = useChangeInput()

  useEffect(() => {
    pichOpton(
      change,
      field.param,
      defaultField ? defaultField : field.options ? field.options[0].value : ""
    )
  }, [flip])

  const isOptions = field.options && field.options.length
  return (
    <div className={styles.field_fliper}>
      {isOptions && (
        <ButtonTab
          exClass={`${styles.field_fliper__btn_new} ${
            (flip || !isOptions) && styles.field_fliper__btn_new__close
          }`}
          Icon={flip ? BsArrowLeft : BsPlus}
          click={() => setFlip((prev) => !prev)}
        />
      )}
      {!flip && isOptions ? (
        <FieldPicker
          isImportant={field.isImportant}
          options={field.options || []}
          change={change}
          field={field}
        />
      ) : field.type === "text" ? (
        <Field isImportant={field.isImportant} field={field} change={change} />
      ) : (
        <FieldDate
          isImportant={field.isImportant}
          field={field}
          change={change}
        />
      )}
    </div>
  )
}

export default FieldFliper
