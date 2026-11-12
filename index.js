import express from 'express';
import mongoose from 'mongoose';
import eventoRouter from './routes/eventos.js';
import recintoRouter from './routes/recintos.js';
import 'dotenv/config';

mongoose.connect(process.env.URL_BD || 'mongodb://127.0.0.1:27017/eventos');

const app = express();

app.use(express.json());

app.use('/eventos', eventoRouter);
app.use('/recintos', recintoRouter);


app.listen(process.env.port || 3000, () => {
    console.log('Servidor escuchando en el puerto ' + (process.env.port || 3000));
});