import { useCallback } from "react"
import { IAuthErrors, IField } from "../interfaces"

const useSetErrorsFields = () => {
  const setErrors = useCallback((message: string, setTemplForm: any) => {
    setTemplForm((prevForm: IField[]) =>
      prevForm.map((field) => {
        return { ...field, msg: "" }
      })
    )
    const errors: IAuthErrors = JSON.parse(message)
    setTemplForm((prevForm: IField[]) =>
      prevForm.map((field) => {
        let newField = field
        Object.keys(errors).forEach((key: string) => {
          if (key === field.param) {
            errors[key].msg &&
              errors[key].msg.forEach((msg) => {
                newField.msg += ` ${msg}`
              })
            newField.msg = newField.msg ? newField.msg.trim() : ""
          }
        })
        return newField
      })
    )
  }, [])

  return { setErrors }
}

export default useSetErrorsFields
