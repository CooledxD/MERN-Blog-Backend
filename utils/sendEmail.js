import nodemailer from 'nodemailer'

export const sendActivationEmail = async ({email, url}) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_SERVICE_EMAIL,
        pass: process.env.MAIL_PASSWORD
      }
    })

    const info = await transporter.sendMail({
      from: process.env.MAIL_SERVICE_EMAIL,
      to: email,
      subject: 'Email Activation',
      text: 'Please activate your email',
      html: `
        <div>
          <a 
            href=${url} 
            style="background: crimson; 
            text-decoration: none; 
            color: white; 
            padding: 10px 20px; 
            margin: 10px 0; 
            display: inline-block;">Verify your Email Address</a>
        </div>
      `
    })

    return info
  } catch (error) {
    console.log(error)

    return error
  }
}