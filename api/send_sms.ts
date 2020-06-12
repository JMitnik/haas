import client from 'twilio';

const accountSid = 'AC820ded78b44349f074996d94aca241ef';
const authToken = '3cf6353e8400b2a08a2029e1fe93ebc3';

const twilio = client(accountSid, authToken);

twilio.messages
  .create({
    body: 'HAAS SMS TEST - Made by your favorite Daan ',
    from: '+3197010252775',
    to: '+31681401217',
  })
  .then((message) => console.log(message));
