export type TableStatus = {
  all_replicas_ready: boolean;
  ready_for_outdated_reads: boolean;
  ready_for_reads: boolean;
  ready_for_writes: boolean;
};

export type TableEntry = {
  db: string;
  id: string;
  name: string;
  raft_leader: string;
  replicas: number;
  replicas_ready: number;
  shards: number;
  status: TableStatus;
};

export type EnrichedDatabaseEntry = {
  id: string;
  name: string;
  tables: TableEntry[];
};
