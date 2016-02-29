'use strict'

var express = require('express');
var m2x = require('m2x')
var models = require('../models.js');
var mongoose = require('mongoose');
var request = require('request')

var router = express.Router();
var Can = mongoose.model('Can');
var CanType = mongoose.model('CanType');
var District = mongoose.model('District');
var client = new m2x(process.env.API_KEY)


var district_list = {
    HKIS: [22.2377876, 114.223576],
    Islands: [22.247847, 113.917959],
    Kwai_Tsing: [22.370268, 114.136884],
    North: [22.491737, 114.138477],
    Sai_Kung: [22.357500, 114.240053],
    Sha_Tin: [22.399165, 114.192793],
    Tai_Po: [22.453442, 114.188895],
    Tsuen_Wan: [22.364977, 114.115709],
    Yuen_Long: [22.390829, 113.972513],
    Kowloon_City: [22.447849, 114.003888],
    Kwun_Tong: [22.323095, 114.164023],
    Sham_Shui_Po: [22.310528, 114.225687],
    Wong_Tai_Sin: [22.340360, 114.150431],
    Yau_Tsim_Mong: [22.342033, 114.196518],
    Southern: [22.286669, 114.149465],
    Wan_Chai: [22.278417, 114.170817]
};

var type_list = {
    'paper': "#4d7e9",
    'metal': "#fee434",
    'glass': "#5dd64b",
    'plastic': "#6f4842",
    'normal': "#d6cec1"
};

function send_err(res, msg) {
    msg = msg ? msg : ''
    res.send(JSON.stringify({
        status: 'FAILED',
        err_msg: msg
    }))
}

router.route('/_callback')
    .post(function(req, res) {
        var data = req.body
        if (data.event == 'fired') {
            var can = Can.findOne({
                _id: data.device.id
            })
            can.filled = can.filled ? 0 : 1
            can.save(function(err) {
                if (err) throw err
            })
            res.send(JSON.stringify({status: 'OK'}))
        } else {
            send_err(res)
        }

    })
    .get(function(req, res) {
        res.send(JSON.stringify({
            status: 'OK'
        }))
    })

router.route('/_client')
    .post(function(req, res) { //Create new device
        try {
            var data = req.body
            var can = new Can({
                lat: parseFloat(data.lat),
                lng: parseFloat(data.lng),
                _district: data.district,
                _type: data.type
            })
            var device_id = Math.random().toString(36).slice(-10)
            client.devices.create({
                name: device_id,
                visibility: 'public',
                metadata: {
                    "lat": data.lat,
                    "lng": data.lng,
                    "district": data.district
                },
                tags: data.type
            })
            client.devices.updateStream(device_id, 'ldr_voltage', {
                name: 'ldr_voltage',
                unit:{
                    'label': 'bit',
                    'symbol': 'b'
                }
            })
            request.post({
                url: 'https://api-m2x.att.com/v2/devices/'+device_id+'/triggers',
                json: true,
                body: {
                    'name': 'filled',
                    'conditions': {
                        'ldr_voltage': {'changed': true}
                    },
                    'frequency': 'continuous',
                    'callback_url': process.env.CALLBACK_URL,
                    'status': 'enabled'
                }
            })
            can._id = device_id
            can.save()
            res.send(JSON.stringify({status: 'OK'}))
        } catch (err) {
            send_err(res, err.message)
        }
    })
    .put(function(req, res) { //Update stream value
        data = req.body
        try {
            var can = Can.findOne({
                _id: data.id
            })
            client.devices.setStreamValue(data.id, 'ldr_voltage', {
                value: data.filled
            })
            can.filled = data.filled
            can.save()
            res.send(JSON.stringify({status: 'OK'}))
        } catch (err) {
            send_err(res, err.message)
        }
    })
    .delete(function(req, res) { //Delete existing device
        data = req.body
        try {
            client.deleteDevice(data.id)
            Can.findOneAndRemove({
                _id: id
            })
            res.send(JSON.stringify({status: 'OK'}))
        } catch (err) {
            send_err(res, err.message)
        }
    })

/* GET home page. */
router.get('/', function(req, res) {
    res.redirect('/HKIS')
})
router.get('/:district', function (req, res) {
    var district = req.params.district;
    var markers = {};
    var can_stream = Can.find().stream()
    can_stream.on('data', function(can) {
        markers[can.id] = [
            can.lat,
            can.lng,
            can.filled,
            '../public/markers/'+can.filled+'-'+can._type.name+'.png'
        ]
    });
    res.render('index', {
        title: district,
        markers: markers,
        district_coords: district_list[district]
    });
});

module.exports = router;
