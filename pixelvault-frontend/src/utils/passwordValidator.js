export function checkPasswordRequirements(password) {
  const pwd = password || "";
  return {
    length: pwd.length >= 8,
    uppercase: /[A-Z]/.test(pwd),
    lowercase: /[a-z]/.test(pwd),
    number: /[0-9]/.test(pwd),
    special: /[^A-Za-z0-9]/.test(pwd),
  };
}

export function validatePassword(password) {
  const reqs = checkPasswordRequirements(password);
  if (!reqs.length) return "Password must be at least 8 characters long";
  if (!reqs.uppercase) return "Password must contain at least 1 uppercase letter";
  if (!reqs.lowercase) return "Password must contain at least 1 lowercase letter";
  if (!reqs.number) return "Password must contain at least 1 number";
  if (!reqs.special) return "Password must contain at least 1 special character";
  return null;
}
