import { createAtom } from '@reatom/core';

import { store } from '../store';

export type ThemeState = 'auto' | 'light' | 'dark';

export const STATES: ThemeState[] = ['auto', 'light', 'dark'];

const LS_KEY = 'theme-state';

const initState = (localStorage.getItem(LS_KEY) as ThemeState) || 'auto';

/** Atoms */
export const themeAtom = createAtom<
  ThemeState,
  { changeThemeState: () => undefined }
>({ changeThemeState: () => undefined }, ({ onAction }, state = initState) => {
  onAction('changeThemeState', () => {
    const index = STATES.indexOf(state as ThemeState);
    state = STATES[(index + 1) % STATES.length];
  });

  return state;
});

/** Store */
store.subscribe(themeAtom, (state) => {
  localStorage.setItem(LS_KEY, state);
});
