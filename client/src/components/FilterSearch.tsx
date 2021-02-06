import React from "react"
// @ts-ignore
import styles from "../styles/form.module"
import { useSelector } from "react-redux"
import { RootStore } from "../redux/store"
import { access } from "../modules/accessModifiers"
import { BsPlus, BsX, BsSearch } from "react-icons/bs"
import FieldPicker from "./FieldPicker"
import ButtonTab from "./ButtonTab"
import { IField } from "../interfaces"

interface IFilterSearchProps {
  handleSubmit(event: React.FormEvent<HTMLFormElement>): any
  quantityItems: number
  search: string
  searchStr: string
  options: { label: string; value: string }[]
  onClickBtnPlus: any
  handleResetSearch: any
  setSearchStr: any
  setFormPicker: any
  fieldPicker: IField
}

const FilterSearch: React.FC<IFilterSearchProps> = ({
  handleSubmit,
  quantityItems,
  search,
  searchStr,
  options,
  onClickBtnPlus,
  handleResetSearch,
  setSearchStr,
  setFormPicker,
  fieldPicker,
}) => {
  const {
    auth: { user },
  } = useSelector((state: RootStore) => state)

  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    if (!value) {
      handleResetSearch()
    } else {
      setSearchStr(value)
    }
  }

  return (
    <div className={styles.form_filter_container}>
      <form onSubmit={handleSubmit} className={styles.form_filter}>
        {(user.role === access.admin.keyWord ||
          user.role === access.teacher.keyWord) && (
          <ButtonTab
            exClass={styles.btn_create_image}
            Icon={BsPlus}
            click={onClickBtnPlus}
          />
        )}
        <div className={styles.form_filter__search}>
          <button
            type='button'
            onClick={handleResetSearch}
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
            onChange={handleChangeSearch}
            placeholder='Пошук зображення'
          />
          <button className={styles.form_filter__search_btn}>
            <BsSearch />
          </button>
        </div>
        <FieldPicker
          submit
          exClass={styles.form_filter__picker}
          noError
          change={setFormPicker}
          field={fieldPicker}
          options={options}
        />
        <button className='btn-handler'></button>
      </form>
      <p className={styles.form_filter__footer}>
        {!search ? (
          <span className={styles.form_filter__results}>
            Кількість результатів:
            <span className={styles.form_filter__results_counter}>
              {quantityItems}
            </span>
          </span>
        ) : (
          <span className={styles.form_filter__results}>
            Кількість результатів пошуку "
            <span className={styles.form_filter__search_string}>{search}</span>
            ":
            <span className={styles.form_filter__results_counter}>
              {quantityItems}
            </span>
          </span>
        )}
      </p>
    </div>
  )
}

export default FilterSearch
