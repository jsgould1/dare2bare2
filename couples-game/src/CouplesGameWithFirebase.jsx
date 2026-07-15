import React, { useState, useEffect } from 'react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

const CHALLENGE_OPTIONS = {
  level1: [
    { title: 'Anticipation Text', description: 'Send her a flirty/dirty text building excitement about tonight' },
    { title: 'Video Teaser', description: 'Record a video teasing what\'s coming - edging, multiple rounds' },
    { title: 'Voice Message', description: 'Send a voicemail describing what you want to do' },
    { title: 'Stamina Prep', description: 'Work out/exercise to build endurance' },
    { title: 'Fantasy Buildup', description: 'Text her about her fantasy boyfriend scenario' },
    { title: 'Breakdown Video', description: 'Record yourself eager and submissive' },
  ],
  level2: [
    { title: 'Anticipation Text', description: 'Send her a flirty/dirty text building excitement' },
    { title: 'Video Teaser', description: 'Record a video teasing what\'s coming' },
    { title: 'Voice Message', description: 'Send a voicemail describing your desires' },
    { title: 'Stamina Prep', description: 'Work out to build endurance' },
    { title: 'Fantasy Buildup', description: 'Text her about her fantasy' },
    { title: 'Breakdown Video', description: 'Record yourself eager' },
  ],
  level3: [
    { title: 'Anticipation Text', description: 'Send her a flirty/dirty text' },
    { title: 'Video Teaser', description: 'Record a video teasing' },
    { title: 'Voice Message', description: 'Send a voicemail' },
    { title: 'Stamina Prep', description: 'Work out' },
    { title: 'Fantasy Buildup', description: 'Text her about fantasy' },
    { title: 'Breakdown Video', description: 'Record yourself' },
  ],
  level4: [
    { title: 'Anticipation Text', description: 'Send her a flirty/dirty text building excitement about tonight' },
    { title: 'Video Teaser', description: 'Record a video teasing what\'s coming tonight' },
    { title: 'Voice Message', description: 'Send a voicemail about your desires' },
    { title: 'Stamina Prep', description: 'Work out to build endurance' },
    { title: 'Fantasy Buildup', description: 'Text her about her fantasy boyfriend scenario' },
    { title: 'Breakdown Video', description: 'Record yourself eager and submissive' },
  ],
};

const DEPOSIT_REWARDS = {
  level1: 'You cum and she makes you taste it on your fingers, then pulls you to her clit and makes you lick the cream while she touches herself',
  level2: 'You cum on her breasts and she makes you lick the cream from her tits while she touches herself, narrating how hot this is',
  level3: 'You cum inside her, she hovers over your face making you beg. She drips it into your mouth while describing her fantasy boyfriend, then sits on your face',
  level4: 'She goes back and forth from your cock to her pussy on your face, bringing your cum back each time. She controls pace and makes you beg while narrating her fantasy boyfriend',
};

