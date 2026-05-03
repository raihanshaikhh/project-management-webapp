import Mailgen from "mailgen";
import nodemailer from "nodemailer"


const transportEmail = nodemailer.createTransport({
    host: process.env.EMAIL_SMTP_HOST,
    port: Number(process.env.EMAIL_SMTP_PORT),
    secure: Number(process.env.EMAIL_SMTP_PORT) === 465,
    auth: {
        user: process.env.EMAIL_SMTP_USER,
        pass: process.env.EMAIL_SMTP_PASSWORD
    }
})


const emailSend = async (options)=>{
    const mailGenerator=new Mailgen({
        theme: "default",
        product:{
            name:"Project Manager",
            link:"https://projectmanager.com"
        }
    })


    const emailPlaintext = mailGenerator.generatePlaintext(options.mailgenContent)
    const emailHtmltext = mailGenerator.generate(options.mailgenContent)

    const transportEmail = nodemailer.createTransport({
    host: process.env.EMAIL_SMTP_HOST,
    port: Number(process.env.EMAIL_SMTP_PORT),
    secure: false, // important
    auth: {
        user: process.env.EMAIL_SMTP_USER,
        pass: process.env.EMAIL_SMTP_PASSWORD
    },
    logger: true,
    debug: true
})

// verify connection
await transportEmail.verify()

    const mail = {
        from:"porjectmanagerteam@example.com",
        to:options.email,
        subject: options.subject,
        html:emailHtmltext,
        text:emailPlaintext
    }
    try {
        await transportEmail.sendMail(mail)
    } catch (error) {
        console.error("Email Service failed,Make sure you provided mailtrap credentials in .env file")
        console.error("error", error)
    }
}

/*EMAIL_SMTP_HOST=sandbox.smtp.mailtrap.io
EMAIL_SMTP_PORT=2525
EMAIL_SMTP_USER=7663f701b55d9a
EMAIL_SMTP_PASSWORD=d663b2db238efd*/




const emailVerificationTemplate = (username, verificationUrl) => {
    return {
        body: {
            name: username,
            intro: "Welcome to Project Manager! We're excited to have you onboard.",
            action: {
                instructions: "Click the button below to verify your email:",
                button: {
                    color: "#22BC66",
                    text: "Verify Email",
                    link: verificationUrl
                }
            },
            outro: "Need help or have questions? Just reply to this email, we'd love to help."
        }
    }
}


const passwordResetTemplate = (username, resetPasswordUrl) => {
    return {
        body: {
            name: username,
            intro: "You requested a password reset for your account.",
            action: {
                instructions: "Click the button below to reset your password:",
                button: {
                    color: "#22BC66",
                    text: "Reset Your Password",
                    link: resetPasswordUrl
                }
            },
            outro: "If you did not request this, you can safely ignore this email."
        }
    }
}
const inviteTestEmail = async ({ toEmail, toName, inviterName, projectName }) => {
  if (!process.env.EMAIL_SMTP_HOST || !process.env.EMAIL_SMTP_PORT || !process.env.EMAIL_SMTP_USER || !process.env.EMAIL_SMTP_PASSWORD) {
    throw new Error("Missing SMTP env vars. Please set EMAIL_SMTP_HOST, EMAIL_SMTP_PORT, EMAIL_SMTP_USER, EMAIL_SMTP_PASSWORD");
  }

  const info = await transportEmail.sendMail({
    from: '"Project Manager" <no-reply@project.com>',
    to: toEmail,
    subject: `You're invited to ${projectName}`,
    html: `<p>Hi ${toName},</p>
           <p>${inviterName} invited you to join <b>${projectName}</b>.</p>`,
    text: `${inviterName} invited you to join ${projectName}`,
  });

  console.log("Invite email sent:", info.messageId);
  return info;
};
export{
    emailVerificationTemplate,
    passwordResetTemplate,
    emailSend,
    inviteTestEmail
}