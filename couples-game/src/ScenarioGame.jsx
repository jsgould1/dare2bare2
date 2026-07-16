import React, { useState, useEffect } from 'react';

// "Tonight's Invitation" — a deck of scenario cards. Each card is a message /
// fantasy to read together or send. A few reference rolling dice for timing, so
// there's a dice roller built in. Content is stored locally only (favorites in
// localStorage); nothing here is synced.

const SCENARIOS = [
  { t: "Your job tonight is to ride my dick and then my face! I want to feel your orgasm on my 👅. Let's roll the dice to see how long I need to last — and how long you get to feel me lick you after…", dice: true },
  { t: "I want to eat your pussy until you come on my face — but not before I deliver a sweet cream pie so I can lick your creamy, cum-filled pussy." },
  { t: "I want to devour your juicy pussy after I fill it with my hot, sticky load! Hold it in until you're ready to come, then squeeze out every bit so my mouth is flooded with cum!" },
  { t: "I rolled the dice and it says I'm your clean-up boy tonight! Every drop of thick, salty cum you milk out of my cock while riding me gets delivered to my tongue as you sit on my face. I'll suck your pussy until you cum hard on me. I want to be your cum clean-up boy.", dice: true },
  { t: "Your juicy pussy deserves a hot load tonight since you've been such a good girl today. I'm going to fill you and eat that taco until you get off. Lay back and fall asleep — once I recover I'll fill you again and then lick you clean!" },
  { t: "You're going to suck my cock tonight until I can't hold back, and then I'm going to cum all over your pussy. I'll tease your cum-covered pussy with my tongue until you can't take it anymore — then you're going to ride my face to orgasm." },
  { t: "Fuck my brains out tonight! Ride my dick until I cream-pie your sweet shaved pussy, then sit on my face with your cum-filled pussy. I want to feel how wet you are, taste how sweet you are, and tongue-fuck you until you explode on top of me — no holding back. Do that for me and I'll blow a second load all over you, and you choose how it gets cleaned up." },
  { t: "Tonight you're going to ride my hard cock slowly, keeping me on the edge, building me up to blow a huge load into your tight pussy. Then tell me how hot it would be to watch me eat you out — taking every bit of the cum you just milked out of me for a hot cream-pie dessert." },
  { t: "I plan to fuck your pink taco tonight and fill you with a thick, heavy load. Then beg me to eat your hot, sticky, cum-filled pussy until your legs shake and you squirt all over my face. Tell me how hot it is as you slip and slide on my tongue." },
  { t: "I'm so lucky you let me cream-pie you so often. The sweet dessert on my tongue drives me crazy. It's so hot thinking about licking your pussy clean and eating every drop I've milked out of my cock. The best is when you've teased me all day and my load is a full mouthful." },
  { t: "Do you want to bob on my hard cock tonight? I want to go balls-deep in your mouth before burying it in your pussy. I'll deliver a massive cream pie that you'll plant right on my face, begging me to eat you out, suck your clit, and lick you until you cum too. Call me your cream-pie clean-up boy — I'll clean your pussy whenever you tell me to." },
  { t: "Does your pussy need a hard dick tonight? Your mouth needs to choke on my cock. I have a massive load ready for you." },
  { t: "It's time you experience an orgasm that drips loads of cum into my waiting mouth. I'm going to lick every drop up, then cum again on your clit so I can see it pooling and take a shot right off your pussy lips." },
  { t: "I want you to suck my dick until I'm ready to blow. Then I'll cum all over your tight box and suck every bit of it off while you orgasm hard on my tongue. Mmm." },
  { t: "It's a cream-pie night! Want to ride my D and have me lick your C? You're going to beg me to lick that sweet juicy pussy clean — and as a bonus, if you beg, you can suck me off for a second shot…" },
  { t: "I'm going to fill all three of your holes tonight — a butt plug, a dildo, and my hard cock down your throat, until you're air-tight. After that you'll ride my cock until I cum deep in your pussy. Then you take control and sit on my face while I lick and finger-fuck you until you come all over me. Never shower after sex again — just make me clean you up." },
  { t: "I want you to be my cream-pie dessert tonight. I want to deliver load after load of sweet cum into your pussy. Is it wrong to want you full of my cum before you get to orgasm yourself? I want to lick your clit and eat your smooth shaved pussy." },
  { t: "I want you to be my cream-pie dessert tonight. I think you should get fucked multiple times before you finally get to cum. I'll fill you up, cover your clit with cum, then plant my face on your pussy — licking up and down your slit while you try not to cum. I'll suck every drop out of you as I bring you to orgasm." },
  { t: "Suck my cock. Ride my dick. Be my cream-pie slut tonight! Ride my face after I've fucked you silly. I want to be your clean-up boy after I've blown my load all over your pussy — and make me eat your cum-filled pussy every time from now on, over and over, and lick your juicy shaved box clean!" },
  { t: "Will you be my Valentine cream pie tonight? I want to fuck you hard and fill your pussy with multiple loads. I'll bury my face in you and lick your clit until you pull my head hard into you. Your smooth shaved pussy will glisten — and then I'll be your clean-up boy, licking every inch of you.", tag: "Valentine" },
  { t: "I'm waiting for my dessert! You're my Valentine's cream pie tonight. The first two loads go in your pussy; I want the third in your mouth while you clean my shaft. You'll be cumming on my tongue with my face buried between your legs.", tag: "Valentine" },
  { t: "You're my Valentine's cream-pie dessert tonight! I want your smooth-shaved juicy pussy covered and glistening. I'll fill you with multiple loads until you feel fuller and wetter than ever, then bury my face between your legs and suck you to multiple orgasms. Then you'll clean my cock and stroke me hard one more time so I can fuck you again!", tag: "Valentine" },
  { t: "You're in control! Ride me and milk my cock dry while I fill your pussy. Then push my head between your legs while I eat that juicy pussy. I want to drown in your cum-filled pussy and lick your clit. Suck me off after and work one more load out of me." },
  { t: "I stroked my cock all weekend thinking of you — so hard I nearly came a dozen times. Every minute I had to stop and save it for your hot pussy. I want you wet too — play with yourself while you think about me filling you. You're so good at riding my dick after I've cum… but find out what it's like to sit on my tongue. Take control and rub your clit on my face until you cum too." },
  { t: "I want that cream pie dripping all over my face tonight! Don't stop until you've pleasured yourself as many times as you can. I want your shaved pussy as close to my face as possible — all the time. And I want you to show off and rub my cock hard at a restaurant, a movie, in the car, on a plane — pretty much everywhere." },
  { t: "If you're down with it, I want to fuck you and eat your cream-pied pussy right now! I want your juicy, cream-filled pussy to make a mess all over my face. Come make me your lap boy." },
  { t: "Can I taste your sweet pussy right now? I want to lick your box top to bottom and taste how sweet your cream-pied box is. Ride my cock until I cream-pie you, then sit back while I eat your pussy for the next hour." },
  { t: "Ride my cock until I fill your tight pussy with the huge load I've been saving for you. Then lay back while I suck your clit and you pull my face into you. I want you on the edge for an hour straight — edge the whole time or cum multiple times. Either way, my face is between your legs until time's up.", dice: true },
  { t: "I couldn't stop thinking about you all weekend. I stroked myself for hours last night and held back so many times so I wouldn't ruin tonight. I kept picturing your pussy soaking wet, licking you top to bottom, dipping my cock into you over and over, teasing you so long before finally creaming all over your smooth shaved pussy." },
  { t: "I'm hard right now just thinking about this — I want us both to cum at least twice tonight! Do you want to cum on my cock or from my mouth first? Then start sucking me again as soon as I can go, and we'll go a second round. Get me hard by telling me how hot it'll be to lick my second load off your shaved pussy." },
  { t: "Touch yourself right now and think about spreading your legs for me later." },
  { t: "Let's try to fuck daily again like we did before Christmas — your pussy used daily, my cock drained just as often. Miss a day and we make up for it (twice in a night, or twice in a day). Hit 30 orgasms in a month and we earn a reward. Miss, and maybe the vibrator comes with you in the car the next morning…", tag: "Challenge" },
  { t: "House rules: we each find time to send hot texts or warm ourselves up for the night. Stay hydrated, eat pineapple daily. I'll photograph your cream-pied pussy each night to document the month.", tag: "Rule" },
  { t: "Make it 7 days in a row and you choose a treat I can't say no to — a cock ring, a cock cage you hold the key to, or a prostate vibrator. Let's get more interesting!", tag: "Reward" }
];

