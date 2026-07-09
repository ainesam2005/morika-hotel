const crypto = require('crypto');

// Unambiguous alphabet — no 0/O/1/I so references are easy to read and share.
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

// Builds a short, human-friendly booking reference, e.g. "MRK-7F3K9Q".
function generateReference() {
  const bytes = crypto.randomBytes(6);
  let code = '';
  for (let i = 0; i < 6; i++) code += ALPHABET[bytes[i] % ALPHABET.length];
  return `MRK-${code}`;
}

// Generates a reference that is not already used by another booking.
async function generateUniqueReference(Booking) {
  for (let attempt = 0; attempt < 6; attempt++) {
    const reference = generateReference();
    const exists = await Booking.exists({ reference });
    if (!exists) return reference;
  }
  // Extremely unlikely fallback: add extra entropy.
  return `${generateReference()}${crypto.randomBytes(1).toString('hex').toUpperCase()}`;
}

module.exports = { generateReference, generateUniqueReference };
