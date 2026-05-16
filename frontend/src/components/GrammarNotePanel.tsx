import type { GrammarNote } from "../types";

interface GrammarNotePanelProps {
  note: GrammarNote;
}

export default function GrammarNotePanel({ note }: GrammarNotePanelProps) {
  const examples = Array.isArray(note.examplesJson) ? note.examplesJson : [];

  return (
    <section className="section card card-surface card-body" style={{ marginTop: 16 }}>
      <div className="card-header" style={{ padding: 0 }}>
        <div>
          <h2 className="section-title">{note.title}</h2>
          <p className="text-muted" style={{ marginTop: "0.5rem" }}>
            {note.topic ?? "Grammar note"}
          </p>
        </div>
      </div>
      <div style={{ marginTop: 12, whiteSpace: "pre-wrap", color: "inherit" }}>{note.contentMarkdown}</div>
      {examples.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div className="text-muted" style={{ marginBottom: 8, fontWeight: 700 }}>
            Examples
          </div>
          <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
            {examples.map((item, index) => (
              <li key={index} style={{ marginBottom: 6 }}>
                {typeof item === "string" ? item : item.example}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
