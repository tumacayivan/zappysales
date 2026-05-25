import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Paper,
  Stack,
  Typography,
  Button,
  IconButton,
  Breadcrumbs,
  Link,
  Divider,
  CircularProgress,
  Alert,
  Avatar,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddIcon from '@mui/icons-material/Add';

import {
  getUser,
  updateUser,
  createAddress,
  updateAddress,
  deleteAddress,
} from '../api/client.js';

import UserFormDialog from '../components/UserFormDialog.jsx';
import AddressFormDialog from '../components/AddressFormDialog.jsx';
import AddressList from '../components/AddressList.jsx';

function initials(u) {
  return `${(u?.firstName?.[0] ?? '').toUpperCase()}${(u?.lastName?.[0] ?? '').toUpperCase()}`;
}

export default function UserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser]           = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  const [editingUser, setEditingUser]       = useState(false);
  const [editingAddress, setEditingAddress] = useState(null); // null | 'new' | address object

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUser(id);
      setUser(data.user);
      setAddresses(data.addresses);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  async function handleUserSave(payload) {
    const updated = await updateUser(id, payload);
    setUser(updated);
    setEditingUser(false);
  }

  async function handleAddressSave(payload) {
    if (editingAddress === 'new') {
      const created = await createAddress(id, payload);
      setAddresses((prev) => [...prev, created]);
    } else {
      const updated = await updateAddress(id, editingAddress.id, payload);
      setAddresses((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    }
    setEditingAddress(null);
  }

  async function handleAddressDelete(address) {
    await deleteAddress(id, address.id);
    setAddresses((prev) => prev.filter((a) => a.id !== address.id));
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" action={
        <Button color="inherit" size="small" onClick={() => navigate('/users')}>Back</Button>
      }>
        {error}
      </Alert>
    );
  }

  return (
    <>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link component={RouterLink} to="/users" underline="hover" color="inherit">
          Users
        </Link>
        <Typography color="text.primary">
          {user.firstName} {user.lastName}
        </Typography>
      </Breadcrumbs>

      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <IconButton onClick={() => navigate('/users')} aria-label="Back to users">
          <ArrowBackIcon />
        </IconButton>
        <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
          {initials(user)}
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5">
            {user.firstName} {user.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary">{user.email}</Typography>
        </Box>
      </Stack>

      {/* Profile card */}
      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography variant="h6">Profile</Typography>
          <Button
            size="small"
            startIcon={<EditOutlinedIcon />}
            onClick={() => setEditingUser(true)}
          >
            Edit profile
          </Button>
        </Stack>
        <Divider sx={{ mb: 2 }} />
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 1, sm: 6 }}
          divider={<Divider orientation="vertical" flexItem />}
        >
          <Field label="First name" value={user.firstName} />
          <Field label="Last name"  value={user.lastName} />
          <Field label="Email"      value={user.email} />
        </Stack>
      </Paper>

      {/* Addresses card */}
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Box>
            <Typography variant="h6">Addresses</Typography>
            <Typography variant="body2" color="text.secondary">
              A user can have multiple addresses (home, work, shipping…).
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setEditingAddress('new')}
          >
            Add address
          </Button>
        </Stack>
        <Divider sx={{ mb: 2 }} />
        <AddressList
          addresses={addresses}
          onEdit={(a) => setEditingAddress(a)}
          onDelete={handleAddressDelete}
        />
      </Paper>

      {/* Dialogs */}
      <UserFormDialog
        open={editingUser}
        title="Edit profile"
        initial={user}
        onClose={() => setEditingUser(false)}
        onSubmit={handleUserSave}
      />

      <AddressFormDialog
        open={editingAddress !== null}
        title={editingAddress === 'new' ? 'Add address' : 'Edit address'}
        initial={editingAddress === 'new' ? null : editingAddress}
        onClose={() => setEditingAddress(null)}
        onSubmit={handleAddressSave}
      />
    </>
  );
}

function Field({ label, value }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {label}
      </Typography>
      <Typography variant="body1">{value || '—'}</Typography>
    </Box>
  );
}
