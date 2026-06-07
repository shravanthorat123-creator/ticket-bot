const {
EmbedBuilder,
ButtonBuilder,
ButtonStyle,
ActionRowBuilder
} = require('discord.js');

const embed = new EmbedBuilder()
.setColor('#5865F2')
.setTitle('🎫 Support Ticket Created')
.setDescription(
`${interaction.user} Your support ticket has been created.

A staff member will be with you shortly.

**Subject**
General Support`
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
