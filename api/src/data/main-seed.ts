import makeStarbucks from './seeds/make-starbucks';
import makeMediamarkt from './seeds/make-mediamarkt';
import makef45 from './seeds/make-f45';

const main = async () => {
  await makeStarbucks();
  await makeMediamarkt();
  await makef45();
};

main();
