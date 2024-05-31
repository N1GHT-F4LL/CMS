require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
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

client.on('messageCreate', message => {
  console.log(`Received message: ${message.content}`); // Log the received message
  if (message.content.startsWith(`${prefix}createteam`)) {
    const teamName = message.content.split(' ')[1];
    const newTeam = teamManager.createTeam(teamName, message.author.id);
    message.channel.send(`Team ${newTeam.name} has been created!`);
  }
});

client.on('messageCreate', message => {
  console.log(`Received message: ${message.content}`); // Log the received message
  if (message.content === `${prefix}listteam`) {
    const teams = teamManager.listTeams();
    let teamList = 'List of Teams:\n';
    teams.forEach(team => {
      teamList += `- ${team.name}: Captain <@${team.captain}>, Members: `;
      team.members.forEach(member => {
        teamList += `<@${member}> `;
      });
      teamList += '\n';
    });
    message.channel.send(teamList);
  }
});

client.login(process.env.CLIENT_TOKEN).then(() => {
  console.log('Bot is now online!');
}).catch(console.error);
