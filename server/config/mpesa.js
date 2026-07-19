export default {


consumerKey:

process.env.MPESA_CONSUMER_KEY,


consumerSecret:

process.env.MPESA_CONSUMER_SECRET,


shortCode:

process.env.MPESA_SHORTCODE,


passKey:

process.env.MPESA_PASSKEY,


callbackURL:

process.env.MPESA_CALLBACK_URL,


environment:

process.env.MPESA_ENV || "sandbox"


};