import { TableStatus } from '../tables/types';

export function humanizeTableStatus(status: TableStatus) {
  if (!status) return '';
  if (status.all_replicas_ready || status.ready_for_writes) return 'Ready';
  if (status.ready_for_reads) return 'Reads only';
  if (status.ready_for_outdated_reads) return 'Outdated reads';
  return 'Unavailable';
}

export type HumanizedReadiness = {
  label: 'failure' | 'success' | 'partial-success';
  value: string;
};
export function humanizeTableReadiness(
  status: TableStatus,
  replicas: number,
  replicasReady: number,
): HumanizedReadiness {
  if (!status) {
    return {
      label: 'failure',
      value: 'unknown',
    };
  }
  if (status.all_replicas_ready) {
    return {
      label: 'success',
      value: `${humanizeTableStatus(status)} ${replicas}/${replicasReady}`,
    };
  }
  if (status.ready_for_writes) {
    return {
      label: 'partial-success',
      value: `${humanizeTableStatus(status)} ${replicas}/${replicasReady}`,
    };
  }

  return {
    label: 'failure',
    value: humanizeTableStatus(status),
  };

  // return new Handlebars.SafeString(
  //   "<div class='status label label-#{label}'>#{value}</div>",
  // );
}
