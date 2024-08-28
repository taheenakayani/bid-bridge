// const nodemailer = require('nodemailer');
// const { google } = require('googleapis');

// const OAuth2 = google.auth.OAuth2;

// const oauth2Client = new OAuth2(
//     'xyz',
//     'xyz',
//     'https://developers.google.com/oauthplayground'
// );

// oauth2Client.setCredentials({
//     refresh_token: 'YOUR_REFRESH_TOKEN'
// });

// async function sendMail(recepient, token) {
//     try {
//         const accessToken = await oauth2Client.getAccessToken();

//         const transporter = nodemailer.createTransport({
//             service: 'gmail',
//             auth: {
//                 type: 'OAuth2',
//                 user: 'heenakayani@gmail.com',
//                 clientId: 'xyz',
//                 clientSecret: 'xyz',
//                 refreshToken: '1//048JoYLx-CFmcCgYIARAAGAQSNwF-L9IrmV1RFif9nL7Kygm3fnnZGJ20tv1PZgC1KbE-iC9zIiaWKlHYYvoX7zMoyVxGP_4Ejt8',
//                 accessToken: accessToken.token,
//             },
//         });

//         const mailOptions = {
//             from: 'heenakayani@gmail.com',
//             to: recepient,
//             subject: 'Password Reset',
//             text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
//             Please click on the following link, or paste this into your browser to complete the process:\n\n
//             http://${req.headers.host}/reset-password/${token}\n\n
//             If you did not request this, please ignore this email and your password will remain unchanged.\n`,
//         };

//         const result = await transporter.sendMail(mailOptions);
//         return result;
//     } catch (error) {
//         console.log(error);
//     }
// }

// module.exports = { sendMail }

// // sendMail().then(result => console.log('Email sent...', result))
// //     .catch(error => console.log(error.message));