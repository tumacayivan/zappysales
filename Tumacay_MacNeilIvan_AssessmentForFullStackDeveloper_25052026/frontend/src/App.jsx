import { Routes, Route, Navigate, Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Button,
} from '@mui/material';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';

import UserListPage from './pages/UserListPage.jsx';
import UserDetailPage from './pages/UserDetailPage.jsx';

export default function App() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" color="inherit">
        <Toolbar>
          <PeopleAltOutlinedIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ flexGrow: 1, color: 'secondary.main' }}>
            User Management
          </Typography>
          <Button component={RouterLink} to="/users" color="primary">
            Users
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/users" replace />} />
          <Route path="/users" element={<UserListPage />} />
          <Route path="/users/:id" element={<UserDetailPage />} />
          <Route path="*" element={<Navigate to="/users" replace />} />
        </Routes>
      </Container>
    </Box>
  );
}
