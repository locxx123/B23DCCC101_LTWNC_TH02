import { useCallback, useMemo } from 'react';
import { SONG_MAP } from '../../data/songs';
import type { Song } from '../../types';
import { SongRow } from '../library/SongRow';
import { usePlayerStore } from '../player/usePlayerStore';
import { useFavoritesStore } from './useFavoritesStore';

export default function FavoritesPage() {
  const ids = useFavoritesStore((s) => s.ids);
  const toggle = useFavoritesStore((s) => s.toggle);
  const playQueue = usePlayerStore((s) => s.playQueue);
  const addToQueue = usePlayerStore((s) => s.addToQueue);

  const songs = useMemo(
    () => ids.map((id) => SONG_MAP.get(id)).filter((s): s is Song => s !== undefined),
    [ids],
  );

  const onPlay = useCallback(
    (song: Song) => playQueue(songs, songs.indexOf(song)),
    [playQueue, songs],
  );

  return (
    <section>
      <h1>Bài hát yêu thích</h1>
      {songs.length === 0 ? (
        <p>Bạn chưa có bài hát yêu thích</p>
      ) : (
        <>
          <button type="button" onClick={() => playQueue(songs, 0)}>
            Phát tất cả
          </button>
          {songs.map((song, i) => (
            <SongRow
              key={song.id}
              song={song}
              index={i}
              isFavorite
              onPlay={onPlay}
              onToggleFavorite={toggle}
              onAddToQueue={addToQueue}
            />
          ))}
        </>
      )}
    </section>
  );
}
