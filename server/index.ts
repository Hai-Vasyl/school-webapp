import express from "express"
import { ApolloServer, PubSub } from "apollo-server-express"
// const { ApolloServer, PubSub } = require()
import http from "http"
import path from "path"

// import { ApolloServer, PubSub } from "apollo-server"
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

    const pubsub = new PubSub()

    const server = new ApolloServer({
      ...schema,
      playground: isDev,
      context: ({ req, res }: { req: any; res: any }) => ({
        req,
        res,
        pubsub,
        isAuth: isAuth(req),
      }),
    })
    server.applyMiddleware({ app })

    // const httpServer = http.createServer(app)
    // server.installSubscriptionHandlers(httpServer)

    if (NODE_ENV === "production") {
      app.use(express.static(path.join(__dirname, "../", "client")))
      app.get("/*", function (req, res) {
        res.sendFile(path.join(__dirname, "../", "client", "index.html"))
      })

      // console.log(path.join(__dirname, "../", "client"))
    }

    // app.listen(PORT, () => {
    //   console.log(`Server started on port: ${PORT}`)
    // })

    // const _server = http.createServer(app)

    // _server.listen(PORT, () => {
    //   new SubscriptionServer(
    //     {
    //       execute,
    //       subscribe,
    //       schema,
    //     },
    //     {
    //       server: _server,
    //       path: "/subscriptions",
    //     }
    //   )
    // })

    // server.listen({ port: PORT }).then(({ url }) => {
    //   console.log(`Server started on url: ${url}`)
    // })
    const httpServer = http.createServer(app)
    server.installSubscriptionHandlers(httpServer)

    // Make sure to call listen on httpServer, NOT on app.
    // console.log(server.subscriptionsPath)
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server ready at http://localhost:${PORT}`)
      console.log(
        `🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`
      )
    })
  } catch (error) {
    console.error(`Server error: ${error.message}`)
  }
})()
