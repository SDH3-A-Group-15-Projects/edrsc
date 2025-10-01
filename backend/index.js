import express, {json} from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const webApp = express();
const port = process.env.PORT || 3000;
webApp.use(cors());
webApp.use(json());

webApp.get('/', (req, res) => res.send('NeuroMind System'));

webApp.listen(port, () => console.log('Express app listening on ${port}\\'))