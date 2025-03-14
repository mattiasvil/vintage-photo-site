import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import StripeCheckout from 'react-stripe-checkout';

function LoginPage({ setUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (username === 'admin' && password === 'password123') {
      const user = { username, premium: false };
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
    } else {
      setError('Credenziali non valide');
    }
  };

  return (
    <div>
      <h2>Accedi</h2>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error && <p>{error}</p>}
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

function PremiumPage({ user, setUser }) {
  const handleToken = (token) => {
    alert('Pagamento effettuato con successo! Sei ora un utente premium.');
    const updatedUser = { ...user, premium: true };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  if (!user) return <p>Devi effettuare il login per accedere ai contenuti premium.</p>;
  if (!user.premium) {
    return (
      <div>
        <h2>Diventa Utente Premium</h2>
        <StripeCheckout
          stripeKey="your-public-stripe-key-here"
          token={handleToken}
          amount={500}
          name="Abbonamento Premium"
          currency="EUR"
        >
          <button>Attiva Premium</button>
        </StripeCheckout>
      </div>
    );
  }
  return <h2>Benvenuto nel Club Premium!</h2>;
}

function HomePage() {
  return <h2>Benvenuto nella Home!</h2>;
}

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <Router>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/premium">Premium</Link>
        <Link to="/login">Login</Link>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/premium" element={<PremiumPage user={user} setUser={setUser} />} />
        <Route path="/login" element={<LoginPage setUser={setUser} />} />
      </Routes>
    </Router>
  );
}