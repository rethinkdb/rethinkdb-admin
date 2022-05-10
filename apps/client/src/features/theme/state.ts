import { declareAction, declareAtom } from '@reatom/core';
import { store } from '../../store';

export type ThemeState = 'auto' | 'light' | 'dark';

export const STATES: ThemeState[] = ['auto', 'light', 'dark'];

const LS_KEY = 'theme-state';

/** Actions */
export const changeThemeState = declareAction('theme');

/** Atoms */
export const themeAtom = declareAtom<ThemeState>(
  localStorage.getItem(LS_KEY) as ThemeState,
  (on) => [
    on(changeThemeState, (state) => {
      const index = STATES.indexOf(state);
      return STATES[(index + 1) % STATES.length];
    }),
  ],
);

/** Store */
store.subscribe(themeAtom, (state) => {
  localStorage.setItem(LS_KEY, state);
});
