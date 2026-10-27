import type { Playlist, PlaylistAction } from '../../types';

export const playlistReducer = (state: Playlist[], action: PlaylistAction): Playlist[] => {
  switch (action.type) {
    case 'create':
      return [...state, { id: action.id, name: action.name, songIds: [] }];
    case 'rename':
      return state.map((p) => (p.id === action.id ? { ...p, name: action.name } : p));
    case 'remove':
      return state.filter((p) => p.id !== action.id);
    case 'addSong':
      return state.map((p) =>
        p.id === action.playlistId && !p.songIds.includes(action.songId)
          ? { ...p, songIds: [...p.songIds, action.songId] }
          : p,
      );
    case 'removeSong':
      return state.map((p) =>
        p.id === action.playlistId
          ? { ...p, songIds: p.songIds.filter((id) => id !== action.songId) }
          : p,
      );
    default:
      return state;
  }
};
