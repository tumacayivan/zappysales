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
  MenuItem,
  Grid,
} from '@mui/material';

const EMPTY = {
  label: 'Home',
  street: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
};

const LABEL_OPTIONS = ['Home', 'Work', 'Shipping', 'Billing', 'Other'];

/**
 * Dialog used to create OR edit an address (shape is identical).
 *
 * Props:
 *   - open
 *   - title
 *   - initial    : address object | null
 *   - onClose
 *   - onSubmit   : (payload) => Promise<void>
 */
export default function AddressFormDialog({ open, title, initial, onClose, onSubmit }) {
  const [form, setForm]      = useState(EMPTY);
  const [submitting, setSub] = useState(false);
  const [error, setError]    = useState(null);

  useEffect(() => {
    if (open) {
      setForm(initial ? {
        label:      initial.label      ?? '',
        street:     initial.street     ?? '',
        city:       initial.city       ?? '',
        state:      initial.state      ?? '',
        postalCode: initial.postalCode ?? '',
        country:    initial.country    ?? '',
      } : EMPTY);
      setError(null);
    }
  }, [open, initial]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const canSubmit =
    form.label.trim() &&
    form.street.trim() &&
    form.city.trim() &&
    form.postalCode.trim() &&
    form.country.trim();

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
              select
              label="Label"
              value={form.label}
              onChange={set('label')}
              required
              fullWidth
            >
              {LABEL_OPTIONS.map((opt) => (
                <MenuItem key={opt} value={opt}>{opt}</MenuItem>
              ))}
            </TextField>

            <TextField
              label="Street"
              value={form.street}
              onChange={set('street')}
              required
              fullWidth
              autoFocus
            />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={7}>
                <TextField
                  label="City"
                  value={form.city}
                  onChange={set('city')}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <TextField
                  label="State / Region"
                  value={form.state}
                  onChange={set('state')}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <TextField
                  label="Postal code"
                  value={form.postalCode}
                  onChange={set('postalCode')}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={7}>
                <TextField
                  label="Country"
                  value={form.country}
                  onChange={set('country')}
                  required
                  fullWidth
                />
              </Grid>
            </Grid>
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
