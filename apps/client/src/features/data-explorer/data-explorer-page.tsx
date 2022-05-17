import React, { useEffect, useState } from 'react';
import { Codemirror } from 'react-codemirror-ts';
import { r } from 'rethinkdb-ts/lib/query-builder/r';
import { RQuery } from 'rethinkdb-ts/lib/query-builder/query';
import SwipeableViews from 'react-swipeable-views';

import {
  AppBar,
  Box,
  Button,
  Grid,
  Paper,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from '@mui/material';

import { CommonTitledLayout } from '../../layouts/page';
import { requestQuery, useChangeList } from '../rethinkdb';

import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/lib/codemirror.css';

import 'codemirror/theme/material-darker.css';
import 'codemirror/theme/neo.css';
import 'codemirror/addon/hint/javascript-hint';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/show-hint.css';

function evalInContext(js: string, context: unknown) {
  return function () {
    return eval(js);
  }.call(context);
}

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

function isChangesQuery(query: RQuery): boolean {
  return Array.isArray(query.term) && query.term[0] === 152;
}

export function DataExplorerPage() {
  const [value, setValue] = useState<string>('');
  const [lastRunTime, setLastRunTime] = useState<Date>(null);
  const [query, setQuery] = useState<RQuery>(null);
  const [result, setResult] = useState<string>();
  const [num, setNum] = React.useState(0);
  const theme = useTheme();
  const isChangesQ = !!query && isChangesQuery(query);
  const changesResult = useChangeList(isChangesQ ? query : null);

  const handleChange = (event: React.ChangeEvent, newValue: number) => {
    setNum(newValue);
  };

  const handleChangeIndex = (index: number) => {
    setNum(index);
  };

  async function onRequestClick() {
    try {
      setLastRunTime(new Date());
      const query = evalInContext(`const r = this.r;${value}`, { r });
      if (!query) {
        setResult('You have to input anything');
        return;
      }
      setQuery(() => query);
    } catch (error) {
      setResult(`TypeError: ${error.message}`);
    }
  }
  useEffect(() => {
    if (query && !isChangesQ) {
      try {
        requestQuery(query).then(
          (data) => setResult(JSON.stringify(data, null, 2)),
          setResult,
        );
      } catch (error) {
        setResult(`TypeError: ${error.message}`);
      }
    }
  }, [query]);

  function onStopChangesClick() {
    setQuery(null);
  }

  const finalResult = isChangesQ
    ? typeof changesResult === 'string'
      ? changesResult
      : JSON.stringify(changesResult, null, 2)
    : result;
  return (
    <CommonTitledLayout title="Data Explorer">
      <Paper elevation={1} square>
        <Codemirror
          options={{
            theme: theme.palette.mode === 'dark' ? 'material-darker' : 'neo',
            lineNumbers: true,
            mode: 'javascript',
            extraKeys: {
              'Ctrl-Space': 'autocomplete',
            },
            matchBrackets: true,
            lineWrapping: true,
            tabSize: 2,
          }}
          onChange={(value) => {
            setValue(value);
          }}
        />
        <Grid m={1} container spacing={1}>
          <Grid item xs={2} direction="row">
            <Button
              variant="contained"
              color="primary"
              onClick={onRequestClick}
            >
              Request
            </Button>
            {isChangesQ && (
              <Button variant="contained" onClick={onStopChangesClick}>
                Abort
              </Button>
            )}
          </Grid>
          <Grid item xs={2}>
            <Typography>
              Last run timestamp: {lastRunTime && +lastRunTime}
            </Typography>
          </Grid>
        </Grid>
        <AppBar position="static" color="default">
          <Tabs
            value={num}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            aria-label="full width tabs example"
          >
            <Tab label="Raw view" {...a11yProps(0)} />
            <Tab label="Tree view" {...a11yProps(1)} />
            <Tab label="Query profile" {...a11yProps(2)} />
            <Tab label="Table viewer view" {...a11yProps(3)} />
            <Tab label="Table view" {...a11yProps(4)} />
          </Tabs>
        </AppBar>
        <SwipeableViews index={num} onChangeIndex={handleChangeIndex}>
          <TabPanel value={num} index={0}>
            <Typography padding={2} minWidth={275} component="pre">
              {finalResult}
            </Typography>
          </TabPanel>
          <TabPanel value={num} index={1}>
            <Codemirror
              value={finalResult}
              options={{
                theme:
                  theme.palette.mode === 'dark' ? 'material-darker' : 'neo',
                readOnly: true,
                lineNumbers: true,
                mode: 'javascript',
                matchBrackets: true,
                lineWrapping: true,
                tabSize: 2,
              }}
            />
          </TabPanel>
          <TabPanel value={num} index={2}>
            To be implemented
          </TabPanel>
          <TabPanel value={num} index={3}>
            To be implemented
          </TabPanel>
          <TabPanel value={num} index={4}>
            To be implemented
          </TabPanel>
        </SwipeableViews>
      </Paper>
    </CommonTitledLayout>
  );
}
