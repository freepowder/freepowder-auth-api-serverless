export const signOut = (req, res) => {
  res.status(200).json({ user: null, token: null });
};
