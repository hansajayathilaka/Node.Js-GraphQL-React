import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/react-hooks'
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink, Observable } from 'apollo-link';
import {getAccessToken, setAccessToken} from "./accessToken";
import { App } from "./App";
import { TokenRefreshLink } from "apollo-link-token-refresh";
import jwtDecode from 'jwt-decode';


const cache = new InMemoryCache({});

const tokenRefreshLink: any = new TokenRefreshLink({
    accessTokenField: 'accessToken',
    isTokenValidOrUndefined: () => {
        const token = getAccessToken();
        if (!token)
            return true;
        try {
            const {exp} = jwtDecode(token);
            return Date.now() < exp * 1000;
        } catch (err) {
            return false;
        }
    },
    fetchAccessToken: async () => {
        debugger;
        const temp = await fetch('http://localhost:3000/refresh_token', {
            method: 'POST',
            credentials: 'include'
        });
        return temp;
    },
    handleFetch: accessToken => {
        debugger;
        setAccessToken(accessToken);
    },
    handleError: err => {
        console.warn('Your refresh token is invalid. Try to relogin');
        console.error(err);
    }
});

const requestLink = new ApolloLink((operation, forward) =>
    new Observable(observer => {
        let handle: any;
        Promise.resolve(operation)
            .then(operation => {
                const accessToken = getAccessToken();
                if(accessToken) {
                    operation.setContext({
                        headers: {
                            authorization: `bearer ${accessToken}`
                        }
                    });
                }
            }).then(() => {
                handle = forward(operation).subscribe({
                    next: observer.next.bind(observer),
                    error: observer.error.bind(observer),
                    complete: observer.complete.bind(observer),
                });
            })
            .catch(observer.error.bind(observer));

        return () => {
            if (handle) handle.unsubscribe();
        };
    })
);

const errorLink = onError(({ graphQLErrors, networkError }) => {
    console.log(graphQLErrors);
    console.log(networkError);
});

const httpLink = new HttpLink({
    uri: 'http://localhost:3000/graphql',
    credentials: 'include'
});


const client = new ApolloClient({
    link: ApolloLink.from([
        tokenRefreshLink,
        errorLink,
        requestLink,
        httpLink
    ]),
    cache
});


ReactDOM.render(
    <ApolloProvider client={ client as any }>
        <App />
    </ApolloProvider>,
  document.getElementById('root')
);
