const useCheck = () => {
  const isInclude = (itemId: string, collection: string[]) => {
    let isInclude = false
    collection.forEach((item: string) => {
      if (item === itemId) {
        isInclude = true
      }
    })
    return isInclude
  }

  return { isInclude }
}

export default useCheck
