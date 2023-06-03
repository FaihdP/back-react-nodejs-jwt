import { v4 as uuidv4 } from 'uuid'
import { createTransport } from 'nodemailer'
import { query } from '../../database/database.js'

export default async function (email) {
  const key = uuidv4()
  const link = `http://localhost:3000/emailVerify/${key}`
  const [rows] = await query('SELECT email FROM key_registration;')
  let band = false

  // Email exist in database
  if (rows.filter((row) => row.email.toLowerCase() == email.toLowerCase()).length > 0) {
    return band
  }

  const transporter = createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'mailverify.project@gmail.com',
      pass: 'zgbazfsmjksinbmc'
    }
  })

  await transporter
    .sendMail({
      from: "'Verificación de correo ' <mailverify.project@gmail.com",
      to: email,
      subject: 'Verificacion de correo',
      html: `
        <b>¡Bienvenido a nuestro sistema de notas!</b> Para poder realizar la verificacion de email, ingresa al siguiente link.
        <br>
        <br>
        <a href="${link}">${link}</a>
      `
    })
    .then(() => {
      query(
        `INSERT INTO key_registration (datetime, key_registration, email) VALUES (now(), "${key}", "${email}")`
      )
      band = true
    })
    .catch((e) => {
      console.error(e)
      band = false
    })
  return band
}
