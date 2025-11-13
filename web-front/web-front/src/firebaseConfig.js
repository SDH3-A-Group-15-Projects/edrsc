import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import config from '../key.json' with { type: 'json' };

const app = initializeApp(config);
const auth = getAuth(app);

export { app, auth };
