require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  ChannelType,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle
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

  if (interaction.isStringSelectMenu()) {

    if (interaction.customId !== 'ticketmenu') return;

    let category;
    let subject;

    switch (interaction.values[0]) {
      case 'general':
        category = GENERAL;
        subject = 'General Support';
        break;

      case 'rewards':
        category = REWARDS;
        subject = 'Rewards';
        break;

      case 'giveaway':
        category = GIVEAWAY;
        subject = 'Giveaway Claim';
        break;
    }

    const channel = await interaction.guild.channels.create({
      name: `ticket-${interaction.user.username}`,
      type: ChannelType.GuildText,
      parent: category
    });

    const embed = new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle('🎫 Support Ticket Created')
      .setDescription(
`${interaction.user} Your support ticket has been created.

A staff member will be with you shortly.

**Subject**
${subject}`
      )
      .setFooter({
        text: 'Smart Ticketing • Today'
      });

    const buttons = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('claim')
          .setLabel('Claim')
          .setEmoji('🎯')
          .setStyle(ButtonStyle.Secondary),

        new ButtonBuilder()
          .setCustomId('pin')
          .setLabel('Pin')
          .setEmoji('📌')
          .setStyle(ButtonStyle.Secondary),

        new ButtonBuilder()
          .setCustomId('close')
          .setLabel('Close')
          .setEmoji('🔒')
          .setStyle(ButtonStyle.Danger)
      );

    await channel.send({
      content: `${interaction.user}`,
      embeds: [embed],
      components: [buttons]
    });

    await interaction.reply({
      content: `✅ Ticket created: ${channel}`,
      ephemeral: true
    });
  }

  if (interaction.isButton()) {

    if (interaction.customId === 'claim') {

      await interaction.reply({
        content: `🎯 Ticket claimed by ${interaction.user}`
      });

    } else if (interaction.customId === 'pin') {

      const messages = await interaction.channel.messages.fetch({ limit: 1 });

      await messages.first().pin();

      await interaction.reply({
        content: '📌 Ticket pinned.',
        ephemeral: true
      });

    } else if (interaction.customId === 'close') {

      await interaction.reply({
        content: '🔒 Closing ticket in 5 seconds...'
      });

      setTimeout(async () => {
        await interaction.channel.delete();
      }, 5000);
    }
  }
});

client.login(process.env.TOKEN);
