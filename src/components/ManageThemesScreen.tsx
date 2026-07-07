import { useState } from 'react';
import type { ThemeData } from '../types';

interface ManageThemesScreenProps {
  themes: ThemeData[];
  onBack: () => void;
}

export function ManageThemesScreen({ themes, onBack }: ManageThemesScreenProps) {
  const [categoryName, setCategoryName] = useState('');
  const [jsonInput, setJsonInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const promptText = `Quero criar um tema de flashcards sobre "${categoryName || 'TEMA'}".
Por favor, gere um arquivo JSON válido na seguinte formatação, contendo pelo menos 5 perguntas com níveis de dificuldade "easy", "medium" e "hard":
{
  "theme": "${categoryName || 'TEMA'}",
  "questions": [
    {
      "id": "unico-1",
      "topic": "Subtópico da pergunta",
      "difficulty": "medium",
      "text": "Qual é a pergunta?",
      "options": [
        {
          "text": "Alternativa correta",
          "isCorrect": true,
          "explanation": "Explicação do porquê está correta."
        },
        {
          "text": "Alternativa errada",
          "isCorrect": false,
          "explanation": "Explicação do porquê está errada."
        }
        // ATENÇÃO: DEVE ter exatamente 4 opções (1 certa, 3 erradas) para cada pergunta.
      ]
    }
  ]
}
Responda APENAS com o código JSON gerado, sem formatação markdown em volta e sem blocos \`\`\`.`;

  const copyPrompt = () => {
    navigator.clipboard.writeText(promptText);
    alert('Prompt copiado para a área de transferência!');
  };

  const handleSaveJson = async () => {
    try {
      let cleanedJson = jsonInput.trim();
      const match = cleanedJson.match(/\{[\s\S]*\}/);
      if (match) {
        cleanedJson = match[0];
      }
      
      const parsed = JSON.parse(cleanedJson);
      if (!parsed.theme || !Array.isArray(parsed.questions)) {
        throw new Error('O JSON não possui o formato esperado (theme e array de questions).');
      }
      setIsSaving(true);
      const res = await fetch('/api/themes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed)
      });
      if (!res.ok) throw new Error('Erro ao salvar no servidor.');
      
      alert('Tema salvo com sucesso!');
      setJsonInput('');
    } catch (e: any) {
      alert(`Erro: ${e.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (filename: string) => {
    if (!confirm(`Tem certeza que deseja apagar o arquivo ${filename}?`)) return;
    try {
      const res = await fetch('/api/themes', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename })
      });
      if (!res.ok) throw new Error('Erro ao deletar no servidor.');
      alert('Deletado com sucesso!');
    } catch (e: any) {
      alert(`Erro: ${e.message}`);
    }
  };

  return (
    <div className="glass-panel" style={{ width: '100%', textAlign: 'left' }}>
      <button className="back-button" onClick={onBack}>← Voltar</button>
      <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>Gerenciar Temas</h2>

      <div className="manage-section">
        <h3>1. Gerador de Prompt para IA</h3>
        <p>Digite o nome do assunto para gerar um prompt formatado:</p>
        <input 
          type="text" 
          value={categoryName}
          onChange={e => setCategoryName(e.target.value)}
          placeholder="Ex: React Hooks, SQL Básico, etc."
          className="text-input"
        />
        <textarea 
          className="json-textarea" 
          readOnly 
          value={promptText}
          rows={8}
        />
        <button className="secondary-button" onClick={copyPrompt}>Copiar Prompt</button>
      </div>

      <div className="manage-section">
        <h3>2. Adicionar Novo Tema (JSON)</h3>
        <p>Cole abaixo o JSON gerado pela IA (cuidaremos de criar o arquivo .json automaticamente):</p>
        <textarea 
          className="json-textarea" 
          value={jsonInput}
          onChange={e => setJsonInput(e.target.value)}
          placeholder='{\n  "theme": "...",\n  "questions": [...]\n}'
          rows={8}
        />
        <button 
          className="primary-button" 
          onClick={handleSaveJson} 
          disabled={!jsonInput.trim() || isSaving}
        >
          {isSaving ? 'Salvando...' : 'Salvar Tema'}
        </button>
      </div>

      <div className="manage-section" style={{ marginBottom: 0 }}>
        <h3>3. Temas Existentes</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {themes.map((t, idx) => (
            <div key={idx} className="theme-list-item">
              <div>
                <strong>{t.theme}</strong> <span style={{ color: 'var(--text-secondary)' }}>({t.filename})</span>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t.questions.length} perguntas</div>
              </div>
              <button className="delete-button" onClick={() => t.filename && handleDelete(t.filename)}>
                Apagar
              </button>
            </div>
          ))}
          {themes.length === 0 && <p>Nenhum tema encontrado.</p>}
        </div>
      </div>
    </div>
  );
}
