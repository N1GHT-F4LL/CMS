const fs = require('fs');
const path = require('path');
const { Console } = require('console');
require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { handleInteractionCreate } = require('./handlers/interactionHandlers');
const TeamManager = require('./bot_modules/team');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

const teamManager = new TeamManager();
const prefix = process.env.PREFIX || '/';

// Create a log file and set up a new Console for logging to that file
const logFileName = 'bot.log';
const logFilePath = path.join(__dirname, logFileName);
const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });
const errorLogStream = fs.createWriteStream(path.join(__dirname, 'error.log'), { flags: 'a' });
const logger = new Console({ stdout: logStream, stderr: errorLogStream });

client.once('ready', () => {
  logger.log('Bot is now online!');
});

client.on('interactionCreate', (interaction) => handleInteractionCreate(interaction, teamManager));

client.login(process.env.CLIENT_TOKEN).catch(error => {
  logger.error(`Failed to log in: ${error}`);
});
