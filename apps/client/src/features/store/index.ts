import { createStore } from '@reatom/core';
// import { connectReduxDevtools } from '@reatom/debug';

const store = createStore();

// if (process.env.NODE_ENV !== 'production') {
//   connectReduxDevtools(store);
// }

export { store };
