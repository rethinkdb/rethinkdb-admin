import React, { useEffect } from 'react';
import { r } from 'rethinkdb-ts/lib/query-builder/r';
import { WriteResult } from 'rethinkdb-ts/lib/types';

import {
  Alert,
  Box,
  Button,
  CardActions,
  CardContent,
  FormControl,
  FormControlLabel,
  Modal,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';

import {admin, requestQuery} from '../rethinkdb';

import { useTableEntries } from './db-table-list';
import { ModalCard } from './modal-style';

export type Durability = 'hard' | 'soft';

export const getCreateQuery = (
  dbName: string,
  tableName: string,
  primaryKey = 'id',
  durability: Durability = 'hard',
) =>
  admin.server_status.coerceTo('ARRAY')
    .do((servers) =>
      r.branch(
        servers.isEmpty(),
        r.error('No server is connected'),
        servers
          .sample(1)
          .nth(0)('name')
          .do((server) =>
            admin.table_config
              .insert(
                {
                  db: dbName,
                  name: tableName,
                  primary_key: primaryKey,
                  durability,
                  shards: [
                    {
                      primary_replica: server,
                      replicas: [server],
                    },
                  ],
                },
                { returnChanges: true },
              ),
          ),
      ),
    );

export type CreateTableFormData = {
  tableName: string;
  primaryKey?: string;
  hardDurability: boolean;
};

export const CreateTableModal = ({ dbName }: { dbName: string }) => {
  const [formState, setFormState] = React.useState<CreateTableFormData>({
    tableName: '',
    primaryKey: '',
    hardDurability: true,
  });
  const [open, setOpen] = React.useState<boolean>(false);
  const [hasEntered, setHasEntered] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>('');
  const [writeResult, setWriteResult] = React.useState<WriteResult | null>(
    null,
  );
  const dbEntries = useTableEntries();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value;
    switch (event.target.type) {
      case 'checkbox': {
        value = event.target.checked;
        break;
      }
      default: {
        value = event.target.value;
      }
    }
    setHasEntered(true);
    setFormState({
      ...formState,
      [event.target.name]: value,
    });
  };

  const query = React.useMemo(
    () =>
      getCreateQuery(
        dbName,
        formState.tableName,
        formState.primaryKey || 'id',
        formState.hardDurability ? 'hard' : 'soft',
      ),
    [
      dbName,
      formState.tableName,
      formState.primaryKey,
      formState.hardDurability,
    ],
  );

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setHasEntered(false);
    setFormState({
      tableName: '',
      primaryKey: '',
      hardDurability: true,
    });
    setError('');
    setWriteResult(null);
  };

  const onTableCreate = React.useCallback(async () => {
    const data: WriteResult = await requestQuery(query);
    if (data?.errors) {
      setWriteResult(data);
      return;
    }
    handleClose();
  }, [query]);

  useEffect(() => {
    // Validate input
    if (formState.tableName === '') {
      setError('Empty');
      return;
    }
    if (/^\w+$/.test(formState.tableName) === false) {
      setError(
        'Only alphanumeric characters and underscore are allowed ([a-zA-Z0-9_])',
      );
      return;
    }
    // Check if it's a duplicate
    for (const database of dbEntries) {
      if (database.tables.map((t) => t.name).includes(formState.tableName)) {
        setError("it's a duplicate");
        return;
      }
    }
    setError('');
  }, [formState.tableName]);

  return (
    <>
      <Button onClick={handleOpen} variant="contained">
        Create Table
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <ModalCard width={600}>
          <CardContent>
            <Typography variant="h6" marginTop={1}>
              Add table
            </Typography>
            {writeResult && !!writeResult.errors && (
              <Stack marginTop={1}>
                <Alert severity="error">{writeResult.first_error}</Alert>
              </Stack>
            )}
            <Box component="form" noValidate autoComplete="off" marginTop={1}>
              <FormControl variant="standard" fullWidth>
                <TextField
                  name="tableName"
                  label="Table Name"
                  sx={{ marginTop: 1 }}
                  onChange={handleChange}
                  helperText={hasEntered && error}
                  error={hasEntered && !!error}
                  value={formState.tableName}
                />
              </FormControl>
              <FormControl variant="standard" fullWidth>
                <TextField
                  name="primaryKey"
                  label="Primary Key"
                  sx={{ marginTop: 1 }}
                  onChange={handleChange}
                  value={formState.primaryKey}
                  placeholder="id"
                />
              </FormControl>
              <FormControlLabel
                sx={{ mt: 1 }}
                control={
                  <Switch
                    checked={formState.hardDurability}
                    onChange={handleChange}
                    name="hardDurability"
                  />
                }
                label="Acknowledge writes only when written to disk"
              />
            </Box>
            <Typography>{formState.tableName}</Typography>
          </CardContent>
          <CardActions>
            <Button onClick={onTableCreate}>Create</Button>
          </CardActions>
        </ModalCard>
      </Modal>
    </>
  );
};
