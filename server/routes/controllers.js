/* eslint-disable camelcase */
import { query } from "../../database/database.js";
import emailSender from "../email/sendEmail.js";
import jwt from "jsonwebtoken";

// Encrypted in SHA256
const SECRET_HASH_KEY =
  "adcc7a2883ddc90219ac589c1c1e2f8f06b28ac19f9e6770bb12e86cc13410db";

export const sendEmail = async (req, res) => {
  const response = await emailSender(req.body.email);
  res.send(response);
};

const deleteKeysExpireds = async () => {
  const [rows] = await query("SELECT id, datetime FROM key_registration");
  rows.forEach(({ id, date }) => {
    console.log(id, new Date(date).getTime());
    console.log(new Date().getTime());
    //  if () query(`DELETE FROM key_registration WHERE id = ${id}`)
  });
};

export const getKeys = async (req, res) => {
  await deleteKeysExpireds();
  const [rows] = await query(
    "SELECT key_registration, email FROM key_registration"
  );
  res.send(rows);
};

export const getPerson = async (req, res) => {
  const email = req.body.email;

  const [[{ id_type }]] = await query(
    `SELECT id_type FROM _user WHERE email = '${email}'`
  );
  const typeUser = id_type === 1 ? "teacher" : "student";

  const [[row]] = await query(
    `SELECT id, names, lastnames, id_type FROM _user 
    INNER JOIN ${typeUser}
    ON _user.id = ${typeUser}.id_user
    WHERE email = '${email}'`
  );

  res.send(row);
};

export const getCourses = async (req, res) => {
  const sql =
    req.body.typeUser === 1
      ? `
        SELECT _group.id, _group.name AS grp, asignature.name AS asignature 
        FROM _group 
        INNER JOIN teacher 
        ON _group.id_teacher = teacher.id_user
        INNER JOIN asignature
        ON _group.id_asignature = asignature.id 
        WHERE teacher.id_user = ${req.body.id || 0}
      `
      : `
        SELECT _group.id, _group.name AS grp, asignature.name AS asignature FROM group_student 
        INNER JOIN _group
        ON group_student.id_group = _group.id
        INNER JOIN asignature
        ON _group.id_asignature = asignature.id 
        INNER JOIN student 
        ON group_student.id_student = student.id_user
        WHERE student.id_user = ${req.body.id || 0}
      `;

  const [rows] = await query(sql);
  res.send(rows);
};

export const getCourse = async (req, res) => {
  const sql = `
    SELECT _group.id, _group.name, teacher.names AS teacher_names, teacher.lastnames AS teacher_lastnames, asignature.name AS asignature
    FROM _group
    INNER JOIN teacher
    ON _group.id_teacher = teacher.id_user
    INNER JOIN asignature
    ON _group.id_asignature = asignature.id
    WHERE _group.id = ${req.body.idGroup}
  `;

  const [rows] = await query(sql);
  res.send(rows);
};

export const getGrades = async (req, res) => {
  if (!req.body.id) return;
  let grades = [];
  try {
    const [studentAsignatures] = await query(`
      SELECT asignature.id, asignature.name AS asignature
      FROM asignature
      INNER JOIN _group
      ON asignature.id = _group.id_asignature
      INNER JOIN group_student
      ON group_student.id_group = _group.id
      WHERE group_student.id_student = ${req.body.id}
    `);

    for (const { asignature, id } of studentAsignatures) {
      const [notes] = await query(`
        SELECT grade._number as note
        FROM grade 
        INNER JOIN student
        ON grade.id_student = student.id_user
        INNER JOIN _group
        ON grade.id_group = _group.id
        INNER JOIN asignature
        ON _group.id_asignature = asignature.id
        WHERE student.id_user = ${req.body.id || 0} AND asignature.id = ${id}
      `);
      grades.push({
        asignature,
        notes,
      });
    }
    res.send(grades);
  } catch (error) {
    return null;
  }
};

export const getStudents = async (req, res) => {
  try {
    const [students] = await query(
      `SELECT student.names, student.lastnames
      FROM student
      INNER JOIN group_student
      ON student.id_user = group_student.id_student
      INNER JOIN _group
      ON group_student.id_group = _group.id
      WHERE _group.id = ${req.body.idGroup || 0}`
    );
    return res.send(students);
  } catch (error) {
    return null;
  }
};

export const createPerson = async (req, res) => {
  try {
    const [{ insertId }] = await query(
      `INSERT INTO _user(email, password, id_type) VALUES ('${req.body.email}', md5('${req.body.password}'), ${req.body.type_user})`
    );

    // type user: 1=(teacher), 2=(admin), 3=(student)

    const table = req.body.type_user === 1 ? "teacher" : "student";

    await query(
      `INSERT INTO ${table}(id_user, names, lastnames) VALUES (${insertId}, '${req.body.names}', '${req.body.lastnames}')`
    );

    res.send(true);
  } catch (error) {
    res.send(false);
    throw error;
  }
};

export const verifyUser = async (req, res) => {
  const [[row]] = await query(
    `SELECT id, email, password FROM _user WHERE email = '${req.body.email}' AND password = md5('${req.body.password}')`
  );

  if (row) {
    const token = jwt.sign(
      {
        id: row.id,
        email: row.email,
        exp: Math.floor(Date.now() / 1000) + 60 * 2,
      },
      SECRET_HASH_KEY
    );
    return res.json({ verified: true, token });
  }

  return res.json({ verified: false });
};

export const verifyToken = (req, res) => {
  try {
    return res.send(jwt.verify(req.body.token, SECRET_HASH_KEY));
  } catch (err) {
    return null;
  }
};
