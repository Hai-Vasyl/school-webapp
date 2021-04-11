import { gql } from "@apollo/client"

// export const CREATE_MESSAGE = gql`
//   mutation CREATE_MESSAGE($content: String!, $chat: ID!) {
//     createMessage(content: $content, chat: $chat) {
//       id
//       content
//       date
//       owner {
//         id
//         username
//         email
//       }
//       chat {
//         id
//       }
//     }
//   }
// `

export const SET_PAGE_IMAGE = gql`
  mutation SET_PAGE_IMAGE($url: String!, $image: Upload, $deleting: Boolean!) {
    setPageImage(url: $url, image: $image, deleting: $deleting) {
      message
      type
    }
  }
`

export const UPDATE_USER_DATA = gql`
  mutation UPDATE_USER_DATA(
    $firstname: String!
    $lastname: String!
    $middlename: String
    $address: String
    $phone: String
    $email: String!
    $password: String
  ) {
    updateUserData(
      firstname: $firstname
      lastname: $lastname
      middlename: $middlename
      address: $address
      phone: $phone
      email: $email
      password: $password
    ) {
      message
      type
    }
  }
`

export const SET_USER_AVA = gql`
  mutation SET_USER_AVA($image: Upload, $deleting: Boolean!) {
    setUserAva(image: $image, deleting: $deleting) {
      message
      type
    }
  }
`

// export const CREATE_CHAT = gql`
//   mutation CREATE_CHAT(
//     $title: String!
//     $description: String
//     $image: Upload
//     $type: String!
//   ) {
//     createChat(
//       title: $title
//       description: $description
//       image: $image
//       type: $type
//     ) {
//       id
//       title
//       channel
//       description
//       date
//       image
//       owner {
//         id
//         username
//         ava
//         email
//         typeUser
//       }
//       type
//       lastMessage {
//         id
//         content
//         date
//         owner {
//           id
//           username
//           email
//         }
//         chat {
//           id
//         }
//       }
//     }
//   }
// `

// export const EDIT_CHAT = gql`
//   mutation EDIT_CHAT(
//     $title: String!
//     $description: String
//     $image: Upload
//     $type: String!
//     $id: ID!
//   ) {
//     editChat(
//       title: $title
//       description: $description
//       image: $image
//       type: $type
//       id: $id
//     ) {
//       id
//       title
//       channel
//       description
//       date
//       image
//       owner {
//         id
//         username
//         ava
//         email
//         typeUser
//       }
//       type
//       lastMessage {
//         id
//         content
//         date
//         owner {
//           id
//           username
//           email
//         }
//         chat {
//           id
//         }
//       }
//     }
//   }
// `

// export const CREATE_NOTIFICATION = gql`
//   mutation CREATE_NOTIFICATION(
//     $title: String!
//     $description: String
//     $type: String
//     $chatId: ID
//     $userId: ID
//     $channel: String!
//   ) {
//     createNotification(
//       title: $title
//       description: $description
//       type: $type
//       chatId: $chatId
//       userId: $userId
//       channel: $channel
//     ) {
//       id
//       title
//       description
//       channel
//       active
//       date
//       type
//       userId {
//         id
//         username
//         email
//         typeUser
//         ava
//       }
//       chatId {
//         id
//         title
//         type
//         image
//       }
//     }
//   }
// `

export const DELETE_NOTIFICATION = gql`
  mutation DELETE_NOTIFICATION($notifId: ID!) {
    deleteNotification(notifId: $notifId)
  }
`

// export const CHECK_NOTIFICATION = gql`
//   mutation CHECK_NOTIFICATION($notifId: ID!) {
//     checkNotification(notifId: $notifId) {
//       id
//       title
//       description
//       channel
//       active
//       date
//       type
//       userId {
//         id
//         username
//         email
//         typeUser
//         ava
//       }
//       chatId {
//         id
//         title
//         type
//         image
//       }
//     }
//   }
// `

// export const ADD_USER_ACCESS = gql`
//   mutation ADD_USER_ACCESS($chatId: ID, $userId: ID!) {
//     addUserAccess(chatId: $chatId, userId: $userId) {
//       id
//       title
//       channel
//       description
//       date
//       image
//       owner {
//         id
//       }
//       owners {
//         id
//         username
//         ava
//         email
//       }
//       type
//       lastMessage {
//         id
//         content
//         date
//         owner {
//           id
//           username
//           email
//         }
//         chat {
//           id
//         }
//       }
//     }
//   }
// `

