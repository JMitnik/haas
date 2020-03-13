const cleanInt = (x: any) => {
  x = Number(x);
  return x >= 0 ? Math.floor(x) : Math.ceil(x);
};

export default cleanInt;
