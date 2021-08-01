import {ApolloServer, gql} from 'apollo-server'
import {typeDefs} from './graphql/typedefs'
import {resolvers} from './graphql/resolvers'
import {dataSources} from './datasources'

const server = new ApolloServer({
  // cors: {
  //   origin: '*',
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //   preflightContinue: false,
  //   optionsSuccessStatus: 204,
  // },
  typeDefs: gql`
    ${typeDefs}
  `,

  resolvers,
  dataSources
})

server.listen().then(({url}) => {
  console.log(`Server ready at ${url}`)
})
