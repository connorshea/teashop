import millify from "millify";

// Starts with because we don't want to apply a suffix if it's less than 1000.
const UNIT_NAMES = [
  "",
  "Thousand",
  "Million",
  "Billion",
  "Trillion",
  "Quadrillion",
  "Quintillion",
  "Sextillion",
  "Septillion",
  "Octillion",
  "Nonillion",
  "Decillion",
  "Undecillion",
  "Duodecillion",
  "Tredecillion",
  "Quattuordecillion",
  "Quindecillion",
  "Sexdecillion",
  "Septendecillion",
  "Octodecillion",
  "Novemdecillion",
  "Vigintillion",
  "Unvigintillion",
  "Duovigintillion",
  "Tresvigintillion",
  "Quattuorvigintillion",
  "Quinvigintillion",
  "Sesvigintillion",
  "Septemvigintillion",
  "Octovigintillion",
  "Novemvigintillion",
  "Trigintillion",
  "Untrigintillion",
  "Duotrigintillion",
  "Trestrigintillion",
  "Quattuortrigintillion",
  "Quintrigintillion",
  "Sestrigintillion",
  "Septentrigintillion",
  "Octotrigintillion",
  "Noventrigintillion"
];

const UNIT_SHORT_NAMES = [
  "",
  "K",
  "M",
  "B",
  "T",
  "Qa",
  "Qi",
  "Sx",
  "Sp",
  "Oc",
  "No",
  "Dc",
  "UDc",
  "DDc",
  "TDc",
  "QaDc",
  "QiDc",
  "SxDc",
  "SpDc",
  "ODc",
  "NDc",
  "Vi",
  "UVi",
  "DVi",
  "TVi",
  "QaVi",
  "QiVi",
  "SxVi",
  "SpVi",
  "OVi",
  "NVi",
  "Tg",
  "UTg",
  "DTg",
  "TTg",
  "QaTg",
  "QiTg",
  "SxTg",
  "SpTg",
  "OTg",
  "NTg"
];

export type HumanizeOptions = {
  short: boolean,
  lowercase: boolean
}

const DEFAULT_OPTIONS: HumanizeOptions = {
  short: false,
  lowercase: false
}

/**
 * Transform large numbers into readable values for humans.
 *
 * Example:
 * 
 *     humanize(100_000_000); // => "100 Billion"
 *     humanize(100_000_000_000); // => "100 Billion"
 *     humanize(100_000_000, { short: true ]); // => "100M"
 *     humanize(100_000_000, { lowercase: true }); // => "100 million"
 *
 */
export const humanize = (value: number, options?: Partial<HumanizeOptions>): string => {
  const opts: HumanizeOptions = options ? { ...DEFAULT_OPTIONS, ...options } : DEFAULT_OPTIONS;

  const units = opts.short ? UNIT_SHORT_NAMES : UNIT_NAMES;

  return millify(value, {
    precision: 2,
    units: units,
    lowercase: opts.lowercase,
    space: !opts.short
  });
}
