import { Box, Card, CardContent, Typography, TextField, Button, Stack } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authProvider } from '@/providers/authProvider';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authProvider.login( { username: email, password })
      navigate('/');
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'response' in err
        ? ((err as { response: { data: { message: string } } }).response?.data?.message || 'Ошибка авторизации')
        : 'Ошибка авторизации';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
    >
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            SaaS Billing
          </Typography>
          <Typography variant="body2" align="center" color="textSecondary" gutterBottom>
            Войдите в панель управления
          </Typography>
          <form onSubmit={handleSubmit}>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <TextField
                label="Пароль"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {error && (
                <Typography color="error" variant="body2">
                  {error}
                </Typography>
              )}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
              >
                {loading ? 'Вход...' : 'Войти'}
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
