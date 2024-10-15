import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
console.log(process.env.MAIL_SERVICE, process.env.MAIL_USERNAME, process.env.MAIL_PASSWORD)

const setupHandlebars = async (transporter) => {
  const { default: hbs } = await import("nodemailer-express-handlebars");

  const option = {
    viewEngine: {
      extname: '.hbs',
      layoutsDir: './views/',
      defaultLayout: 'user_account',
    },
    viewPath: './views/',
    extName: '.hbs',
  };

  transporter.use('compile', hbs(option));
};

const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD
  }
});

const send = async (options) => {
  await setupHandlebars(transporter);

  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.credentials.email,
    subject: options.subject,
    template: 'user_account',
    context: {
      name: options.credentials.name,
      email: options.credentials.email,
      password: options.credentials.password,
      link: options.credentials.link,
    }
  };

  return transporter.sendMail(message);
};

export default { send };
