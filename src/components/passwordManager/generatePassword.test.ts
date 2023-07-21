import { generatePassword } from "./PasswordGenerator";

const specialChars = /[!@#$%^&*_+=]/;
const ambiguousChars = /[{}[\]()/\\'"`~,;:.<>]/;

test('generatePassword creates password of correct length', () => {
    const length = 10;
    const password = generatePassword(length, false, false);
    expect(password.length).toBe(length);
});

test('generatePassword includes special characters when useSpecialChars is true', () => {
    const password = generatePassword(10, true, false);
    expect(password).toMatch(specialChars);
});

test('generatePassword does not include special characters when useSpecialChars is false', () => {
    const password = generatePassword(10, false, false);
    expect(password).not.toMatch(specialChars);
});

test('generatePassword includes ambiguous characters when useAmbiguousChars is true', () => {
    const password = generatePassword(10, false, true);
    expect(password).toMatch(ambiguousChars);
});

test('generatePassword does not include ambiguous characters when useAmbiguousChars is false', () => {
    const password = generatePassword(10, false, false);
    expect(password).not.toMatch(ambiguousChars);
});
