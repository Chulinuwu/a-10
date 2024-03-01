const express = require('express');

const {getAppointments,getAppointment,addAppointment,updateAppointment,deleteAppointment} = require('../controllers/appointments');

const router = express.Router({mergeParams: true});
const {protect,authorize} = require('../middleware/auth');

router.route('/').get(protect, getAppointments).post(addAppointment);
router.route('/:id').get(protect,getAppointment).put(updateAppointment).delete(deleteAppointment);

module.exports = router;