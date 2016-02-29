var express = require('express');
var router = express.Router();

district_list = {
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

type_list = {
    'paper': "#4d7e9",
    'metal': "#fee434",
    'glass': "#5dd64b",
    'plastic': "#6f4842",
    'normal': "#d6cec1"
};

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

module.exports = router;
