// What unfolds after each stop, one short line at a time. Every line is drawn from a fact in debriefs.ts;
// nothing here is new. There are no sources or labels mid-story, so the wording itself carries the evidence:
//   "riders say" / "a survey found" = REPORTED   ·   "claims" / "says he was" = ALLEGED
//   "critics say … the company denies it" = CONTESTED   ·   "the company says" = STATEMENT
//   "in this story" / "imagine" = WHAT-IF or FICTIONAL. Labels, responses and sources are all listed at the end.
import type { UnfoldItem } from '../acts/unfold';

export const UNFOLD: Record<string, UnfoldItem[]> = {
  verify: [
    { say: 'Three tries. Nothing about Arun changed. Only the light did.' },
    { id: 'verify-survey', ask: '150 Uber drivers in India were asked about selfie checks. How many said one had locked them out?', options: ['About 1 in 20', 'About 1 in 5', 'Nearly half'], correct: 2, reveal: 'Nearly half. Some for a day, some for good.' },
    { say: 'Uber says a face check alone can’t remove anyone, and that people review every flag.' },
    { say: 'A Zomato rider rated 4.85 says he was blocked for “behavioural issues”, with no detail. A court has asked Zomato to answer.' },
    { say: 'Tests of face-matching software found most systems make more mistakes for some faces than for others.' },
    { say: 'Karnataka’s new gig-worker law requires 14 days’ notice, with reasons, before a platform cuts a worker off.' },
    { say: 'Nothing in this check asked whether Arun is Arun. It asked about light, plastic and pixels.' },
  ],
  offer: [
    { say: 'Same rider. Same roads. Overnight, the finish line moved.' },
    { say: 'Riders in Delhi and Varanasi say their bonus ladder changed just like this: ₹555 for 32 orders became ₹448 for 43.' },
    { say: 'Riders also say one rejected order too many could cost the whole day’s bonus. Swiggy says bonuses are tied to finishing orders and logging in.' },
    { say: 'And they say map pins can be a kilometre off, so they ride distance nobody pays for. We found no company response.' },
    { id: 'offer-shipt', ask: 'When a US grocery app hid its pay formula, workers built their own calculator. What did it show?', options: ['Pay went up', 'Pay stayed the same', '4 in 10 were paid less'], correct: 2, reveal: '41% were paid less, by about 11%. The company said average pay stayed the same.' },
    { say: 'Arun decides in 12 seconds. The rules that score him can change while he sleeps.' },
  ],
  wait: [
    { say: 'Eighteen minutes at the counter. ₹0.' },
    { say: 'Riders interviewed by researchers call it invisible work: waiting, tapping, refreshing. Zomato says its hourly figures do include waiting.' },
    { id: 'wait-speed', ask: '13 quick-delivery riders were asked whether 10-minute deadlines made them speed. How many said yes?', options: ['A few', 'About half', 'All 13'], correct: 2, reveal: 'All 13. Blinkit’s CEO says riders are never penalised for being late.' },
    { say: 'Zomato’s CEO says riders never see the customer’s timer. After the Labour Minister met the companies, Blinkit dropped “10 minutes” from its ads.' },
    { say: 'In a 43°C heatwave, a reporter working as a rider earned ₹44 in 57 minutes. The rest-point cooler was empty.' },
    { say: 'The companies say they provide coolers, cooling vests and glucose.' },
    { say: 'When the app doesn’t count the work, it’s easy for everyone else not to see it.' },
  ],
  tip: [
    { say: 'The customer meant the tip for Arun. In this story, the app kept it.' },
    { id: 'tip-real', ask: 'Has a real company ever done this?', options: ['No, it’s only a theory', 'Yes, and it paid for it'], correct: 1, reveal: 'Yes. In New York, DoorDash counted tips toward the pay it had promised. It paid $16.75 million to settle, without admitting wrongdoing.' },
    { say: 'Amazon used tips to cover cuts to drivers’ pay, while emails told them they kept 100%. It paid $61.7 million.' },
    { say: 'We know of no finding that an Indian app does this. Flopcart’s rule is our what-if.' },
    { say: 'In India, a riders’ union says only about 5 in 100 orders get any tip. Zomato disputes how the union measures pay.' },
    { say: '“100% of tips” can be true on paper, and still leave Arun with nothing extra.' },
  ],
  strike: [
    { say: 'The night riders strike, staying online suddenly pays five times more.' },
    { id: 'strike-surge', ask: 'During real national rider strikes, what did the apps offer that evening?', options: ['Nothing unusual', '₹120–150 extra an order'], correct: 1, reveal: 'Riders report ₹120–150 an order, and rejection penalties waived. Zomato’s parent company called the incentives routine for the festive season.' },
    { say: 'Zomato says its riders average ₹102 an hour. A riders’ union says it’s about ₹81 after costs. They count different hours and costs.' },
    { id: 'strike-hours', ask: 'A survey of 10,000+ app workers in 8 cities asked delivery riders about their hours. How many worked more than 10 hours a day?', options: ['1 in 4', '1 in 2', 'Nearly 8 in 10'], correct: 2, reveal: '78%.' },
    { say: 'Researchers scored 11 Indian platforms on fair work. None got above 6 out of 10. Ola, Uber and Porter got 0.' },
    { say: 'An hourly figure is a choice: which hours you count, and whose costs.' },
  ],
  ride: [
    { say: 'Two phones. One trip. Two prices. Was it the iPhone? The battery? Or just a different second?' },
    { say: 'In India, viral posts claimed the same trip cost more on an iPhone. A regulator sent the companies notices. Ola and Uber deny it.' },
    { say: 'A Belgian newspaper got a higher price at 12% battery. A US fact-check found no difference. Uber says battery plays no part.' },
    { id: 'ride-cr', ask: '174 volunteers compared quotes for matching trips. What was the typical gap between the cheapest and the dearest?', options: ['Under 5%', 'About 15%', 'Over 40%'], correct: 2, reveal: 'About 42%. Uber says the method is flawed and that it does not personalise prices.' },
    { say: 'Two screenshots can’t prove anything either way. Only many careful, paired tests can, and only the company sees all the data.' },
  ],
  arrive: [
    { say: 'You paid one number. Mahesh got another. Neither of you saw the split.' },
    { say: 'India’s new rules say drivers with their own car should get at least 80% of the fare. Each state has to adopt them.' },
    { id: 'arrive-uk', ask: 'UK drivers audited their own trip data. How much did Uber take on some trips?', options: ['About 10%', 'About 25%', 'Up to 50%'], correct: 2, reveal: 'Up to half, researchers reported. Uber says it does not recognise the figures.' },
    { say: 'All day an app decided what Arun was worth. Tonight he paid a man in the same position.' },
  ],
  game: [
    { say: 'The hand that ended the game may not have been luck.' },
    { say: 'A developer who took apart a hit puzzle game says its hidden rules can deal a hand with no possible move, right after you’ve watched ads near your record.' },
    { id: 'game-worth', ask: 'When are you worth the most to an ad-funded game?', options: ['When you’re winning easily', 'When you’re about to beat your record', 'When you’ve just started'], correct: 1, reveal: 'Near your record. That’s when you’re most likely to watch an ad to keep going. Near-misses make people want to play on more than wins do.' },
    { say: 'The same analysis says the game prices each player: a new iPhone player in the US is worth over 4 times one in India.' },
    { say: 'Ad networks really do report how much each player earns the app, and let apps set different ad prices for different players.' },
    { say: 'The developer did not respond, and nobody has repeated the analysis yet.' },
    { say: 'After a day of being managed and priced, even Arun’s rest was for sale.' },
  ],
};
