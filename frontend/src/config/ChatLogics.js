export const getSender = (loggedUser, users) => {
  return users.find((user) => user._id !== loggedUser._id).name;
};
