exports.sanatizeUser = function (user) {
  return {
    userId: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: user.token,
    // addresses: user.addresses,
    lat: user.lat,
    lng: user.lng,
    address: user.address,
  };
};
