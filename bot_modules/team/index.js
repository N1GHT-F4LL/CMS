const fs = require('fs');
const path = require('path');

class TeamManager {
  constructor() {
    this.teamsFilePath = path.join(__dirname, 'teams.json');
    this.teamsData = this.loadTeamsData();
  }

  loadTeamsData() {
    let teamsData = [];
    if (fs.existsSync(this.teamsFilePath)) {
      const teamsJson = fs.readFileSync(this.teamsFilePath);
      teamsData = JSON.parse(teamsJson);
    }
    return teamsData;
  }

  saveTeamsData() {
    fs.writeFileSync(this.teamsFilePath, JSON.stringify(this.teamsData, null, 2));
  }

  validateTeamName(teamName) {
    const validNamePattern = /^[a-zA-Z0-9\s_-]+$/; // Only allow letters, numbers, spaces, underscores, and hyphens
    if (!teamName || teamName.length > 50 || !validNamePattern.test(teamName)) {
      return false;
    }
    return true;
  }

  isMemberInAnyTeam(memberId) {
    return this.teamsData.some(team => team.members.includes(memberId));
  }

  isUserCaptain(teamName, userId) {
    const team = this.teamsData.find(team => team.name === teamName);
    return team && team.captain === userId;
  }

  createTeam(teamName, captainId) {
    if (!this.validateTeamName(teamName)) {
      throw new Error('Invalid team name. Team names can only contain letters, numbers, spaces, underscores, and hyphens, and must be less than 50 characters.');
    }

    if (this.isMemberInAnyTeam(captainId)) {
      throw new Error('You are already a member of a team.');
    }

    const newTeam = {
      name: teamName,
      members: [captainId],
      captain: captainId,
    };
    this.teamsData.push(newTeam);
    this.saveTeamsData();
    return newTeam;
  }

  listTeams() {
    return this.teamsData.map(team => ({
      name: team.name,
      captain: team.captain,
      members: team.members.filter(member => member !== team.captain),
    }));
  }

  addMemberToTeam(teamName, memberId, requestorId) {
    if (!this.validateTeamName(teamName)) {
      throw new Error('Invalid team name.');
    }

    const team = this.teamsData.find(team => team.name === teamName);
    if (!team) {
      throw new Error('Team not found.');
    }

    if (!this.isUserCaptain(teamName, requestorId)) {
      throw new Error('You are not the captain of this team.');
    }

    if (this.isMemberInAnyTeam(memberId)) {
      throw new Error('The member is already in a team.');
    }

    team.members.push(memberId);
    this.saveTeamsData();
    return team;
  }

  removeMemberFromTeam(teamName, memberId, requestorId) {
    if (!this.validateTeamName(teamName)) {
      throw new Error('Invalid team name.');
    }

    const team = this.teamsData.find(team => team.name === teamName);
    if (!team) {
      throw new Error('Team not found.');
    }

    if (!this.isUserCaptain(teamName, requestorId)) {
      throw new Error('You are not the captain of this team.');
    }

    team.members = team.members.filter(member => member !== memberId);
    this.saveTeamsData();
    return team;
  }

  deleteTeam(teamName, requestorId) {
    if (!this.validateTeamName(teamName)) {
      throw new Error('Invalid team name.');
    }

    const teamIndex = this.teamsData.findIndex(team => team.name === teamName);
    if (teamIndex === -1) {
      throw new Error('Team not found.');
    }

    const team = this.teamsData[teamIndex];
    if (team.captain !== requestorId) {
      throw new Error('You are not the captain of this team.');
    }

    const deletedTeam = this.teamsData.splice(teamIndex, 1);
    this.saveTeamsData();
    return deletedTeam[0];
  }

  updateTeamName(oldName, newName, requestorId) {
    if (!this.validateTeamName(oldName) || !this.validateTeamName(newName)) {
      throw new Error('Invalid team name.');
    }

    const team = this.teamsData.find(team => team.name === oldName);
    if (!team) {
      throw new Error('Team not found.');
    }

    if (team.captain !== requestorId) {
      throw new Error('You are not the captain of this team.');
    }

    team.name = newName;
    this.saveTeamsData();
    return team;
  }
}

module.exports = TeamManager;
