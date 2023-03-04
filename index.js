const TelegramBot = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require("./options");

const telegramApiToken = '6045116736:AAFjYszJHPcGPpgiZpxOqzv4-D5rdCcBpH8'

const bot = new TelegramBot(telegramApiToken, {polling: true});

const chats = {}

const startGame = async chatId => {
  await bot.sendMessage(chatId, `Я загадал цифру от 0 до 0, а ты попробуй угадать`)
  const randomNumber = Math.floor(Math.random() * 10)
  chats[chatId] = "" + randomNumber;
  await bot.sendMessage(chatId, 'Отгадывай', gameOptions)
  console.log(randomNumber)
}

const init = () => {
  bot.setMyCommands([
    {command: '/start', description: 'Initial greeting'},
    {command: '/info', description: 'Your info'},
    {command: '/game', description: 'Start game'},
  ])

  bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === '/start') {
      await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/c3a/121/c3a12122-e316-3160-8a76-7d36c018bb84/4.webp')
      return await bot.sendMessage(chatId, 'Welcome')
    }
    if (text === '/info') {
      return await bot.sendMessage(chatId, `Your name is ${msg.from.first_name}  ${msg.from.last_name}`)
    }
    if (text === '/game') {
      return await startGame(chatId)
    }
    return bot.sendMessage(chatId, 'Unknown command')
  })

  bot.on('callback_query', async msg => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if (data === '/again') {
      return await startGame(chatId)
    }
    if (data === chats[chatId]) {
      return await bot.sendMessage(chatId, `Ты угадал!`, againOptions)
    } else {
      return await bot.sendMessage(chatId, `Ты не угадал, попробуй еще раз`, againOptions)
    }
  })
}

init()