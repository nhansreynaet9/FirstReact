import React, { useEffect, useState } from 'react';
import './App.css'; 
function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    fetch('http://localhost:5000/users') // get request to the backend
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error('Error fetching users:', err));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name || !email) {
      setError('Please enter both name and email');
      return;
    }
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, // send post request to the backend with new name and email
        body: JSON.stringify({ name, email }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to add user');
      }

      const newUser = await res.json();
      setUsers(prev => [...prev, newUser]);
      setName('');
      setEmail('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <h1>User List</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            disabled={loading}
            style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={loading}
            style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
          />
        </div>
        <button type="submit" disabled={loading} style={{ padding: '8px 12px' }}>
          {loading ? 'Adding...' : 'Add User'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {users.length === 0 ? (
        <p>Loading users...</p>
      ) : (
        <ul>
          {users.map(user => (
            <li key={user.id}>{user.name} ({user.email})</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;

