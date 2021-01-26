import { IField } from "../interfaces"

const usePickOption = () => {
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

  return { pichOpton }
}

export default usePickOption
