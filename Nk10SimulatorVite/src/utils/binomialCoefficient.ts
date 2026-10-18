export function binomialCoefficient(n: number, k: number): number {
  if (Number.isNaN(n) || Number.isNaN(k)) return NaN;
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  if (k === 1 || k === n - 1) return n;

  // Optimize: C(n, k) === C(n, n - k)
  if (k > n - k) {
    k = n - k;
  }

  let result = 1;
  for (let i = 1; i <= k; i++) {
    result *= (n - i + 1) / i;
  }

  return Math.round(result);
}
