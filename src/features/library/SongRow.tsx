import { memo } from 'react';
import type { CSSProperties } from 'react';
import type { Song } from '../../types';
import { formatDuration } from '../../utils/format';

interface SongRowProps {
  song: Song;
  index: number;
  isFavorite: boolean;
  onPlay: (song: Song) => void;
  onToggleFavorite: (id: string) => void;
  onAddToQueue: (song: Song) => void;
  onAddToPlaylist?: (song: Song) => void;
  playlistDisabled?: boolean;
  style?: CSSProperties;
}

function SongRowComponent({
  song,
  index,
  isFavorite,
  onPlay,
  onToggleFavorite,
  onAddToQueue,
  onAddToPlaylist,
  playlistDisabled = false,
  style,
}: SongRowProps) {
  return (
    <div className="song-row" style={style}>
      <span className="song-index">{index + 1}</span>
      <span className="song-title">{song.title}</span>
      <span className="song-artist">{song.artist}</span>
      <span className="song-genre">{song.genre}</span>
      <span className="song-duration">{formatDuration(song.duration)}</span>
      <button type="button" onClick={() => onPlay(song)}>
        Phát
      </button>
      <button
        type="button"
        aria-label={isFavorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
        onClick={() => onToggleFavorite(song.id)}
      >
        {isFavorite ? '♥' : '♡'}
      </button>
      <button type="button" onClick={() => onAddToQueue(song)}>
        + Hàng đợi
      </button>
      {onAddToPlaylist && (
        <button type="button" disabled={playlistDisabled} onClick={() => onAddToPlaylist(song)}>
          + Playlist
        </button>
      )}
    </div>
  );
}

export const SongRow = memo(SongRowComponent);
