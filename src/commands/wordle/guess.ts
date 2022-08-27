import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import {
  fillArr, words, guessWord, mapWord, letterMap, LetterMap, splitArr,
} from '../../util';
import { SlashCommand } from '../../structures';

export default new SlashCommand({
  name: 'guess',
  description: 'guess a word for your wordle game!',
  options: [
    {
      name: 'word',
      description: 'input a word to guess',
      type: ApplicationCommandOptionType.String,
      required: true,
      max_length: 5,
      min_length: 5,
    },
  ],
  async run({ client, interaction, args }) {
    const guess = args.getString('word')!.toLowerCase();

    const activeGame = await client.prisma.game.findFirst({
      where: {
        userId: interaction.user.id,
        active: true,
      },
    });

    if (!activeGame) {
      return client.embeds.error({
        reason: 'You need to start a game to guess word. Type `/wordle` to start a game.',
        interaction,
      });
    }

    if (!words.includes(guess)) {
      return client.embeds.error({
        reason: 'Please guess a valid 5 letter word!',
        interaction,
      });
    }

    const newLetters = mapWord(guess, activeGame.correctWord);
    const letters = letterMap(newLetters, activeGame.letters as LetterMap);

    const newData = await client.prisma.game.update({
      where: { id: activeGame.id },
      data: {
        guessedWords: [...activeGame.guessedWords, guess],
        letters,
      },
    });

    const mapped = newData.guessedWords.map((word) => guessWord(word, activeGame.correctWord).join(''));
    const output = fillArr(mapped, 6, client.emoji.blank.repeat(5));

    const value = Object.entries(letters).map(([k, v]) => client.emoji[v][k] as string);
    const newArr = splitArr(value);

    const embed = new EmbedBuilder()
      .setTitle('Wordle Game')
      .setColor('#2E3037')
      .setDescription(output.join('\n'))
      .addFields({
        name: 'Letters',
        value: newArr.join(''),
      });

    interaction.followUp({ embeds: [embed] });

    if (newData.guessedWords.length >= 6) {
      await client.prisma.game.update({
        where: { id: activeGame.id },
        data: {
          active: false,
        },
      });

      return interaction.followUp(`Game over! The correct word was **${activeGame.correctWord}**!`);
    }

    if (guess === activeGame.correctWord) {
      await client.prisma.game.update({
        where: { id: activeGame.id },
        data: {
          active: false,
        },
      });

      return interaction.followUp(`You win! It took you ${activeGame.guessedWords.length + 1} guesses to get **${activeGame.correctWord}**!`);
    }
  },
});