export default function CouplesGame() {
  const [gameState, setGameState] = useState('setup');
  const [herTargetLevel, setHerTargetLevel] = useState(null);
  const [hisRiskChoice, setHisRiskChoice] = useState(null);
  const [challenges, setChallenges] = useState([
    { id: 1, time: '10:00 AM', selectedChallenge: null, selectedLevel: null, completed: false },
    { id: 2, time: '2:00 PM', selectedChallenge: null, selectedLevel: null, completed: false },
    { id: 3, time: '5:00 PM', selectedChallenge: null, selectedLevel: null, completed: false },
    { id: 4, time: '8:00 PM', selectedChallenge: null, selectedLevel: null, completed: false },
    { id: 5, time: '11:00 PM', selectedChallenge: null, selectedLevel: null, completed: false },
  ]);

  const [nightReward, setNightReward] = useState('');
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [showingLevel, setShowingLevel] = useState(null);
  const [gameId] = useState('couples-game-today');
  // Local-only: each partner reveals the reward on their own device.
  const [rewardRevealed, setRewardRevealed] = useState(false);

  // Load game state from Firebase on mount
  useEffect(() => {
    const gameRef = doc(db, 'games', gameId);
    const unsubscribe = onSnapshot(gameRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setGameState(data.gameState || 'setup');
        setHerTargetLevel(data.herTargetLevel);
        setHisRiskChoice(data.hisRiskChoice);
        setChallenges(data.challenges || challenges);
        setNightReward(data.nightReward || '');
      }
    });
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId]);

  // Save game state to Firebase
  const saveGameState = async (newState) => {
    try {
      const gameRef = doc(db, 'games', gameId);
      await setDoc(gameRef, {
        gameState: newState.gameState || gameState,
        herTargetLevel: newState.herTargetLevel !== undefined ? newState.herTargetLevel : herTargetLevel,
        hisRiskChoice: newState.hisRiskChoice !== undefined ? newState.hisRiskChoice : hisRiskChoice,
        challenges: newState.challenges || challenges,
        nightReward: newState.nightReward || nightReward,
        lastUpdated: new Date().toISOString(),
      }, { merge: true });
    } catch (error) {
      console.error('Error saving to Firebase:', error);
    }
  };

  const selectedCount = challenges.filter(c => c.selectedChallenge).length;
  const completedCount = challenges.filter(c => c.completed).length;
  const allSelected = selectedCount === challenges.length;
  const progressPercent = (selectedCount / challenges.length) * 100;
  const completedPercent = (completedCount / challenges.length) * 100;

  const selectChallenge = async (cardId, level, challenge) => {
    const newChallenges = challenges.map(c =>
      c.id === cardId
        ? { ...c, selectedChallenge: challenge, selectedLevel: level, completed: false }
        : c
    );
    setChallenges(newChallenges);
    setSelectedCardId(null);
    setShowingLevel(null);
    await saveGameState({ challenges: newChallenges });
  };

  const toggleChallengeComplete = async (cardId) => {
    const newChallenges = challenges.map(c =>
      c.id === cardId ? { ...c, completed: !c.completed } : c
    );
    setChallenges(newChallenges);
    await saveGameState({ challenges: newChallenges });
  };

  const startGame = async () => {
    if (herTargetLevel && hisRiskChoice) {
      setGameState('playing');
      await saveGameState({
        gameState: 'playing',
        herTargetLevel,
        hisRiskChoice,
      });
    }
  };

  const resetGame = async () => {
    const newChallenges = challenges.map(c => ({
      ...c,
      completed: false,
      selectedChallenge: null,
      selectedLevel: null
    }));
    setGameState('setup');
    setHerTargetLevel(null);
    setHisRiskChoice(null);
    setChallenges(newChallenges);
    setSelectedCardId(null);
    setShowingLevel(null);
    setRewardRevealed(false);
    await saveGameState({
      gameState: 'setup',
      herTargetLevel: null,
      hisRiskChoice: null,
      challenges: newChallenges,
    });
  };

  const getChallengeOptions = (level) => {
    return CHALLENGE_OPTIONS['level' + level] || [];
  };

  // Setup Screen
  if (gameState === 'setup') {
    return (
      <div style={{ minHeight: '100vh', padding: '1rem', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
        <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
          <div style={{ padding: '2rem', borderRadius: '0.5rem', background: 'linear-gradient(135deg, rgba(244, 168, 168, 0.2) 0%, rgba(232, 137, 154, 0.1) 100%)', border: '2px solid #f4a8a8', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', color: '#f4a8a8', fontFamily: 'Georgia, serif', marginBottom: '1.5rem', textAlign: 'center' }}>
              Today's Negotiation
            </h2>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1rem', color: '#f4a8a8', marginBottom: '1rem' }}>Her Target Reward Level:</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                {[1, 2, 3, 4].map((level) => (
                  <button
                    key={level}
                    onClick={() => setHerTargetLevel(level)}
                    style={{
                      padding: '1rem',
                      borderRadius: '0.5rem',
                      fontWeight: '500',
                      color: 'white',
                      border: herTargetLevel === level ? '2px solid #f4a8a8' : '2px solid #4a4a6a',
                      background: herTargetLevel === level ? 'rgba(244, 168, 168, 0.3)' : 'rgba(42, 42, 62, 0.6)',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>
                      {level === 1 ? '💋' : level === 2 ? '🌶️' : level === 3 ? '🔥' : '💥'}
                    </div>
                    Level {level}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1rem', color: '#f4a8a8', marginBottom: '1rem' }}>His Risk Level:</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                {[1, 2, 3, 4].map((level) => (
                  <button
                    key={level}
                    onClick={() => setHisRiskChoice(level)}
                    style={{
                      padding: '1rem',
                      borderRadius: '0.5rem',
                      fontWeight: '500',
                      color: 'white',
                      border: hisRiskChoice === level ? '2px solid #b4c8dc' : '2px solid #4a4a6a',
                      background: hisRiskChoice === level ? 'rgba(180, 200, 220, 0.3)' : 'rgba(42, 42, 62, 0.6)',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>
                      {level === 1 ? '😊' : level === 2 ? '🔥' : level === 3 ? '🌶️' : '💥'}
                    </div>
                    Level {level}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={startGame}
              disabled={!herTargetLevel || !hisRiskChoice}
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '0.5rem',
                fontWeight: '600',
                fontSize: '1rem',
                color: herTargetLevel && hisRiskChoice ? '#1a1a2e' : '#6b7280',
                background: herTargetLevel && hisRiskChoice ? '#f4a8a8' : '#4a4a6a',
                border: 'none',
                cursor: herTargetLevel && hisRiskChoice ? 'pointer' : 'not-allowed',
                opacity: herTargetLevel && hisRiskChoice ? 1 : 0.5,
              }}
            >
              Start the Day 🔥
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Playing Screen
  return (
    <div style={{ minHeight: '100vh', padding: '1rem', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
      <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem', paddingTop: '1.5rem' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#f4a8a8', fontWeight: 'bold', fontFamily: 'Georgia, serif' }}>
            Today's Game
          </h1>
          <p style={{ color: '#d1d5db', fontSize: '0.875rem' }}>Level {herTargetLevel} • Real-time Syncing ✓</p>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ color: '#d1d5db', fontSize: '0.875rem', fontWeight: '500' }}>Setup</span>
            <span style={{ fontSize: '1.25rem', color: '#f4a8a8', fontFamily: 'Georgia, serif' }}>{selectedCount}/{challenges.length}</span>
          </div>
          <div style={{ width: '100%', backgroundColor: '#2a2a3e', borderRadius: '9999px', height: '12px', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: '9999px', background: 'linear-gradient(90deg, #f4a8a8 0%, #e8899a 100%)', width: progressPercent + '%', transition: 'width 500ms ease' }} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
          {challenges.map((challenge) => (
            <div key={challenge.id}>
              {selectedCardId === challenge.id ? (
                <div style={{ padding: '1rem', borderRadius: '0.5rem', background: 'rgba(244, 168, 168, 0.1)', border: '2px solid #f4a8a8' }}>
                  <p style={{ color: 'white', fontSize: '0.875rem', marginBottom: '1rem', fontWeight: '500' }}>{challenge.time}</p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
                    {[1, 2, 3, 4].map((level) => (
                      <button
                        key={level}
                        onClick={() => setShowingLevel(showingLevel === level ? null : level)}
                        style={{
                          padding: '0.75rem',
                          borderRadius: '0.375rem',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          color: 'white',
                          border: level === 1 ? '2px solid #b4c8dc' : level === 2 ? '2px solid #f4a8a8' : level === 3 ? '2px solid #dc5064' : '2px solid #8b0000',
                          background: level === 1 ? 'rgba(180, 200, 220, 0.5)' : level === 2 ? 'rgba(244, 168, 168, 0.4)' : level === 3 ? 'rgba(220, 80, 100, 0.5)' : 'rgba(139, 0, 0, 0.6)',
                          opacity: showingLevel === level ? 1 : 0.7,
                          cursor: 'pointer'
                        }}
                      >
                        {level === 1 && '😊'} {level === 2 && '🔥'} {level === 3 && '🌶️'} {level === 4 && '💥'}
                      </button>
                    ))}
                  </div>

                  {[1, 2, 3, 4].map((level) => (
                    showingLevel === level && (
                      <div key={level} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                        {getChallengeOptions(level).map((option, idx) => (
                          <button
                            key={idx}
                            onClick={() => selectChallenge(challenge.id, level, option)}
                            style={{
                              padding: '0.75rem',
                              borderRadius: '0.375rem',
                              textAlign: 'left',
                              background: 'rgba(42, 42, 62, 0.8)',
                              border: level === 1 ? '1px solid #b4c8dc' : level === 2 ? '1px solid #f4a8a8' : level === 3 ? '1px solid #dc5064' : '1px solid #8b0000',
                              cursor: 'pointer'
                            }}
                          >
                            <div style={{ fontWeight: '500', color: 'white', fontSize: '0.875rem' }}>{option.title}</div>
                            <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>{option.description}</div>
                          </button>
                        ))}
                      </div>
                    )
                  ))}

                  <button
                    onClick={() => setSelectedCardId(null)}
                    style={{
                      width: '100%',
                      marginTop: '1rem',
                      padding: '0.5rem',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#d1d5db',
                      border: '1px solid #4b5563',
                      background: 'transparent',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : challenge.selectedChallenge ? (
                <div
                  onClick={() => setSelectedCardId(challenge.id)}
                  style={{
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    background: challenge.completed ? 'rgba(244, 168, 168, 0.15)' : 'rgba(244, 168, 168, 0.08)',
                    borderLeft: '4px solid #f4a8a8',
                  }}
                >
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <div onClick={(e) => { e.stopPropagation(); toggleChallengeComplete(challenge.id); }} style={{ fontSize: '1.5rem', cursor: 'pointer' }}>
                      {challenge.completed ? '✓' : '⭕'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontWeight: '500', color: challenge.completed ? '#9ca3af' : 'white', textDecoration: challenge.completed ? 'line-through' : 'none' }}>
                        {challenge.selectedChallenge.title}
                      </h3>
                      <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '0.25rem' }}>{challenge.selectedChallenge.description}</p>
                      <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>{challenge.time}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setSelectedCardId(challenge.id)}
                  style={{
                    width: '100%',
                    padding: '1.5rem',
                    borderRadius: '0.5rem',
                    background: 'rgba(42, 42, 62, 0.6)',
                    border: '2px dashed #4a4a6a',
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ fontSize: '1.5rem' }}>🔒</span>
                  <p style={{ color: 'white', fontWeight: '500', marginTop: '0.5rem' }}>{challenge.time}</p>
                </button>
              )}
            </div>
          ))}
        </div>

        {allSelected && (
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ color: '#d1d5db', fontSize: '0.875rem', fontWeight: '500' }}>Progress</span>
              <span style={{ fontSize: '1.25rem', color: '#f4a8a8', fontFamily: 'Georgia, serif' }}>{completedCount}/{challenges.length}</span>
            </div>
            <div style={{ width: '100%', backgroundColor: '#2a2a3e', borderRadius: '9999px', height: '12px', overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: '9999px', background: 'linear-gradient(90deg, #f4a8a8 0%, #e8899a 100%)', width: completedPercent + '%', transition: 'width 500ms ease' }} />
            </div>
          </div>
        )}

        <div style={{ padding: '1.5rem', borderRadius: '0.5rem', marginBottom: '1.5rem', background: 'linear-gradient(135deg, rgba(244, 168, 168, 0.25) 0%, rgba(232, 137, 154, 0.15) 100%)', border: '2px solid #f4a8a8' }}>
          <h2 style={{ fontSize: '1.25rem', color: '#f4a8a8', fontFamily: 'Georgia, serif', marginBottom: '1rem' }}>
            ✨ Tonight's Reward ✨
          </h2>
          {allSelected ? (
            rewardRevealed ? (
              <div style={{ background: 'rgba(55, 65, 81, 0.4)', padding: '1rem', borderRadius: '0.375rem', borderLeft: '4px solid #f4a8a8' }}>
                <p style={{ color: 'white', fontSize: '1rem', lineHeight: '1.5', fontFamily: 'Georgia, serif' }}>
                  {DEPOSIT_REWARDS['level' + herTargetLevel]}
                </p>
                <button
                  onClick={() => setRewardRevealed(false)}
                  style={{ marginTop: '0.75rem', padding: '0.4rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.75rem', color: '#d1d5db', border: '1px solid #4b5563', background: 'transparent', cursor: 'pointer' }}
                >
                  Hide
                </button>
              </div>
            ) : (
              <button
                onClick={() => setRewardRevealed(true)}
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '0.375rem',
                  fontWeight: '600',
                  color: '#1a1a2e',
                  background: '#f4a8a8',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                🔓 Reveal tonight's reward
              </button>
            )
          ) : (
            <p style={{ color: '#9ca3af', fontSize: '0.875rem', fontStyle: 'italic' }}>
              Select all 5 challenges to unlock tonight's reward.
            </p>
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={resetGame}
            style={{
              flex: 1,
              padding: '0.75rem',
              borderRadius: '0.375rem',
              fontWeight: '500',
              color: 'white',
              border: '2px solid #4b5563',
              background: 'transparent',
              cursor: 'pointer'
            }}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
