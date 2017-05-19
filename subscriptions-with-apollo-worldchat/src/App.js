import React, { Component } from 'react'
import WorldChat from './WorldChat'
import ApolloClient, { createNetworkInterface } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'
import generateStupidName from 'sillyname'
import {SubscriptionClient, addGraphQLSubscriptions} from 'subscriptions-transport-ws'


// Create WebSocket client
const wsClient = new SubscriptionClient(`wss://subscriptions.graph.cool/v1/cizfapt9y2jca01393hzx96w9`, {
  reconnect: true,
})

const networkInterface = createNetworkInterface({
  uri: 'https://api.graph.cool/simple/v1/cizfapt9y2jca01393hzx96w9'
})

// Extend the network interface with the WebSocket
const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient
)

const client = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions,
  dataIdFromObject: o => o.id,
})


const WORLDCHAT_USERNAME_KEY = 'WORLDCHAT_USERNAME'

class App extends Component {

  componentWillMount() {

    // testing
    // localStorage.removeItem(WORLDCHAT_USERNAME_KEY)

    let name = localStorage.getItem(WORLDCHAT_USERNAME_KEY)
    if (!Boolean(name)) {
      name = generateStupidName()
      console.log('No name in localStorage, generated new: ', name)
      localStorage.setItem(WORLDCHAT_USERNAME_KEY, name)
    }
    console.log('Name in localStorage: ', name)

  }

  render() {
    return (
      <ApolloProvider client={client}>
        <WorldChat
          name={localStorage.getItem(WORLDCHAT_USERNAME_KEY)}
        />
      </ApolloProvider>
    )
  }
}

export default App
