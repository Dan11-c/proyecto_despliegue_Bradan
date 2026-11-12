import mongoose from 'mongoose';

let entradasSchema = new mongoose.Schema({
    tipo: {
        type: String,
        required: true,
        minlength: 3,
        trim: true
    },
    precio: {
        type: Number,
        required: true,
        min: 0
    },
    disponibles: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: function (value) 
            {
                return Number.isInteger(value);
            },
            message: 'El valor debe ser un número entero.'
        }
    }
});

let eventoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        minlength: 5,
        trim: true
    },
    fecha: {
        type: Date,
        required: true
    },
    recinto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recinto',
        required: true
    },
    entradas: [entradasSchema]
});


let Evento = mongoose.model('Evento', eventoSchema);
export default Evento;