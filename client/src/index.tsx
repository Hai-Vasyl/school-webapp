import React from "react"
import { render } from "react-dom"
import App from "./App"
import "./styles/index.scss"
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  split,
} from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import { BrowserRouter as Router } from "react-router-dom"
import store from "./redux/store"
import { Provider } from "react-redux"
import { getMainDefinition } from "@apollo/client/utilities"
import { WebSocketLink } from "@apollo/client/link/ws"
import { createUploadLink } from "apollo-upload-client"

// const isDev = true
// const host = isDev
//   ? "localhost:5000"
//   : window.location.href.split("//")[1].split("/")[0]

// const httpLink = createUploadLink({
//   uri: `${isDev ? "http" : "https"}://${host}/graphql`,
// })

// const websocketLink = new WebSocketLink({
//   uri: `${isDev ? "ws" : "wss"}://${host}/graphql`,
//   options: {
//     reconnect: true,
//   },
// })

// const authLink = setContext((_, { headers }) => {
//   const auth = localStorage.getItem("auth") || ""

//   let authtoken = ""
//   if (auth.length) {
//     const { token }: { token: string } = JSON.parse(auth)
//     authtoken = token.length ? token : ""
//   }
//   return {
//     headers: {
//       ...headers,
//       authorization: `Bearer ${authtoken}`,
//     },
//   }
// })

// const splitLink = split(
//   ({ query }) => {
//     const definition = getMainDefinition(query)
//     return (
//       definition.kind === "OperationDefinition" &&
//       definition.operation === "subscription"
//     )
//   },
//   websocketLink,
//   //@ts-ignore
//   authLink.concat(httpLink)
// )

// const client = new ApolloClient({
//   link: splitLink,
//   cache: new InMemoryCache(),
// })
// --- connect apollo-server-express without wss
// const isDev = true
// const host = isDev
//   ? "localhost:5000"
//   : window.location.href.split("//")[1].split("/")[0]

// const httpLink = createUploadLink({
//   uri: `${isDev ? "http" : "https"}://${host}/graphql`,
// })

// const authLink = setContext((_, { headers }) => {
//   const auth = localStorage.getItem("auth") || ""

//   let authtoken = ""
//   if (auth.length) {
//     const { token }: { token: string } = JSON.parse(auth)
//     authtoken = token.length ? token : ""
//   }
//   return {
//     headers: {
//       ...headers,
//       authorization: `Bearer ${authtoken}`,
//     },
//   }
// })

// const client = new ApolloClient({
//   link: authLink.concat(httpLink),
//   cache: new InMemoryCache(),
// })

const isDev = true
const host = isDev
  ? "localhost:5000"
  : window.location.href.split("//")[1].split("/")[0]

const httpLink = createUploadLink({
  uri: `${isDev ? "http" : "https"}://${host}`,
})

const authLink = setContext((_, { headers }) => {
  const auth = localStorage.getItem("auth") || ""

  let authtoken = ""
  if (auth.length) {
    const { token }: { token: string } = JSON.parse(auth)
    authtoken = token.length ? token : ""
  }
  return {
    headers: {
      ...headers,
      authorization: `Bearer ${authtoken}`,
    },
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})

render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </ApolloProvider>,
  document.getElementById("root")
)
