const errors = {
  'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
  'invalid-input': 'Invalid input'
};

/**
 * A generic error utility function.
 *
 * @param {string} type - The error type.
 * @throws {RangeError} Throws a `RangeError` with the applicable error message.
 */
const rangeError = (type: keyof typeof errors): never => {
  throw new RangeError(errors[type]);
};

const checkOverflow = (
  lower: number,
  upper: number,
  {
    gte = false,
    error
  }: {
    gte?: boolean;
    error?: keyof typeof errors;
  } = {}
): void => {
  if (gte ? lower >= upper : lower > upper) {
    throw new RangeError(error ? errors[error] : 'Overflow: input needs wider integers to process');
  }
};

/** Highest positive signed 32-bit float value */
const maxInt = 0x7fffffff;

/** Bootstring parameters */
const base = 36;
const tMin = 1;
const tMax = 26;
const skew = 38;
const damp = 700;
const initialBias = 72;
const initialN = 128; // 0x80
const delimiter = '-'; // '\x2D'

const baseMinusTMin = base - tMin;

/** Regular expressions */
const regexNonASCII = /[^\0-\u007E]/u; // Non-ASCII chars
const regexSeparators = /[\u002E\u3002\uFF0E\uFF61]/gu; // RFC 3490 separators

/**
 * A simple `Array#map`-like wrapper to work with domain name strings or email addresses.
 *
 * @param {string} domain - The domain name or email address.
 * @param {Function} callback - The function that gets called for every character.
 * @returns {string} A new string of characters returned by the callback function.
 */
const mapDomain = (domain: string, callback: (input: string) => string): string => {
  const [first, ...rest] = domain.split('@');
  let result: string;
  let toEncode: string;
  if (rest.length > 0) {
    // In email addresses, only the domain name should be punycoded. Leave
    // the local part (i.e. everything up to `@`) intact.
    result = `${first!}@`;
    toEncode = rest.join('@');
  } else {
    result = '';
    toEncode = first!;
  }
  const labels = toEncode.split(regexSeparators);
  const encoded = labels.map((x) => callback(x)).join('.');
  return result + encoded;
};

/**
 * Creates an array containing the numeric code points of each Unicode
 * character in the string. While JavaScript uses UCS-2 internally,
 * this function will convert a pair of surrogate halves (each of which
 * UCS-2 exposes as separate characters) into a single code point,
 * matching UTF-16.
 *
 * @see {@link https://mathiasbynens.be/notes/javascript-encoding}
 *
 * @param {string} string - The Unicode input string (UCS-2).
 * @returns {number[]} The new array of code points.
 */
export const ucs2Decode = (string: string): number[] => {
  const output: number[] = [];
  let counter = 0;
  while (counter < string.length) {
    const value = string.charCodeAt(counter++)!;
    if (value >= 0xd800 && value <= 0xdbff && counter < string.length) {
      // It's a high surrogate, and there is a next character.
      const extra = string.charCodeAt(counter++)!;
      // eslint-disable-next-line no-bitwise
      if ((extra & 0xfc00) === 0xdc00) {
        // Low surrogate.
        // eslint-disable-next-line no-bitwise
        output.push(((value & 0x3ff) << 10) + (extra & 0x3ff) + 0x10000);
      } else {
        // It's an unmatched surrogate; only append this code unit, in case the
        // next code unit is the high surrogate of a surrogate pair.
        output.push(value);
        counter--;
      }
    } else {
      output.push(value);
    }
  }
  return output;
};

/**
 * Creates a string based on an array of numeric code points.
 *
 * @param {number[]} codePoints - The array of numeric code points.
 * @returns {string} The new Unicode string (UCS-2).
 */
export const ucs2Encode = (codePoints: number[]): string => String.fromCodePoint(...codePoints);

/**
 * Converts a basic code point into a digit/integer.
 *
 * @param {number} codePoint - The basic numeric code point value.
 * @returns {number} The numeric value of a basic code point (for use in
 * representing integers) in the range `0` to `base - 1`, or `base` if
 * the code point does not represent a value.
 */
