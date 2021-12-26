# react-query-native-devtools

Plugin for Flipper for the React Query [React Query](https://github.com/tannerlinsley/react-query) similar to [React Query Devtools](https://react-query.tanstack.com/docs/devtools) experience.

Flipper plugins contain two parts:

- The client plugin that should be put inside your application. Its role is get data from QueryClient and send it to Flipper.
- Flipper desktop plugin. It listens for data which client plugin sends and renders it in Flipper.

This is a monorepo for two packages:

### [react-query-native-devtools](./packages/react-query-native-devtools)

The package for your React Native project to work with React Query.
Installation and usage are [here](./packages/react-query-native-devtools/README.md).

### [flipper-plugin-react-query-native-devtools](./packages/flipper-plugin-react-query-native-devtools)

Desktop plugin for the flipper. To use - search for the `flipper-plugin-react-query-native-devtools` in the plugin menu.

More details is [here](./packages/flipper-plugin-react-query-native-devtools/README.md).
