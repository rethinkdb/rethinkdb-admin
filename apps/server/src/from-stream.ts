import { Observable } from 'rxjs';
import { Readable } from 'stream';

// Adapted from https://github.com/Reactive-Extensions/rx-node/blob/87589c07be626c32c842bdafa782fca5924e749c/index.js#L52
export function fromStream(
  stream: Readable,
  finishEventName = 'end',
  dataEventName = 'data',
) {
  stream.pause();

  return new Observable((observer) => {
    function dataHandler(data: unknown) {
      observer.next(data);
    }

    function errorHandler(err: Error) {
      observer.error(err);
    }

    function endHandler() {
      observer.complete();
    }

    stream.addListener(dataEventName, dataHandler);
    stream.addListener('error', errorHandler);
    stream.addListener(finishEventName, endHandler);

    stream.resume();

    return () => {
      stream.removeListener(dataEventName, dataHandler);
      stream.removeListener('error', errorHandler);
      stream.removeListener(finishEventName, endHandler);
    };
  });
}