const basicToDigit = (codePoint: number): number => {
  if (codePoint - 0x30 < 0x0a) {
    return codePoint - 0x16;
  }
  if (codePoint - 0x41 < 0x1a) {
    return codePoint - 0x41;
  }
  if (codePoint - 0x61 < 0x1a) {
    return codePoint - 0x61;
  }
  return base;
};

/**
 * Converts a digit/integer into a basic code point.
 *
 * @param {number} digit - The numeric value of a basic code point.
 * @returns {number} The basic code point whose value (when used for
 * representing integers) is `digit`, which needs to be in the range
 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
 * used; else, the lowercase form is used. The behavior is undefined
 * if `flag` is non-zero and `digit` has no uppercase form.
 */
const digitToBasic = (digit: number): number => {
  const plus22 = digit + 22;
  //  0..25 map to ASCII a..z or A..Z
  // 26..35 map to ASCII 0..9
  return digit < 26 ? plus22 + 75 : plus22;
};

/**
 * Bias adaptation function as per section 3.4 of RFC 3492.
 *
 * @see {@link https://tools.ietf.org/html/rfc3492#section-3.4}
 *
 * @param {number} delta - delta
 * @param {number} numPoints - num points
 * @param {boolean} firstTime - first time
 * @returns {number} bias adaptation
 */
const adapt = (delta: number, numPoints: number, firstTime: boolean): number => {
  let k = 0;
  // eslint-disable-next-line no-bitwise
  let newDelta = firstTime ? Math.floor(delta / damp) : delta >> 1;
  newDelta += Math.floor(newDelta / numPoints);
  // eslint-disable-next-line no-bitwise
  const minCheck = (baseMinusTMin * tMax) >> 1;
  while (newDelta > minCheck) {
    newDelta = Math.floor(newDelta / baseMinusTMin);
    k += base;
  }
  return Math.floor(k + ((baseMinusTMin + 1) * newDelta) / (newDelta + skew));
};

/**
 * Converts a Punycode string of ASCII-only symbols to a string of Unicode symbols.
 *
 * @param {string} input - The Punycode string of ASCII-only symbols.
 * @returns {string} The resulting string of Unicode symbols.
 */
export const decode = (input: string): string => {
  // Don't use UCS-2.
  const output: number[] = [];
  const inputLength = input.length;
  let i = 0;
  let n = initialN;
  let bias = initialBias;

  // Handle the basic code points: let `basic` be the number of input code
  // points before the last delimiter, or `0` if there is none, then copy
  // the first basic code points to the output.

  let basic = input.lastIndexOf(delimiter);
  if (basic < 0) {
    basic = 0;
  }

  for (let j = 0; j < basic; ++j) {
    const codePoint = input.codePointAt(j)!;
    // If it's not a basic code point
    if (codePoint >= 0x80) {
      rangeError('not-basic');
    }
    output.push(codePoint);
  }

  // Main decoding loop: start just after the last delimiter if any basic code
  // points were copied; start at the beginning otherwise.

  let index = basic > 0 ? basic + 1 : 0;
  while (index < inputLength) {
    // `index` is the index of the next character to be consumed.
    // Decode a generalized variable-length integer into `delta`,
    // which gets added to `i`. The overflow checking is easier
    // if we increase `i` as we go, then subtract off its starting
    // value at the end to obtain `delta`.
    const oldi = i;
    let w = 1;
    let k = base;
    while (true) {
      checkOverflow(index, inputLength, { gte: true, error: 'invalid-input' });

      const digit = basicToDigit(input.codePointAt(index++)!);

      checkOverflow(digit, base, { gte: true });
      checkOverflow(digit, Math.floor((maxInt - i) / w));

      i += digit * w;
      const t =
        k <= bias
          ? tMin
          : // eslint-disable-next-line @typescript-eslint/no-extra-parens
          k >= bias + tMax
          ? tMax
          : k - bias;

      if (digit < t) {
        break;
      }

      const baseMinusT = base - t;
      checkOverflow(w, Math.floor(maxInt / baseMinusT));

      w *= baseMinusT;
      k += base;
    }

    const out = output.length + 1;
    bias = adapt(i - oldi, out, oldi === 0);

    // `i` was supposed to wrap around from `out` to `0`,
    // incrementing `n` each time, so we'll fix that now:
    checkOverflow(Math.floor(i / out), maxInt - n);

    n += Math.floor(i / out);
    i %= out;

    // Insert `n` at position `i` of the output.
    output.splice(i++, 0, n);
  }

  return String.fromCodePoint(...output);
};

