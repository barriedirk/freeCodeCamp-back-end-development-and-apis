function isPrime(value) {
  if (!Number.isInteger(value) || value < 2) {
    return false;
  }

  if (value === 2) {
    return true;
  }

  if (value % 2 === 0) {
    return false;
  }

  for (let divisor = 3; divisor <= Math.sqrt(value); divisor += 2) {
    if (value % divisor === 0) {
      return false;
    }
  }

  return true;
}

module.exports = { isPrime };