const TelegramApi = require('node-telegram-bot-api');
const { gameOptions, againOptions } = require('./options')

const token = '7456616931:AAGs_rJeP8nm4gJT1b1bY00YbpV9huCdY-8';

const bot = new TelegramApi(token, {polling: true})

const chats = {};

const startGame = async (chatId) => {
  bot.sendMessage(chatId, 'I have a number from 1 to 9, guess it');
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, 'Guess...', gameOptions)
};

const start = () => {
  bot.on("message", async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;
  
    bot.setMyCommands([
      {command: "/start", description: "Welcome message"},
      {command: "/info", description: "Your name"},
      {command: "/game", description: "Guess the number game"},
    ])
  
    if(text === "/start") {
      await bot.sendSticker(chatId, "https://tlgrm.eu/_/stickers/85b/9a3/85b9a330-80ac-4e5d-a7b7-d63f5fab2e6b/2.jpg")
      return bot.sendMessage(chatId, "Welcome to my crazzy Chat Bot.")
    }
  
    if(text === "/info") {
      return bot.sendMessage(chatId, `Your name is ${msg.from.first_name} ${msg.from.last_name}`)
    }

    if(text === "/game") {
      startGame(chatId)
    }

    return bot.sendMessage(chatId, 'I do not understand you');
  })

  bot.on('callback_query', async msg => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if(data === '/again') {
      return startGame(chatId);
    }
    if(data === chats[chatId]) {
      return await bot.sendMessage(chatId, "Wow! You have guessed!!!", againOptions)
    } else {
      return await bot.sendMessage(chatId, `No no no! It was ${chats[chatId]}`, againOptions)
    }
  })
}

start()
