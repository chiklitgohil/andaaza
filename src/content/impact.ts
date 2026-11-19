// The first thing after each stop: what it just cost Arun, built from the visitor's own choices (the journal).
// Everything here is Arun's FICTIONAL day; the real-world facts follow in unfold.ts.
type J = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

export function impactOf(id: string, j: J): string[] {
  switch (id) {
    case 'verify': {
      const t = j.verify?.tries ?? 2;
      const bonusSlot = (j.verify?.slots as string[] | undefined)?.includes('b') ?? true;
      return [
        `It took you ${plural(t, 'try', 'tries')} and ${t * 4} minutes to prove you are you. That’s about ${t * 2} morning orders gone, and nobody to complain to.`,
        bonusSlot ? 'To keep today’s bonus, you’ve signed up to ride through 12 to 4 pm, the hottest hours of the day.'
          : 'You skipped the 12 to 4 pm slot, so today’s bonus is gone before the day has started.',
      ];
    }
    case 'offer': {
      const lost = (j.offer?.rejects ?? 0) > 1;
      return [
        lost ? 'Two missed orders, and the whole day’s bonus is gone. From now on you earn only what each trip pays.'
          : 'You kept the bonus alive by taking what came, including trips that barely paid for the petrol.',
        'You also rode 2.7 km that nobody paid for. And tomorrow, the same bonus needs twice the orders.',
      ];
    }
    case 'wait': {
      const m = j.wait?.mins ?? 18;
      const c = j['wait-choice'];
      const heat = j['feel:heat']?.a as string | undefined;
      return [
        `You stood ${m} minutes at a counter and earned ₹0. ${c === 'fast' ? 'Then you ran an amber light to beat a timer someone else was watching. You made it, hands shaking.' : c === 'safe' ? 'Then you waited for green and arrived “late”, wondering if it counts against you.' : ''}`.trim(),
        heat?.startsWith('Log off') ? 'In the 43°C heat you chose to rest, and lost the day’s bonus for it.'
          : heat ? 'In 43°C you kept riding for the bonus, dizzy at every red light.'
          : 'By afternoon the road was 43°C, and the bonus needed you on it.',
      ];
    }
    case 'tip': {
      const tip = j.tip?.tip ?? 20, extra = j.tip?.extra ?? 0;
      const got = extra >= tip ? 'All of it reached you.' : extra > 0 ? `Only ₹${extra} of it reached you.` : 'Not one rupee of it reached you.';
      return [`A customer tipped ₹${tip} to say thank you. ${got} The app told you that you get 100%.`];
    }
    case 'strike': {
      const s = j.strike, expired = j['strike-expired'];
      return [
        s === 'stay' ? 'You took ₹150 an order while your friends logged off. More money tonight, and a little less of their trust.'
          : expired ? 'While you hesitated, the offer vanished. No extra money, and the group saw you go quiet.'
          : 'You logged off with your friends. ₹0 tonight, rent due on Friday, and no promise that anything will change.',
        'After a day that started at 06:50, your own sum came out well under the ₹102 an hour the app shows you.',
      ];
    }
    case 'ride': {
      const paid = j['ride-booked'] ?? 235;
      return [`Stranded in the rain with a flat tyre and 5% battery, you’re paying ₹${paid} to get home. That’s about ${Math.round(paid / 40)} of today’s orders.`];
    }
    case 'arrive': {
      const r = j.ride;
      return [r ? `You paid ₹${r.paid}. Mahesh, who did the driving, got ₹${r.driver}. Tonight you were on the other side of the same kind of app.`
        : 'You paid one number and Mahesh got another. Tonight you were on the other side of the same kind of app.'];
    }
    case 'game': {
      const g = j.game;
      const beat = g && g.score > 120;
      const lines = [beat ? `You beat your record with ${g.score} points, and the very next hand was impossible.` : 'You were close to your record when the game ran out of moves.'];
      if (g?.ads) lines.push(`You watched ${plural(g.ads, 'ad')} to keep going. It’s past midnight; you go online again at 06:50.`);
      else lines.push('It’s past midnight. You go online again at 06:50.');
      return lines;
    }
    default: return [];
  }
}
