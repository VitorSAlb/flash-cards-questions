import { useState, useEffect } from 'react';
import type { ThemeData } from '../types';

interface CustomRandomScreenProps {
  themes: ThemeData[];
  onStart: (selectedThemes: string[], maxQuestions: number) => void;
  onBack: () => void;
}

export function CustomRandomScreen({ themes, onStart, onBack }: CustomRandomScreenProps) {
  const [selectedThemeNames, setSelectedThemeNames] = useState<string[]>(themes.map(t => t.theme));
  const [maxQuestions, setMaxQuestions] = useState<number>(20);

  useEffect(() => {
    if (themes.length > 0 && selectedThemeNames.length === 0) {
      setSelectedThemeNames(themes.map(t => t.theme));
    }
  }, [themes]);

  const handleToggleTheme = (themeName: string) => {
    setSelectedThemeNames(prev => 
      prev.includes(themeName) 
        ? prev.filter(t => t !== themeName)
        : [...prev, themeName]
    );
  };

  const handleSelectAll = () => {
    setSelectedThemeNames(themes.map(t => t.theme));
  };

  const handleSelectNone = () => {
    setSelectedThemeNames([]);
  };

  const totalAvailable = themes
    .filter(t => selectedThemeNames.includes(t.theme))
    .reduce((acc, curr) => acc + curr.questions.length, 0);

  return (
    <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', textAlign: 'left', margin: '0 auto' }}>
      <button className="back-button" onClick={onBack}>← Voltar</button>
      <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Mix Aleatório</h2>

      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>1. Selecione os Temas</h3>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <button className="secondary-button" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={handleSelectAll}>Marcar Todos</button>
          <button className="secondary-button" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={handleSelectNone}>Desmarcar Todos</button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', maxHeight: '250px', overflowY: 'auto', paddingRight: '10px' }}>
          {themes.map(t => (
            <label key={t.theme} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', background: 'rgba(255,255,255,0.05)', padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <input 
                type="checkbox" 
                checked={selectedThemeNames.includes(t.theme)}
                onChange={() => handleToggleTheme(t.theme)}
                style={{ width: '20px', height: '20px', accentColor: 'var(--primary-color)' }}
              />
              <span style={{ flex: 1, fontSize: '1.1rem' }}>{t.theme}</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t.questions.length} questões</span>
            </label>
          ))}
          {themes.length === 0 && <p>Nenhum tema encontrado.</p>}
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '0.5rem', color: 'var(--primary-color)' }}>2. Quantidade de Perguntas</h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.8rem' }}>
          Quantas perguntas você quer responder? (Até {totalAvailable} disponíveis nestes temas)
        </p>
        <input 
          type="number" 
          value={maxQuestions}
          onChange={e => setMaxQuestions(Math.max(1, parseInt(e.target.value) || 1))}
          className="text-input"
          style={{ fontSize: '1.1rem', padding: '0.8rem' }}
          min="1"
          max={totalAvailable || 1}
        />
      </div>

      <button 
        className="primary-button" 
        style={{ width: '100%', padding: '1rem', fontSize: '1.2rem' }}
        onClick={() => onStart(selectedThemeNames, maxQuestions)}
        disabled={selectedThemeNames.length === 0 || maxQuestions < 1 || totalAvailable === 0}
      >
        Começar Mix Aleatório
      </button>
    </div>
  );
}
