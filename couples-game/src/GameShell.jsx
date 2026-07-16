import React, { useState } from 'react';
import CouplesGameV3 from './CouplesGameV3';
import ScenarioGame from './ScenarioGame';

// Simple top tab switcher between the two game modes.
const barWrap = {
  position: 'sticky',
  top: 0,
  zIndex: 40,
  display: 'flex',
  gap: '.5rem',
  padding: '.6rem',
  background: 'rgba(22,33,62,.92)',
  backdropFilter: 'blur(6px)',
  borderBottom: '1px solid #2a2a3e'
};
const tabBtn = (active) => ({
  flex: 1,
  padding: '.6rem',
  borderRadius: '.5rem',
  fontSize: '.8rem',
  fontWeight: 600,
  letterSpacing: '.04em',
  cursor: 'pointer',
  border: active ? '1px solid #f4a8a8' : '1px solid #4a4a6a',
  background: active ? 'rgba(244,168,168,.22)' : 'transparent',
  color: active ? '#f4a8a8' : '#d1d5db',
  fontFamily: 'inherit'
});

export default function GameShell() {
  const [tab, setTab] = useState('daily');
  return (
    <div>
      <div style={barWrap}>
        <button style={tabBtn(tab === 'daily')} onClick={() => setTab('daily')}>🔥 Daily Game</button>
        <button style={tabBtn(tab === 'scenarios')} onClick={() => setTab('scenarios')}>💌 Tonight's Invitation</button>
      </div>
      {tab === 'daily' ? <CouplesGameV3 /> : <ScenarioGame />}
    </div>
  );
}
