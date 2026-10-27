import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { SONG_MAP } from '../../data/songs';
import type { Song } from '../../types';
import { formatDuration } from '../../utils/format';
import { usePlayerStore } from '../player/usePlayerStore';
import { usePlaylistDispatch, usePlaylists } from './PlaylistContext';

export default function PlaylistDetailPage() {
  const { id } = useParams<{ id: string }>();
  const playlists = usePlaylists();
  const dispatch = usePlaylistDispatch();
  const playQueue = usePlayerStore((s) => s.playQueue);

  const playlist = playlists.find((p) => p.id === id);

  const songs = useMemo(
    () =>
      (playlist?.songIds ?? [])
        .map((sid) => SONG_MAP.get(sid))
        .filter((s): s is Song => s !== undefined),
    [playlist],
  );

  if (!playlist) return <p>Không tìm thấy playlist</p>;

  const total = songs.reduce((sum, s) => sum + s.duration, 0);

  return (
    <section>
      <h1>{playlist.name}</h1>
      <p>
        Tổng thời lượng: {Math.floor(total / 60)} phút {total % 60} giây
      </p>
      <button type="button" disabled={songs.length === 0} onClick={() => playQueue(songs, 0)}>
        Phát tất cả
      </button>
      <ul>
        {songs.map((song) => (
          <li key={song.id}>
            {song.title} - {song.artist} ({formatDuration(song.duration)}){' '}
            <button
              type="button"
              onClick={() => dispatch({ type: 'removeSong', playlistId: playlist.id, songId: song.id })}
            >
              Bỏ
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
