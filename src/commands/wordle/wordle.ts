import { SlashCommand } from '../../structures';
import { words, LetterMap } from '../../util';

export default new SlashCommand({
  name: 'wordle',
  description: 'start a new game!',
  async run({ client, interaction }) {
    const activeGame = await client.prisma.game.findFirst({
      where: {
        userId: interaction.user.id,
        active: true,
      },
    });

    if (activeGame) {
      return client.embeds.error({
        reason: 'You already have an active game. Please use the `/guess` command.',
        interaction,
      });
    }

    const correctWord = words[Math.floor(Math.random() * words.length)]!;
    const letters: LetterMap = {
      a: 'darkGray',
      b: 'darkGray',
      c: 'darkGray',
      d: 'darkGray',
      e: 'darkGray',
      f: 'darkGray',
      g: 'darkGray',
      h: 'darkGray',
      i: 'darkGray',
      j: 'darkGray',
      k: 'darkGray',
      l: 'darkGray',
      m: 'darkGray',
      n: 'darkGray',
      o: 'darkGray',
      p: 'darkGray',
      q: 'darkGray',
      r: 'darkGray',
      s: 'darkGray',
      t: 'darkGray',
      u: 'darkGray',
      v: 'darkGray',
      w: 'darkGray',
      x: 'darkGray',
      y: 'darkGray',
      z: 'darkGray',
    };

    await client.prisma.game.create({
      data: {
        userId: interaction.user.id,
        active: true,
        correctWord,
        letters,
      },
    });

    client.embeds.success({
      interaction,
      reason: 'Created your game! Use the `/guess` command to play.',
    });
  },
});
