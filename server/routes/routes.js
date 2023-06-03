import { Router } from 'express'
import {
  sendEmail,
  getKeys,
  createPerson,
  verifyUser,
  getCourses,
  getPerson,
  verifyToken,
  getGrades,
  getCourse,
  getStudents
} from './controllers.js'

const router = Router()

router.post('/api/sendEmail', (req, res) => sendEmail(req, res))

router.post('/api/createPerson', (req, res) => createPerson(req, res))

router.post('/api/verifyUser', (req, res) => verifyUser(req, res))

router.post('/api/getCourses', (req, res) => getCourses(req, res))

router.post('/api/getPerson', (req, res) => getPerson(req, res))

router.post('/api/verifyToken', (req, res) => verifyToken(req, res))

router.post('/api/getGrades', (req, res) => getGrades(req, res))

router.post('/api/getGrade', (req, res) => getCourse(req, res))

router.post('/api/getStudents', (req, res) => getStudents(req, res))

router.get('/api/getKeys', (req, res) => getKeys(req, res))

export default router
