const express = require('express');
const {getHospitals, getHospital, createHospital, updateHospital, deleteHospital , getVacCenters} = require('../controllers/hospitals');
const router = express.Router();
//load env vars

//Include other resources routers
const appointmentsRouter = require('./appointments');

const {protect,authorize} = require('../middleware/auth');
const app = express();

//Re-route into other resources routers
router.use('/:hospitalId/appointments',appointmentsRouter);
router.route('/vacCenters').get(getVacCenters);

router.route('/').get(getHospitals).post(protect, authorize('admin'),createHospital);
router.route('/:id').get(getHospital).put(protect, authorize('admin'),updateHospital).delete(protect, authorize('admin'),deleteHospital);

module.exports =router;