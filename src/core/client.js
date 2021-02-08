import Discord from 'discord.js';
import {clientConfig} from './config';

/* Initialize Discord client
______________________________________________________________________________________________________________________*/
const client = new Discord.Client(clientConfig);
console.info('Connection to Discord...');
client
    .login(process.env.ACCESS_TOKEN)
    .then(() => console.info('Connected to Discord'))
    .catch((e) => throw `Discord connexion error: ${e}`);

export default client;