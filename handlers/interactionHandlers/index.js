async function handleCreateTeam(interaction, teamManager) {
  const teamName = interaction.options.getString("name");
  try {
    const newTeam = teamManager.createTeam(teamName, interaction.user.id);
    await interaction.reply({
      content: `Team ${newTeam.name} has been created!`,
      ephemeral: true,
    });
  } catch (error) {
    await interaction.reply({ content: error.message, ephemeral: true });
  }
}

async function handleListTeams(interaction, teamManager) {
  const teams = teamManager.listTeams();
  if (teams.length === 0) {
    await interaction.reply({
      content: "No teams have been created yet.",
      ephemeral: true,
    });
    return;
  }
  let teamList = "List of Teams:\n";
  teams.forEach((team) => {
    teamList += `- ${team.name}: Captain <@${team.captain}>, Members: `;
    if (team.members.length === 0) {
      teamList += "None\n";
    } else {
      team.members.forEach((member) => {
        teamList += `<@${member}> `;
      });
      teamList += "\n";
    }
  });
  await interaction.reply({ content: teamList, ephemeral: true });
}

async function handleAddMember(interaction, teamManager) {
  const memberId = interaction.options.getUser("member").id;
  try {
    const team = teamManager.teamsData.find(
      (team) => team.captain === interaction.user.id
    );
    if (!team) {
      throw new Error("You are not a captain of any team.");
    }
    const updatedTeam = teamManager.addMemberToTeam(
      team.name,
      memberId,
      interaction.user.id
    );
    await interaction.reply({
      content: `Member <@${memberId}> has been added to your team ${team.name}.`,
      ephemeral: true,
    });
  } catch (error) {
    await interaction.reply({ content: error.message, ephemeral: true });
  }
}

async function handleRemoveMember(interaction, teamManager) {
  const memberId = interaction.options.getUser("member").id;
  try {
    const team = teamManager.teamsData.find(
      (team) => team.captain === interaction.user.id
    );
    if (!team) {
      throw new Error("You are not a captain of any team.");
    }
    const updatedTeam = teamManager.removeMemberFromTeam(
      team.name,
      memberId,
      interaction.user.id
    );
    await interaction.reply({
      content: `Member <@${memberId}> has been removed from your team ${team.name}.`,
      ephemeral: true,
    });
  } catch (error) {
    await interaction.reply({ content: error.message, ephemeral: true });
  }
}

async function handleDeleteTeam(interaction, teamManager) {
  try {
    const team = teamManager.teamsData.find(
      (team) => team.captain === interaction.user.id
    );
    if (!team) {
      throw new Error("You are not a captain of any team.");
    }
    const deletedTeam = teamManager.deleteTeam(team.name, interaction.user.id);
    await interaction.reply({
      content: `Team ${team.name} has been deleted.`,
      ephemeral: true,
    });
  } catch (error) {
    await interaction.reply({ content: error.message, ephemeral: true });
  }
}

async function handleUpdateTeamName(interaction, teamManager) {
  const newName = interaction.options.getString("new_name");
  try {
    const team = teamManager.teamsData.find(
      (team) => team.captain === interaction.user.id
    );
    if (!team) {
      throw new Error("You are not a captain of any team.");
    }
    const oldName = team.name;
    const updatedTeam = teamManager.updateTeamName(
      oldName,
      newName,
      interaction.user.id
    );
    await interaction.reply({
      content: `Team name updated from ${oldName} to ${newName}.`,
      ephemeral: true,
    });
  } catch (error) {
    await interaction.reply({ content: error.message, ephemeral: true });
  }
}

async function handleAddEvent(interaction, eventManager) {
  const url = interaction.options.getString("url");
  const startDate = interaction.options.getString("start_date");
  const startTime = interaction.options.getString("start_time");
  const endDate = interaction.options.getString("end_date");
  const endTime = interaction.options.getString("end_time");
  const isCTFd = interaction.options.getBoolean("is_ctfd") || false;
  const addedBy = interaction.user.id;
  try {
    const newEvent = eventManager.addEvent(
      url,
      startDate,
      startTime,
      endDate,
      endTime,
      isCTFd,
      addedBy
    );
    await interaction.reply({
      content: `Event added: ${newEvent.url} (isCTFd: ${newEvent.isCTFd}, start: ${newEvent.start}, end: ${newEvent.end})`,
      ephemeral: true,
    });
  } catch (error) {
    await interaction.reply({ content: error.message, ephemeral: true });
  }
}

async function handleListEvents(interaction, eventManager) {
  const events = eventManager.listEvents();
  if (events.length === 0) {
    await interaction.reply({
      content: "No events have been added yet.",
      ephemeral: true,
    });
    return;
  }

  let eventList = "List of Events:\n\n";
  events.forEach((event) => {
    const startDate = new Date(event.start);
    const endDate = new Date(event.end);
    const formattedStart = startDate.toLocaleString("en-US", {
      timeZone: "UTC",
      dateStyle: "full",
      timeStyle: "short",
    });
    const formattedEnd = endDate.toLocaleString("en-US", {
      timeZone: "UTC",
      dateStyle: "full",
      timeStyle: "short",
    });

    eventList +=
      `**Event URL:** ${event.url}\n` +
      `**Start:** ${formattedStart}\n` +
      `**End:** ${formattedEnd}\n` +
      `**CTFd Event:** ${event.isCTFd ? "Yes" : "No"}\n` +
      `**Added On:** ${new Date(event.dateAdded).toLocaleString()}\n` +
      `--------------------------------------\n\n`;
  });
  await interaction.reply({ content: eventList, ephemeral: true });
}

async function handleInteractionCreate(interaction, teamManager, eventManager) {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === "create-team") {
    await handleCreateTeam(interaction, teamManager);
  } else if (commandName === "list-teams") {
    await handleListTeams(interaction, teamManager);
  } else if (commandName === "add-member") {
    await handleAddMember(interaction, teamManager);
  } else if (commandName === "remove-member") {
    await handleRemoveMember(interaction, teamManager);
  } else if (commandName === "delete-team") {
    await handleDeleteTeam(interaction, teamManager);
  } else if (commandName === "update-team-name") {
    await handleUpdateTeamName(interaction, teamManager);
  } else if (commandName === "add-event") {
    await handleAddEvent(interaction, eventManager);
  } else if (commandName === "list-events") {
    await handleListEvents(interaction, eventManager);
  }
}

module.exports = { handleInteractionCreate };
