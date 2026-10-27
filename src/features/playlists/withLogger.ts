import type { Reducer } from 'react';

export const withLogger =
  <S, A extends { type: string }>(reducer: Reducer<S, A>): Reducer<S, A> =>
  (state, action) => {
    const next = reducer(state, action);
    if (import.meta.env.DEV) {
      console.log(`[action] ${action.type}`, { prev: state, action, next });
    }
    return next;
  };
