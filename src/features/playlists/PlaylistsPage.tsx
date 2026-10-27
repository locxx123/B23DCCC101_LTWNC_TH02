import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { usePlaylistDispatch, usePlaylists } from './PlaylistContext';

export default function PlaylistsPage() {
  const playlists = usePlaylists();
  const dispatch = usePlaylistDispatch();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed === '') {
      setError('Tên playlist không được để trống');
      return;
    }
    if (playlists.some((p) => p.name.toLowerCase() === trimmed.toLowerCase())) {
      setError('Tên playlist đã tồn tại');
      return;
    }
    dispatch({ type: 'create', id: `pl-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, name: trimmed });
    setName('');
    setError('');
  };

  return (
    <section>
      <h1>Playlist</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Tên playlist
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <button type="submit">Tạo</button>
        {error && <p role="alert">{error}</p>}
      </form>
      <ul className="playlist-list">
        {playlists.map((p) => (
          <li key={p.id}>
            <Link to={`/playlists/${p.id}`}>{p.name}</Link> <span>{p.songIds.length} bài</span>{' '}
            <button type="button" onClick={() => dispatch({ type: 'remove', id: p.id })}>
              Xóa
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
