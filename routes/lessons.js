const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/lessonController');
const authenticateToken = require('../middlewares/auth');
const auditLog = require('../middlewares/audit');

router.use(authenticateToken);

// Lịch (Sổ đầu bài)
router.get('/:projectId/schedule', lessonController.getScheduleByProjectId);
router.post('/:projectId/schedule', auditLog('SAVE_SCHEDULE', req => ({ targetType: 'project', targetId: req.params.projectId })), lessonController.saveSchedule);

// Giáo án
router.get('/:projectId/lessons', lessonController.getAllLessonsByProject);
router.get('/:projectId/export-data', lessonController.getExportData);
router.get('/:projectId/lessons/:tt', lessonController.getLessonByTT);
router.post('/:projectId/lessons/:tt', auditLog('SAVE_LESSON', req => ({ targetType: 'lesson', targetId: req.params.projectId, details: { tt: req.params.tt } })), lessonController.saveLesson);

module.exports = router;
