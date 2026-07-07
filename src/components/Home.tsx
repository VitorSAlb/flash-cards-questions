import type { ThemeData } from '../types';

interface HomeProps {
  themes: ThemeData[];
  onSelectTheme: (theme: string) => void;
  onCustomRandom: () => void;
  onManageThemes: () => void;
  onViewBookmarks: () => void;
  onViewBlocked: () => void;
  bookmarksCount: number;
  blockedCount: number;
}

export function Home({ themes, onSelectTheme, onCustomRandom, onManageThemes, onViewBookmarks, onViewBlocked, bookmarksCount, blockedCount }: HomeProps) {
  return (
    <div className="glass-panel" style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <h2>Selecione um Tema</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button className="secondary-button" onClick={onManageThemes}>
            ⚙️ Gerenciar
          </button>
          <button className="secondary-button" onClick={onViewBookmarks}>
            🚩 Dúvidas ({bookmarksCount})
          </button>
          <button className="secondary-button" onClick={onViewBlocked}>
            🚫 Bloqueadas ({blockedCount})
          </button>
          <button className="primary-button" onClick={onCustomRandom}>
            🎲 Mix de Temas
          </button>
        </div>
      </div>
      <div className="themes-grid">
        {themes.length === 0 ? (
          <p>Nenhum tema encontrado. Adicione JSONs na pasta src/data/</p>
        ) : (
          themes.map((data, index) => (
            <div 
              key={index} 
              className="theme-card"
              onClick={() => onSelectTheme(data.theme)}
            >
              <div className="theme-title">{data.theme}</div>
              <div className="theme-stats">
                {data.questions.length} {data.questions.length === 1 ? 'pergunta' : 'perguntas'}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
