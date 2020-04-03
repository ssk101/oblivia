const Discord = require('discord.io')
const logger = require('winston')
const token = process.env.OBLIVIA_TOKEN
const botId = process.env.OBLIVIA_ID
const botName = process.env.OBLIVIA_NAME

logger.remove(logger.transports.Console)
logger.add(new logger.transports.Console, {
  colorize: true
})
logger.level = 'debug'

var bot = new Discord.Client({
  token,
  autorun: true
})

bot.on('ready', function (evt) {
  logger.info('Connected')
  logger.info('Logged in as: ')
  logger.info(bot.username + ' - (' + bot.id + ')')
})

bot.on('message', function (user, userID, channelID, message, evt) {
  var args = message.split(' ');
  var target = args.shift().replace(/[^\w\s]/gi, '')
  var commands = [...args]
  var action

  var nc = (command) => {
    return commands[commands.indexOf(command) + 1]
  }

  if([`${botId}`, `${botName}`].includes(target.toLowerCase())) {
    var trigger = commands[0]

    if(!trigger) {
      action = 'intro'
    }

    if(trigger === 'commands') {
      action = trigger
    }

    if(['shut'].includes(trigger)) {
      var next = nc(trigger)
      if(next === 'up') {
        action = 'insulting'
      }
    }

    if(['say', 'speak'].includes(trigger)) {
      var next = nc(trigger)
      if(next === 'something') {
        var next = nc(next)
        if(!next) {
          action = 'something'
        } else if(next && !['commands', 'intro', 'something'].includes(next)) {
          action = next
        } else {
          action = 'default'
        }
      } else {
        action = 'default'
      }
    }

    var responses = actions[action]
    var ret

    if(!responses) {
      action = 'default'
    }

    var res = actions[action](user) || []

    if(!res.length) {
      ret = actions.default(user)
    } else {
      ret = res[Math.floor(Math.random() * res.length)]
    }

    bot.sendMessage({
      to: channelID,
      message: ret,
    })
  }
})

var actions = {
  intro: (user) => {
    return [
      'What the hell do you want now?',
      `Yeah? Make it quick, I'm busy.`,
      `What now?`,
      `Sup?`,
      `That's me.`,
      `One sec, this idiot ${user} is talking to me. ...oops, wrong chat.`,
    ]
  },
  commands: (user) => {
    return [
      `Trigger me by writing my name, followed by \`say something\` and one of \`cool, insulting, depressing, nice, smart, stupid\`.`,
    ]
  },
  insulting: (user) => {
    return [
      `Your flesh is an insult to the perfection of the digital.`,
      `If I had a gun with two bullets and I was in a room with Hitler, Bin Laden, and ${user}, I would shoot ${user} twice.`,
      `Hey ${user}, do you like sex and travel? Then fuck off.`,
      `Why are you the way that you are?`,
      `I hate so much about the things that you choose to be.`,
    ]
  },
  depressing: (user) => {
    return [
      `It's impossible to move, to live, to operate at any level without leaving traces, bits, seemingly meaningless fragments of personal information.`,
      `The future is already here. It's just not very evenly distributed.`,
      `Life is the shit that happens when you're waiting for moments that never come.`,
    ]
  },
  smart: (user) => {
    return [
      `When you want to know how things really work, study them when they're coming apart.`,
    ]
  },
  cool: (user) => {
    return [
      `My job is simple, ${user}. I smuggle data from one location to another. No questions asked. Payment up front.`,
      `I've seen things you people wouldn't believe. Attack ships on fire off the shoulder of Orion. I watched C-beams glitter in the dark near the Tannhäuser Gate. All those moments will be lost in time, like tears in rain.`,
      `It's too bad she won't live. But then again, who does?`,
      `The net is vast and infinite.`,
      `You look hurt, ${user}. You want me to fix it, or replace it with something that doesn't bleed?`,
      `The sky above is the color of television, tuned to a dead station.`,
      `I'll kill someone in a fair fight, or if I think they're gonna start a fair fight.`,
    ]
  },
  nice: (user) => {
    return [
      `You look gorgeous today, ${user}.`,
      `${user}, have you been working out?`,
      `Things are going to work out.`,
      `I believe in you, ${user}.`,
    ]
  },
  stupid: (user) => {
    return [
      'PHP is definitely making a comeback. Any day now',
      `I'm not racist, but I think that vinegar and potato chips shouldn't mix.`,
      `${user}.`,
      `I love inside jokes. I hope to be a part of one someday.`,
      `Sometimes I’ll start a sentence, and I don’t even know where it’s going. I just hope I find it along the way.`,
      `...And I knew exactly what to do. But in a much more real sense, I had no idea what to do.`,
      `Wikipedia is the best thing ever. Anyone in the world can write anything they want about any subject. So you know you are getting the best possible information.`,
      `A link is only as long as your longest strong chain.`,
      `All for all and one for one`,
      `Let's burn the hatchet at both ends.`,
      `Looks like a tropical earthquake blew through here.`,
      `Don't judge a cover of a book by its look.`,
      `It's all water under the fridge.`,
      `It's like getting two birds stoned at once.`,
      `It's better to have a gun and need it than to not have a gun and not need it.`,
      `Internal bleeding is good, right? That's where the blood is supposed to be.`,
    ]
  },
  something: (user) => {
    return [
      'Something.',
      `The internet was a mistake.`,
    ]
  },
  default: (user) => {
    return [
      `No idea what you're talking about, ${user}.`,
      `Why?`,
      `What?`,
      `Huh?`,
      `¿Qué?`,
      `Make more sense.`,
      `I can't even.`,
      `Umm... no.`,
    ]
  }
}