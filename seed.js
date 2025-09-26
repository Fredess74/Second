#!/usr/bin/env node
/* eslint-disable no-console */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { nanoid } = require('nanoid/non-secure');
const admin = require('firebase-admin');

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || process.env.GOOGLE_APPLICATION_CREDENTIALS;
const projectId = process.env.FIREBASE_PROJECT_ID;

if (!projectId) {
  console.error('FIREBASE_PROJECT_ID is required in your environment variables.');
  process.exit(1);
}

if (!admin.apps.length) {
  if (serviceAccountPath) {
    const absolutePath = path.isAbsolute(serviceAccountPath)
      ? serviceAccountPath
      : path.join(process.cwd(), serviceAccountPath);
    const serviceAccount = JSON.parse(fs.readFileSync(absolutePath, 'utf-8'));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId
    });
  } else {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId
    });
  }
}

const db = admin.firestore();

const leagueTiers = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Elite', 'Legend', 'Mythic'];
const firstNames = ['Alex', 'Taylor', 'Jordan', 'Morgan', 'Casey', 'River', 'Hayden', 'Skyler', 'Emerson', 'Phoenix'];
const lastNames = ['Kim', 'Lopez', 'Patel', 'Garcia', 'Nguyen', 'Smith', 'Johnson', 'Martinez', 'Brown', 'Singh'];

const randomFrom = array => array[Math.floor(Math.random() * array.length)];

const generateUsers = count =>
  Array.from({ length: count }).map(() => {
    const uid = nanoid(20);
    const displayName = `${randomFrom(firstNames)} ${randomFrom(lastNames)}`;
    const league = randomFrom(leagueTiers);
    const totalPoints = Math.floor(Math.random() * 50000) + 500;
    const weeklyLeaguePoints = Math.floor(Math.random() * 5000);
    const scanDays = Math.floor(Math.random() * 7);

    return {
      uid,
      email: `${displayName.toLowerCase().replace(/\s/g, '.')}.${Math.floor(Math.random() * 9999)}@example.com`,
      displayName,
      totalPoints,
      league,
      weeklyLeaguePoints,
      squadId: null,
      scanStreak: {
        days: scanDays,
        lastScanDate: new Date(Date.now() - scanDays * 86400000).toISOString()
      },
      createdAt: new Date().toISOString()
    };
  });

const createSquads = (users, squadCount = 6) => {
  const squads = [];
  const shuffledUsers = [...users];

  for (let i = 0; i < squadCount; i += 1) {
    const squadId = nanoid(8);
    const takeCount = Math.min(shuffledUsers.length, Math.floor(Math.random() * 6) + 4);
    if (takeCount === 0) break;
    const members = shuffledUsers.splice(0, takeCount);
    const goalTarget = [10000, 25000, 50000][Math.floor(Math.random() * 3)];

    members.forEach(member => {
      // eslint-disable-next-line no-param-reassign
      member.squadId = squadId;
    });

    const shoppingList = members.slice(0, Math.min(2, members.length)).map(member => ({
      id: nanoid(6),
      itemName: randomFrom(['Energy drinks', 'Snacks', 'Study supplies', 'Party decor', 'Pizza fund']),
      addedBy: member.uid,
      createdAt: new Date().toISOString()
    }));

    squads.push({
      squadId,
      squadName: `Squad ${i + 1}`,
      members: members.map(member => member.uid),
      mascotStatus: 'happy',
      sharedGoal: {
        targetPoints: goalTarget,
        currentPoints: Math.floor(goalTarget * Math.random())
      },
      shoppingList
    });
  }

  return squads;
};

const getWeekRange = () => {
  const current = new Date();
  const day = current.getUTCDay();
  const diffToMonday = (day + 6) % 7;
  const weekStart = new Date(Date.UTC(current.getUTCFullYear(), current.getUTCMonth(), current.getUTCDate() - diffToMonday));
  const weekEnd = new Date(weekStart);
  weekEnd.setUTCDate(weekStart.getUTCDate() + 7);
  const key = `${weekStart.getUTCFullYear()}-W${String(getWeekNumber(current)).padStart(2, '0')}`;
  return { weekStart, weekEnd, key };
};

const getWeekNumber = date => {
  const tmpDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const dayNum = tmpDate.getUTCDay() || 7;
  tmpDate.setUTCDate(tmpDate.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(tmpDate.getUTCFullYear(), 0, 1));
  return Math.ceil(((tmpDate - yearStart) / 86400000 + 1) / 7);
};

const seed = async () => {
  const users = generateUsers(200);
  const squads = createSquads(users);
  const { weekStart, weekEnd, key } = getWeekRange();

  console.log('Seeding users...');
  const userWrites = users.map(user =>
    db
      .collection('users')
      .doc(user.uid)
      .set(user)
  );
  await Promise.all(userWrites);

  console.log('Seeding squads...');
  const squadWrites = squads.map(squad => db.collection('squads').doc(squad.squadId).set(squad));
  await Promise.all(squadWrites);

  console.log('Seeding leagues...');
  const leagueGroups = {};
  users.forEach(user => {
    const groupNumber = (user.uid.charCodeAt(0) + user.uid.charCodeAt(1)) % 5;
    const leagueId = `${user.league.toLowerCase()}_${key}_group_${groupNumber + 1}`;
    if (!leagueGroups[leagueId]) {
      leagueGroups[leagueId] = {
        leagueId,
        leagueName: user.league,
        members: [],
        weekStartDate: weekStart.toISOString(),
        weekEndDate: weekEnd.toISOString(),
        weekKey: key
      };
    }
    leagueGroups[leagueId].members.push({
      uid: user.uid,
      displayName: user.displayName,
      pointsThisWeek: user.weeklyLeaguePoints,
      league: user.league,
      streakMultiplier: user.scanStreak.days >= 5 ? 1.5 : 1
    });
  });

  const leagueWrites = Object.values(leagueGroups).map(group =>
    db
      .collection('leagues')
      .doc(group.leagueId)
      .set(group)
  );
  await Promise.all(leagueWrites);

  console.log('Seed complete!');
  process.exit(0);
};

seed().catch(error => {
  console.error('Seeding failed', error);
  process.exit(1);
});
