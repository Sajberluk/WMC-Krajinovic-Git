import { readFileSync } from "node:fs";
// In a real app, this data comes from a REST API. Here we read it from a file.
const tournament = JSON.parse(readFileSync("tournament.json", "utf8"));
/**
 * Calculates the KDA value: (kills + assists) / deaths.
 * A player with 0 deaths counts as if they had 1 death.
 */
function calcKda(stats) {
    const deaths = Math.max(stats.deaths, 1);
    return (stats.kills + stats.assists) / deaths;
}
/** Adds up the kills of all players in a team. */
function totalKills(team) {
    return team.players.reduce((sum, player) => sum + player.stats.kills, 0);
}
/** Formats one player, e.g. "byteMe [NPN] tank, KDA 5.25". */
function formatPlayer(player) {
    const clanTag = player.clan ? player.clan.tag : "-";
    return `${player.gamertag} [${clanTag}] ${player.role}, KDA ${calcKda(player.stats).toFixed(2)}`;
}
/** Finds a team by its tag, e.g. "5AAIF". */
function findTeam(tag) {
    const team = tournament.teams.find(t => t.tag === tag);
    if (!team) {
        throw new Error(`Team with tag ${tag} not found`);
    }
    return team;
}
/** Returns the tag of the team that won the match. */
function winner(match) {
    if (!match.score)
        return "draw";
    if (match.score.teamA > match.score.teamB)
        return match.teamA;
    if (match.score.teamB > match.score.teamA)
        return match.teamB;
    return "draw";
}
/** Formats a match, e.g. "Round 1: Null Pointer Ninjas 13:9 Ctrl Alt Defeat". */
function formatMatch(match) {
    const nameA = findTeam(match.teamA).name;
    const nameB = findTeam(match.teamB).name;
    const scoreStr = match.score ? `${match.score.teamA}:${match.score.teamB}` : "vs";
    let line = `Round ${match.round}: ${nameA} ${scoreStr} ${nameB}`;
    if (match.status === "finished") {
        line += ` -> winner: ${winner(match)}`;
    }
    return line;
}
/** Finds a player by gamertag across all teams. */
function findPlayer(gamertag) {
    for (const team of tournament.teams) {
        const player = team.players.find(p => p.gamertag === gamertag);
        if (player) {
            return player;
        }
    }
    return undefined;
}
/** Prints a team and all its players. */
function printTeam(team) {
    console.log(`${team.name} (${team.tag}), total kills: ${totalKills(team)}`);
    team.players.forEach(player => console.log("  " + formatPlayer(player)));
}
// A new player joins team 5BAIF.
const newPlayer = {
    gamertag: "noob42",
    role: "support",
    stats: { kills: 0, deaths: 0, assists: 0 }
};
findTeam("5BAIF").players.push(newPlayer);
console.log(`=== ${tournament.name} in room ${tournament.venue.room} ===`);
tournament.teams.forEach(team => printTeam(team));
tournament.matches.forEach(match => console.log(formatMatch(match)));
const firstMatch = tournament.matches[0];
if (firstMatch && firstMatch.mvp) {
    const mvpPlayer = findPlayer(firstMatch.mvp);
    if (mvpPlayer) {
        console.log(`MVP of round 1: ${formatPlayer(mvpPlayer)}`);
    }
}
//# sourceMappingURL=app.js.map