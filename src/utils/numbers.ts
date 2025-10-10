export const formatNumberShort = (n: number): string => {
  if (n >= 1_000_000) {
    return (n / 1_000_000).toFixed(1).replace(/.0$/, '') + 'M';
  }
  if (n >= 1_000) {
    return (n / 1_000).toFixed(1).replace(/.0$/, '') + 'k';
  }
  return n.toString();
};

export const formatNumberUS = (n: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'decimal',
  }).format(n);

export const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
