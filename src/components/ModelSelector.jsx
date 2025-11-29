import React, { useState, useEffect } from 'react';
import './ModelSelector.css';

// Available model presets for selection
export const MODEL_PRESETS = [
  {
    id: "default-gpt",
    label: "Default GPT",
    description: "Fast, cost-efficient GPT for normal chat.",
    mode: "chat",           // will call /api/chat with mode="chat"
    usePremium: false,      // backend will pick DEFAULT_CHAT_MODEL
  },
  {
    id: "thinker",
    label: "Thinker (o3-mini)",
    description: "Deeper reasoning for planning tasks.",
    mode: "plan",           // will call /api/chat or /api/plan with plan mode
    usePremium: true,       // backend will pick THINKER_MODEL_LIGHT
  },
];

const ModelSelector = ({ onPresetChange, initialPresetId = "default-gpt" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPresetId, setSelectedPresetId] = useState(initialPresetId);

  const selectedPreset = MODEL_PRESETS.find(preset => preset.id === selectedPresetId) || MODEL_PRESETS[0];

  useEffect(() => {
    // Notify parent of initial selection
    onPresetChange(selectedPreset);
  }, []);

  const handlePresetSelect = (preset) => {
    setSelectedPresetId(preset.id);
    onPresetChange(preset);
    setIsOpen(false);
  };

  return (
    <div className="model-selector">
      <div className="model-selector-trigger" onClick={() => setIsOpen(!isOpen)}>
        <span className="model-label">{selectedPreset.label}</span>
        <span className="model-arrow">{isOpen ? '▲' : '▼'}</span>
      </div>
      
      {isOpen && (
        <div className="model-dropdown">
          {MODEL_PRESETS.map((preset) => (
            <div
              key={preset.id}
              className={`model-option ${selectedPresetId === preset.id ? 'selected' : ''}`}
              onClick={() => handlePresetSelect(preset)}
            >
              <div className="model-option-header">
                <span className="model-option-label">{preset.label}</span>
              </div>
              <div className="model-option-description">{preset.description}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModelSelector;