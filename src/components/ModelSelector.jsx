import React from "react";

const MODEL_PRESETS = [
  {
    id: "gpt-5-mini",
    label: "Planner (fast)",
    description: "Default chat & light planning",
    mode: "chat",
    usePremium: false,
  },
  {
    id: "gpt-5.1",
    label: "Planner Pro",
    description: "Deeper planning, higher quality",
    mode: "plan",
    usePremium: true,
  },
];

const ModelSelector = ({ selectedId, onChange }) => {
  return (
    <div className="model-selector">
      {MODEL_PRESETS.map((preset) => {
        const active = preset.id === selectedId;

        return (
          <button
            key={preset.id}
            type="button"
            className={`model-pill ${active ? "active" : ""}`}
            onClick={() => onChange(preset)}
          >
            <div className="model-pill-label-row">
              <span className="model-pill-label">{preset.label}</span>
              {preset.id === "gpt-5-mini" && (
                <span className="model-pill-tag model-pill-tag--fast">
                  default
                </span>
              )}
              {preset.id === "gpt-5.1" && (
                <span className="model-pill-tag model-pill-tag--premium">
                  deep
                </span>
              )}
            </div>
            <div className="model-pill-description">
              {preset.description}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default ModelSelector;
export { MODEL_PRESETS };