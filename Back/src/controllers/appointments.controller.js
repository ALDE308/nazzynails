﻿const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('../_middleware/validate-request');
const authorize = require('../_middleware/authorize');
const appointmentService = require('../services/appointment.service');

// routes
router.post('/create', authorize(), newAppointmentSchema, newAppointment);
router.get('/', authorize(), getAll);
router.get('/date', authorize(), getAllbyDate);
router.get('/:id', authorize(), getById);
router.put('/:id', authorize(), updateSchema, update);
router.delete('/:id', authorize(), _delete);

module.exports = router;

function newAppointmentSchema(req, res, next) {
    const schema = Joi.object({
        clientId: Joi.number().integer().required(),
        time: Joi.date().required(),
        serviceList: Joi.array().items(Joi.number().integer())
    });
    validateRequest(req, next, schema);
}

function newAppointment(req, res, next) {
    appointmentService.create(req.user, req.body)
        .then(() => res.json({message: 'Appointment created successful' }))
        .catch(next);
}

function getAll(req, res, next) {
    var data = []
    appointmentService.getAll(req.user)
        .then(appointments => {
            for (appointment of appointments) {
                var client = {
                    "id": appointment.clientId.id,
                    "name": appointment.clientId.name,
                    "address": appointment.clientId.address,
                    "email": appointment.clientId.email,
                    "phoneNumber": appointment.clientId.phoneNumber
                }
                var serviceList = [];
                for(service of appointment.serviceList){
                    serviceList.push({
                        "id": service.id,
                        "name": service.name,
                        "length": service.length,
                        "enable": service.enable,
                        "price": service.price
                    });
                };
                data.push({ 
                    "id": appointment.id,
                    "name": appointment.name,
                    "client": client,
                    "time": appointment.time,
                    "serviceList": serviceList,
                    "appointmentIsDone": appointment.appointmentIsDone,
                })
            };
            res.json(data);})
        .catch(next);
}

function getAllbyDate(req, res, next) {
    var data = [];
    appointmentService.getAllbyDate(req.user)
        .then(appointments => {
            for (appointment of appointments){
                var client = {
                    "id": appointment.clientId.id
                }
                var serviceList = [];
                for(service of appointment.serviceList){
                    serviceList.push({
                        "id": service.id,
                        "name": service.name,
                        "length": service.length,
                        "enable": service.enable,
                        "price": service.price
                    });
                };
                data.push({ 
                    "id": appointment.id,
                    "time": appointment.time,
                    "serviceList": serviceList,
                })
            };
            res.json(data);})
        .catch(next);
}

function getById(req, res, next) {
    appointmentService.getById(req.user, req.params.id)
        .then((appointment) => {
            res.json(appointment)
        })
        .catch(next);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        clientId: Joi.number().integer().empty(),
        time: Joi.date().empty(),
        serviceList: Joi.array().items(Joi.number().integer()).empty(),
        appointmentIsDone: Joi.bool().empty()
    });
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    appointmentService.update(req.user, req.params.id, req.body)
        .then(appointment => res.json(appointment))
        .catch(next);
}

function _delete(req, res, next) {
    appointmentService.delete(req.user, req.params.id)
        .then(() => res.json({ message: 'Appointment deleted successfully' }))
        .catch(next);
}