import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Stack,
  Avatar,
} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddIcon from '@mui/icons-material/Add';

import { listUsers, createUser } from '../api/client.js';
import UserFormDialog from '../components/UserFormDialog.jsx';

function initials(u) {
  return `${(u.firstName?.[0] ?? '').toUpperCase()}${(u.lastName?.[0] ?? '').toUpperCase()}`;
}

export default function UserListPage() {
  const navigate = useNavigate();

  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [dialogOpen, setDialog] = useState(false);

  useEffect(() => {
    let cancelled = false;
    listUsers()
      .then((data) => { if (!cancelled) setUsers(data); })
      .catch((e)   => { if (!cancelled) setError(e.message); })
      .finally(()  => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  async function handleCreate(payload) {
    const created = await createUser(payload);
    setUsers((prev) => [...prev, created]);
    setDialog(false);
  }

  return (
    <>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5">Users</Typography>
          <Typography variant="body2" color="text.secondary">
            Select a user to manage their profile and addresses.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialog(true)}
        >
          New user
        </Button>
      </Stack>

      <Paper variant="outlined">
        {loading && (
          <Box sx={{ p: 6, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress size={28} />
          </Box>
        )}

        {error && !loading && (
          <Box sx={{ p: 3 }}>
            <Alert severity="error">Failed to load users: {error}</Alert>
          </Box>
        )}

        {!loading && !error && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3}>
                    <Box sx={{ py: 4, textAlign: 'center', color: 'text.secondary' }}>
                      No users yet — click <strong>New user</strong> to add one.
                    </Box>
                  </TableCell>
                </TableRow>
              )}

              {users.map((u) => (
                <TableRow
                  key={u.id}
                  hover
                  sx={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/users/${u.id}`)}
                >
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36, fontSize: 14 }}>
                        {initials(u)}
                      </Avatar>
                      <Typography fontWeight={500}>
                        {u.firstName} {u.lastName}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>{u.email}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Manage profile & addresses">
                      <IconButton
                        size="small"
                        onClick={(e) => { e.stopPropagation(); navigate(`/users/${u.id}`); }}
                      >
                        <ChevronRightIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>

      <UserFormDialog
        open={dialogOpen}
        title="New user"
        onClose={() => setDialog(false)}
        onSubmit={handleCreate}
      />
    </>
  );
}
