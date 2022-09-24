const { ApolloServer, gql, PubSub } = require("apollo-server");

const fs = require("fs");
const typeDefsFile = fs.readFileSync("./schema.gql");
const pubsub = new PubSub();

// type RoomInfo {
//   gamePhase: GamePhaseEnum
//   word: String
//   openedLetters: Int
//   roomId: Int
//   players: [Player]
//   inroom: [User]
//   suggestions: [Suggestion]
// }

var rooms = [
  {
    gamePhase: "INGAME",
    word: "мебель",
    openedLetters: 1,
    roomId: 1,
    users: [
      { name: "sewaca", id: "player1", role: "PLAYER" },
      { name: "L0ver1ck", id: "player2", role: "PLAYER" },
      { name: "Аня", id: "player3", role: "PLAYER" },
      { name: "Руслан", id: "player4", role: "PLAYER" },
      { name: "Bumble Beezy", id: "player5", role: "LEADER" },
      { name: "Михаил Булгаков", id: "player6", role: "PLAYER" },
      { name: "Александр Македонский", id: "player7", role: "PLAYER" },
      { name: "Александр Пушкин", id: "player8", role: "PLAYER" },
    ],
    suggestions: [
      {
        id: "fromp3w_333",
        from: "player3",
        text: "Стул, стол, табурет и диван это ?",
        answer: "мебель",
      },
    ],
  },
];

const typeDefs = gql`
  ${typeDefsFile}
`;

