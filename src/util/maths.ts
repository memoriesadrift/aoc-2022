export const gcd = (a: bigint, b: bigint): bigint => !b ? a : gcd(b, a % b)

export const lcm = (a: bigint, b: bigint): bigint => (a * b) / gcd(a, b)
