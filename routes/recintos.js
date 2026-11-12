import express from 'express';
import Recinto from '../models/recinto.js';

let router = express.Router();

router.get('/', (req, res) => {
    Recinto.find().then(resultado => {
        if (resultado.length > 0) {
            res.status(200).send({ok: true, resultado: resultado});
        } else {
            res.status(500).send({ok: false, error: "No se han encontrado recintos"});
        }
    }).catch(error => {
        res.status(500).send({ok: false, error: "No se han encontrado recintos"});
    });
});

router.get('/localidad/:nombre', (req, res) => {
    Recinto.find({localidad: req.params.nombre}).then(resultado => {
        if (resultado.length > 0) {
            res.status(200).send({ok: true, resultado: resultado});
        } else {
            res.status(404).send({ok: false, error: "No se han encontrado recintos de la localidad indicada"});
        }
    }).catch(error => {
        res.status(404).send({ok: false, error: "No se han encontrado recintos de la localidad indicada"});
    });
});

router.get('/:id', (req, res) => {
    Recinto.findById(req.params.id).then(resultado => {
        if (resultado) {
            res.status(200).send({ok: true, resultado: resultado});
        } else {
            res.status(404).send({ok: false, error: `Recinto ${req.params.id} no encontrado`});
        }
    }).catch(error => {
        res.status(404).send({ok: false, error: `Recinto ${req.params.id} no encontrado`});
    });
});

router.post('/', (req, res) => {
    let nuevoRecinto = new Recinto(req.body);
    nuevoRecinto.save().then(resultado => {
        res.status(201).send({ok: true, resultado: resultado});
    }).catch(error => {
        res.status(500).send({ok: false, error: "Error añadiendo recinto"});
    });
});

router.delete('/:id', (req, res) => {
    Recinto.findByIdAndDelete(req.params.id).then(resultado => {
        if (resultado) {
            res.status(200).send({ok: true, resultado: resultado});
        } else {
            res.status(404).send({ok: false, error: `Error eliminando recinto ${req.params.id}`});
        }
    }).catch(error => {
        res.status(404).send({ok: false, error: `Error eliminando recinto ${req.params.id}`});
    });
});

export default router;