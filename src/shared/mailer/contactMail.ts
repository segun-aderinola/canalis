import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
require("dotenv").config();

var transporter = nodemailer.createTransport({
  service:  process.env.MAIL_SERVICE,
  auth: {
    user:  process.env.MAIL_USERNAME,
    pass:  process.env.MAIL_PASSWORD
  },
});

var option = {
    viewEngine : {
        extname: '.hbs', // handlebars extension
        layoutsDir: __dirname+'/views/', // location of handlebars templates
        defaultLayout: 'contact_mail', // name of main template
    },
    viewPath: __dirname+'/views/',
    extName: '.hbs'
};

const send = async (options:any) => {

    await transporter.use('compile', hbs(option));

    const message = {
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to: `${options.admin_email}`,
      subject: `${options.subject}`,
      template: 'contact_mail',
      context: {
        scout_name: `${options.scout_name}`,
        scout_email: `${options.scout_email}`,
        player_name: `${options.player_name}`,
        team_name: `${options.team_name}`,
      }
    };
  
    const info = await transporter.sendMail(message);
    //console.log(info);
    return info;
}

export default { send };