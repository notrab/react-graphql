# Worldchat

A realtime chat application that displays the locations of all the chat participants on a map.

![Worldchat](http://i.imgur.com/8cpv7Hi.png)

You can run your own instance of the application by first creating a Graphcool backend and then running the app locally using `npm`.


## 1. Create a Graphcool backend [![graphql-up](http://static.graph.cool/images/graphql-up.svg)](https://www.graph.cool/graphql-up/new?source=https://raw.githubusercontent.com/graphcool-examples/worldchat-subscriptions-example/master/Worldchat.schema)

You'll need the following GraphQL schema to get started with the Worlchat application:

```graphql
type Traveller {
  id: ID!
  createdAt: DateTime!
  updatedAt: DateTime!
  name: String!
  location: Location! @relation(name: "TravellerLocation")
  messages: [Message!]! @relation(name: "MessagesFromTraveller")
}

type Message {
  id: ID!
  createdAt: DateTime!
  updatedAt: DateTime!
  text: String!
  sentBy: Traveller!  @relation(name: "MessagesFromTraveller")
}

type Location {
  id: ID!
  createdAt: DateTime!
  updatedAt: DateTime!
  traveller: Traveller! @relation(name: "TravellerLocation")
  latitude: Float!
  longitude: Float!
}
```

We already included a [schema file](https://github.com/graphcool-examples/worldchat-subscriptions-example/blob/master/Worldchat.schema) in this git repository, so all you have to do is download or clone the repository and then use our [cli](https://www.npmjs.com/package/graphcool) to create your Graphcool project:

```sh
git clone https://github.com/graphcool-examples/worldchat-subscriptions-example.git
cd Worldchat
graphcool create Worldchat.schema
```

You can also create the data model manually in our [console](https://console.graph.cool).


## 2. Connect the App to your backend

In `App.js`, you need to adjust the URLs that are used to connect to the GraphQL server.

```js
const wsClient = new SubscriptionClient(`wss://subscriptions.graph.cool/v1/__YOUR PROJECT ID__`, {
  reconnect: true,
})

const networkInterface = createNetworkInterface({
  uri: 'https://api.graph.cool/simple/v1/__YOUR PROJECT ID__'
```

You can retrieve your project ID from our [console](https://console.graph.cool), just select the newly created `Worldchat` project, navigate to `Settings -> General` and copy the `Project Id` from there.

You can then run the app locally by starting it from the terminal:

```sh
npm start
```

Happy chatting! 💬🌎


## Resources

This app demonstrates how to use the Graphcool subscription API using the Apollo client. you can find more about these technologies here:

- [**Tutorial:** How to build a Real-Time Chat with GraphQL Subscriptions and Apollo](https://www.graph.cool/docs/tutorials/worldchat-subscriptions-example-ui0eizishe/)
- [**Video:** How to build a Real-Time Chat with GraphQL Subscriptions and Apollo](https://www.youtube.com/watch?v=aSLF9f13o2c)
- [**Docs:** Using GraphQL Subscriptions with Graphcool](https://www.graph.cool/docs/reference/simple-api/generated-subscriptions-aip7oojeiv)
- [**Blog Post**: GraphQL Subscriptions in Apollo Client](https://dev-blog.apollodata.com/graphql-subscriptions-in-apollo-client-9a2457f015fb#.458zrl2u7)


## Help & Community [![Slack Status](https://slack.graph.cool/badge.svg)](https://slack.graph.cool)

Join our [Slack community](http://slack.graph.cool/) if you run into issues or have questions. We love talking to you!

![](http://i.imgur.com/5RHR6Ku.png)
