import { setContext } from "@apollo/client/link/context";
import { ErrorLink } from "@apollo/client/link/error";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
// import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client/core";

const AUTH_LOGOUT_EVENT = "auth:logout";

const resolveBackendUrl = () => {
  const configuredUrl = import.meta.env.VITE_BACKEND_API_URL?.trim();
  const isBrowser = typeof window !== "undefined";

  if (!isBrowser) return configuredUrl || "http://localhost:4000/graphql";

  const host = window.location.hostname;
  const isLanHost = host && host !== "localhost" && host !== "127.0.0.1";

  if (configuredUrl && !(isLanHost && configuredUrl.includes("localhost"))) {
    return configuredUrl;
  }

  const protocol = window.location.protocol || "http:";
  return `${protocol}//${host || "localhost"}:4000/graphql`;
};

const httpLink = createHttpLink({
  uri: resolveBackendUrl(),
});

const clearAuthSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.dispatchEvent(new Event(AUTH_LOGOUT_EVENT));
  client.clearStore().catch(() => {});
};

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: headers?.authorization || (token ? `Bearer ${token}` : ""),
    },
  };
});

const errorLink = new ErrorLink(({ error }) => {
  if (!CombinedGraphQLErrors.is(error)) return;

  const isUnauthenticated = error.errors.some(
    (graphQLError) => graphQLError.extensions?.code === "UNAUTHENTICATED"
  );

  if (isUnauthenticated) {
    clearAuthSession();
  }
});

export const client = new ApolloClient({
  link: errorLink.concat(authLink).concat(httpLink),
  cache: new InMemoryCache(),
});
