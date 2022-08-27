import {
  CommandInteraction, PermissionResolvable, EmbedBuilder,
  SelectMenuInteraction, Message, ButtonInteraction,
} from 'discord.js';
import { emoji, logger } from '.';
import { client } from '..';

interface EmbedGeneratorOptions {
  interaction?: CommandInteraction | SelectMenuInteraction | ButtonInteraction;
  message?: Message;
}

interface PermissionErrorOptions extends EmbedGeneratorOptions {
  permission: PermissionResolvable;
  user: 'I' | 'You';
}

interface BasicEmbedOptions extends EmbedGeneratorOptions {
  reason: string;
}

interface DisplayBoardOptions extends Omit<BasicEmbedOptions, 'reason'> {
  characters: {
    character: 'A' | 'B' | 'C' | 'D';
    color: 'yellow' | 'green' | 'gray' | 'darkgray';
  }[];
}

export const embedGenerator = {
  permissionError({
    interaction, permission, user, message,
  }: PermissionErrorOptions) {
    const embed = new EmbedBuilder()
      .setTitle(`${emoji.wrong} Permission Error`)
      .setColor('Red')
      .setDescription(`${user} do not have the \`${permission}\` permission`);

    if (interaction) return interaction.followUp({ embeds: [embed] });
    if (message) return message.reply({ embeds: [embed] });
    return logger.trace('The function requires you to supply an interaction or message!');
  },

  error({
    interaction, reason, message,
  }: BasicEmbedOptions) {
    const embed = new EmbedBuilder()
      .setTitle(`${emoji.wrong} Error`)
      .setColor('Red')
      .setDescription(reason);

    if (interaction) return interaction.followUp({ embeds: [embed] });
    if (message) return message.reply({ embeds: [embed] });
    return logger.trace('The function requires you to supply an interaction or message!');
  },

  info({ interaction, reason, message }: BasicEmbedOptions) {
    const embed = new EmbedBuilder()
      .setTitle(`${emoji.information} Info`)
      .setColor('#2E3037')
      .setDescription(reason);

    if (interaction) return interaction.followUp({ embeds: [embed] });
    if (message) return message.reply({ embeds: [embed] });
    return logger.trace('The function requires you to supply an interaction or message!');
  },

  success({ interaction, reason, message }: BasicEmbedOptions) {
    const embed = new EmbedBuilder()
      .setTitle(`${emoji.correct} Success`)
      .setColor('Green')
      .setDescription(reason);

    if (interaction) return interaction.followUp({ embeds: [embed] });
    if (message) return message.reply({ embeds: [embed] });
    return logger.trace('The function requires you to supply an interaction or message!');
  },

  displayBoard({ characters, interaction, message }: DisplayBoardOptions) {
    const chars = characters.map(({ color, character }) => {
      const char = client.emoji[color][character.toLowerCase()];
      return char;
    });

    if (interaction) return interaction.followUp(chars.join('\n'));
    if (message) return message.reply(chars.join('\n'));
    return logger.trace('The function requires you to supply an interaction or message!');
  },
};
