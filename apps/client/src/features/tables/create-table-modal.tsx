import React, { FunctionComponent, useEffect } from 'react';
import { r } from 'rethinkdb-ts/lib/query-builder/r';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  FormControl,
  FormControlLabel,
  Modal,
  Switch,
  TextField,
  Typography,
} from '@mui/material';

import { request } from '../rethinkdb/socket';
import { system_db } from '../rethinkdb';
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

export type Durability = 'hard' | 'soft';

export const getCreateQuery = (
  dbName: string,
  tableName: string,
  primaryKey = 'id',
  durability: Durability = 'hard',
) => {
  return r
    .db(system_db)
    .table('server_status')
    .coerceTo('ARRAY')
    .do((servers) => {
      return r.branch(
        servers.isEmpty(),
        r.error('No server is connected'),
        servers
          .sample(1)
          .nth(0)('name')
          .do((server) =>
            r
              .db(system_db)
              .table('table_config')
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
      );
    });
};

export type CreateTableFormData = {
  tableName: string;
  primaryKey?: string;
  hardDurability: boolean;
};

export const CreateTableModal: FunctionComponent<{ dbName: string }> = ({
  dbName,
}) => {
  const [formState, setFormState] = React.useState<CreateTableFormData>({
    tableName: '',
    primaryKey: '',
    hardDurability: true,
  });

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
  const [open, setOpen] = React.useState<boolean>(false);
  const [hasEntered, setHasEntered] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>('');
  const dbEntries = useTableEntries();

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

  useEffect(() => {
    console.log(query);
  }, [query]);

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
  };

  const onTableCreate = React.useCallback(() => {
    request(query).then((data: unknown) => {
      if (data?.errors) {
        setError(JSON.stringify(data, null, 2));
        return;
      }
      handleClose();
    });
  }, [query]);

  useEffect(() => {
    // Validate input
    if (formState.tableName === '') {
      setError('Empty');
      return;
    }
    if (/^[a-zA-Z0-9_]+$/.test(formState.tableName) === false) {
      setError(
        'Only alphanumeric characters and underscore are allowed ([a-zA-Z0-9_])',
      );
      return;
    }
    // Check if it's a duplicate
    for (const database of dbEntries) {
      debugger;
      if (database.tables.map(t => t.name).includes(formState.tableName)) {
        setError("it's a duplicate");
        return;
      }
    }
    setError('');
  }, [formState.tableName]);

  return (
    <>
      <Button onClick={handleOpen}>Create Table</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Card sx={{ ...style, width: 600 }}>
          <CardContent>
            <Typography variant="h6" marginTop={1}>
              Add table
            </Typography>
            <Typography component="pre">
              {JSON.stringify(formState, null, 2)}
            </Typography>
            <Box component="form" noValidate autoComplete="off">
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
                  helperText={hasEntered && error}
                  error={hasEntered && !!error}
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
            <Typography component="pre">{error}</Typography>
          </CardContent>
          <CardActions>
            <Button onClick={onTableCreate}>Create</Button>
          </CardActions>
        </Card>
      </Modal>
    </>
  );
};