const resolvers = {
  Query: {
    roomInfo(_, { roomId }) {
      return rooms.filter((room) => room.roomId === roomId)[0];
    },
    getAllRooms(_) {
      return rooms;
    },

    // users(root, args) { return users.filter(user => user.id === args.id)[0] },
  },

  Mutation: {
    createRoom(
      _,
      {
        gamePhase = "ENDED",
        word = "",
        openedLetters = 1,
        creator,
        suggestions = [],
      }
    ) {
      let maxId = 0;
      rooms.map((room) => {
        maxId = Math.max(room.roomId, maxId);
        return room;
      });
      maxId++;

      let user = {
        id: "user" + Math.random().toString(16).slice(2, 10),
        name: creator.name,
        role: "LEADER",
      };

      rooms.push({
        gamePhase: gamePhase,
        word: word,
        openedLetters: openedLetters,
        roomId: maxId,
        users: [user],
        suggestions: suggestions,
      });
      return { ...user, roomId: maxId };
    },
    leaveRoom(_, { userId, roomId }) {
      let room = rooms.filter((r) => r.roomId === roomId)[0];
      let userRole = room.users.filter((user) => user.id === userId)[0].role;
      if (room) room.users = room.users.filter((user) => user.id !== userId);
      if (!room.users.length)
        rooms = rooms.filter((a) => a.roomId !== room.roomId);
      if (userRole === "LEADER") room.users[0].role = "LEADER";
      return room;
    },
    joinRoom(
      _,
      {
        id = "user" + Math.random().toString(16).slice(2, 10),
        name,
        roomId,
        role = "PLAYER",
      }
    ) {
      let room = rooms.filter((r) => r.roomId === roomId)[0];
      role =
        room.users.filter((a) => a.role === "PLAYER" || a.role === "LEADER")
          .length < 8
          ? role
          : "SPECTATOR";
      room.users.push({
        id: id,
        name: name,
        role: role,
      });
      return { id: id, name: name, role: role, roomId: roomId };
    },
    makeSuggestion(_, { playerid, roomId, text, answer }) {
      let room = rooms.filter((a) => a.roomId === roomId)[0];
      if (room.suggestions.filter((s) => s.from === playerid).length !== 0)
        throw new Error("Ошибка! Этот игрок уже предложил определение");
      let suggestionId = "suggestion" + Math.random().toString(16).slice(2, 10);
      if (room.users.find((a) => a.id === playerid && a.role === "PLAYER")) {
        var generatedSuggestion = {
          id: suggestionId,
          from: playerid,
          text: text,
          answer: answer.toLowerCase().trim(),
        };
        room.suggestions.push(generatedSuggestion);
        pubsub.publish("NEW_SUGGESTION", { suggestion: generatedSuggestion });
        return generatedSuggestion;
      } else {
        throw new Error(
          "Пользователь не является игроком или покинул комнату!"
        );
      }
    },
    removeSuggestion(_, { roomId, playerid = "", suggestionId = "" }) {
      if (!playerid && !suggestionId) return false;
      let room = rooms.filter((r) => r.roomId === roomId)[0];
      room.suggestions = room.suggestions.filter(
        (s) => s.id !== suggestionId && s.from !== playerid
      );
      return true;
    },
    answerSuggestionLeader(_, { roomId, suggestionId, answer }) {
      let room = rooms.filter((r) => r.roomId === roomId)[0];
      let suggestion = room.suggestions.filter((s) => s.id === suggestionId)[0];

      if (answer.toLowerCase().trim() === room.word.toLowerCase().trim()) {
        room.gamePhase = "ENDED";
        room.suggestions = [];
        room.openedLetters = 1000000;
        return false;
      }

      if (
        answer.toLowerCase().trim() === suggestion.answer.toLowerCase().trim()
      ) {
        room.suggestions = room.suggestions.filter(
          (s) => s.id !== suggestionId
        );
        return true;
      }
      return false;
    },
    answerSuggestion(_, { playerid, roomId, suggestionId, answer }) {
      let room = rooms.filter((r) => r.roomId === roomId)[0];
      if (!room.suggestions)
        throw new Error("В комнате нет неотвеченных определений");
      if (!answer.length) throw new Error("Ответ не может быть пустым");
      let suggestion = room.suggestions.filter((s) => s.id === suggestionId)[0];
      if (room.word.toLowerCase().trim() === answer.toLowerCase().trim()) {
        room.gamePhase = "ENDED";
        room.suggestions = [];
        room.openedLetters = 10000000;
        return true;
      }
      if (
        answer.toLowerCase().trim() === suggestion.answer.toLowerCase().trim()
      ) {
        room.openedLetters++;
        room.suggestions = [];
        if (room.openedLetters === room.word.length) {
          room.gamePhase = "ENDED";
        }
        return true;
      }
      room.suggestions = room.suggestions.filter((s) => s.id !== suggestionId);
      return false;
    },
    makeGuess(_, { roomId, answer }) {
      let room = rooms.filter((r) => r.roomId === roomId)[0];
      let ans = false;
      if (room.word.toLowerCase().trim() === answer.toLowerCase().trim()) {
        room.gamePhase = "ENDED";
        room.suggestions = [];
        room.openedLetters = 100000000;
        ans = true;
      }
      pubsub.publish("NEW_GUESS", { roomId: roomId, answer: answer, res: ans });
      return ans;
    },
    setGameWord(_, { roomId, word }) {
      let room = rooms.filter((r) => r.roomId === roomId)[0];
      if (!room) return false;
      room.word = word.trim().toLowerCase();
      room.gamePhase = "INGAME";
      room.openedLetters = 1;
      return true;
    },
    giveRole(_, { roomId, playerid, newRole }) {
      if (["SPECTATOR", "PLAYER", "LEADER"].indexOf(newRole) == -1)
        return false;
      let room = rooms.filter((r) => r.roomId === roomId)[0];
      if (!room) return false;
      let leader = room.users.filter((a) => a.role === "LEADER")[0];
      let users = room.users.filter((a) => a.role === "PLAYER");
      let user = room.users.filter((a) => a.id === playerid)[0];
      if (!user || !user.role) return false;
      if (users.length === 8 && newRole === "USER") return false;

      if (newRole === "LEADER") leader.role = user.role;
      user.role = newRole;

      return true;
    },
  },

  Subscription: {
    listenSuggestions: {
      subscribe: () => pubsub.asyncIterator(["NEW_SUGGESTION"]),
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
