export const categories = {
  all: {
    keyWord: "all",
    title: "Усі",
  },
  science: {
    keyWord: "science",
    title: "Наука",
  },
  health: {
    keyWord: "health",
    title: "Здоров'я",
  },
  sports: {
    keyWord: "sports",
    title: "Спорт",
  },
  entertainment: {
    keyWord: "entertainment",
    title: "Дозвілля",
  },
  culture: {
    keyWord: "culture",
    title: "Культура",
  },
  ecology: {
    keyWord: "ecology",
    title: "Екологія",
  },
}

export const getNewsParamsByKey = (keyWord: string) => {
  switch (keyWord) {
    case categories.science.keyWord:
      return categories.science
    case categories.health.keyWord:
      return categories.health
    case categories.sports.keyWord:
      return categories.sports
    case categories.entertainment.keyWord:
      return categories.entertainment
    case categories.culture.keyWord:
      return categories.culture
    case categories.ecology.keyWord:
      return categories.ecology
  }
}
