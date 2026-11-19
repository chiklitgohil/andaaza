import type { Debrief } from './types';

const OMOLEWA = { title: 'Block Blast breakdown', publisher: 'Ayo Omolewa (ayoships.com)', url: 'https://ayoships.com/breakdowns/block-blast', opened: true };

const NEWSLAUNDRY = { title: 'Sweat, surveillance and silence: lives at the margins of India’s quick e-commerce boom', publisher: 'Newslaundry', url: 'https://www.newslaundry.com/2025/05/01/sweat-surveillance-and-silence-lives-at-the-margins-of-indias-quick-e-commerce-boom', opened: true };

export const DEBRIEFS_SHIFT: Record<string, Debrief> = {
  verify: {
    actId: 'verify',
    title: 'Verify it’s you',
    message: 'Before Arun earns a rupee, software decides whether he is allowed to work. When a face check fails, or an account is blocked, there is often no person to argue with and no reason given.',
    honesty: 'The selfie is simulated: this page never uses your camera. Flopcart, its slots and its bonus are invented.',
    facts: [
      {
        text: 'In a survey of 150 Uber drivers in India, nearly half said they had been temporarily or permanently locked out of their accounts by selfie verification. Riders report Swiggy and Zomato also use selfies to log in.',
        label: 'REPORTED',
        response: 'Uber says facial recognition alone cannot deactivate anyone and at least two people review flags. Zomato says its systems detect impersonation.',
        sources: [{ title: 'Uber’s facial recognition is locking Indian drivers out of their accounts', publisher: 'MIT Technology Review', url: 'https://www.technologyreview.com/2022/12/06/1064287/ubers-facial-recognition-is-locking-indian-drivers-out-of-their-accounts/', opened: true }],
      },
      {
        text: 'A Zomato rider rated 4.85, his family’s only earner, was blocked in November 2024 for "behavioural issues". Zomato ignored two labour-department notices; in November 2025 the Telangana High Court issued notice to the company.',
        label: 'ALLEGED',
        response: 'Zomato’s stated reason was "behavioural issues", with no further detail made public.',
        sources: [{ title: 'Telangana HC pulls up Zomato for arbitrarily blocking delivery agent’s ID', publisher: 'Siasat', url: 'https://www.siasat.com/telangana-hc-pulls-up-zomato-for-arbitrarily-blocking-delivery-agents-id-3304456', opened: true }],
      },
      {
        text: 'In the UK, Uber Eats courier Pa Edrissa Manjang was removed after repeated facial-recognition "mismatches" and settled a race-discrimination claim in 2024, backed by the Equality and Human Rights Commission.',
        label: 'DOCUMENTED',
        response: 'Uber says facial verification "was not the reason" for his removal and that there was robust human review.',
        sources: [{ title: 'Bates Wells and the EHRC support Uber Eats driver who faced problematic AI checks', publisher: 'Bates Wells', url: 'https://bateswells.co.uk/updates/bates-wells-and-the-ehrc-supports-uber-eats-driver-who-faced-problematic-ai-checks/', opened: true }],
      },
      {
        text: 'A US government evaluation of 189 face-recognition algorithms from 99 developers (NIST, December 2019) found that most of them showed demographic differences in error rates: they made more mistakes for some groups of people than others.',
        label: 'DOCUMENTED',
        sources: [{ title: 'NIST Study Evaluates Effects of Race, Age, Sex on Face Recognition Software', publisher: 'NIST', url: 'https://www.nist.gov/news-events/news/2019/12/nist-study-evaluates-effects-race-age-sex-face-recognition-software', opened: true }],
      },
      {
        text: 'Blinkit riders told Newslaundry their daily bonus requires staying logged in from 12 to 4 pm, the hottest hours of the day.',
        label: 'REPORTED',
        response: 'Blinkit did not respond to Newslaundry’s questions.',
        sources: [NEWSLAUNDRY],
      },
      {
        text: 'Karnataka’s 2025 platform-workers law requires 14 days’ notice with reasons before a worker is terminated, and requires platforms to tell workers about automated monitoring and decision systems.',
        label: 'DOCUMENTED',
        sources: [{ title: 'The Karnataka Platform-based Gig Workers (Social Security and Welfare) Bill, 2025', publisher: 'PRS Legislative Research', url: 'https://prsindia.org/bills/states/the-karnataka-platform-based-gig-workers-social-security-and-welfare-bill-2025', opened: true }],
      },
    ],
  },
  offer: {
    actId: 'offer',
    title: 'The offer',
    message: 'Arun decides in seconds, with part of the picture. The rules that score those decisions (rejection limits, bonus targets, how distance is measured) are set by the app and can change overnight.',
    honesty: 'The offers, amounts and the 10.3 vs 13.0 km example are invented, shaped like the figures riders reported.',
    facts: [
      {
        text: 'Blinkit riders in Varanasi and Delhi said their daily bonus ladder changed in 2025: from ₹130 for 15 orders and ₹555 for 32, to ₹205 for 30, ₹338 for 40 and ₹448 for 43.',
        label: 'REPORTED',
        response: 'Blinkit did not respond to Newslaundry’s questions.',
        sources: [NEWSLAUNDRY],
      },
      {
        text: 'In April 2023 Blinkit moved riders from a flat fee per order to distance-based pay with booked slots. Riders said per-order pay fell from ₹25 to ₹15, and over half of about 200 Delhi-NCR dark stores shut for three days in protest.',
        label: 'CONTESTED',
        response: 'Blinkit called it an opt-in exercise that pays riders "based on their effort".',
        sources: [{ title: 'Blinkit services disrupted in Delhi NCR as delivery partners go on strike', publisher: 'Inc42', url: 'https://inc42.com/buzz/blinkit-services-disrupted-in-delhi-ncr-as-delivery-partners-go-on-strike', opened: true }],
      },
      {
        text: 'Swiggy riders reported in 2021 that more than one rejection in a day forfeited the daily incentive. During the December 2025 strike, Zomato temporarily waived rejection penalties, showing such penalties exist.',
        label: 'REPORTED',
        response: 'Swiggy confirmed incentives are tied to completion and regular login.',
        sources: [{ title: 'Food delivery workers tell their story on Twitter: say it’s a losing game', publisher: 'The News Minute', url: 'https://www.thenewsminute.com/news/food-delivery-workers-tell-their-story-twitter-say-its-losing-game-153410', opened: false }],
      },
      {
        text: 'Riders say map pins can be up to a kilometre off, so they ride distance they are not paid for.',
        label: 'ALLEGED',
        response: 'No company response found.',
        sources: [NEWSLAUNDRY],
      },
      {
        text: 'When US grocery app Shipt switched to a black-box pay formula, a worker-built audit (the "Shipt Calculator", MIT) found 41% of workers were paid less, by about 11% on average.',
        label: 'DOCUMENTED',
        response: 'Shipt said average base pay levels remained consistent.',
        sources: [{ title: 'The Shipt Calculator: crowdsourcing gig worker pay data to audit algorithmic management', publisher: 'MIT Media Lab', url: 'https://www.media.mit.edu/projects/the-shipt-calculator-crowdsourcing-gig-worker-pay-data-to-audit-algorithmic-management/overview/', opened: true }],
      },
    ],
  },
  wait: {
    actId: 'wait',
    title: 'Ready in 2 minutes',
    message: 'Some of Arun’s hardest work never appears on the screen: waiting for food, deciding whether to run a light, riding in 43°C. If the app does not count it, it is easy for everyone else not to see it.',
    honesty: 'The waiting time, the light and the outcomes of each choice are invented. They are not predictions of what happens on real roads.',
    facts: [
      {
        text: 'Interviews with delivery riders in India (2025) describe waiting at restaurants and repetitive app tapping as major unpaid "invisible labour".',
        label: 'REPORTED',
        response: 'Zomato says its published hourly earnings include waiting time.',
        sources: [{ title: 'Invisible labour of gig delivery workers (arXiv 2504.17697)', publisher: 'arXiv', url: 'https://arxiv.org/abs/2504.17697', opened: true }],
      },
      {
        text: 'All 13 Blinkit and Zepto riders Reuters interviewed in 2022 said 10-minute deadlines often made them speed.',
        label: 'CONTESTED',
        response: 'Blinkit’s CEO said riders are not penalised for delays and can ride at their own pace.',
        sources: [{ title: 'Delivery race among Indian grocery startups brings road safety risks', publisher: 'Reuters via Business Standard', url: 'https://www.business-standard.com/article/economy-policy/delivery-race-among-indian-grocery-startups-brings-road-safety-risks-122012300401_1.html', opened: false }],
      },
      {
        text: 'After Labour Minister Mansukh Mandaviya met the quick-commerce platforms in January 2026, Blinkit dropped "10 minutes" from its branding.',
        label: 'STATEMENT',
        response: 'Zomato’s CEO says riders never see the customer’s timer and that speed comes from nearby stores, not fast riding.',
        sources: [{ title: 'Blinkit drops 10-minute delivery claim after labour minister intervenes', publisher: 'The Week', url: 'https://www.theweek.in/wire-updates/business/2026/01/13/blinkit-drops-10-minute-delivery-claim-after-labour-min-intervenes-swiggy-zepto-may-follow-suit.html', opened: true }],
      },
      {
        text: 'A reporter who signed up as a rider during Delhi’s May 2026 heatwave (about 43°C) earned ₹44 for 57 minutes on one app and found a rest-point cooler with an empty tank.',
        label: 'REPORTED',
        response: 'The platforms said they provide coolers (Zepto), cooling vests (Instamart) and glucose sachets (Blinkit).',
        sources: [{ title: 'Instant delivery companies say they’re sheltering workers from the heat. Reality looks different', publisher: 'The Wire', url: 'https://m.thewire.in/article/business/special-instant-delivery-companies-say-theyre-sheltering-workers-from-the-heat-reality-looks-different', opened: true }],
      },
    ],
  },
  tip: {
    actId: 'tip',
    title: 'The tip',
    message: 'A customer believed their kindness went to Arun. In this what-if, it went to the company instead, while the app told him he got "100%". US regulators found two large platforms did exactly this.',
    honesty: 'Arun’s app is invented and we know of no regulator finding that an Indian platform treats tips this way. The mechanism shown comes from two documented US cases.',
    facts: [
      {
        text: 'DoorDash counted customer tips toward the pay it guaranteed workers, so a bigger tip mostly saved DoorDash money. With a $10 guarantee, a $0, $3, $6 or $9 tip all paid the worker exactly $10. New York settlement: $16.75 million for about 63,000 workers (2025).',
        label: 'DOCUMENTED',
        response: 'DoorDash admitted no wrongdoing and now itemises base pay, bonus and tip.',
        sources: [{ title: 'Attorney General James secures $16.75 million from DoorDash for cheating delivery workers', publisher: 'New York Attorney General', url: 'https://ag.ny.gov/press-release/2025/attorney-general-james-secures-1675-million-doordash-cheating-delivery-workers', opened: true }],
      },
      {
        text: 'Amazon quietly cut Flex drivers’ hourly pay and used tips to fill the gap, while form emails told drivers they received 100% of tips. The FTC required Amazon to pay $61.7 million (2021).',
        label: 'DOCUMENTED',
        sources: [{ title: 'Amazon to pay $61.7 million to settle FTC charges it withheld some customer tips from Amazon Flex drivers', publisher: 'US Federal Trade Commission', url: 'https://www.ftc.gov/news-events/news/press-releases/2021/02/amazon-pay-617-million-settle-ftc-charges-it-withheld-some-customer-tips-amazon-flex-drivers', opened: true }],
      },
      {
        text: 'DoorDash had settled an earlier case on the same practice with Washington DC in 2020 ($2.5 million).',
        label: 'DOCUMENTED',
        response: 'DoorDash denied wrongdoing and said it had changed its model.',
        sources: [{ title: 'AG Racine reaches $2.5 million agreement with DoorDash', publisher: 'Washington DC Attorney General', url: 'https://oag.dc.gov/release/ag-racine-reaches-25-million-agreement-doordash', opened: true }],
      },
      {
        text: 'In India, the Telangana Gig and Platform Workers Union says only about 5% of orders receive tips.',
        label: 'CONTESTED',
        response: 'Zomato’s CEO reports average earnings that exclude tips and says per-busy-hour comparisons are the wrong measure.',
        sources: [{ title: 'TGPWA counters Deepinder Goyal’s claim on delivery partner pay', publisher: 'Business Today', url: 'https://www.businesstoday.in/india/story/no-social-security-no-paid-insurance-tgpwa-counters-deepinder-goyals-claim-on-delivery-partner-pay-509258-2026-01-03', opened: false }],
      },
    ],
  },
  strike: {
    actId: 'strike',
    title: 'Log off at 7',
    message: 'When riders organise, the same app that sets their pay can make staying more attractive at exactly the right moment. And the headline "hourly" figure depends on which hours, and which costs, you count.',
    honesty: 'The chat, Imran and Suresh, the ₹150 offer timing and Arun’s ledger are invented. The costs are yours to adjust.',
    facts: [
      {
        text: 'On 25 and 31 December 2025, rider unions (including IFAT and TGPWU) called national strikes over pay, safety and 10-minute delivery. Platforms offered evening incentives of ₹120–150 per order and waived rejection penalties.',
        label: 'REPORTED',
        response: 'Eternal (Zomato) called the incentives routine for the festive season; its CEO said deliveries went at a record pace.',
        sources: [{ title: 'Swiggy, Zomato step up delivery incentives amid gig worker strike', publisher: 'Storyboard18', url: 'https://www.storyboard18.com/brand-marketing/swiggy-zomato-step-up-delivery-incentives-amid-gig-worker-strike-and-year-end-surge-86814.htm', opened: false }],
      },
      {
        text: 'Zomato’s CEO said in January 2026 that riders average ₹102 an hour excluding tips, counting all logged-in time. The Telangana union says it is about ₹81 an hour after costs.',
        label: 'CONTESTED',
        response: 'Zomato says per-"busy hour" comparisons are the wrong metric.',
        sources: [{ title: 'TGPWA counters Deepinder Goyal’s claim on delivery partner pay', publisher: 'Business Today', url: 'https://www.businesstoday.in/india/story/no-social-security-no-paid-insurance-tgpwa-counters-deepinder-goyals-claim-on-delivery-partner-pay-509258-2026-01-03', opened: false }],
      },
      {
        text: 'A 2024 survey of over 10,000 app-based cab and delivery workers in 8 Indian cities ("Prisoners on Wheels?") found 78% of delivery workers work more than 10 hours a day.',
        label: 'REPORTED',
        sources: [{ title: 'Prisoners on Wheels? report', publisher: 'TGPWU / PAIGAM / IFAT', url: 'https://tgpwu.org/2024/03/13/prisoners-on-wheels-report/', opened: false }],
      },
      {
        text: 'Fairwork India 2024 rated 11 platforms on fair pay, conditions, contracts, management and representation. None scored above 6 out of 10, and Ola, Uber and Porter scored 0.',
        label: 'DOCUMENTED',
        sources: [{ title: 'Fairwork India Ratings 2024', publisher: 'Fairwork India / IIIT Bangalore', url: 'https://citapp.iiitb.ac.in/wp-content/uploads/2024/10/Fairwork-India-2024-Report.pdf', opened: false }],
      },
    ],
  },
};

