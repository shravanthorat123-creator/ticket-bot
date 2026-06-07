require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  ChannelType,
  ActionRowBuilder,
  StringSelectMenuBuilder
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const GENERAL = process.env.GENERAL_CATEGORY;
const REWARDS = process.env.REWARDS_CATEGORY;
const GIVEAWAY = process.env.GIVEAWAY_CATEGORY;

client.once('ready', () => {
  console.log(`${client.user.tag} is online`);
});

client.on('messageCreate', async (message) => {

  if (message.author.bot) return;

  if (message.content === '!panel') {

    const menu = new StringSelectMenuBuilder()
      .setCustomId('ticketmenu')
      .setPlaceholder('Choose a category')
      .addOptions([
        {
          label: 'General Support',
          value: 'general',
          emoji: '🔔'
        },
        {
          label: 'Rewards',
          value: 'rewards',
          emoji: '💰'
        },
        {
          label: 'Giveaway Claim',
          value: 'giveaway',
          emoji: '🎁'
        }
      ]);

    const row = new ActionRowBuilder().addComponents(menu);

    await message.channel.send({
      content: '🎫 Ticket System',
      components: [row]
    });
  }
});

client.on('interactionCreate', async interaction => {

  if (!interaction.isStringSelectMenu()) return;

  if (interaction.customId !== 'ticketmenu') return;

  let category;

  switch (interaction.values[0]) {
    case 'general':
      category = GENERAL;
      break;

    case 'rewards':
      category = REWARDS;
      break;

    case 'giveaway':
      category = GIVEAWAY;
      break;
  }

  const channel = await interaction.guild.channels.create({
    name: `ticket-${interaction.user.username}`,
    type: ChannelType.GuildText,
    parent: category
  });

  await channel.send(
    `Welcome ${interaction.user}! Please explain your issue.`
  );

  await interaction.reply({
    content: `✅ Ticket created: ${channel}`,
    ephemeral: true
  });
});

client.login(process.env.TOKEN);
