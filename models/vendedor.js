var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var VendedorSchema   = new Schema({
	name: String,
	cedula: String,
	celular: String,
	concesionario: {type: mongoose.Schema.Types.ObjectId, ref: 'Concesionario'},
	concesionario_name: {type: String, default: 'Concesionario' },
	asistio: Boolean,
	fechasAsistio: [Date],
	ventas: { type : Array , default: [] },
	num_ventas : { type : Number , default: 0 },
	disponible: { type : Boolean, default: true }
});


VendedorSchema.methods.aux = function () {
  	var algo = this.name
    	? "El nombre del vendedor es " + this.name
     	: "El vendedor no tiene nombre"

     	return algo;
}


module.exports = mongoose.model('Vendedor', VendedorSchema);
