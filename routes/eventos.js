import express from 'express';
import Evento from '../models/evento.js';
import Recinto from '../models/recinto.js';

let router = express.Router();

router.get('/', (req, res) => {
    Evento.find().populate('recinto').then(resultado => {
        if (resultado.length > 0) {
            res.status(200).send({ok: true, resultado: resultado});
        } else {
            res.status(500).send({ok: false, error: "No se han encontrado eventos"});
        }
    }).catch(error => {
        res.status(500).send({ok: false, error: "No se han encontrado eventos"});
    });
});

router.get('/localidad/:nombre', (req, res) => {
    Recinto.find({localidad: req.params.nombre}).then(recintos => {
        Evento.find({
            recinto: {$in: recintos.map(recinto => recinto._id)},
            fecha: {$gte: new Date()}
        }).populate('recinto').then(resultado => {
            if (resultado.length > 0) {
                res.status(200).send({ok: true, resultado: resultado});
            } else {
                res.status(404).send({ok: false, error: "No se han encontrado eventos"});
            }
        }).catch(error => {
            res.status(404).send({ok: false, error: "No se han encontrado eventos"});
        });
    }).catch(error => {
        res.status(404).send({ok: false, error: "No se han encontrado eventos"});
    });
});

router.get('/entradas/:idEvento/:tipoEntrada', (req, res) => {
    Evento.findById(req.params.idEvento).then(evento => {
        let entrada = evento ? evento.entradas.find(e => e.tipo === req.params.tipoEntrada) : null;
        if (entrada) {
            res.status(200).send({ok: true, resultado: {precio: entrada.precio, disponibles: entrada.disponibles}});
        } else {
            res.status(404).send({ok: false, error: `Error obteniendo datos de entrada para evento ${req.params.idEvento}`});
        }
    }).catch(error => {
        res.status(404).send({ok: false, error: `Error obteniendo datos de entrada para evento ${req.params.idEvento}`});
    });
});

router.put('/entradas/:idEvento/:tipoEntrada/:cantidad', (req, res) => {
    let mensajeError = `Error actualizando entradas del evento ${req.params.idEvento}`;
    let cantidad = Number(req.params.cantidad);
    Evento.findById(req.params.idEvento).then(evento => {
        let entrada = evento ? evento.entradas.find(e => e.tipo === req.params.tipoEntrada) : null;
        if (entrada && cantidad > 0 && entrada.disponibles >= cantidad) {
            entrada.disponibles -= cantidad;
            evento.save().then(resultado => {
                res.status(200).send({ok: true, resultado: resultado});
            }).catch(error => {
                res.status(404).send({ok: false, error: mensajeError});
            });
        } else {
            res.status(404).send({ok: false, error: mensajeError});
        }
    }).catch(error => {
        res.status(404).send({ok: false, error: mensajeError});
    });
});

router.get('/:id', (req, res) => {
    Evento.findById(req.params.id).populate('recinto').then(resultado => {
        if (resultado) {
            res.status(200).send({ok: true, resultado: resultado});
        } else {
            res.status(404).send({ok: false, error: `Evento ${req.params.id} no encontrado`});
        }
    }).catch(error => {
        res.status(404).send({ok: false, error: `Evento ${req.params.id} no encontrado`});
    });
});

router.post('/', (req, res) => {
    let nuevoEvento = new Evento(req.body);
    nuevoEvento.save().then(resultado => {
        res.status(201).send({ok: true, resultado: resultado});
    }).catch(error => {
        res.status(500).send({ok: false, error: "Error añadiendo evento"});
    });
});

router.put('/:id', (req, res) => {
    Evento.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true}).then(resultado => {
        if (resultado) {
            res.status(200).send({ok: true, resultado: resultado});
        } else {
            res.status(404).send({ok: false, error: `Error actualizando evento ${req.params.id}`});
        }
    }).catch(error => {
        res.status(404).send({ok: false, error: `Error actualizando evento ${req.params.id}`});
    });
});

router.delete('/:id', (req, res) => {
    Evento.findByIdAndDelete(req.params.id).then(resultado => {
        if (resultado) {
            res.status(200).send({ok: true, resultado: resultado});
        } else {
            res.status(404).send({ok: false, error: `Error eliminando evento ${req.params.id}`});
        }
    }).catch(error => {
        res.status(404).send({ok: false, error: `Error eliminando evento ${req.params.id}`});
    });
});

export default router;