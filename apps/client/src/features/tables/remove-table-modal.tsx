import React, { FunctionComponent, useEffect } from 'react';
import { r } from 'rethinkdb-ts/lib/query-builder/r';

import {
  Alert,
  Button,
  Card,
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

const notValidText =
  "This name doesn't match the name of the database you're trying to delete.";

export const RemoveTableModal: FunctionComponent<{
  dbName: string;
  tableName: string;
}> = ({ dbName, tableName }) => {
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

  const onDatabaseCreate = React.useCallback(async () => {
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
        <Card sx={{ ...style, width: 600 }}>
          <CardContent>
            <Typography variant="h6" marginTop={1} marginBottom={2}>
              Remove database
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
            <Button onClick={onDatabaseCreate} disabled={error}>
              Delete
            </Button>
          </CardActions>
        </Card>
      </Modal>
    </>
  );
};
