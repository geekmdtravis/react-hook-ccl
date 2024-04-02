import { useCcl } from '../../';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { useState } from 'react';

type MockCclData = {
  secretMessage: string;
  secretNumber: number;
};

const MOCK_DATA: MockCclData = {
  secretMessage: 'hello',
  secretNumber: 123,
};

const MOCK_JSON = JSON.stringify(MOCK_DATA);

function App() {
  const [inputText, setInputText] = useState('500');
  const pollInterval = parseInt(inputText) || undefined;

  const res = useCcl<MockCclData>('A_FAKE_PRG', ['abc', 123], {
    pollInterval,
    mockJSON: MOCK_JSON,
    mode: 'development',
  });

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>
        <code>react-hook-ccl</code>
      </h1>
      <label htmlFor="pollInterval" style={{ marginRight: '1rem' }}>
        Poll Interval (ms)
      </label>
      <input
        id="pollInterval"
        type="number"
        value={inputText}
        onChange={e => setInputText(e.target.value)}
      />
      <div>
        <pre
          style={{
            textAlign: 'left',
            padding: '1rem',
            backgroundColor: '#373737',
            marginTop: '2rem',
          }}
        >
          {JSON.stringify(res, null, 4)}
        </pre>
      </div>

      <p className="read-the-docs">More coming soon!</p>
    </>
  );
}

export default App;
