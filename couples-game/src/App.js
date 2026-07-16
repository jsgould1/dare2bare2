import GameShell from './GameShell';
import AuthGate from './AuthGate';

function App() {
  return (
    <AuthGate>
      <GameShell />
    </AuthGate>
  );
}

export default App;
