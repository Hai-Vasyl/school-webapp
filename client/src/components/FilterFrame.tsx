import React from "react"
// @ts-ignore
import styles from "../styles/form.module"

interface IFilterFrameProps {
  quantity: number
  search: string
  children: any
  submit(event: React.FormEvent<HTMLFormElement>): any
}

const FilterFrame: React.FC<IFilterFrameProps> = ({
  quantity,
  search,
  children,
  submit,
}) => {
  return (
    <div className={styles.form_filter_container}>
      <div className='wrapper-clear'>
        <form
          onSubmit={submit}
          className={`${styles.form_filter} ${styles.form_filter__wrapper}`}
        >
          {children}
          <button className='btn-handler'></button>
        </form>
        <p className={styles.form_filter__footer}>
          {!search ? (
            <span className={styles.form_filter__results}>
              Кількість результатів:
              <span className={styles.form_filter__results_counter}>
                {quantity}
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
                {quantity}
              </span>
            </span>
          )}
        </p>
      </div>
    </div>
  )
}

export default FilterFrame
