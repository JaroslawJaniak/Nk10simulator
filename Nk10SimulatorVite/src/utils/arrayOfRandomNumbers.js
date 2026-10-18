function arrayOfRandomNumbers(n, k) {
  let i = 0;
  let s = 0;
  const arr = [];

  while (arr.length < n) {
    s = Math.floor(Math.random() * k) + 1;
    if (!arr.includes(s)) {
      arr.push(s);
    }
  }

  return arr;
}

export default arrayOfRandomNumbers;

// n = number of random numbers to generate
// k = the maximum number to generate random numbers from for example, if n = 5 and k = 49, the function will generate an array of 5 unique random numbers between 1 and 49.
