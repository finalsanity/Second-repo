"use client";

import { useMemo, useState, type CSSProperties } from "react";

const surprises = [
  { icon: "🌈", title: "Rainbow energy", message: "You make ordinary days feel a little more colorful." },
  { icon: "🦊", title: "Fox fact", message: "A group of foxes is called a skulk. Sneaky, right?" },
  { icon: "🎈", title: "Tiny challenge", message: "Do your silliest dance for five seconds." },
  { icon: "🍀", title: "Lucky find", message: "Today has a secret good moment waiting for you." },
  { icon: "🚀", title: "Mission unlocked", message: "Your next idea deserves a launch countdown." },
  { icon: "🌟", title: "Star sticker", message: "Official award: excellent at being you." },
  { icon: "🧩", title: "Puzzle piece", message: "Try looking at a small problem from a new angle." },
  { icon: "🐳", title: "Whale hello", message: "You are doing fin-tastic. Keep swimming!" },
  { icon: "🎨", title: "Color splash", message: "Pick a color and spot three things wearing it." },
  { icon: "🪄", title: "Magic moment", message: "A little wonder is hiding in plain sight." },
  { icon: "🍓", title: "Sweet surprise", message: "You deserve a snack-sized celebration." },
  { icon: "🌙", title: "Moonbeam", message: "Even quiet progress is still progress." },
] as const;

const boxColors = ["pink", "yellow", "mint", "lavender", "peach", "blue"] as const;

export default function Home() {
  const [openedBoxes, setOpenedBoxes] = useState<Set<number>>(new Set());
  const [selectedBox, setSelectedBox] = useState<number | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);

  const confettiPieces = useMemo(() => Array.from({ length: 42 }, (_, index) => index), []);

  const boxes = useMemo(
    () =>
      Array.from({ length: 36 }, (_, index) => ({
        id: index,
        color: boxColors[index % boxColors.length],
        surprise: surprises[index % surprises.length],
      })),
    [],
  );

  const selectedSurprise = selectedBox === null ? null : boxes[selectedBox].surprise;
  const allOpened = openedBoxes.size === boxes.length;

  function openBox(id: number) {
    if (openedBoxes.has(id)) {
      setSelectedBox(id);
      return;
    }

    setOpenedBoxes((current) => new Set(current).add(id));
    setSelectedBox(id);
    setConfettiKey((current) => current + 1);
  }

  function resetBoxes() {
    setOpenedBoxes(new Set());
    setSelectedBox(null);
  }

  return (
    <main className={`page-shell ${isDark ? "dark-mode" : ""}`}>
      <button
        className="theme-toggle"
        type="button"
        aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
        aria-pressed={isDark}
        onClick={() => setIsDark((current) => !current)}
      >
        <span aria-hidden="true">{isDark ? "☀" : "☾"}</span>
        {isDark ? "Light mode" : "Dark mode"}
      </button>
      <section className="hero" aria-labelledby="page-title">
        <div className="sparkle sparkle-one" aria-hidden="true">✦</div>
        <div className="sparkle sparkle-two" aria-hidden="true">✧</div>
        <p className="eyebrow"><span className="eyebrow-dot" /> A little joy, just for you</p>
        <h1 id="page-title">Open a little <span>wonder.</span></h1>
        <p className="hero-copy">There are 36 tiny surprises waiting behind these boxes.<br />Pick one and see what you find.</p>
      </section>

      <section className="game-panel" aria-label="Mystery box wall">
        <div className="panel-topline">
          <div>
            <p className="panel-kicker">Mystery Box Wall</p>
            <p className="panel-hint">Choose any box to begin your adventure</p>
          </div>
          <div className="progress-pill" aria-live="polite">
            <span className="progress-star">✦</span>
            <strong>{openedBoxes.size}</strong><span> / 36 opened</span>
          </div>
        </div>

        <div className="box-grid" aria-label={`${openedBoxes.size} of 36 boxes opened`}>
          {boxes.map((box, index) => {
            const isOpened = openedBoxes.has(box.id);
            const isSelected = selectedBox === box.id;
            return (
              <button
                className={`gift-box gift-${box.color} ${isOpened ? "is-opened" : ""} ${isSelected ? "is-selected" : ""}`}
                key={box.id}
                type="button"
                aria-label={isOpened ? `Box ${index + 1}, opened: ${box.surprise.title}` : `Open mystery box ${index + 1}`}
                aria-pressed={isOpened}
                onClick={() => openBox(box.id)}
                style={{ "--box-delay": `${index * 18}ms` } as CSSProperties}
              >
                <span className="box-lid" aria-hidden="true"><span className="ribbon ribbon-vertical" /><span className="ribbon ribbon-horizontal" /></span>
                <span className="box-body" aria-hidden="true"><span className="box-shine" /></span>
                {isOpened && <span className="opened-icon" aria-hidden="true">{box.surprise.icon}</span>}
                {isSelected && (
                  <span className="box-confetti" key={confettiKey} aria-hidden="true">
                    {confettiPieces.map((piece) => (
                      <span
                        className="confetti-piece"
                        key={piece}
                        style={{
                          "--confetti-index": piece,
                          "--confetti-x": `${Math.cos((piece / confettiPieces.length) * Math.PI * 2) * (55 + (piece % 4) * 18)}px`,
                          "--confetti-y": `${Math.sin((piece / confettiPieces.length) * Math.PI * 2) * (55 + (piece % 4) * 18)}px`,
                        } as CSSProperties}
                      />
                    ))}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className={`reveal-card ${selectedSurprise ? "has-reveal" : ""} ${allOpened ? "is-complete" : ""}`} aria-live="polite">
          {selectedSurprise ? (
            <>
              <div className="reveal-icon" aria-hidden="true">{selectedSurprise.icon}</div>
              <div className="reveal-copy"><p className="reveal-label">Your surprise</p><h2>{selectedSurprise.title}</h2><p>{selectedSurprise.message}</p></div>
              <button className="reset-button" type="button" onClick={resetBoxes}>Start over <span aria-hidden="true">↗</span></button>
            </>
          ) : (
            <>
              <div className="reveal-icon placeholder-icon" aria-hidden="true">?</div>
              <div className="reveal-copy"><p className="reveal-label">Your surprise is hiding</p><h2>Which one will you choose?</h2><p>Every box holds a different little moment of joy.</p></div>
            </>
          )}
        </div>

        {allOpened && <p className="completion-note">You found every surprise! <button type="button" onClick={resetBoxes}>Play again</button></p>}
      </section>

      <footer className="footer-note"><span>Made for curious minds</span><span className="footer-dot" /> <span>One box at a time</span></footer>
    </main>
  );
}
