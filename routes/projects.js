const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authenticateToken = require('../middlewares/auth');
const auditLog = require('../middlewares/audit');

router.use(authenticateToken);

router.get('/', projectController.getAllProjects);
router.post('/', auditLog('CREATE_PROJECT', req => ({ targetType: 'project', details: { name: req.body.name } })), projectController.createProject);
router.get('/:id', projectController.getProjectById);
router.put('/:id', auditLog('UPDATE_PROJECT', req => ({ targetType: 'project', targetId: req.params.id, details: { name: req.body.name } })), projectController.updateProject);
router.delete('/:id', auditLog('DELETE_PROJECT', req => ({ targetType: 'project', targetId: req.params.id })), projectController.deleteProject);

module.exports = router;
