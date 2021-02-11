import { IField } from "../interfaces"

const useChangeInput = () => {
  const changeInput = (
    event: React.ChangeEvent<HTMLInputElement>,
    setForm: any
  ) => {
    const { value, name } = event.target
    setForm((prevForm: IField[]) =>
      prevForm.map((field: IField) => {
        if (name === field.param) {
          return { ...field, value, msg: "" }
        }
        return field
      })
    )
  }

  const changeNumber = (setForm: any, param: string, isAddition: boolean) => {
    setForm((prevForm: IField[]) =>
      prevForm.map((prevField: IField) => {
        if (prevField.param === param) {
          const newValue = isAddition
            ? Number(prevField.value) + 1
            : Number(prevField.value) - 1
          return { ...prevField, value: newValue }
        }
        return prevField
      })
    )
  }

  const changeEditor = (setForm: any, param: string, value: string) => {
    setForm((prevForm: IField[]) =>
      prevForm.map((field) => {
        if (field.param === param) {
          return { ...field, value, msg: "" }
        }
        return field
      })
    )
  }

  const pichOpton = (setForm: any, param: string, value: string) => {
    setForm((prevForm: IField[]) =>
      prevForm.map((field: IField) => {
        if (field.param === param) {
          return { ...field, value, msg: "" }
        }
        return field
      })
    )
  }

  const changeFile = (setForm: any, param: string, value: any) => {
    setForm((prevForm: IField[]) =>
      prevForm.map((field: IField) => {
        if (field.param === param) {
          return {
            ...field,
            value,
            msg: "",
          }
        }
        return field
      })
    )
  }

  return { changeInput, changeEditor, changeNumber, pichOpton, changeFile }
}

export default useChangeInput
