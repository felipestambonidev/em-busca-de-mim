"use client";

import { useState } from "react";

export default function AdminTabs({ tabs }: { tabs: { id: string; label: string; content: React.ReactNode }[] }) {
  const [active, setActive] = useState(tabs[0].id);
  return (
    <>
      <div className="adm-tabs" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={active === t.id}
            className={`adm-tab ${active === t.id ? "is-on" : ""}`}
            onClick={() => setActive(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t) => (
        <section key={t.id} role="tabpanel" hidden={active !== t.id} className="adm-panel">
          {t.content}
        </section>
      ))}
    </>
  );
}
