import { useEffect, useState, type CSSProperties } from "react";

type Token = {
  name: string;
  variable: string;
  description: string;
};

type TokenGroup = {
  name: string;
  tokens: Token[];
};

type Section = "Color" | "Spacing" | "Components";

const sections: Section[] = ["Color", "Spacing", "Components"];

const groups: TokenGroup[] = [
  {
    name: "Surfaces",
    tokens: [
      { name: "Canvas", variable: "--ds-color-canvas", description: "Page background" },
      { name: "Surface", variable: "--ds-color-surface", description: "Default surface" },
      { name: "Raised", variable: "--ds-color-surface-raised", description: "Elevated surface" },
      { name: "Border", variable: "--ds-color-border", description: "Subtle separation" },
    ],
  },
  {
    name: "Text",
    tokens: [
      { name: "Primary", variable: "--ds-color-text-primary", description: "Headings and emphasis" },
      { name: "Secondary", variable: "--ds-color-text-secondary", description: "Body copy" },
      { name: "Muted", variable: "--ds-color-text-muted", description: "Supporting labels" },
    ],
  },
  {
    name: "Accents",
    tokens: [
      { name: "Mint", variable: "--ds-color-accent", description: "Primary accent" },
      { name: "Mint shade", variable: "--ds-color-accent-soft", description: "Accent background" },
      { name: "Lilac", variable: "--ds-color-purple", description: "Secondary accent" },
    ],
  },
  {
    name: "Status",
    tokens: [
      { name: "Success", variable: "--ds-color-success", description: "Positive state" },
      { name: "Warning", variable: "--ds-color-warning", description: "Attention state" },
      { name: "Danger", variable: "--ds-color-danger", description: "Error state" },
    ],
  },
];

function readColor(variable: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
}

export default function App() {
  const [activeSection, setActiveSection] = useState<Section>("Color");
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState("");

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(""), 1800);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  const normalizedQuery = query.trim().toLowerCase();
  const visibleGroups = groups
    .map((group) => ({
      ...group,
      tokens: group.tokens.filter((token) =>
        `${token.name} ${token.variable} ${token.description} ${readColor(token.variable)}`
          .toLowerCase()
          .includes(normalizedQuery),
      ),
    }))
    .filter((group) => group.tokens.length > 0);
  async function copyToken(variable: string) {
    try {
      await navigator.clipboard.writeText(`var(${variable})`);
      setCopied(variable);
    } catch {
      setCopied("Clipboard unavailable");
    }
  }

  return (
    <div className="catalog-shell">
      <main className="main-content">
        <header className="topbar">
          <nav className="top-nav" aria-label="Design system sections">
            {sections.map((section) => (
              <button
                className={activeSection === section ? "is-active" : ""}
                key={section}
                type="button"
                aria-current={activeSection === section ? "page" : undefined}
                onClick={() => setActiveSection(section)}
              >
                {section}
              </button>
            ))}
          </nav>
        </header>

        {activeSection === "Color" ? (
          <>
            <section className="page-intro" aria-labelledby="page-title">
              <div className="intro-copy">
                <h1 id="page-title">Color</h1>
              </div>
              <label className="search-field">
                <span className="search-icon" aria-hidden="true" />
                <span className="visually-hidden">Search color tokens</span>
                <input
                  type="search"
                  placeholder="Search colors"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </label>
            </section>

            <section className="token-browser" aria-label="Color tokens">
              {visibleGroups.length > 0 ? visibleGroups.map((group, groupIndex) => (
                <section className={`token-group token-group-${group.name.toLowerCase()}`} key={group.name} aria-labelledby={`group-${groupIndex}`}>
                  <div className="group-heading">
                    <h3 id={`group-${groupIndex}`}>{group.name}</h3>
                    <span>{group.tokens.length.toString().padStart(2, "0")}</span>
                  </div>
                  <div className="token-grid">
                    {group.tokens.map((token, tokenIndex) => (
                      <button
                        className="token-card"
                        key={token.variable}
                        type="button"
                        onClick={() => void copyToken(token.variable)}
                        aria-label={`Copy ${token.variable}`}
                        style={{ animationDelay: `${(groupIndex * 4 + tokenIndex) * 35}ms` } as CSSProperties}
                      >
                        <span className="swatch" style={{ backgroundColor: `var(${token.variable})` }}>
                          <span className="swatch-copy">Copy token <span aria-hidden="true">↗</span></span>
                        </span>
                        <span className="token-info">
                          <span className="token-name">{token.name}</span>
                          <span className="token-description">{token.description}</span>
                          <span className="token-meta">
                            <code>{token.variable}</code>
                            <code>{readColor(token.variable)}</code>
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                </section>
              )) : (
                <p className="empty-state">No tokens match “{query}”.</p>
              )}
            </section>
          </>
        ) : (
          <section className="empty-panel" aria-labelledby="empty-title">
            <h1 id="empty-title">{activeSection}</h1>
            <p>Coming soon</p>
          </section>
        )}

      </main>

      <div className={`toast${copied ? " is-visible" : ""}`} role="status" aria-live="polite">
        {copied === "Clipboard unavailable" ? copied : copied ? `Copied var(${copied})` : ""}
      </div>
    </div>
  );
}
