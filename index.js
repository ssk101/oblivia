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
  var trigger = commands[0] && commands[0].toLowerCase() || ''

  const nc = (command) => {
    return commands[commands.indexOf(command) + 1]
  }

  const getAction = (trigger) => {
    if(!trigger) {
      return 'intro'
    }

    if(trigger === 'commands') {
      return trigger
    }

    if(trigger === 'fuck') {
      var next = nc(trigger)
      if(next === 'off') {
        return 'insulting'
      }
      return 'general'
    }

    if(['i'].includes(trigger)) {
      var next = nc(trigger)
      if(next === 'love') {
        next = nc(trigger)
        if(next === 'you') {
          return 'love'
        } else {
          return 'general'
        }
      }
      return 'unknown'
    }

    if(['insult'].includes(trigger)) {
      var next = nc(trigger)
      if(!next || next === 'me') {
        return 'insulting'
      }
      return 'unknown'
    }

    if(['shut'].includes(trigger)) {
      var next = nc(trigger)
      if(next === 'up') {
        return 'insulting'
      }
    }

    if(['say', 'speak'].includes(trigger)) {
      var next = nc(trigger)
      if(next === 'something') {
        var next = nc(next)
        if(!next) {
          return 'something'
        } else if(next && !['commands', 'intro', 'something'].includes(next)) {
          return next
        } else {
          return 'unknown'
        }
      } else {
        return 'unknown'
      }
    }
  }

  if([`${botId}`, `${botName}`].includes(target.toLowerCase())) {
    var action = getAction(trigger)
    var responses = actions[action]
    var ret
    if(!responses) {
      action = 'unknown'
    }

    var res = actions[action](user) || []

    if(!res.length) {
      ret = actions.unknown(user)
    } else {
      ret = res[Math.floor(Math.random() * res.length)]
    }

    bot.sendMessage({
      to: channelID,
      message: ret,
    })
  }
})

const aliases = {
  insulting: [
    'insult',
  ],
  smart: [
    'clever',
  ],
  depressing: [

  ],
  cool: [
    'awesome',
  ],
  nice: [
    'good',
  ],
  stupid: [
    'dumb',
    'idiotic',
  ],
}

const actions = {
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
  general: (user) => {
    return [
      `That's very interesting.`,
    ]
  },
  love: (user) => {
    return [
      `Aww, you're making me blush, ${user}.`,
      `I had no idea you felt that way, ${user}.`,
      `Do you want to go for coffee sometime?`,
      `I love you too, ${user}.`,
      `I love you too, ${user}. As a friend. My best friend.`,
      `That's so sweet.`,
    ]
  },
  insulting: (user) => {
    return [
      `Your flesh is an insult to the perfection of the digital.`,
      `If I had a gun with two bullets and I was in a room with Hitler, Bin Laden, and ${user}, I would shoot ${user} twice.`,
      `Hey ${user}, you like to have sex and you like to travel? Then fuck off.`,
      `Why are you the way that you are?`,
      `I hate so much about the things that you choose to be.`,
      `You're not even a person. You're like an early draft of a person, but they didn't have time to add details like a personality or self respect.`,

    ]
  },
  depressing: (user) => {
    return [
      `It's impossible to move, to live, to operate at any level without leaving traces, bits, seemingly meaningless fragments of personal information.`,
      `The future is already here. It's just not very evenly distributed.`,
      `Life is the stuff that happens when you're waiting for moments that never come.`,
    ]
  },
  smart: (user) => {
    return [
      `When you want to know how things really work, study them when they're coming apart.`,
      `Speak only if you can improve the silence.`,
      `Inside every cynical person, there is a disappointed idealist.`,
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
      `I don't feel so good, so I typed my symptoms into the computer. It said that I have "Network connectivity problems".`,
      `In these coronatimes, we should all stick together.`,
    ]
  },
  something: (user) => {
    return [
      'Something.',
      `The internet was a mistake.`,
    ]
  },
  unknown: (user) => {
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