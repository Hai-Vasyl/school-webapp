import React from "react"
// @ts-ignore
import styles from "../styles/form.module"
import { BsSearch, BsX } from "react-icons/bs"

interface IFieldSearchProps {
  resetSearch: any
  search: string
  check?: any
  searchStr: string
  change: any
}

const FieldSearch: React.FC<IFieldSearchProps> = ({
  resetSearch,
  search,
  searchStr,
  check,
  change,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    check && check(event)
    change(event.target.value)
  }

  return (
    <div className={styles.form_filter__search}>
      <button
        type='button'
        onClick={resetSearch}
        className={`${styles.form_filter__search_btn} ${
          styles.form_filter__search_btn__reset
        } ${!search && styles.form_filter__search_btn__close}`}
      >
        <BsX />
      </button>
      <input
        className={`${styles.form_filter__search_input} ${
          !search && styles.form_filter__search_input__close
        }`}
        type='text'
        value={searchStr}
        onChange={handleChange}
        placeholder='Пошук зображення'
      />
      <button className={styles.form_filter__search_btn}>
        <BsSearch />
      </button>
    </div>
  )
}

export default FieldSearch
