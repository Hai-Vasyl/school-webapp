import { gql } from "@apollo/client"

export const LOGIN_USER = gql`
  query LOGIN_USER($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        id
        username
        email
        ava
        color
        firstname
        confirmed
        lastname
        middlename
        phone
        address
        birth
        role
        group {
          owner {
            id
            username
            email
            ava
            color
            firstname
            lastname
            middlename
            role
          }
          name
          date
        }
        date
      }
      token
    }
  }
`

export const REGISTER_USER = gql`
  query REGISTER_USER(
    $firstname: String!
    $lastname: String!
    $username: String!
    $email: String!
    $password: String!
    $isAdmin: Boolean
    $role: String
    $group: String
  ) {
    register(
      firstname: $firstname
      lastname: $lastname
      username: $username
      email: $email
      password: $password
      isAdmin: $isAdmin
      role: $role
      group: $group
    ) {
      user {
        id
        username
        email
        ava
        color
        firstname
        confirmed
        lastname
        middlename
        phone
        address
        birth
        role
        date
      }
      token
    }
  }
`

export const GET_USER_CHATS = gql`
  query GET_USER_CHATS {
    userChats {
      id
      title
      channel
      description
      date
      image
      owner {
        id
      }
      owners {
        id
        username
        ava
        email
      }
      type
      lastMessage {
        id
        content
        date
        owner {
          id
          username
          email
        }
        chat {
          id
        }
      }
    }
  }
`

export const GET_USER_CHATS_ONLY = gql`
  query GET_USER_CHATS_ONLY($userId: ID) {
    userChats(userId: $userId) {
      id
      type
    }
  }
`

export const GET_USER_NOTIFICATIONS = gql`
  query GET_USER_NOTIFICATIONS {
    getNotifications {
      id
      title
      description
      channel
      active
      date
      type
      userId {
        id
        username
        email
        typeUser
        ava
      }
      chatId {
        id
        title
        type
        image
      }
    }
  }
`

export const GET_CHAT_USERS = gql`
  query GET_CHAT_USERS($chatId: ID!) {
    getChatUsers(chatId: $chatId) {
      id
      username
      email
      typeUser
      ava
    }
  }
`

export const GET_CHAT_MESSAGES = gql`
  query GET_CHAT_MESSAGES($chat: ID!) {
    chatMessages(chat: $chat) {
      id
      content
      date
      owner {
        id
        username
        ava
      }
      chat {
        id
      }
    }
  }
`

export const GET_UNREAD_MESSAGES = gql`
  query GET_UNREAD_MESSAGES {
    getUnreadMessages {
      id
      content
      date
      owner {
        id
        username
        ava
      }
      chat {
        id
      }
    }
  }
`

export const SEARCH_CHATS = gql`
  query SEARCH_CHATS($searchStr: String!) {
    searchChats(searchStr: $searchStr) {
      users {
        id
        username
        email
        ava
      }
      chats {
        id
        title
        image
        type
        owner {
          id
        }
      }
    }
  }
`
export const SEARCH_MESSAGES = gql`
  query SEARCH_MESSAGES($searchStr: String!, $chatId: String!) {
    searchMessages(searchStr: $searchStr, chatId: $chatId) {
      id
      content
      date
      owner {
        id
        username
        ava
      }
      chat {
        id
      }
    }
  }
`
export const GET_CHAT_INFO = gql`
  query GET_CHAT_INFO($isChat: Boolean!, $id: ID!) {
    getChatUserInfo(isChat: $isChat, id: $id) {
      user {
        id
        username
        email
        ava
        firstname
        lastname
        date
        typeUser
      }
      chat {
        id
        title
        description
        date
        image
        owner {
          id
          username
          email
          ava
          typeUser
        }
        type
      }
    }
  }
`

export const GET_PAGES = gql`
  query GET_PAGES {
    getPages {
      id
      url
      image
      imageKey
      date
    }
  }
`

export const GET_PAGE = gql`
  query GET_PAGE($url: String!) {
    getPage(url: $url) {
      id
      url
      image
      date
    }
  }
`

export const GET_TEACHERS = gql`
  query GET_TEACHERS {
    getTeachers {
      id
      username
      email
      ava
      color
      firstname
      lastname
      role
    }
  }
`

export const GET_STUDENTS = gql`
  query GET_STUDENTS($groupId: ID!) {
    getStudentsGroup(groupId: $groupId) {
      id
      username
      email
      ava
      color
      firstname
      lastname
      role
    }
  }
`

export const GET_STUDENTS_NOGROUP = gql`
  query GET_STUDENTS_NOGROUP {
    getStudentsNoGroup {
      id
      username
      email
      ava
      color
      firstname
      lastname
      role
    }
  }
`

export const GET_GROUPS = gql`
  query GET_GROUPS {
    getGroups {
      id
      owner {
        id
        username
        email
        ava
        color
        firstname
        lastname
        role
      }
      name
      date
    }
  }
`

export const GET_IMAGES = gql`
  query GET_IMAGES($from: Int!, $to: Int!, $search: String, $type: String) {
    getImages(from: $from, to: $to, search: $search, type: $type) {
      images {
        id
        owner {
          id
        }
        date
        location
        type
      }
      quantity
    }
  }
`

export const GET_IMAGE = gql`
  query GET_IMAGE($imageId: ID!) {
    getImage(imageId: $imageId) {
      id
      owner {
        id
        username
        email
        ava
        color
        firstname
        lastname
        role
      }
      date
      location
      content
      type
      key
      hashtags
      description
    }
  }
`

export const GET_NEWS_EVENTS = gql`
  query GET_NEWS_EVENTS(
    $search: String
    $type: String!
    $category: String
    $dateFrom: String
    $dateTo: String
    $from: Int!
    $to: Int!
    $exceptId: ID
  ) {
    getNewsEvents(
      search: $search
      type: $type
      category: $category
      dateFrom: $dateFrom
      dateTo: $dateTo
      from: $from
      to: $to
      exceptId: $exceptId
    ) {
      items {
        id
        title
        date
        category
        dateEvent
        links {
          link
          label
        }
        preview {
          id
          location
        }
      }
      quantity
    }
  }
`

export const GET_NEWS_EVENT = gql`
  query GET_NEWS_EVENT($contentId: ID!, $type: String!) {
    getNewsEvent(contentId: $contentId, type: $type) {
      id
      title
      content
      type
      owner {
        id
        username
        email
        ava
        color
        firstname
        lastname
        role
      }
      date
      category
      dateEvent
      links {
        link
        label
      }
    }
  }
`

export const GET_CONTENT_IMAGES = gql`
  query GET_CONTENT_IMAGES($contentId: ID!) {
    getContentImages(contentId: $contentId) {
      id
      date
      location
      hashtags
      description
      owner {
        id
      }
    }
  }
`

export const GET_PAGE_SECTIONS = gql`
  query GET_PAGE_SECTIONS(
    $search: String
    $url: String!
    $filters: [InputFilter]!
    $from: Int!
    $to: Int!
  ) {
    getPageSections(
      search: $search
      url: $url
      filters: $filters
      from: $from
      to: $to
    ) {
      items {
        id
        page
        url
        title
        content
        priority
        date
        uploads {
          id
          location
          content
          type
          hashtags
          description
          format
        }
        owner {
          id
        }
      }
      quantity
    }
  }
`

export const GET_PAGE_FILTERS = gql`
  query GET_PAGE_FILTERS($url: String!) {
    getFilters(url: $url) {
      id
      url
      keyWord
      value
    }
  }
`
