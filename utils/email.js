const nodemailer = require('nodemailer')
const {EMAIL_USER, GOOGLE_APP_PASSWORD} = require('./config.js')


const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user: EMAIL_USER,
        pass:GOOGLE_APP_PASSWORD
    }
})

const sendEmail = async(to,username,subject,articles) =>{

    const html = `
  <div style="font-family: Arial, sans-serif; padding: 20px;">
      
      <h2 style="color: #2c3e50;">Breaking News Alert</h2>
      
      <p>Hello <b>${username || "User"}</b>,</p>
      <p>Here are your latest news updates:</p>

      ${articles.map(a => `
        <div style="
            border: 1px solid #ddd;
            border-radius: 10px;
            padding: 10px;
            margin-bottom: 15px;
        ">
          
          <h3>${a.title}</h3>

          ${a.image_url ? `
            <img src="${a.image_url}" 
                 style="width:100%; max-height:200px; object-fit:cover; border-radius:8px;" />
          ` : ""}

          <p>${a.description || ""}</p>

          <a href="${a.link}" 
             style="
               display:inline-block;
               margin-top:10px;
               padding:8px 12px;
               background:#3498db;
               color:white;
               text-decoration:none;
               border-radius:5px;
             ">
             Read More →
          </a>
        </div>
      `).join("")}

      <hr/>

      <p style="color: gray; font-size: 12px;">
        You're receiving this because of your news preferences.
      </p>

      <p><b>Daily Express Team</b></p>

    </div>
    `;

    const mailOptions = {
        from: `"News App" <${EMAIL_USER}>`,
        to: to,
        subject: subject,
        html: html,
    }
    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent: ' + info.response)
}

module.exports = sendEmail;