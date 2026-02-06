import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";

const sendMail = async (to, subject, data) => {
  const templatePath = path.join(
    process.cwd(),
    "src",
    "templates",
    "accept-invite.html",
  );

  let html = fs.readFileSync(templatePath, "utf8");

  html = html
    .replace("{{ link }}", data.link)
    .replace("{{ title }}", data.title)
    .replace("{{ startDate }}", data.startDate)
    .replace("{{ endDate }}", data.endDate)
    .replace("{{ userName }}", data.name);

  const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject,
    html,
  });
};

export default sendMail;
