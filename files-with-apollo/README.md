# react-apollo-file-upload-example
![](http://i.imgur.com/CH44AZF.png)

## Getting Started

After [downloading this example](https://github.com/graphcool-examples/react-apollo-file-upload-example/archive/master.zip) please follow these steps!

### 1. Create an account

To run this example, please create a [Graphcool](http://graph.cool) account and **copy your endpoint**. This shouldn't take longer than a minute. We promise!

![](http://i.imgur.com/ytXDR4B.gif)

This is how our GraphQL data model looks like:

```graphql
type Post {
  description: String!
  image: File!
}

# The File model is already part of your new project
type File {
  url: String!
}
```

### 2. Configure your GraphQL Endpoint

```sh
export REACT_APP_GRAPHQL_ENDPOINT="https://api.graph.cool/simple/v1/__PROJECT_ID__"
```

### 3. Run the example

You're done configuring the example application. Please run the following command and open [localhost:3000](http://localhost:3000) in your browser. Have fun exploring! 🎉

```sh
npm install
npm start
```


## Help & Community [![Slack Status](https://slack.graph.cool/badge.svg)](https://slack.graph.cool)

Join our [Slack community](http://slack.graph.cool/) if you run into issues or have questions. We love talking to you!

![](http://i.imgur.com/5RHR6Ku.png)
