import React, { useEffect } from 'react';
import { r } from 'rethinkdb-ts/lib/query-builder/r';

import {
  Alert,
  Button,
  CardActions,
  CardContent,
  IconButton,
  Modal,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import { requestQuery } from '../rethinkdb';

import { ModalCard } from './modal-style';

const notValidText =
  "This name doesn't match the name of the database you're trying to delete.";

export const RemoveTableModal = ({
  dbName,
  tableName,
}: {
  dbName: string;
  tableName: string;
}) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [hasEntered, setHasEntered] = React.useState<boolean>(false);
  const [value, setValue] = React.useState<string>('');
  const [error, setError] = React.useState<boolean>(true);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setHasEntered(false);
    setValue('');
    setError(true);
  };

  const onChange = React.useCallback<
    React.ChangeEventHandler<HTMLInputElement>
  >((event) => {
    setHasEntered(true);
    setValue(event?.target.value.toString() || '');
  }, []);

  const onTableDelete = React.useCallback(async () => {
    await requestQuery(r.db(dbName).tableDrop(tableName));
    handleClose();
  }, [dbName]);

  useEffect(() => {
    // Validate input
    if (value === `${dbName}.${tableName}`) {
      setError(false);
      return;
    }
    setError(true);
  }, [value]);

  return (
    <>
      <IconButton edge="end" aria-label="delete" onClick={handleOpen}>
        <DeleteIcon />
      </IconButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <ModalCard width={600}>
          <CardContent>
            <Typography variant="h6" marginTop={1} marginBottom={2}>
              Remove table
            </Typography>
            <Stack>
              <Alert severity="warning">
                Deleting the database will delete all the tables in it.
                <br />
                This action <strong>cannot</strong> be undone.
              </Alert>
            </Stack>
            <Typography component="p" marginTop={1}>
              Please type in the name of the table to confirm. ({dbName}.
              {tableName})
            </Typography>
            <TextField
              label="Name of the database"
              variant="outlined"
              sx={{ marginTop: 1 }}
              onChange={onChange}
              helperText={hasEntered && error && notValidText}
              error={hasEntered && error}
            />
          </CardContent>
          <CardActions>
            <Button onClick={onTableDelete} disabled={error}>
              Delete
            </Button>
          </CardActions>
        </ModalCard>
      </Modal>
    </>
  );
};
