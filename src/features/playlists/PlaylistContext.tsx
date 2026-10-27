import { createContext, useContext, useEffect, useReducer } from 'react';
import type { Dispatch, ReactNode } from 'react';
import type { Playlist, PlaylistAction } from '../../types';
import { playlistReducer } from './playlistReducer';
import { withLogger } from './withLogger';

const STORAGE_KEY = 'music-playlists';

const PlaylistStateContext = createContext<Playlist[] | null>(null);
const PlaylistDispatchContext = createContext<Dispatch<PlaylistAction> | null>(null);

const load = (): Playlist[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Playlist[]) : [];
  } catch {
    return [];
  }
};

export function PlaylistProvider({ children }: { children: ReactNode }) {
  const [playlists, dispatch] = useReducer(withLogger(playlistReducer), undefined, load);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(playlists));
  }, [playlists]);

  return (
    <PlaylistDispatchContext.Provider value={dispatch}>
      <PlaylistStateContext.Provider value={playlists}>{children}</PlaylistStateContext.Provider>
    </PlaylistDispatchContext.Provider>
  );
}

export function usePlaylists(): Playlist[] {
  const ctx = useContext(PlaylistStateContext);
  if (ctx === null) throw new Error('usePlaylists phải được dùng bên trong PlaylistProvider');
  return ctx;
}

export function usePlaylistDispatch(): Dispatch<PlaylistAction> {
  const ctx = useContext(PlaylistDispatchContext);
  if (ctx === null) throw new Error('usePlaylistDispatch phải được dùng bên trong PlaylistProvider');
  return ctx;
}
