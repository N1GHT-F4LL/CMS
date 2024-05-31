require('dotenv').config();
const { REST, Routes } = require('discord.js');

const commands = [
  {
    name: 'create-team',
    description: 'Creates a new team',
    options: [
      {
        name: 'name',
        type: 3, // STRING type is 3
        description: 'Name of the team',
        required: true,
      },
    ],
  },
  {
    name: 'list-teams',
    description: 'Lists all teams',
  },
  {
    name: 'add-member',
    description: 'Adds a member to your team',
    options: [
      {
        name: 'member',
        type: 6, // USER type is 6
        description: 'Member to add',
        required: true,
      },
    ],
  },
  {
    name: 'remove-member',
    description: 'Removes a member from your team',
    options: [
      {
        name: 'member',
        type: 6, // USER type is 6
        description: 'Member to remove',
        required: true,
      },
    ],
  },
  {
    name: 'delete-team',
    description: 'Deletes your team',
  },
  {
    name: 'update-team-name',
    description: 'Updates the name of your team',
    options: [
      {
        name: 'new_name',
        type: 3, // STRING type is 3
        description: 'New name of the team',
        required: true,
      },
    ],
  },
  {
    name: 'add-event',
    description: 'Adds a new event',
    options: [
      {
        name: 'url',
        type: 3, // STRING type is 3
        description: 'URL of the event',
        required: true,
      },
      {
        name: 'start_date',
        type: 3, // STRING type is 3
        description: 'Start date of the event (YYYY-MM-DD)',
        required: true,
      },
      {
        name: 'start_time',
        type: 3, // STRING type is 3
        description: 'Start time of the event (HH:mm)',
        required: true,
      },
      {
        name: 'end_date',
        type: 3, // STRING type is 3
        description: 'End date of the event (YYYY-MM-DD)',
        required: true,
      },
      {
        name: 'end_time',
        type: 3, // STRING type is 3
        description: 'End time of the event (HH:mm)',
        required: true,
      },
      {
        name: 'is_ctfd',
        type: 5, // BOOLEAN type is 5
        description: 'Is the event hosted on CTFd?',
        required: false,
      },
    ],
  },
  {
    name: 'list-events',
    description: 'Lists all events',
  },
];

const rest = new REST({ version: '10' }).setToken(process.env.CLIENT_TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    // Clear existing global commands
    const existingCommands = await rest.get(
      Routes.applicationCommands(process.env.CLIENT_ID)
    );

    for (const command of existingCommands) {
      await rest.delete(
        `${Routes.applicationCommands(process.env.CLIENT_ID)}/${command.id}`
      );
    }

    console.log('Existing commands cleared.');

    // Register new commands
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();