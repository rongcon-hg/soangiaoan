const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/lessonController');
const authenticateToken = require('../middlewares/auth');

router.use(authenticateToken);

// Lịch (Sổ đầu bài)
router.get('/:projectId/schedule', lessonController.getScheduleByProjectId);
router.post('/:projectId/schedule', lessonController.saveSchedule);

// Giáo án
router.get('/:projectId/lessons', lessonController.getAllLessonsByProject);
router.get('/:projectId/lessons/:tt', lessonController.getLessonByTT);
router.post('/:projectId/lessons/:tt', lessonController.saveLesson);

module.exports = router;
