async function handleCreateTeam(interaction, teamManager) {
  const teamName = interaction.options.getString('name');
  try {
    const newTeam = teamManager.createTeam(teamName, interaction.user.id);
    await interaction.reply(`Team ${newTeam.name} has been created!`);
  } catch (error) {
    await interaction.reply(error.message);
  }
}

async function handleListTeams(interaction, teamManager) {
  const teams = teamManager.listTeams();
  if (teams.length === 0) {
    await interaction.reply('No teams have been created yet.');
    return;
  }
  let teamList = 'List of Teams:\n';
  teams.forEach(team => {
    teamList += `- ${team.name}: Captain <@${team.captain}>, Members: `;
    team.members.forEach(member => {
      teamList += `<@${member}> `;
    });
    teamList += '\n';
  });
  await interaction.reply(teamList);
}

async function handleAddMember(interaction, teamManager) {
  const memberId = interaction.options.getUser('member').id;
  try {
    const team = teamManager.teamsData.find(team => team.captain === interaction.user.id);
    if (!team) {
      throw new Error('You are not a captain of any team.');
    }
    const updatedTeam = teamManager.addMemberToTeam(team.name, memberId, interaction.user.id);
    await interaction.reply(`Member <@${memberId}> has been added to your team ${team.name}.`);
  } catch (error) {
    await interaction.reply(error.message);
  }
}

async function handleRemoveMember(interaction, teamManager) {
  const memberId = interaction.options.getUser('member').id;
  try {
    const team = teamManager.teamsData.find(team => team.captain === interaction.user.id);
    if (!team) {
      throw new Error('You are not a captain of any team.');
    }
    const updatedTeam = teamManager.removeMemberFromTeam(team.name, memberId, interaction.user.id);
    await interaction.reply(`Member <@${memberId}> has been removed from your team ${team.name}.`);
  } catch (error) {
    await interaction.reply(error.message);
  }
}

async function handleDeleteTeam(interaction, teamManager) {
  try {
    const team = teamManager.teamsData.find(team => team.captain === interaction.user.id);
    if (!team) {
      throw new Error('You are not a captain of any team.');
    }
    const deletedTeam = teamManager.deleteTeam(team.name, interaction.user.id);
    await interaction.reply(`Team ${team.name} has been deleted.`);
  } catch (error) {
    await interaction.reply(error.message);
  }
}

async function handleUpdateTeamName(interaction, teamManager) {
  const newName = interaction.options.getString('new_name');
  try {
    const team = teamManager.teamsData.find(team => team.captain === interaction.user.id);
    if (!team) {
      throw new Error('You are not a captain of any team.');
    }
    const updatedTeam = teamManager.updateTeamName(team.name, newName, interaction.user.id);
    await interaction.reply(`Team name updated from ${team.name} to ${newName}.`);
  } catch (error) {
    await interaction.reply(error.message);
  }
}

async function handleInteractionCreate(interaction, teamManager) {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'create-team') {
    await handleCreateTeam(interaction, teamManager);
  } else if (commandName === 'list-teams') {
    await handleListTeams(interaction, teamManager);
  } else if (commandName === 'add-member') {
    await handleAddMember(interaction, teamManager);
  } else if (commandName === 'remove-member') {
    await handleRemoveMember(interaction, teamManager);
  } else if (commandName === 'delete-team') {
    await handleDeleteTeam(interaction, teamManager);
  } else if (commandName === 'update-team-name') {
    await handleUpdateTeamName(interaction, teamManager);
  }
}

module.exports = { handleInteractionCreate };
