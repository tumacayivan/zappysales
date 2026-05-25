import { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Chip,
  IconButton,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';

/**
 * Renders the user's addresses as a responsive card grid.
 *
 * Props:
 *   - addresses : Address[]
 *   - onEdit    : (address) => void
 *   - onDelete  : (address) => Promise<void>
 */
export default function AddressList({ addresses, onEdit, onDelete }) {
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting]           = useState(false);

  if (addresses.length === 0) {
    return (
      <Box
        sx={{
          py: 5, textAlign: 'center', color: 'text.secondary',
          border: '1px dashed', borderColor: 'divider', borderRadius: 2,
        }}
      >
        <LocationOnOutlinedIcon sx={{ fontSize: 36, mb: 1, opacity: 0.6 }} />
        <Typography variant="body1">No addresses yet.</Typography>
        <Typography variant="body2">Click <strong>Add address</strong> to create the first one.</Typography>
      </Box>
    );
  }

  async function confirmDelete() {
    setDeleting(true);
    try {
      await onDelete(pendingDelete);
      setPendingDelete(null);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <Grid container spacing={2}>
        {addresses.map((a) => (
          <Grid item xs={12} md={6} key={a.id}>
            <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                <Chip
                  label={a.label}
                  size="small"
                  color={a.label === 'Home' ? 'primary' : 'default'}
                  variant={a.label === 'Home' ? 'filled' : 'outlined'}
                />
                <Stack direction="row" spacing={0.5}>
                  <IconButton size="small" onClick={() => onEdit(a)} aria-label="Edit address">
                    <EditOutlinedIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => setPendingDelete(a)} aria-label="Delete address">
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Stack>
              <Typography variant="body1">{a.street}</Typography>
              <Typography variant="body2" color="text.secondary">
                {[a.city, a.state, a.postalCode].filter(Boolean).join(', ')}
              </Typography>
              <Typography variant="body2" color="text.secondary">{a.country}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Dialog open={!!pendingDelete} onClose={() => !deleting && setPendingDelete(null)}>
        <DialogTitle>Delete this address?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action cannot be undone. {pendingDelete && (
              <>
                You're about to delete the <strong>{pendingDelete.label}</strong> address at{' '}
                <em>{pendingDelete.street}</em>.
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPendingDelete(null)} disabled={deleting}>Cancel</Button>
          <Button color="error" onClick={confirmDelete} disabled={deleting}>
            {deleting ? 'Deleting…' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
