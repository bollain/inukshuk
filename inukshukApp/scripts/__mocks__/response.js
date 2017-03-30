const states = {
  200: 'ok',
  201: 'created'
}

export function getResponse(user, state) {
  return new Promise((resolve, reject) => {
    process.nextTick(
      () => state ? resolve(user) : reject({
        error: 'Problem connecting to server'})
    );
  });
}