require("dotenv").config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

// eslint-disable-next-line no-unused-expressions, import/no-extraneous-dependencies
const client = require("twilio")(accountSid, authToken);

// eslint-disable-next-line no-unused-vars
exports.sendSMS = async (body, recieverPhoneNumber) => {
  const msgOptions = {
    from: process.env.TWILIO_FROM_NUMBER,
    to: `+${recieverPhoneNumber}`,
    channel: "sms",
    body,
  };
  try {
    const message = await client.messages.create(msgOptions);
    console.log(message);
  } catch (err) {
    console.log(err);
  }
};

// sendSMS(otp);
