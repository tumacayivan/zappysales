import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Alert,
} from '@mui/material';

const EMPTY = { email: '', firstName: '', lastName: '' };

/**
 * Reusable dialog for both "create user" and "edit profile" flows.
 *
 * Props:
 *   - open       : boolean
 *   - title      : string
 *   - initial    : { email, firstName, lastName } | null
 *   - onClose    : () => void
 *   - onSubmit   : (payload) => Promise<void>
 */
export default function UserFormDialog({ open, title, initial, onClose, onSubmit }) {
  const [form, setForm]       = useState(EMPTY);
  const [submitting, setSub]  = useState(false);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (open) {
      setForm(initial ? { email: initial.email, firstName: initial.firstName, lastName: initial.lastName } : EMPTY);
      setError(null);
    }
  }, [open, initial]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const canSubmit = form.email.trim() && form.firstName.trim() && form.lastName.trim();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    setSub(true);
    setError(null);
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err.message);
    } finally {
      setSub(false);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              label="First name"
              value={form.firstName}
              onChange={set('firstName')}
              required
              fullWidth
              autoFocus
            />
            <TextField
              label="Last name"
              value={form.lastName}
              onChange={set('lastName')}
              required
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={form.email}
              onChange={set('email')}
              required
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={submitting}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={!canSubmit || submitting}>
            {submitting ? 'Saving…' : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