// export const REMOVE_USER_ACCESS = gql`
//   mutation REMOVE_USER_ACCESS($chatId: ID!, $userId: ID) {
//     removeUserAccess(chatId: $chatId, userId: $userId) {
//       id
//       title
//       channel
//       description
//       date
//       image
//       owner {
//         id
//       }
//       owners {
//         id
//         username
//         ava
//         email
//       }
//       type
//       lastMessage {
//         id
//         content
//         date
//         owner {
//           id
//           username
//           email
//         }
//         chat {
//           id
//         }
//       }
//     }
//   }
// `

export const SET_MESSAGE_READ = gql`
  mutation SET_MESSAGE_READ($messageId: ID!) {
    setMessageRead(messageId: $messageId)
  }
`

export const DELETE_UNREAD_MESSAGES = gql`
  mutation DELETE_UNREAD_MESSAGES($messages: [ID!]!) {
    deleteUnreadMessages(messages: $messages)
  }
`

export const CREATE_UPLOAD = gql`
  mutation CREATE_UPLOAD(
    $hashtags: String
    $description: String
    $upload: Upload
    $content: ID
    $type: String!
    $mimetype: String
  ) {
    createUpload(
      hashtags: $hashtags
      description: $description
      upload: $upload
      content: $content
      type: $type
      mimetype: $mimetype
    ) {
      message
      type
    }
  }
`

export const EDIT_UPLOAD = gql`
  mutation EDIT_UPLOAD(
    $imageId: ID!
    $hashtags: String
    $description: String
    $upload: Upload
  ) {
    editUpload(
      imageId: $imageId
      hashtags: $hashtags
      description: $description
      upload: $upload
    ) {
      message
      type
    }
  }
`

export const DELETE_UPLOAD = gql`
  mutation DELETE_UPLOAD($imageId: ID!) {
    deleteUpload(imageId: $imageId) {
      message
      type
    }
  }
`

export const CREATE_NEWS_EVENT = gql`
  mutation CREATE_NEWS_EVENT(
    $title: String!
    $content: String!
    $type: String!
    $category: String!
    $dateEvent: String!
    $links: [InputLink]
  ) {
    createNewsEvent(
      title: $title
      content: $content
      type: $type
      category: $category
      dateEvent: $dateEvent
      links: $links
    )
  }
`

export const EDIT_NEWS_EVENT = gql`
  mutation EDIT_NEWS_EVENT(
    $contentId: ID!
    $title: String!
    $content: String!
    $type: String!
    $category: String!
    $dateEvent: String!
    $links: [InputLink]
  ) {
    editNewsEvent(
      contentId: $contentId
      title: $title
      content: $content
      type: $type
      category: $category
      dateEvent: $dateEvent
      links: $links
    ) {
      message
      type
    }
  }
`

export const DELETE_NEWS_EVENT = gql`
  mutation DELETE_NEWS_EVENT($contentId: ID!) {
    deleteNewsEvent(contentId: $contentId) {
      message
      type
    }
  }
`

export const CREATE_PAGE_SECTION = gql`
  mutation CREATE_PAGE_SECTION(
    $url: String!
    $title: String!
    $content: String!
    $priority: Int!
    $filters: [InputFilter]!
    $optContent: Boolean
  ) {
    createPageSection(
      url: $url
      title: $title
      content: $content
      priority: $priority
      filters: $filters
      optContent: $optContent
    ) {
      message
      type
    }
  }
`

export const EDIT_PAGE_SECTION = gql`
  mutation EDIT_PAGE_SECTION(
    $sectionId: ID!
    $title: String!
    $content: String!
    $priority: Int!
    $filters: [InputFilterEdit]!
    $optContent: Boolean
  ) {
    editPageSection(
      sectionId: $sectionId
      title: $title
      content: $content
      priority: $priority
      filters: $filters
      optContent: $optContent
    ) {
      message
      type
    }
  }
`

export const DELETE_PAGE_SECTION = gql`
  mutation DELETE_PAGE_SECTION($sectionId: ID!) {
    deletePageSection(sectionId: $sectionId) {
      message
      type
    }
  }
`

export const SEND_EMAIL = gql`
  mutation SEND_EMAIL(
    $firstname: String!
    $lastname: String!
    $email: String!
    $message: String!
  ) {
    sendEmail(
      firstname: $firstname
      lastname: $lastname
      email: $email
      message: $message
    ) {
      message
      type
    }
  }
`
