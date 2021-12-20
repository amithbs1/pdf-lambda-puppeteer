import fetch from 'cross-fetch';
import { ApolloClient } from '@apollo/client/core'
import { HttpLink } from '@apollo/client/core'
import { InMemoryCache, NormalizedCacheObject } from '@apollo/client/cache'
import { setContext } from '@apollo/client/link/context';

export const APOLLO_STATE_PROPERTY_NAME = '__APOLLO_STATE__';
export const COOKIES_TOKEN_NAME = 'jwt';

let apolloClient: ApolloClient<NormalizedCacheObject> = null;

const createApolloClient = () => {
  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URI,
    credentials: 'same-origin',
    fetch
  });

  const authLink = setContext((_, { headers }) => {

    return {
      headers: {
        ...headers,
      },
    };
  });

  return new ApolloClient({
    ssrMode: true,
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
};

export function initializeApollo() {
  const client = apolloClient ?? createApolloClient();

  // For SSG and SSR always create a new Apollo Client
  if (true) {
    return client;
  }
}
