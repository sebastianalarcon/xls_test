var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var DashBoardSchema   = new Schema({
	day: {type :String, required: true },
	fecha:  {type: Date, unique: true , required: true } ,
	enter : {type: Number ,  default: 0 },
	out  :  {type: Number,  default:  0 },
	hight_in : { type: Number, default: 0 },
	total_sells : { type: Number, default: 0 },
	calls : { type: Number, default: 0 }
});


module.exports = mongoose.model('Dashboard', DashBoardSchema);
