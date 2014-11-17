var express = require('express');
var router = express.Router();
var parseXlsx = require('excel');
var Dashboard = require('../models/dashboard');
var Concesionario = require('../models/concesionario');
var Vendedor = require('../models/vendedor');
var Cliente = require('../models/cliente');
var nodeExcel = require('excel-export');
var crontab = require('node-crontab');
var request = require('request');
/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});


/*    SCRIPT PARA EXPORTAR DATOS  CONF.COLS ES UN ARRAY QUE RECIBE LOS TÍTULOS DE LAS COLUMNAS CONF.ROWS ES EL CONTENIDO DE CADA COLUMNA, ACÁ SE DEBE HACER UN FOR QUE LEA CADA REGISTRO DE LA BASE DE DATOS  */
router.get('/exportar', function(req, res) {
	
      var conf ={};
	    conf.stylesXmlFile = __dirname +"/styles.xml";
	      conf.cols = [{
	        caption:'string',
	        type:'string',
	        beforeCellWrite:function(row, cellData){
	             return cellData.toUpperCase();
	        },
	        width:28.7109375
	    },{
	        caption:'date',
	        type:'date',
	        beforeCellWrite:function(){
	            var originDate = new Date(Date.UTC(1899,11,30));
	            return function(row, cellData, eOpt){
	                  if (eOpt.rowNum%2){
	                    eOpt.styleIndex = 1;
	                  }  
	                  else{
	                    eOpt.styleIndex = 2;
	                  }
	                if (cellData === null){
	                  eOpt.cellType = 'string';
	                  return 'N/A';
	                } else
	                  return (cellData - originDate) / (24 * 60 * 60 * 1000);
	            } 
	        }()
	    },{
	        caption:'bool',
	        type:'bool'
	    },{
	        caption:'number',
	         type:'number'                
	      }];
	      conf.rows = [
	         ['pi', new Date(Date.UTC(2013, 4, 1)), true, 3.14],
	         ["e", new Date(2012, 4, 1), false, 2.7182],
	        ["M&M<>'", new Date(Date.UTC(2013, 6, 9)), false, 1.61803],
	        ["null date", null, true, 1.414]  
	      ];
	      var result = nodeExcel.execute(conf);
	      res.setHeader('Content-Type', 'application/vnd.openxmlformats');
	      res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
	      res.end(result, 'binary');


	
});

/*      LOS CRONJOBS TIENEN GRANULARIDAD DE MINUTOS, POR LO CUAL NO SE PUEDEN HACER EN TIEMPO MENOR A UN MINUTO. LA RESPUESTA (BODY) ES EL ARREGLO QUE DEVUELVE EL API DE LA CÁMARA      */
router.get('/cron', function(req, res) {
	var jobId = crontab.scheduleJob("* * * * *", function(){ //This will call this function every 1 minute
	    console.log("It's been 1 minute!");
	    request('http://192.168.1.116/local/people-counter/.api?live-sum.json', function (error, response, body) {
  			if (!error && response.statusCode == 200) {
    			console.log(body) // Print the google web page.
  			}
		})
	});


});



/*      SCRIPT DE CREACIÓN DE USUARIOS PARA LA APP DE LLAMA A UN VENDEDOR         */
router.get('/xls_users', function(req, res) {
	for (i = 1; i <= 369; i++) {
    	parseXlsx(__dirname + '/File'+i+'.xlsx', function(err, data) {
  		if(err) throw err;
    	// data is an array of arrays
    	// console.log(data.length);

     	data.forEach(function(entry) {
		 	var cliente = new Cliente({
		 	 	name: entry[1],
		 	 	dni: entry[0],
		 	 	celphone: entry[2],
		 	 	correo: entry[3]
		 	 	}).save(function(err,obj){
		 	 		if (err) return console.error(err);
		 		});
		 	});
    		
		});	
	}

	
	

	res.render('index', { title: 'Express' });
});


/*      SCRIPT DE CREACIÓN DE VENDEDORES PARA LA APP DE LLAMA A UN VENDEDOR         */


router.get('/xls', function(req, res) {
	
	parseXlsx(__dirname + '/autogrande.xlsx', function(err, data) {
  		if(err) throw err;
    	// data is an array of arrays
    	console.log(data.length);

		// Autogrande: 5469cf67cde5780e1332cce7
		// Autoniza: 5469cf67cde5780e1332cce8
		// Centrodiesel: 5469cf67cde5780e1332cce9
		// Internacional: 5469cf67cde5780e1332ccea

    	data.forEach(function(entry) {
			var vendedor = new Vendedor({
			 	name: entry[0],
			 	cedula: entry[1],
			 	celular: entry[1],
			 	concesionario: '5469cf67cde5780e1332cce7',
			 	concesionario_name: 'Autogrande',
			 	asistio: false,
			 	disponible: false
			 	}).save(function(err,obj){
			 		if (err) return console.error(err);
				});
			});
    		
		});

	// var vendedor = new Vendedor({
	// 	name: 'James Rodriguez',
	// 	cedula: '111111',
	// 	celular: '123123123',
	// 	concesionario: '542c8076aa653d0000759661',
	// 	concesionario_name: 'Autoniza',
	// 	asistio: false,
	// 	disponible: false
	// }).save(function(err,obj){
	// 	if (err) return console.error(err);
	// });
	/*Create Concesionarios*/
	/*
	var concesionario = new Concesionario({
	 	name: 'Autogrande',
	 	username: 'autogrande',
	 	turno : 1,
	 	atendiendo : true
	}).save(function(err,obj){
	 	if (err) return console.error(err);
	});

	var concesionario = new Concesionario({
		name: 'Autoniza',
	 	username: 'autoniza',
	 	turno : 2
	}).save(function(err,obj){
	 	if (err) return console.error(err);
	});

	var concesionario = new Concesionario({
		name: 'Centrodiesel',
	 	username: 'centrodiesel',
	 	turno : 3
	}).save(function(err,obj){
	 	if (err) return console.error(err);
	});

	var concesionario = new Concesionario({
		name: 'Internacional',
	 	username: 'internacional',
	 	turno : 4
	}).save(function(err,obj){
	 	if (err) return console.error(err);
	});
	*/

	  /*
	  var dashboard = new Dashboard({
    	day: "obtenerFechaString()",
    	fecha:  Date()
  		}).save(function (err, obj) {
    		if (err) return console.error(err);
      		console.log(obj);
  		});
		*/
	res.render('index', { title: 'Express' });
});




module.exports = router;
