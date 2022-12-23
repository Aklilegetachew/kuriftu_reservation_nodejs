import express from 'express';
import dotenv from 'dotenv';
import config from 'config';
import cors from 'cors';
import dd from 'body-parser';
import cookieParser from 'cookie-parser';
import router from './routes/router';

dotenv.config();
const app = express();
app.use(
    cors(
        {
            origin: ['http://localhost:3000'],
            optionsSuccessStatus: 200,
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
        }
    )
);

app.options('*', cors());
app.use(dd.json());
app.use(cookieParser());

app.use(router);


if (process.env.NODE_ENV === 'development') {
    app.listen(config.get('port'), () => {
        console.log(`Server Started on Port: ${config.get('port')} - ${process.env.NODE_ENV}`);
    });
} else if (process.env.NODE_ENV === 'vercelup') {
    app.listen(config.get('port'), () => {
        console.log(`Server Started on Port: ${config.get('port')} - ${process.env.NODE_ENV}`);
    });
} else if (process.env.NODE_ENV === 'production') {
    app.listen();
}