export const DEBRIEFS: Record<string, Debrief> = {
  ...DEBRIEFS_SHIFT,
  ride: {
    actId: 'ride',
    title: 'The ride home',
    message:
      'Arun spent the day being priced and paid by an app. Tonight he was the customer, and a single number on a screen hid everything that went into it. ' +
      'People suspect their phone, battery or card changes the price. The honest position is that two screenshots cannot prove it either way; only many careful, paired tests can.',
    honesty:
      'Gaadi, the stranger, Mahesh and every price in this chapter are invented. The sizes of the claimed effects come from single viral posts and one newspaper test, which the companies deny.',
    facts: [
      {
        text: 'In January 2025, viral posts in India showed the same trip quoted at ₹290.79 on an Android phone and ₹342.47 on an iPhone. India’s Central Consumer Protection Authority sent notices to Ola and Uber.',
        label: 'ALLEGED',
        response: 'Uber: "We do not set prices based on a rider’s phone manufacturer." Ola says it does not differentiate by phone for identical rides. We found no published finding by the regulator as of November 2026.',
        sources: [
          { title: 'Govt orders detailed probe into Ola, Uber over differential pricing', publisher: 'Inc42', url: 'https://inc42.com/buzz/govt-orders-detailed-probe-into-ola-uber-over-differential-pricing', opened: true },
          { title: 'Uber denies differential pricing based on phone models amid CCPA investigation', publisher: 'Storyboard18', url: 'https://www.storyboard18.com/brand-marketing/uber-denies-differential-pricing-based-on-phone-models-amid-ccpa-investigation-54545.htm', opened: false },
        ],
      },
      {
        text: 'Low battery: in 2016 Uber’s then head of economic research said riders with low batteries are more willing to accept surge pricing, and that Uber does not use this. A 2023 Brussels newspaper test with two phones got €17.56 at 12% battery and €16.60 at 84%; a US fact-check found identical prices.',
        label: 'CONTESTED',
        response: 'Uber says battery level is not used to set fares and that prices depend on demand and driver supply. A single two-phone test cannot separate battery from moment-to-moment price changes.',
        sources: [
          { title: 'Uber fares allegedly linked to phone battery levels', publisher: 'Brussels Times', url: 'https://www.brusselstimes.com/brussels-2/449143/uber-fares-allegedly-linked-to-phone-battery-levels/', opened: false },
          { title: 'Uber surge pricing and phone battery', publisher: 'Vice', url: 'https://vice.com/en/article/m7beq8/uber-surge-pricing-phone-battery', opened: false },
        ],
      },
      {
        text: 'Payment method: a viral US video (April 2026) showed $33.05 with an Amex card and $20.33 after switching to Visa. Other riders claim gift-card or credit balances raised their fares.',
        label: 'ALLEGED',
        response: 'Uber told Fortune that it never sets prices based on card brand, gift cards, Uber Cash, account balance or battery level.',
        sources: [{ title: 'Uber riders complain they were charged more for paying with Amex cards', publisher: 'Fortune', url: 'https://fortune.com/2026/04/23/amex-uber-fares-charge-more-higher-gift-cards-battery-low/', opened: false }],
      },
      {
        text: 'Uber’s privacy notice for riders (last updated 22 October 2026) lists: precise location from request to drop-off and while the app is open on screen; device data including motion data, hardware model, IP address, advertising identifiers and mobile network; selfies and facial verification information; call recordings, transcripts and chat logs; search history; gender inferred from first name; inferred interests for ad audiences; a predicted risk of conflict between users; and, outside the EEA, UK and Switzerland, “enrichment data” from data providers such as household income range, lifestyle, purchasing behaviour and viewing habits. Battery level is not listed.',
        label: 'DOCUMENTED',
        response: 'The notice is Uber’s own description of its practices; some items depend on permissions and country.',
        sources: [{ title: 'Uber Privacy Notice', publisher: 'Uber', url: 'https://www.uber.com/legal/en/document/?name=privacy-notice&country=united-states&lang=en', opened: true }],
      },
      {
        text: 'Consumer Reports had 174 volunteers compare Uber and Lyft fares for matching trips (March–April 2026): a 42.4% median gap between the lowest and highest quote, and 12.4% of displayed discounts were illusory.',
        label: 'CONTESTED',
        response: 'Uber: the findings are "based on a flawed methodology"; it "does not personalize prices, period." Lyft: "We do not engage in surveillance pricing."',
        sources: [
          { title: 'Consumer Reports investigation reveals Uber and Lyft AI-driven pricing tactics', publisher: 'Consumer Reports', url: 'https://www.consumerreports.org/media-room/press-releases/2026/06/consumer-reports-investigation-reveals-uber-and-lyft-ai-driven-pricing-tactics-lead-to-significantly-different-prices/', opened: true },
          { title: 'Uber comment on Consumer Reports', publisher: 'Uber', url: 'https://www.uber.com/us/en/newsroom/uber-comment-consumer-reports/', opened: true },
        ],
      },
    ],
  },
  arrive: {
    actId: 'arrive',
    title: 'What the fare paid for',
    message:
      'Arun paid one number and Mahesh received another. Neither of them saw the split when the ride was booked. ' +
      'How much of a fare reaches the driver is set by the platform, can change from trip to trip, and is rarely shown to either side.',
    honesty: 'Mahesh, his trips, his costs and every rupee in this chapter are invented. The cut you choose is a WHAT-IF; the facts below are not.',
    facts: [
      {
        text: 'India’s Motor Vehicle Aggregator Guidelines (July 2025) cap surge pricing at twice the base fare and say drivers using their own vehicles should receive at least 80% of the fare. States were asked to adopt them.',
        label: 'DOCUMENTED',
        sources: [{ title: 'Govt permits surge fares of up to 2x base rate for cab aggregators', publisher: 'Business Standard', url: 'https://www.business-standard.com/india-news/cab-aggregators-surge-pricing-rapido-uber-ola-125070200228_1.html', opened: false }],
      },
      {
        text: 'Using their legal right to their own data, 258 UK Uber drivers audited 1.5 million trips; researchers reported hourly pay falling after dynamic pricing and Uber’s share rising to as much as 50% on some trips.',
        label: 'CONTESTED',
        response: 'Uber: "We do not recognise the figures in this report." The drivers were volunteers, not a random sample.',
        sources: [{ title: 'Uber rejects University of Oxford study', publisher: 'TaxiPoint', url: 'https://www.taxi-point.co.uk/post/uber-rejects-university-of-oxford-study-that-finds-drivers-see-drop-in-pay-under-dynamic-pricing', opened: true }],
      },
    ],
  },
  game: {
    actId: 'game',
    title: 'One more game',
    message:
      'After a day of being managed by one app and priced by another, Arun’s rest is the next thing for sale. In an ad-funded game, ' +
      'the moment you are closest to beating your record can be the moment you are worth the most, because that is when you are most likely to watch an ad to keep going.',
    honesty:
      'Stack is our own simplified game, not a copy of any real app. Its hidden rules re-create what one researcher reported finding; the ad prices drawn for each deal and the pacing are invented.',
    facts: [
      {
        text: 'A developer decompiled the Android and iOS versions of Block Blast and reported encrypted rules, downloaded from its servers, that can deal a hand with no possible placement once a player has watched their last 3 rewarded ads, the ad loaded now pays at least 3.5 times their last one, and their score is a set step (500, 750 or 1,000) past their record.',
        label: 'REPORTED',
        response: 'Hungry Studio, the developer, did not reply to a request for comment (Inc., October 2026). The analysis has not been independently replicated, and the decryption key was withheld.',
        sources: [OMOLEWA, { title: 'Is Block Blast rigged? A developer decompiled the viral game to find out', publisher: 'Inc. via The Star', url: 'https://www.thestar.com.my/tech/tech-news/2026/10/28/is-block-blast-rigged-a-developer-decompiled-the-viral-game-to-find-out', opened: true }],
      },
      {
        text: 'The same analysis reports a second rule: once you are 10% past your record, each new hand has a 20% chance of being impossible. Others make pieces harder when you play fast near your record, and easier after two games below it.',
        label: 'REPORTED',
        response: 'No response from the developer found.',
        sources: [OMOLEWA],
      },
      {
        text: 'A per-player model reportedly prices you: a made-up new iPhone player was worth about $25.48 per 1,000 ads in the US, $8.08 in Brazil and $5.59 in India.',
        label: 'REPORTED',
        response: 'No response from the developer found. The researcher ran a ported copy of the model, not the live server.',
        sources: [OMOLEWA],
      },
      {
        text: 'The analysis reports that each request to the game’s ad-price server sends 40 fields (including carrier, storage, the hour and recent ad prices), and that on-device models with 27, 52 and 93 inputs (such as first score, phone model, RAM, country and time since install) predict ad value, level difficulty and next-day activity. Server-side models predict churn, lifetime value and whether you will tap “revive”; their weights are not visible.',
        label: 'REPORTED',
        response: 'Hungry Studio did not reply to a request for comment. The analysis has not been independently replicated.',
        sources: [OMOLEWA],
      },
      {
        text: 'Sensor Tower estimated that Block Blast made about $127 million from ads between January and May 2026 (about $131 million for its developer, Hungry Studio). These are market-tracker estimates, not company figures.',
        label: 'REPORTED',
        sources: [OMOLEWA, { title: 'Sensor Tower: Mobile Game Ad Monetization in 2026', publisher: 'Game Dev Reports (summary of Sensor Tower)', url: 'https://gamedevreports.substack.com/p/sensor-tower-mobile-game-ad-monetization', opened: false }],
      },
      {
        text: 'Ad platforms really do report ad revenue per individual user and let apps set different price floors for different players.',
        label: 'DOCUMENTED',
        sources: [
          { title: 'User-Level Ad Revenue API', publisher: 'AppLovin MAX documentation', url: 'https://support.applovin.com/en/max/reporting-apis/user-level-ad-revenue-api', opened: true },
          { title: 'Advanced settings (segments and bid floors)', publisher: 'Unity LevelPlay documentation', url: 'https://docs.unity.com/en-us/grow/levelplay/sdk/android/advanced-settings', opened: true },
        ],
      },
      {
        text: 'Players have long complained the game turns against them near a high score ("around the 1500 score… shapes that will auto fail you").',
        label: 'ALLEGED',
        response: 'Unverified app-store reviews. Some guides argue "impossible" hands come from poor board management.',
        sources: [{ title: 'Block Blast reviews', publisher: 'JustUseApp (App Store review aggregator)', url: 'https://justuseapp.com/en/app/1617391485/block-blast/reviews', opened: true }],
      },
      {
        text: 'In a study of Candy Crush players, near-misses produced the strongest urge to keep playing, more than wins or clear losses.',
        label: 'DOCUMENTED',
        sources: [{ title: 'The Candy Crush Sweet Tooth: how near-misses in Candy Crush increase frustration and the urge to continue gameplay', publisher: 'Journal of Gambling Studies 33(2), 2017', url: 'https://link.springer.com/article/10.1007/s10899-016-9633-7', opened: false }],
      },
    ],
  },
};
