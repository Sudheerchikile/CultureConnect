export const capitialize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// Generate a consistent fallback avatar using user's name
export const getFallbackAvatar = (name) => {
  const seed = name ? name.toLowerCase().replace(/\s+/g, '') : 'user';
  return `https://api.dicebear.com/7.x/avataaars/png?seed=${seed}&size=128&background=%23ffffff`;
};

// Handle image error by setting fallback avatar
export const handleAvatarError = (e, userName) => {
  const fallbackUrl = getFallbackAvatar(userName);
  if (e.target.src !== fallbackUrl) {
    e.target.src = fallbackUrl;
  }
};