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

  return { changeInput }
}

export default useChangeInput
