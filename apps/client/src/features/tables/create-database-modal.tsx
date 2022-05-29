import React, { useEffect } from 'react';
import { r } from 'rethinkdb-ts/lib/query-builder/r';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Modal,
  TextField,
  Typography,
} from '@mui/material';

import { requestQuery, system_db } from '../rethinkdb';

import { useTableEntries } from './db-table-list';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  pt: 2,
  px: 4,
  pb: 3,
};

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
    await requestQuery(
      r.db(system_db).table('db_config').insert({ name: value }),
    );
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
        <Card sx={{ ...style, width: 400 }}>
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
        </Card>
      </Modal>
    </>
  );
};
