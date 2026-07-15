import CouplesGame from './CouplesGameWithFirebase';
import AuthGate from './AuthGate';

function App() {
  return (
    <AuthGate>
      <CouplesGame />
    </AuthGate>
  );
}

export default App;
