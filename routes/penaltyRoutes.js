const express = require('express');
const {
  createPenalty,
  getAllPenalties,
  getPenaltiesByViolation,
  getPenaltyById,
  updatePenalty,
  deletePenalty
} = require('../controllers/penaltyController');

const router = express.Router();

router.post('/create', createPenalty);
router.get('/', getAllPenalties);
router.get('/violation/:violationId', getPenaltiesByViolation);
router.get('/:id', getPenaltyById);
router.put('/:id', updatePenalty);
router.delete('/:id', deletePenalty);

module.exports = router;
