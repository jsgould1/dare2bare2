import React, { useState } from 'react';
import CouplesGameV3 from './CouplesGameV3';
import ScenarioGame from './ScenarioGame';
import AdventureGame from './AdventureGame';

// Top tab switcher between the game modes.
const barWrap = {
  position: 'sticky', top: 0, zIndex: 40, display: 'flex', gap: '.4rem',
  padding: '.6rem', background: 'rgba(22,33,62,.92)', backdropFilter: 'blur(6px)',
  borderBottom: '1px solid #2a2a3e', flexWrap: 'wrap'
};
const tabBtn = (active) => ({
  flex: 1, minWidth: '6.5rem', padding: '.55rem .4rem', borderRadius: '.5rem',
  fontSize: '.72rem', fontWeight: 600, letterSpacing: '.02em', cursor: 'pointer',
  border: active ? '1px solid #f4a8a8' : '1px solid #4a4a6a',
  background: active ? 'rgba(244,168,168,.22)' : 'transparent',
  color: active ? '#f4a8a8' : '#d1d5db', fontFamily: 'inherit'
});

export default function GameShell() {
  const [tab, setTab] = useState('daily');
  return (
    <div>
      <div style={barWrap}>
        <button style={tabBtn(tab === 'daily')} onClick={() => setTab('daily')}>🔥 Daily Game</button>
        <button style={tabBtn(tab === 'scenarios')} onClick={() => setTab('scenarios')}>💌 Invitation</button>
        <button style={tabBtn(tab === 'adventure')} onClick={() => setTab('adventure')}>🎭 Adventure</button>
      </div>
      {tab === 'daily' ? <CouplesGameV3 /> : tab === 'scenarios' ? <ScenarioGame /> : <AdventureGame />}
    </div>
  );
}
