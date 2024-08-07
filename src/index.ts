export default function raceControl(
  target: (...args: any[]) => Promise<any>,
  abortSignal = false
) {
  let index = 0;
  const aborts: AbortController[] = [];

  return function controller(...args: any[]) {
    const currentIdx = ++index;

    if (abortSignal) {
      aborts[currentIdx] = new AbortController();
    }

    return new Promise((resolve, reject) => {
      target(
        ...args,
        aborts[currentIdx] ? aborts[currentIdx].signal : undefined
      )
        .then((result) => currentIdx === index && resolve(result))
        .catch((error) => currentIdx === index && reject(error))
        .finally(() => {
          if (currentIdx === index) {
            index = 0;
            aborts.forEach((abort, idx) => idx !== currentIdx && abort.abort());
            aborts.length = 0;
          }
        });
    });
  };
}
