import React, { useState, useEffect } from 'react';
import { ADVENTURES } from './adventures';

// "Choose Your Adventure" — Nancy picks a character and plays a branching scene.
// She sets a HEAT CAP (how far she wants it to go); any choice leading past the
// cap is locked until she raises it. Every scene also has slow-down / stop
// branches written in. Local-only; nothing synced, nothing stored but her cap.

const pink = '#f4a8a8';
const HEAT_LABELS = ['Flirty', 'Warm', 'Hot', 'Filthy', 'No limits'];
const HEAT_COLORS = ['#b4c8dc', '#f4a8a8', '#e8899a', '#dc5064', '#8b0000'];

const wrap = { minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', color: '#d1d5db', padding: '1rem' };
const inner = { maxWidth: '640px', margin: '0 auto', paddingBottom: '3rem' };

function HeatDots({ level }) {
  return (
    <span style={{ letterSpacing: '2px' }}>
      {[0, 1, 2, 3, 4].map(i => (
        <span key={i} style={{ color: i <= level ? HEAT_COLORS[level] : '#3a3a52', fontSize: '.8rem' }}>●</span>
      ))}
    </span>
  );
}

function HeatCap({ cap, setCap, compact }) {
  return (
    <div style={{ display: 'flex', gap: '.35rem', flexWrap: 'wrap', justifyContent: compact ? 'flex-start' : 'center' }}>
      {HEAT_LABELS.map((lab, i) => (
        <button key={i} onClick={() => setCap(i)}
          style={{
            padding: compact ? '.3rem .55rem' : '.5rem .7rem',
            borderRadius: '999px',
            fontSize: compact ? '.7rem' : '.8rem',
            cursor: 'pointer',
            fontFamily: 'inherit',
            border: '1px solid ' + (cap === i ? HEAT_COLORS[i] : '#4a4a6a'),
            background: cap === i ? HEAT_COLORS[i] + '33' : 'transparent',
            color: cap === i ? '#fff' : '#9ca3af'
          }}>
          {i === 0 ? '💧' : i === 4 ? '🔥' : ''} {lab}
        </button>
      ))}
    </div>
  );
}

export default function AdventureGame() {
  const [cap, setCapState] = useState(2);
  const [charId, setCharId] = useState(null);
  const [nodeId, setNodeId] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    try {
      const v = parseInt(localStorage.getItem('cg-adv-cap'), 10);
      if (v >= 0 && v <= 4) setCapState(v);
    } catch (e) {}
  }, []);
  const setCap = (v) => { setCapState(v); try { localStorage.setItem('cg-adv-cap', String(v)); } catch (e) {} };

  const adv = charId ? ADVENTURES.find(a => a.id === charId) : null;
  const node = adv ? adv.nodes[nodeId] : null;

  const pick = (id) => { setCharId(id); const a = ADVENTURES.find(x => x.id === id); setNodeId(a.start); setHistory([]); window.scrollTo(0, 0); };
  const choose = (to) => { setHistory(h => [...h, nodeId]); setNodeId(to); window.scrollTo(0, 0); };
  const back = () => { setHistory(h => { if (!h.length) return h; const n = h[h.length - 1]; setNodeId(n); return h.slice(0, -1); }); };
  const restart = () => { setNodeId(adv.start); setHistory([]); window.scrollTo(0, 0); };
  const exit = () => { setCharId(null); setNodeId(null); setHistory([]); window.scrollTo(0, 0); };

  // ── Picker ────────────────────────────────────────────────────────────────
  if (!adv) {
    return (
      <div style={wrap}>
        <div style={inner}>
          <div style={{ textAlign: 'center', marginBottom: '1.25rem', paddingTop: '.5rem' }}>
            <h1 style={{ fontSize: '1.9rem', color: pink, fontFamily: 'Georgia, serif', fontWeight: 'bold' }}>Choose Your Adventure</h1>
            <p style={{ color: '#9ca3af', fontSize: '.85rem', marginTop: '.35rem' }}>Pick who comes to the door. You decide how far it goes.</p>
          </div>

          <div style={{ background: 'rgba(244,168,168,.08)', border: '1px solid rgba(244,168,168,.4)', borderRadius: '.6rem', padding: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '.75rem', letterSpacing: '.1em', textTransform: 'uppercase', color: pink, marginBottom: '.6rem', textAlign: 'center' }}>How far tonight?</div>
            <HeatCap cap={cap} setCap={setCap} />
            <p style={{ color: '#9ca3af', fontSize: '.72rem', textAlign: 'center', marginTop: '.6rem', fontStyle: 'italic' }}>
              You're always in control — raise or lower this anytime, and every scene has a way to slow down or stop.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '.75rem' }}>
            {ADVENTURES.map(a => (
              <button key={a.id} onClick={() => pick(a.id)}
                style={{ textAlign: 'left', padding: '1rem', borderRadius: '.6rem', cursor: 'pointer', fontFamily: 'inherit',
                  background: 'rgba(42,42,62,.6)', border: '1px solid #4a4a6a', color: '#fff' }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '.35rem' }}>{a.emoji}</div>
                <div style={{ fontWeight: 600, color: pink, fontSize: '.95rem' }}>{a.title}</div>
                <div style={{ fontSize: '.78rem', color: '#9ca3af', marginTop: '.3rem', lineHeight: 1.35 }}>{a.blurb}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Player ──────────────────────────────────────────────────────────────
  const isEnding = !!node.ending;
  const choices = node.choices || [];

  return (
    <div style={wrap}>
      <div style={inner}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.75rem' }}>
          <button onClick={exit} style={{ background: 'none', border: 'none', color: '#b4c8dc', cursor: 'pointer', fontSize: '.85rem', fontFamily: 'inherit', padding: '.25rem 0' }}>← Adventures</button>
          <span style={{ fontFamily: 'Georgia, serif', color: pink, fontSize: '.95rem' }}>{adv.emoji} {adv.title}</span>
          <span><HeatDots level={node.heat} /></span>
        </div>

        <div style={{ background: 'rgba(42,42,62,.5)', border: '1px solid rgba(244,168,168,.3)', borderRadius: '.6rem', padding: '.5rem .75rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <span style={{ fontSize: '.68rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.08em' }}>Heat cap:</span>
          <HeatCap cap={cap} setCap={setCap} compact />
        </div>

        <div style={{ borderLeft: '4px solid ' + HEAT_COLORS[node.heat], background: 'rgba(244,168,168,.06)', borderRadius: '.5rem', padding: '1.1rem 1.2rem', marginBottom: '1.25rem' }}>
          {isEnding && (
            <div style={{ fontSize: '.72rem', letterSpacing: '.12em', textTransform: 'uppercase', color: HEAT_COLORS[node.heat], marginBottom: '.6rem' }}>
              ✦ {node.endingTitle}
            </div>
          )}
          <p style={{ color: '#fff', fontSize: '1.08rem', lineHeight: 1.6, fontFamily: 'Georgia, serif', whiteSpace: 'pre-wrap' }}>{node.text}</p>
        </div>

        {isEnding ? (
          <div style={{ display: 'flex', gap: '.6rem', flexWrap: 'wrap' }}>
            <button onClick={restart} style={btnPrimary}>↺ Play this again</button>
            <button onClick={exit} style={btnGhost}>Choose another</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
            {choices.map((c, i) => {
              const dest = adv.nodes[c.to];
              const locked = dest.heat > cap;
              return locked ? (
                <button key={i} onClick={() => setCap(dest.heat)}
                  style={{ ...choiceBtn, borderStyle: 'dashed', color: '#7a7a92', background: 'transparent', cursor: 'pointer' }}>
                  🔒 {c.label}
                  <span style={{ display: 'block', fontSize: '.68rem', color: HEAT_COLORS[dest.heat], marginTop: '.2rem' }}>
                    tap to raise the heat to “{HEAT_LABELS[dest.heat]}”
                  </span>
                </button>
              ) : (
                <button key={i} onClick={() => choose(c.to)} style={choiceBtn}>{c.label}</button>
              );
            })}
            {history.length > 0 && (
              <button onClick={back} style={{ ...btnGhost, alignSelf: 'flex-start', marginTop: '.2rem' }}>← back a step</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const choiceBtn = {
  width: '100%', textAlign: 'left', padding: '.85rem 1rem', borderRadius: '.5rem', cursor: 'pointer',
  fontFamily: 'inherit', fontSize: '.95rem', color: '#fff',
  background: 'rgba(42,42,62,.75)', border: '1px solid ' + pink
};
const btnPrimary = { flex: 1, minWidth: '8rem', padding: '.8rem', borderRadius: '.5rem', border: 'none', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', background: pink, color: '#1a1a2e' };
const btnGhost = { flex: 1, minWidth: '8rem', padding: '.8rem', borderRadius: '.5rem', border: '1px solid #4b5563', cursor: 'pointer', fontFamily: 'inherit', background: 'transparent', color: '#d1d5db' };
