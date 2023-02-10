import React, { useEffect } from 'react';
import {
  Button,
  CardActions,
  CardContent,
  Modal,
  TextField,
  Typography,
} from '@mui/material';

import {admin, requestQuery} from '../rethinkdb';

import { useTableEntries } from './db-table-list';
import { ModalCard } from './modal-style';

export const CreateDatabaseModal = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [hasEntered, setHasEntered] = React.useState<boolean>(false);
  const [value, setValue] = React.useState<string>('');
  const [error, setError] = React.useState<string>('');
  const dbEntries = useTableEntries();

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setHasEntered(false);
    setValue('');
    setError('');
  };

  const onChange = React.useCallback<
    React.ChangeEventHandler<HTMLInputElement>
  >((event) => {
    setHasEntered(true);
    setValue(event?.target.value.toString() || '');
  }, []);

  const onDatabaseCreate = React.useCallback(async () => {
    await requestQuery(admin.db_config.insert({ name: value }));
    handleClose();
  }, [value]);

  useEffect(() => {
    // Validate input
    if (value === '') {
      setError('Empty');
      return;
    }
    if (/^[a-zA-Z0-9_]+$/.test(value) === false) {
      setError(
        'Only alphanumeric characters and underscore are allowed ([a-zA-Z0-9_])',
      );
      return;
    }
    // Check if it's a duplicate
    for (const database of dbEntries) {
      if (database.name === value) {
        setError("it's a duplicate");
        return;
      }
    }
    setError('');
  }, [value]);

  return (
    <>
      <Button onClick={handleOpen} color="secondary">
        Create Database
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <ModalCard>
          <CardContent>
            <Typography variant="h6" marginTop={1}>
              Add database
            </Typography>
            <TextField
              label="Database Name"
              variant="outlined"
              sx={{ marginTop: 1 }}
              onChange={onChange}
              helperText={hasEntered && error}
              error={hasEntered && !!error}
            />
            <Typography>{value}</Typography>
          </CardContent>
          <CardActions>
            <Button onClick={onDatabaseCreate}>Create</Button>
          </CardActions>
        </ModalCard>
      </Modal>
    </>
  );
};
