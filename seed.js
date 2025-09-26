/* eslint-disable no-console */
const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

const db = admin.firestore();

const USERS = [
  {
    uid: "demo-user-1",
    email: "captain@fetchsquads.dev",
    displayName: "Командир",
  },
  {
    uid: "demo-user-2",
    email: "scout@fetchsquads.dev",
    displayName: "Разведчик",
  },
  {
    uid: "demo-user-3",
    email: "healer@fetchsquads.dev",
    displayName: "Поддержка",
  },
];

async function seed() {
  try {
    const squadRef = db.collection("squads").doc();
    const squadData = {
      squadName: "Демо-отряд Fetch",
      members: USERS.slice(0, 2).map((user) => user.uid),
      totalPoints: 3200,
      goal: {
        name: "Собрать 25 000 очков на мегапати",
        targetPoints: 25000,
      },
      shoppingList: [
        { text: "Кофе для всей команды", completed: true },
        { text: "Закупка снеков", completed: false },
      ],
      mascotUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f415.svg",
      lastReceipt: null,
    };

    await squadRef.set(squadData);

    for (const user of USERS) {
      await db.collection("users").doc(user.uid).set({
        email: user.email,
        displayName: user.displayName,
        squadId: squadData.members.includes(user.uid) ? squadRef.id : null,
      });
    }

    console.log(`Создан демо-отряд ${squadRef.id} и ${USERS.length} пользователей.`);
  } catch (error) {
    console.error("Не удалось выполнить seed", error);
  }
}

seed();
