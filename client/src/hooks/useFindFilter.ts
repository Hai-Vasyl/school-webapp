import { IPageSectionFilter, IField } from "../interfaces"

const useFindFilter = () => {
  const findFilterParams = (filters: IPageSectionFilter[], keyWord: string) => {
    return filters.find((filter) => filter.keyWord === keyWord)
  }
  const getFormFilterParams = (filters: IField[], keyWord: string) => {
    const filter = filters.find((filter) => filter.param === keyWord)
    return filter ? filter : { options: [], title: "" }
  }
  return { findFilterParams, getFormFilterParams }
}

export default useFindFilter
