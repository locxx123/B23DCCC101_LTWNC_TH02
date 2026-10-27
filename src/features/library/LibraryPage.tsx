import { memo, useCallback, useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import { FixedSizeList } from 'react-window';
import type { ListChildComponentProps } from 'react-window';
import { SONGS, GENRES } from '../../data/songs';
import { useDebounce } from '../../hooks/useDebounce';
import type { Genre, Song } from '../../types';
import { useFavoritesStore } from '../favorites/useFavoritesStore';
import { usePlayerStore } from '../player/usePlayerStore';
import { usePlaylistDispatch, usePlaylists } from '../playlists/PlaylistContext';
import { SongRow } from './SongRow';

type GenreFilter = 'all' | Genre;
type SortKey = 'default' | 'name' | 'duration';

interface RowData {
  songs: Song[];
  favorites: Set<string>;
  onPlay: (song: Song) => void;
  onToggleFavorite: (id: string) => void;
  onAddToQueue: (song: Song) => void;
  onAddToPlaylist: (song: Song) => void;
  playlistDisabled: boolean;
}

const Row = memo(function Row({ index, style, data }: ListChildComponentProps<RowData>) {
  const song = data.songs[index];
  return (
    <SongRow
      song={song}
      index={index}
      style={style}
      isFavorite={data.favorites.has(song.id)}
      onPlay={data.onPlay}
      onToggleFavorite={data.onToggleFavorite}
      onAddToQueue={data.onAddToQueue}
      onAddToPlaylist={data.onAddToPlaylist}
      playlistDisabled={data.playlistDisabled}
    />
  );
});

export default function LibraryPage() {
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState<GenreFilter>('all');
  const [sort, setSort] = useState<SortKey>('default');
  const [playlistId, setPlaylistId] = useState('');

  const debouncedQuery = useDebounce(query, 300);

  const favoriteIds = useFavoritesStore((s) => s.ids);
  const toggleFavorite = useFavoritesStore((s) => s.toggle);
  const playQueue = usePlayerStore((s) => s.playQueue);
  const addToQueue = usePlayerStore((s) => s.addToQueue);
  const playlists = usePlaylists();
  const dispatch = usePlaylistDispatch();

  const favorites = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  const visibleSongs = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    let result = SONGS.filter(
      (s) =>
        (genre === 'all' || s.genre === genre) &&
        (q === '' || s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q)),
    );
    if (sort === 'name') {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title, 'vi'));
    } else if (sort === 'duration') {
      result = [...result].sort((a, b) => a.duration - b.duration);
    }
    return result;
  }, [debouncedQuery, genre, sort]);

  const onPlay = useCallback(
    (song: Song) => {
      playQueue(visibleSongs, visibleSongs.indexOf(song));
    },
    [playQueue, visibleSongs],
  );

  const selectedPlaylistId = playlists.some((p) => p.id === playlistId) ? playlistId : '';

  const onAddToPlaylist = useCallback(
    (song: Song) => {
      if (selectedPlaylistId) {
        dispatch({ type: 'addSong', playlistId: selectedPlaylistId, songId: song.id });
      }
    },
    [dispatch, selectedPlaylistId],
  );

  const itemData = useMemo<RowData>(
    () => ({
      songs: visibleSongs,
      favorites,
      onPlay,
      onToggleFavorite: toggleFavorite,
      onAddToQueue: addToQueue,
      onAddToPlaylist,
      playlistDisabled: selectedPlaylistId === '',
    }),
    [visibleSongs, favorites, onPlay, toggleFavorite, addToQueue, onAddToPlaylist, selectedPlaylistId],
  );

  return (
    <section>
      <h1>Thư viện</h1>
      <div className="toolbar">
        <label>
          Tìm kiếm
          <input
            type="search"
            value={query}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
            placeholder="Tên bài hoặc ca sĩ"
          />
        </label>
        <label>
          Thể loại
          <select value={genre} onChange={(e) => setGenre(e.target.value as GenreFilter)}>
            <option value="all">Tất cả</option>
            {GENRES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </label>
        <label>
          Sắp xếp
          <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
            <option value="default">Mặc định</option>
            <option value="name">Tên A-Z</option>
            <option value="duration">Thời lượng tăng dần</option>
          </select>
        </label>
        <label>
          Playlist đang chọn
          <select value={selectedPlaylistId} onChange={(e) => setPlaylistId(e.target.value)}>
            <option value="">-- Chưa chọn --</option>
            {playlists.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p role="status">
        {visibleSongs.length > 0
          ? `Tìm thấy ${visibleSongs.length} bài hát`
          : 'Không tìm thấy bài hát nào'}
      </p>
      {visibleSongs.length > 0 && (
        <FixedSizeList
          height={560}
          width="100%"
          itemCount={visibleSongs.length}
          itemSize={56}
          itemData={itemData}
          itemKey={(index, data: RowData) => data.songs[index].id}
        >
          {Row}
        </FixedSizeList>
      )}
    </section>
  );
}
