import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
React.useEffect(() => {
    console.log('Component mounted');
    return () => {
        console.log('Component unmounted');
    };
}, []);

React.useEffect(() => {
    console.log('Email state updated:', email);
}, [email]);

React.useEffect(() => {
    console.log('Password state updated:', password);
}, [password]);

React.useEffect(() => {
    console.log('Loading state updated:', loading);
}, [loading]);

React.useEffect(() => {
    console.log('Error state updated:', error);
}, [error]);
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Attempting to sign in with email:', email);
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        console.error('Login error:', result.error);
      } else if (result?.ok) {
        console.log('Login successful, redirecting to admin dashboard');
        router.push('/admin'); // Redirect to admin dashboard
      } else {
        setError('An unexpected error occurred');
        console.error('Unexpected result:', result);
      }
    } catch (error) {
      setError('An unexpected error occurred');
      console.error('Catch error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;