# React Query Native Devtools

Flipper client plug-in for [React Query](https://github.com/tannerlinsley/react-query)

## Installation

```bash
$ npm i --save-dev react-query-native-devtools react-native-flipper
# or
$ yarn add --dev react-query-native-devtools react-native-flipper
```

## Usage

Register the plugin in your application:

```javascript
import * as React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

if (__DEV__) {
  import('react-query-native-devtools').then(({ addPlugin }) => {
    addPlugin({ queryClient });
  });
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MyReactQueryApp />
    </QueryClientProvider>
  );
}
```
