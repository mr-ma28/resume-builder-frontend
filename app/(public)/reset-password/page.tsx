// config/plugins.js
module.exports = ({ env }: { env: any }) => ({
  // ...
  email: {
    config: {
      provider: "sendgrid", // or 'nodemailer'
      providerOptions: {
        // your email provider config
      },
      settings: {
        defaultFrom: "noreply@yourapp.com",
        defaultReplyTo: "support@yourapp.com",
      },
    },
  },
});
