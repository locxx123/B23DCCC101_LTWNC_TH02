import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Song } from '../../types';

export interface PlayerState {
  queue: Song[];
  currentIndex: number; // -1 khi chưa phát
  isPlaying: boolean;
  position: number; // giây
  playQueue: (songs: Song[], startIndex: number) => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  addToQueue: (song: Song) => void;
  tick: () => void;
}

export const usePlayerStore = create<PlayerState>()(
  devtools(
    (set, get) => ({
      queue: [],
      currentIndex: -1,
      isPlaying: false,
      position: 0,

      playQueue: (songs, startIndex) =>
        set(
          { queue: songs, currentIndex: startIndex, isPlaying: songs.length > 0, position: 0 },
          false,
          'playQueue',
        ),

      togglePlay: () =>
        set((s) => (s.currentIndex < 0 ? s : { isPlaying: !s.isPlaying }), false, 'togglePlay'),

      next: () =>
        set(
          (s) => {
            if (s.currentIndex < 0) return s;
            if (s.currentIndex >= s.queue.length - 1) return { isPlaying: false, position: 0 };
            return { currentIndex: s.currentIndex + 1, position: 0 };
          },
          false,
          'next',
        ),

      prev: () =>
        set(
          (s) => {
            if (s.currentIndex < 0) return s;
            if (s.position > 3 || s.currentIndex === 0) return { position: 0 };
            return { currentIndex: s.currentIndex - 1, position: 0 };
          },
          false,
          'prev',
        ),

      addToQueue: (song) =>
        set(
          (s) => (s.queue.some((q) => q.id === song.id) ? s : { queue: [...s.queue, song] }),
          false,
          'addToQueue',
        ),

      tick: () => {
        const { queue, currentIndex, position, next } = get();
        const song = queue[currentIndex];
        if (!song) return;
        if (position + 1 >= song.duration) next();
        else set({ position: position + 1 }, false, 'tick');
      },
    }),
    { name: 'player', enabled: import.meta.env.DEV },
  ),
);
