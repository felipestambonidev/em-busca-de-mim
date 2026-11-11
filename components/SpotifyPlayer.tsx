"use client";

import { useEffect, useRef, useState } from "react";

/* Playlist oficial: open.spotify.com/playlist/6MvhfCzsrBjMVqoAZCIM5z */
const PLAYLIST_ID = "6MvhfCzsrBjMVqoAZCIM5z";

function SpotifyLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

/**
 * Botão flutuante da playlist.
 * O player só é carregado no primeiro clique (o Spotify não pesa na abertura do site)
 * e continua montado depois de fechar o painel, para a música não parar.
 */
export default function SpotifyPlayer() {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!panelRef.current?.contains(t) && !buttonRef.current?.contains(t)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  function toggle() {
    setLoaded(true);
    setOpen((v) => !v);
  }

  return (
    <div className="spotify">
      <div
        ref={panelRef}
        id="spotify-panel"
        className={`spotify__panel${open ? " is-open" : ""}`}
        role="dialog"
        aria-label="Playlist Em Busca de Mim no Spotify"
        aria-hidden={!open}
        inert={!open}
      >
        <div className="spotify__head">
          <p className="spotify__title">
            Playlist <span className="spotify__script">Em Busca de Mim</span>
          </p>
          <button type="button" className="spotify__close" onClick={() => setOpen(false)} aria-label="Fechar playlist">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        {loaded && (
          <iframe
            className="spotify__frame"
            title="Playlist Em Busca de Mim no Spotify"
            src={`https://open.spotify.com/embed/playlist/${PLAYLIST_ID}?utm_source=generator`}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          />
        )}
      </div>

      <button
        ref={buttonRef}
        type="button"
        className={`spotify__fab${open ? " is-open" : ""}`}
        onClick={toggle}
        aria-expanded={open}
        aria-controls="spotify-panel"
        aria-label={open ? "Fechar playlist" : "Ouvir a playlist Em Busca de Mim"}
      >
        <SpotifyLogo className="spotify__logo" />
        <span className="spotify__label">Ouça a playlist</span>
      </button>
    </div>
  );
}
