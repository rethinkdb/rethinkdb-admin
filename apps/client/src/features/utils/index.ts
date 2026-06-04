export function pluralizeNoun(
  noun: string,
  num: number,
  capitalize?: boolean,
): string {
  let result;
  const ends_with_y = noun.substr(-1) === 'y';
  if (num === 1) {
    result = noun;
  } else {
    if (ends_with_y && noun !== 'key') {
      result = noun.slice(0, noun.length - 1) + 'ies';
    } else if (noun.substr(-1) === 's') {
      result = noun + 'es';
    } else if (noun.substr(-1) === 'x') {
      result = noun + 'es';
    } else {
      result = noun + 's';
    }
  }
  if (capitalize) {
    result = result.charAt(0).toUpperCase() + result.slice(1);
  }
  return result;
}

export function formatBytes(bytes: number, decimals = 1) {
  if (bytes === 0) {
    return '0 Bytes';
  }
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toFixed(decimals) + ' ' + sizes[i];
}
