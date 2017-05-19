# react-apollo-instagram-example
![](http://i.imgur.com/CH44AZF.png)


## Getting Started

After [downloading this example](https://github.com/graphcool-examples/react-apollo-instagram-subscriptions-example/archive/master.zip) please follow these steps.

### 1. Create an account

To run this example, please create a [graph.cool](http://graph.cool) account and **copy your endpoint**. This shouldn't take longer than a minute. We promise!

![](http://i.imgur.com/ytXDR4B.gif)

This is how our GraphQL data model should look like:

```graphql
type Post {
  description: String!
  imageUrl: String!
}
```

### 2. Configure app data endpoint

Open `src/index.js` and replace `__PROJECT_ID__` with your endpoint in the following lines:

```js
const wsClient = new SubscriptionClient('wss://subscriptions.graph.cool/v1/__PROJECT_ID__')
const networkInterface = createNetworkInterface({
  uri: 'https://api.graph.cool/simple/v1/__PROJECT_ID__',
})
```

### 3. Run the example

You're done configuring the example application. Please run the following command and open [localhost:3000](http://localhost:3000) in your browser. Make sure to open two or more tabs with the page to see subscriptions in action. Have fun exploring! 🎉

```sh
npm install
npm start
```

### 4. Subscriptions Debugger

You can use the Graphcool Playground to test subscriptions.

![](http://graphcool-random.s3.amazonaws.com/images/subscriptions.gif)

Simply run a subscription query to subscribe:

```graphql
subscription {
  Post(filter: {
    mutation_in: [CREATED]
  }) {
    node {
      id
      imageUrl
      description
    }
  }
}
```

## Help & Community [![Slack Status](https://slack.graph.cool/badge.svg)](https://slack.graph.cool)

Join our [Slack community](http://slack.graph.cool/) if you run into issues or have questions. We love talking to you!

![](http://i.imgur.com/5RHR6Ku.png)