const FAV_KEY = 'cg-fav-scenarios';

function shuffleOrder(n) {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}

const wrap = { minHeight: '100vh', padding: '1rem', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' };
const inner = { maxWidth: '640px', margin: '0 auto', paddingBottom: '3rem' };
const pink = '#f4a8a8';

export default function ScenarioGame() {
  const [bag, setBag] = useState([]);
  const [current, setCurrent] = useState(null); // index into SCENARIOS
  const [revealed, setRevealed] = useState(false);
  const [dice, setDice] = useState(null); // [a, b]
  const [scale, setScale] = useState(5); // minutes per pip
  const [favs, setFavs] = useState([]);
  const [showFavs, setShowFavs] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(FAV_KEY) || '[]');
      if (Array.isArray(saved)) setFavs(saved);
    } catch (e) {}
  }, []);

  const persistFavs = (next) => {
    setFavs(next);
    try { localStorage.setItem(FAV_KEY, JSON.stringify(next)); } catch (e) {}
  };

  const draw = () => {
    let b = bag;
    if (!b.length) b = shuffleOrder(SCENARIOS.length);
    const next = b[0];
    setBag(b.slice(1));
    setCurrent(next);
    setRevealed(false);
    setDice(null);
    setCopied(false);
  };

  const rollDice = () => {
    setDice([1 + Math.floor(Math.random() * 6), 1 + Math.floor(Math.random() * 6)]);
  };

  const card = current == null ? null : SCENARIOS[current];
  const isFav = card ? favs.includes(card.t) : false;

  const toggleFav = () => {
    if (!card) return;
    persistFavs(isFav ? favs.filter(t => t !== card.t) : [...favs, card.t]);
  };

  const copy = () => {
    if (!card) return;
    try {
      navigator.clipboard.writeText(card.t);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (e) {}
  };

  return (
    <div style={wrap}>
      <div style={inner}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem', paddingTop: '.5rem' }}>
          <h1 style={{ fontSize: '1.9rem', color: pink, fontFamily: 'Georgia, serif', fontWeight: 'bold' }}>Tonight's Invitation</h1>
          <p style={{ color: '#d1d5db', fontSize: '.85rem', marginTop: '.35rem' }}>Draw a card. Reveal it together.</p>
        </div>

        {/* Card */}
        <div style={{ minHeight: '13rem', padding: '1.5rem', borderRadius: '.75rem', border: `2px solid ${pink}`, background: 'linear-gradient(135deg, rgba(244,168,168,.16) 0%, rgba(232,137,154,.08) 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', marginBottom: '1rem' }}>
          {card == null ? (
            <p style={{ color: '#9ca3af', textAlign: 'center', fontStyle: 'italic' }}>Tap “Draw a card” to begin.</p>
          ) : !revealed ? (
            <div style={{ textAlign: 'center' }}>
              {card.tag && <div style={{ display: 'inline-block', marginBottom: '.75rem', fontSize: '.7rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#1a1a2e', background: pink, borderRadius: '999px', padding: '.2rem .7rem' }}>{card.tag}</div>}
              <div style={{ fontSize: '2.4rem', marginBottom: '.75rem' }}>💌</div>
              <button onClick={() => setRevealed(true)} style={{ padding: '.85rem 1.4rem', borderRadius: '.5rem', fontWeight: 600, color: '#1a1a2e', background: pink, border: 'none', cursor: 'pointer', fontSize: '1rem' }}>
                🔓 Reveal
              </button>
            </div>
          ) : (
            <div>
              {card.tag && <div style={{ display: 'inline-block', marginBottom: '.75rem', fontSize: '.7rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#1a1a2e', background: pink, borderRadius: '999px', padding: '.2rem .7rem' }}>{card.tag}</div>}
              <p style={{ color: '#fff', fontSize: '1.1rem', lineHeight: 1.55, fontFamily: 'Georgia, serif' }}>{card.t}</p>

              {card.dice && (
                <div style={{ marginTop: '1.1rem', padding: '.9rem', borderRadius: '.5rem', background: 'rgba(26,26,46,.5)', border: '1px solid rgba(244,168,168,.4)' }}>
                  {dice ? (
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', textAlign: 'center' }}>
                      <div><div style={{ fontSize: '2rem' }}>🎲 {dice[0]}</div><div style={{ color: '#d1d5db', fontSize: '.75rem' }}>he lasts<br /><b style={{ color: pink }}>{dice[0] * scale} min</b></div></div>
                      <div><div style={{ fontSize: '2rem' }}>🎲 {dice[1]}</div><div style={{ color: '#d1d5db', fontSize: '.75rem' }}>he licks after<br /><b style={{ color: pink }}>{dice[1] * scale} min</b></div></div>
                    </div>
                  ) : (
                    <p style={{ color: '#9ca3af', textAlign: 'center', fontSize: '.85rem' }}>This one calls for the dice ↓</p>
                  )}
                  <div style={{ display: 'flex', gap: '.5rem', justifyContent: 'center', alignItems: 'center', marginTop: '.7rem' }}>
                    <button onClick={rollDice} style={{ padding: '.5rem .9rem', borderRadius: '.4rem', border: `1px solid ${pink}`, background: 'transparent', color: pink, cursor: 'pointer', fontWeight: 600 }}>🎲 Roll the dice</button>
                    <select value={scale} onChange={e => setScale(Number(e.target.value))} style={{ padding: '.45rem', borderRadius: '.4rem', background: 'rgba(42,42,62,.8)', color: '#fff', border: '1px solid #4a4a6a' }}>
                      <option value={1}>×1 min</option>
                      <option value={2}>×2 min</option>
                      <option value={5}>×5 min</option>
                    </select>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '.5rem', marginTop: '1.1rem', flexWrap: 'wrap' }}>
                <button onClick={toggleFav} style={{ flex: 1, minWidth: '5rem', padding: '.6rem', borderRadius: '.4rem', border: `1px solid ${pink}`, background: isFav ? 'rgba(244,168,168,.25)' : 'transparent', color: pink, cursor: 'pointer' }}>{isFav ? '♥ Saved' : '♡ Save'}</button>
                <button onClick={copy} style={{ flex: 1, minWidth: '5rem', padding: '.6rem', borderRadius: '.4rem', border: '1px solid #4b5563', background: 'transparent', color: '#d1d5db', cursor: 'pointer' }}>{copied ? '✓ Copied' : '⧉ Copy'}</button>
              </div>
            </div>
          )}
        </div>

        <button onClick={draw} style={{ width: '100%', padding: '1rem', borderRadius: '.6rem', fontWeight: 700, fontSize: '1.05rem', color: '#1a1a2e', background: pink, border: 'none', cursor: 'pointer' }}>
          {current == null ? 'Draw a card 💋' : 'Draw another 💋'}
        </button>

        {/* Favorites */}
        <div style={{ marginTop: '1.5rem' }}>
          <button onClick={() => setShowFavs(s => !s)} style={{ width: '100%', padding: '.6rem', borderRadius: '.4rem', border: '1px solid #4b5563', background: 'transparent', color: '#d1d5db', cursor: 'pointer' }}>
            {showFavs ? 'Hide' : 'Show'} saved cards ({favs.length})
          </button>
          {showFavs && (
            <div style={{ marginTop: '.75rem', display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
              {favs.length === 0 && <p style={{ color: '#9ca3af', fontStyle: 'italic', fontSize: '.85rem', textAlign: 'center' }}>No saved cards yet.</p>}
              {favs.map((t, i) => (
                <div key={i} style={{ padding: '.8rem', borderRadius: '.5rem', background: 'rgba(42,42,62,.6)', borderLeft: `4px solid ${pink}` }}>
                  <p style={{ color: '#e5e7eb', fontSize: '.9rem', lineHeight: 1.5, fontFamily: 'Georgia, serif' }}>{t}</p>
                  <button onClick={() => persistFavs(favs.filter(x => x !== t))} style={{ marginTop: '.5rem', fontSize: '.7rem', color: '#9ca3af', background: 'transparent', border: '1px solid #4b5563', borderRadius: '.35rem', padding: '.25rem .6rem', cursor: 'pointer' }}>Remove</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
