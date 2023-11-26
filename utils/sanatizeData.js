exports.sanatizeUser = function (user) {
  return {
    userId: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: user.token,
    phone: user.phone,
    // addresses: user.addresses,
    lat: user.lat,
    lng: user.lng,
    address: user.address,
    active: user.active,
  };
};
