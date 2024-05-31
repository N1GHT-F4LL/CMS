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

  createTeam(teamName, captainId) {
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
    return this.teamsData;
  }

}

module.exports = TeamManager;
