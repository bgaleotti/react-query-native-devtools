# React Query Native Devtools

Flipper devtools for [React Query](https://github.com/tannerlinsley/react-query)

## Installation

```bash
$ npm i --save-dev react-query-native-devtools react-native-flipper
# or
$ yarn add --dev react-query-native-devtools react-native-flipper
```

## Usage

Register the plugin in your application:

```javascript
import { queryCache } from 'react-query';

if (__DEV__) {
  import('react-query-native-devtools').then(({ addPlugin }) => {
    addPlugin(queryCache);
  });
}
```
