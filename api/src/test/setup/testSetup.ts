const rand = 'test' + Math.random();
console.log("INIITIALIZE: RAND is " + rand);

beforeAll(() => {
  console.log("BeforeAll: RAND is " + rand);
  // @ts-ignore
  global.rand = rand;
})