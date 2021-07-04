// import express from "express"
// import { ApolloServer, PubSub } from "apollo-server-express"
// import http from "http"
// import path from "path"
// import mongoose from "mongoose"
// import { config } from "dotenv"
// import isAuth from "./context/isAuth"
// import schema from "./schema"
// import cors from "cors"

// config()
// const { PORT, MONGO_USER, MONGO_PASS, MONGO_DB, NODE_ENV } = process.env
// const isDev = NODE_ENV === "development"

// ;(async () => {
//   try {
//     const app = express()
//     app.use(cors())

//     await mongoose.connect(
//       `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@cluster0.osxef.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority`,
//       {
//         useCreateIndex: true,
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//         useFindAndModify: false,
//       },
//       () => console.log("MongoDB started successfully!")
//     )

//     const pubsub = new PubSub()

//     const server = new ApolloServer({
//       ...schema,
//       playground: isDev,
//       context: ({ req, res }: { req: any; res: any }) => ({
//         req,
//         res,
//         pubsub,
//         isAuth: isAuth(req),
//       }),
//     })
//     server.applyMiddleware({ app })

//     if (NODE_ENV === "production") {
//       app.use(express.static(path.join(__dirname, "../", "client")))
//       app.get("/*", function (req, res) {
//         res.sendFile(path.join(__dirname, "../", "client", "index.html"))
//       })
//     }

//     const httpServer = http.createServer(app)
//     server.installSubscriptionHandlers(httpServer)

//     httpServer.listen(PORT, () => {
//       console.log(`🚀 Server ready at http://localhost:${PORT}`)
//       console.log(
//         `🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`
//       )
//     })
//   } catch (error) {
//     console.error(`Server error: ${error.message}`)
//   }
// })()
////////////////// apollo-server-express without sockets
import express from "express"
import { ApolloServer } from "apollo-server-express"
import path from "path"
import mongoose from "mongoose"
import { config } from "dotenv"
import isAuth from "./context/isAuth"
import schema from "./schema"
import cors from "cors"

config()
const { PORT, MONGO_USER, MONGO_PASS, MONGO_DB, NODE_ENV } = process.env
const isDev = NODE_ENV === "development"

;(async () => {
  try {
    const app = express()
    app.use(cors())

    await mongoose.connect(
      `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@cluster0.osxef.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority`,
      {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      },
      () => console.log("MongoDB started successfully!")
    )

    const server = new ApolloServer({
      ...schema,
      playground: isDev,
      context: ({ req, res }: { req: any; res: any }) => ({
        req,
        res,
        isAuth: isAuth(req),
      }),
    })
    server.applyMiddleware({ app })

    app.use(express.static(path.join(__dirname, "../", "../", "public")))

    if (!isDev) {
      app.use(express.static(path.join(__dirname, "../", "client")))
      app.get("/*", function (req, res) {
        res.sendFile(path.join(__dirname, "../", "client", "index.html"))
      })
    }

    app.listen(PORT, () => console.log(`Server started on port: ${PORT}`))
  } catch (error) {
    console.error(`Server error: ${error.message}`)
  }
})()

///////////////////////////////////////// apollo-server
// import { ApolloServer } from "apollo-server"
// import mongoose from "mongoose"
// import { config } from "dotenv"
// import isAuth from "./context/isAuth"
// import schema from "./schema"
// import path from "path"

// config()
// const { PORT, MONGO_USER, MONGO_PASS, MONGO_DB, NODE_ENV } = process.env
// const isDev = NODE_ENV === "development"

// ;(async () => {
//   try {
//     await mongoose.connect(
//       `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@cluster0.osxef.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority`,
//       {
//         useCreateIndex: true,
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//         useFindAndModify: false,
//       },
//       () => console.log("MongoDB started successfully!")
//     )

//     const server = new ApolloServer({
//       ...schema,
//       playground: true,
//       context: ({ req, res }: { req: any; res: any }) => ({
//         req,
//         res,
//         isAuth: isAuth(req),
//       }),
//     })

//     // if (NODE_ENV === "production") {
//     //   app.use(express.static(path.join(__dirname, "../", "client")))
//     //   app.get("/*", function (req, res) {
//     //     res.sendFile(path.join(__dirname, "../", "client", "index.html"))
//     //   })
//     // }

//     server.listen({ port: PORT }).then(({ url }) => {
//       console.log(`Server started on url: ${url}`)
//     })
//   } catch (error) {
//     console.error(`Server error: ${error.message}`)
//   }
// })()
