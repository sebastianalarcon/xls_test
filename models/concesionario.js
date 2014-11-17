var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ConcesionarioSchema   = new Schema({
	name : {type: String , required: true },
	turno : {type: Number , required: true },
	username: {type: String , required: true },
	atendiendo : {type: Boolean , required: true, default: false },
	estado : {type: String , required: true, default: "activo"},
	carros_atendiendo : { type: [String]},
	cola_vendedores : { type: [String]}
});


module.exports = mongoose.model('Concesionario', ConcesionarioSchema);
