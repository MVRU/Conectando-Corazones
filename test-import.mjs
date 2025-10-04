import('firebase/firestore')
  .then(() => console.log('ok'))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
