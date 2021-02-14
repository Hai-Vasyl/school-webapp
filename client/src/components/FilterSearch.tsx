import React, { useState } from "react"
// @ts-ignore
import stylesBtn from "../styles/button.module"
// @ts-ignore
import styles from "../styles/form.module"
import { useSelector } from "react-redux"
import { RootStore } from "../redux/store"
import { access } from "../modules/accessModifiers"
import { BsPlus, BsX, BsSearch, BsArrowClockwise } from "react-icons/bs"
import FieldPicker from "./FieldPicker"
import ButtonTab from "./ButtonTab"
import { IField } from "../interfaces"
import FieldDate from "../components/FieldDate"
import Button from "../components/Button"
import FieldSearch from "./FieldSearch"

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
  setFormDate?: any
  fieldDateFrom?: IField
  fieldDateTo?: IField
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
  fieldDateFrom,
  fieldDateTo,
  setFormDate,
}) => {
  const {
    auth: { user },
  } = useSelector((state: RootStore) => state)
  const [isDateError, setIsDateError] = useState(false)

  const checkSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    if (!value) {
      handleResetSearch()
      return
    }
  }

  const handleResetDate = () => {
    setFormDate((prev: IField[]) =>
      prev.map((field: IField) => {
        return { ...field, value: "" }
      })
    )
    setIsDateError(false)
  }

  const onChangeDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    const from = fieldDateFrom && fieldDateFrom.value
    const to = fieldDateTo && fieldDateTo.value

    if (
      (name === "from" && new Date(value) > new Date(to)) ||
      (name === "to" && new Date(value) < new Date(from))
    ) {
      setIsDateError(true)
    } else {
      setIsDateError(false)
    }
  }

  return (
    <div className={styles.form_filter_container}>
      <div className='wrapper-clear'>
        <form onSubmit={handleSubmit} className={styles.form_filter}>
          {(user.role === access.admin.keyWord ||
            user.role === access.teacher.keyWord) && (
            <ButtonTab
              exClass={stylesBtn.btn_form_plus}
              Icon={BsPlus}
              click={onClickBtnPlus}
            />
          )}
          <FieldSearch
            resetSearch={handleResetSearch}
            search={search}
            check={checkSearch}
            searchStr={searchStr}
            change={setSearchStr}
          />
          {/* <div className={styles.form_filter__search}>
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
          </div> */}
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
        {setFormDate && (
          <form
            onSubmit={
              isDateError
                ? (event) => {
                    event.preventDefault()
                  }
                : handleSubmit
            }
            className={styles.form_filter__date}
          >
            <FieldDate
              field={fieldDateFrom}
              change={setFormDate}
              check={onChangeDate}
              noError
              error={isDateError}
              exClass={styles.form_filter__picker_date}
            />
            <FieldDate
              field={fieldDateTo}
              change={setFormDate}
              check={onChangeDate}
              noError
              error={isDateError}
              exClass={`${styles.form_filter__picker_date} ${styles.form_filter__picker_date__to}`}
            />
            <Button
              exClass={`${stylesBtn.btn_simple} ${styles.form_filter__btn}`}
              Icon={BsArrowClockwise}
              type='button'
              click={handleResetDate}
            />
            <Button
              exClass={`${
                isDateError ? stylesBtn.btn_disabled : stylesBtn.btn_primary
              } ${styles.form_filter__btn} `}
              title='Шукати'
              disabled={isDateError}
            />
            <button className='btn-handler'></button>
          </form>
        )}
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
              <span className={styles.form_filter__search_string}>
                {search}
              </span>
              ":
              <span className={styles.form_filter__results_counter}>
                {quantityItems}
              </span>
            </span>
          )}
        </p>
      </div>
    </div>
  )
}

export default FilterSearch
