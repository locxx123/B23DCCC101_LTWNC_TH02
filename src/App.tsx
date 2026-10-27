import { lazy, Suspense } from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import LibraryPage from './features/library/LibraryPage';
import { PlayerBar } from './features/player/PlayerBar';
import { PlaylistProvider } from './features/playlists/PlaylistContext';

const FavoritesPage = lazy(() => import('./features/favorites/FavoritesPage'));
const PlaylistsPage = lazy(() => import('./features/playlists/PlaylistsPage'));
const PlaylistDetailPage = lazy(() => import('./features/playlists/PlaylistDetailPage'));

function Shell() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="app" data-theme={theme}>
      <nav className="menu">
        <NavLink to="/" end>
          Thư viện
        </NavLink>
        <NavLink to="/favorites">Yêu thích</NavLink>
        <NavLink to="/playlists">Playlist</NavLink>
        <button type="button" onClick={toggleTheme}>
          {theme === 'light' ? 'Giao diện tối' : 'Giao diện sáng'}
        </button>
      </nav>
      <main>
        <Suspense fallback={<p>Đang tải trang...</p>}>
          <Routes>
            <Route path="/" element={<LibraryPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/playlists" element={<PlaylistsPage />} />
            <Route path="/playlists/:id" element={<PlaylistDetailPage />} />
          </Routes>
        </Suspense>
      </main>
      <PlayerBar />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <PlaylistProvider>
        <BrowserRouter>
          <Shell />
        </BrowserRouter>
      </PlaylistProvider>
    </ThemeProvider>
  );
}
