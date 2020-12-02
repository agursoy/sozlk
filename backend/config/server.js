module.exports = ({ env }) => ({
  url: env('URL', 'https://sozlk.com/api'),
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', 'e1c9bb24e797b477245edf746fb0d73c'),
    },
  },
});