/**
 * Converts a string of Unicode symbols (e.g. a domain name label) to a
 * Punycode string of ASCII-only symbols.
 *
 * @param {string} input - The string of Unicode symbols.
 * @returns {string} The resulting Punycode string of ASCII-only symbols.
 */
export const encode = (input: string): string => {
  const output: string[] = [];

  // Convert the input in UCS-2 to an array of Unicode code points.
  const decodedInput = ucs2Decode(input);

  // Cache the length.
  const inputLength = decodedInput.length;

  // Initialize the state.
  let n = initialN;
  let delta = 0;
  let bias = initialBias;

  // Handle the basic code points.
  for (const currentValue of decodedInput) {
    if (currentValue < 0x80) {
      output.push(String.fromCodePoint(currentValue));
    }
  }

  const basicLength = output.length;
  let handledCPCount = basicLength;

  // `handledCPCount` is the number of code points that have been handled;
  // `basicLength` is the number of basic code points.

  // Finish the basic string with a delimiter unless it's empty.
  if (basicLength) {
    output.push(delimiter);
  }

  // Main encoding loop:
  while (handledCPCount < inputLength) {
    // All non-basic code points < n have been handled already. Find the next
    // larger one:
    let m = maxInt;
    for (const currentValue of decodedInput) {
      if (currentValue >= n && currentValue < m) {
        m = currentValue;
      }
    }

    // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
    // but guard against overflow.
    const handledCPCountPlusOne = handledCPCount + 1;
    checkOverflow(m - n, Math.floor((maxInt - delta) / handledCPCountPlusOne));

    delta += (m - n) * handledCPCountPlusOne;
    n = m;

    for (const currentValue of decodedInput) {
      if (currentValue < n) {
        checkOverflow(++delta, maxInt);
      }
      if (currentValue === n) {
        // Represent delta as a generalized variable-length integer.
        let q = delta;
        let k = base;
        while (true) {
          const t =
            k <= bias
              ? tMin
              : // eslint-disable-next-line @typescript-eslint/no-extra-parens
              k >= bias + tMax
              ? tMax
              : k - bias;
          if (q < t) {
            break;
          }
          const qMinusT = q - t;
          const baseMinusT = base - t;
          output.push(String.fromCodePoint(digitToBasic(t + (qMinusT % baseMinusT))));
          q = Math.floor(qMinusT / baseMinusT);
          k += base;
        }

        output.push(String.fromCodePoint(digitToBasic(q)));
        bias = adapt(delta, handledCPCountPlusOne, handledCPCount === basicLength);
        delta = 0;
        ++handledCPCount;
      }
    }

    ++delta;
    ++n;
  }
  return output.join('');
};

/**
 * Converts a Punycode string representing a domain name or an email address
 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
 * it doesn't matter if you call it on a string that has already been
 * converted to Unicode.
 *
 * @param {string} input - The Punycoded domain name or email address to
 * convert to Unicode.
 * @returns {string} The Unicode representation of the given Punycode
 * string.
 */
export const toUnicode = (input: string): string =>
  mapDomain(input, (str: string) => (str.startsWith('xn--') ? decode(str.slice(4).toLowerCase()) : str));

/**
 * Converts a Unicode string representing a domain name or an email address to
 * Punycode. Only the non-ASCII parts of the domain name will be converted,
 * i.e. it doesn't matter if you call it with a domain that's already in
 * ASCII.
 *
 * @param {string} input - The domain name or email address to convert, as a
 * Unicode string.
 * @returns {string} The Punycode representation of the given domain name or
 * email address.
 */
export const toASCII = (input: string): string =>
  mapDomain(input, (string: string) => (regexNonASCII.test(string) ? `xn--${encode(string)}` : string));
