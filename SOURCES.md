# The Glass City — Sources

Generated from `data/cases/*.json` and `data/myths.json`. Do not edit by hand; run `npm run sources`.

- 105 cases, 10 myths
- 148 source links: 76 were opened and read by the researchers; 72 were seen only in search-result snippets (marked "snippet").
- Facts are as of the date shown on each case.

## Evidence labels

DOCUMENTED, REPORTED, ALLEGED, CONTESTED, STATEMENT, WHAT-IF, FICTIONAL. See the About page in the site for definitions.

Rule for settlements: when a government enforcer (FTC, DOJ, a state attorney general, a national regulator) obtains an order or settlement, the case is DOCUMENTED for the order and its terms, and the underlying conduct is described as "alleged". Private class-action settlements are ALLEGED.

## Cases

### 'Algorithmic wage discrimination': how app workers describe their pay

**REPORTED** · 2023 · US · id `dubal-wage-discrimination-2023`

Legal scholarship based on ethnography (interviews and observation). It is qualitative, not a pay audit.

- **Collected:** Drivers' acceptance history, hours, locations and behaviour.
- **Inferred:** The lowest pay each driver is likely to accept, as drivers and the author describe it.
- **Done:** Law professor Veena Dubal, drawing on about nine years of fieldwork with ride-hail drivers, argues platforms use granular data to set personalised, variable and opaque pay. She calls for a ban.
- **Company response:** None found.
- **Outcome:** Influential in policy debates. (2023)
- **Limits:** Describes experiences and logic; does not measure pay differences statistically.

Sources:
- [On Algorithmic Wage Discrimination, 123 Colum. L. Rev. 1929](https://columbialawreview.org/content/on-algorithmic-wage-discrimination/). Columbia Law Review. primary, snippet

### "Twelve Million Phones, One Dataset, Zero Privacy"

**REPORTED** · 2019-12-19 · US · id `nyt-twelve-million-phones-2019`

Investigative journalism with an explained method.

- **Collected:** More than 50 billion location pings from more than 12 million US phones in 2016-17.
- **Inferred:** Home and work addresses, routines, identities.
- **Done:** Reporters showed the 'anonymous' data could be used to identify and follow specific people, including officials.
- **Company response:** None found.
- **Outcome:** No direct enforcement; widely cited in later regulation debates. (2019-12-19)
- **Limits:** Paywalled; we could not open the original. The source company was not named.

Sources:
- [Twelve Million Phones, One Dataset, Zero Privacy](https://www.nytimes.com/interactive/2019/12/19/opinion/location-tracking-cell-phone.html). The New York Times. primary, snippet

### "Unique in the Crowd": four location points

**DOCUMENTED** · 2013 · Global · id `de-montjoye-2013`

Peer-reviewed. 'Unique' is not the same as 'named'. Naming someone needs outside information.

- **Collected:** 15 months of phone-antenna location records for 1.5 million people.
- **Inferred:** Whether a person's trace is unique.
- **Done:** de Montjoye et al. (Scientific Reports, 2013) found that 4 hourly, antenna-level points uniquely identify 95% of individuals in the dataset.
- **Company response:** None found.
- **Outcome:** Research finding. (2013)
- **Limits:** Antenna-level data; GPS would be more precise still.

Sources:
- [Unique in the Crowd: The privacy bounds of human mobility](https://pmc.ncbi.nlm.nih.gov/articles/PMC3607247/). Scientific Reports (via PMC). primary, snippet

### 15 demographic facts could re-identify 99.98% of Americans (model estimate)

**DOCUMENTED** · 2019-07-23 · US · id `rocher-2019`

Peer-reviewed. This is a model ESTIMATE, not a count of real re-identifications.

- **Collected:** Demographic attributes.
- **Inferred:** Likelihood that a record is correctly re-identified.
- **Done:** Rocher, Hendrickx and de Montjoye (Nature Communications, 2019) estimated that 15 demographic attributes would correctly re-identify 99.98% of Americans in any dataset.
- **Company response:** None found.
- **Outcome:** Research finding. (2019-07-23)
- **Limits:** Model-based.

Sources:
- [Estimating the success of re-identifications in incomplete datasets using generative models](https://pmc.ncbi.nlm.nih.gov/articles/PMC6650473/). Nature Communications (via PMC). primary, snippet

### 23andMe: relatives' DNA data exposed through other people's accounts

**DOCUMENTED** · 2023-10 · US, UK, Global · id `23andme-2023`

Company disclosure, regulator penalties and court settlements.

- **Collected:** Ancestry, relatives and some health-related genetic reports.
- **Inferred:** Family links and ancestry.
- **Done:** Attackers reused leaked passwords (credential stuffing) to enter some accounts, then scraped relatives' information through DNA Relatives, exposing about 6.9 million people.
- **Company response:** None found.
- **Outcome:** UK ICO fine of £2.31 million (June 2025); class settlement revised to $46.75 million in bankruptcy; a multistate attorney-general settlement (2026). The company filed for bankruptcy in March 2025 and was bought by TTAM (a nonprofit led by co-founder Anne Wojcicki). (2025-07)
- **Limits:** Exact counts differ between sources.

Sources:
- [UK data privacy regulator fines 23andMe](https://therecord.media/uk-data-privacy-regulator-fines-23andme). The Record. secondary, snippet
- [Attorney General announces 23andMe settlement](https://www.ag.state.mn.us/Office/Communications/2026/07/14_23andMe.asp). Minnesota Attorney General. primary, snippet

### 52 of 53 top Indian apps used deceptive design

**REPORTED** · 2024-07 · India · id `asci-conscious-patterns-2024`

Industry self-regulatory body's study with a described method; not a regulator finding. Apps were not all named publicly.

- **Collected:** Not applicable (design audit).
- **Inferred:** Not applicable.
- **Done:** ASCI Academy and design firm Parallel HQ reviewed 53 popular Indian apps across 9 industries and found deceptive patterns in 52, averaging 2.7 per app; health-tech apps were highest.
- **Company response:** None found.
- **Outcome:** Study only. (2024-07)
- **Limits:** We could not read the report PDF directly.

Sources:
- [52 of 53 top apps in India use dark patterns, says ASCI study](https://www.business-standard.com/technology/apps/52-of-53-top-apps-in-india-use-dark-patterns-says-asci-study-124080101324_1.html). Business Standard. secondary, snippet

### A crawl of the top 1 million websites for tracking

**DOCUMENTED** · 2016-10 · Global · id `princeton-1m-sites-2016`

Peer-reviewed measurement (January 2016 crawl).

- **Collected:** Canvas, audio and font fingerprints, local network addresses and more.
- **Inferred:** A device identity that survives cookie clearing.
- **Done:** Englehardt and Narayanan (ACM CCS 2016) found canvas fingerprinting on 14,371 sites (from about 400 script domains), canvas-based font detection on 3,250, audio fingerprinting on 67 and WebRTC local-IP discovery on 715. The Battery API was used by only about two scripts.
- **Company response:** None found.
- **Outcome:** Fed into browser anti-fingerprinting features. (2016)
- **Limits:** A 2016 snapshot.

Sources:
- [Princeton Web Census](https://webtransparency.cs.princeton.edu/webcensus/). Princeton University. primary, opened

### A marketing firm's 'Active Listening' pitch

**STATEMENT** · 2024-08-26 · US · id `cmg-active-listening-2024`

A company's own sales claim. No technical evidence was shown that it works or was deployed.

- **Collected:** Claimed: voice data picked up by device microphones.
- **Inferred:** Claimed: purchase intent from conversations.
- **Done:** 404 Media published a Cox Media Group pitch deck claiming it could target ads using 'Active Listening' and listing Google, Meta and Amazon as partners.
- **Company response:** Google removed CMG from its Partners Program. Meta said it does not use your phone's microphone for ads and was reviewing CMG. Amazon said it has never worked with CMG on this program. (Company statements reported by 404 Media and others)
- **Outcome:** No regulator action found. (2024)
- **Limits:** Marketing claims are not evidence of capability.

Sources:
- [Here's the Pitch Deck for 'Active Listening' Ad Targeting](https://www.404media.co/heres-the-pitch-deck-for-active-listening-ad-targeting/). 404 Media. primary, snippet

### A priest outed using commercially available app data

**REPORTED** · 2021-07 · US · id `pillar-grindr-2021`

A news outlet's own report. Its method was not disclosed, and its ethics are widely CONTESTED.

- **Collected:** App-signal and location data, said to be commercially available, from an unnamed vendor.
- **Inferred:** That a specific person used a gay dating app and where.
- **Done:** The Pillar published the findings, and the priest resigned.
- **Company response:** Grindr called it an "unethical, homophobic witch hunt" and said it doubted the data came from Grindr. (Grindr statement via AP)
- **Outcome:** No legal outcome; widely cited as the first public case of broker data used to out a named person. (2021-07)
- **Limits:** The method was not disclosed, so it cannot be checked. Experts called the report vague.

Sources:
- [Priest outed via Grindr app highlights rampant data tracking](https://wjla.com/news/nation-world/priest-outed-via-grindr-app-highlights-rampant-data-tracking). Associated Press via WJLA. secondary, snippet

### A Telegram bot returned CoWIN vaccination details

**CONTESTED** · 2023-06 · India · id `cowin-bot-2023`

Journalists REPORTED the bot; the government disputes that CoWIN itself was breached.

- **Collected:** Names, ID numbers and vaccination details.
- **Inferred:** Not applicable.
- **Done:** Journalists reported a Telegram bot that returned registration details for a given phone or Aadhaar number.
- **Company response:** The health ministry said CoWIN was not directly breached and called some reports "mischievous"; officials said the bot likely used previously stolen data. (Press Information Bureau)
- **Outcome:** CERT-In investigation; no public report found. (2023-06)
- **Limits:** Origin of the data unresolved.

Sources:
- [Health ministry statement on CoWIN](https://pib.gov.in/PressReleasePage.aspx?PRID=1931691). Press Information Bureau, Government of India. primary, snippet

### Air India passenger data exposed through a vendor

**DOCUMENTED** · 2021-05-21 · India, Global · id `air-india-sita-2021`

Company disclosure (admission).

- **Collected:** Names, dates of birth, contact details, passport, ticket and frequent-flyer data (2011-2021).
- **Inferred:** Not applicable.
- **Done:** Air India disclosed that about 4.5 million passengers' data was affected in a breach at SITA.
- **Company response:** Air India said SITA did not hold card CVV numbers. (Air India statement)
- **Outcome:** The same vendor breach affected other airlines. (2021-05-21)
- **Limits:** Company's own figures.

Sources:
- [Air India says data breach impacts 4.5 million former passengers](https://therecord.media/air-india-says-data-breach-impacts-4-5-million-former-passengers). The Record. secondary, snippet

### Amazon Prime sign-up and cancellation: $2.5 billion

**DOCUMENTED** · 2025-09-25 · US · id `amazon-prime-2025`

Court-approved settlement. Amazon did not admit wrongdoing.

- **Collected:** Checkout and subscription behaviour.
- **Inferred:** Who could be nudged into a subscription.
- **Done:** The FTC alleged Amazon enrolled consumers in Prime without consent through confusing checkout designs and made cancelling hard through a multi-step process internally called 'Iliad'.
- **Company response:** "Amazon and our executives have always followed the law, and this settlement allows us to move forward and focus on innovating for customers." (Amazon spokesperson Mark Blafkin, via press coverage)
- **Outcome:** $1 billion civil penalty plus $1.5 billion in refunds. It requires a clear decline button, clear terms, and cancellation as easy as sign-up. (2025-09-25)
- **Limits:** Settled during trial, so the allegations were not decided by a court.

Sources:
- [FTC Secures Historic $2.5 Billion Settlement Against Amazon](https://www.ftc.gov/news-events/news/press-releases/2025/09/ftc-secures-historic-25-billion-settlement-against-amazon). US Federal Trade Commission. primary, opened, 2025-09-25
- [Amazon to pay $2.5 billion to settle FTC allegations](https://www.pbs.org/newshour/economy/amazon-to-pay-2-5-billion-to-settle-ftc-allegations-it-duped-customers-into-enrolling-in-prime). PBS NewsHour. secondary, snippet

### Amazon: Alexa kept children's voice recordings; Ring staff could view customers' videos

**DOCUMENTED** · 2023-05-31 · US · id `alexa-ring-2023`

FTC/DOJ orders. Amazon disagreed with the claims and denied breaking the law.

- **Collected:** Children's voice recordings and location data from Alexa; private home video from Ring cameras.
- **Inferred:** Not the main issue. The cases were about keeping and accessing the data.
- **Done:** The FTC and DOJ alleged Amazon kept children's Alexa recordings indefinitely, undermined deletion requests, and used them to train its algorithms. Separately, the FTC alleged Ring let employees and contractors access customers' private videos.
- **Company response:** Amazon said it disagreed with the FTC's claims and denied violating the law, but that the settlements put these matters behind it. (Amazon statement via press coverage (snippet))
- **Outcome:** $25 million (Alexa, children's privacy law) and $5.8 million (Ring). (2023-05-31)
- **Limits:** Settled. No finding that recordings were used for ads.

Sources:
- [FTC and DOJ Charge Amazon with Violating Children's Privacy Law by Keeping Kids' Alexa Voice Recordings Forever](https://www.ftc.gov/news-events/news/press-releases/2023/05/ftc-doj-charge-amazon-violating-childrens-privacy-law-keeping-kids-alexa-voice-recordings-forever). US Federal Trade Commission. primary, opened, 2023-05-31
- [Amazon will pay $25 million in FTC child data privacy fine](https://www.csmonitor.com/Business/2023/0601/Amazon-will-pay-25-million-in-FTC-child-data-privacy-fine). Christian Science Monitor. secondary, snippet

### Amazon's 'Project Nessie' pricing algorithm

**ALLEGED** · 2023-09 · US · id `amazon-nessie-2023`

Allegation in an FTC antitrust complaint (heavily redacted).

- **Collected:** Competitors' prices.
- **Inferred:** Which price increases competitors would match.
- **Done:** In its antitrust case, the FTC alleges Amazon used 'Project Nessie' to raise prices where it predicted rivals would follow, earning over $1 billion in extra profit.
- **Company response:** Amazon said the FTC "grossly mischaracterizes" an old tool meant to stop unsustainably low prices that "didn't work as intended, so we scrapped it". (Amazon spokesperson Tim Doyle via NBC News)
- **Outcome:** Part of ongoing antitrust litigation. (2023)
- **Limits:** Allegations; redacted complaint.

Sources:
- [Amazon used algorithm to raise prices, FTC alleges](https://www.nbcnews.com/business/business-news/amazon-used-algorithm-raise-prices-rcna123410). NBC News. secondary, opened

### Antivirus software sold users' browsing histories

**DOCUMENTED** · 2024-02-22 · US, Global · id `avast-jumpshot-2024`

FTC order. No admission of wrongdoing.

- **Collected:** Detailed web browsing data from Avast's antivirus and browser extensions.
- **Inferred:** Interests, purchases, health, religion and more, from sites visited.
- **Done:** The FTC alleged Avast's subsidiary Jumpshot sold browsing data from 2014 to 2020 to more than 100 third parties.
- **Company response:** None found.
- **Outcome:** $16.5 million for consumer refunds and a ban on selling browsing data for advertising. (2024-06-26)
- **Limits:** '100+' counts buyers, not consumers.

Sources:
- [FTC Order Will Ban Avast from Selling Browsing Data for Advertising Purposes](https://www.ftc.gov/news-events/news/press-releases/2024/02/ftc-order-will-ban-avast-selling-browsing-data-advertising-purposes-require-it-pay-165-million-over). US Federal Trade Commission. primary, opened, 2024-02-22

### Arizona v. Google: location tracked after users turned it off

**DOCUMENTED** · 2022-10-04 · US · id `google-location-arizona-2022`

State attorney-general settlement. Google did not admit wrongdoing.

- **Collected:** Location data, including through settings other than 'Location History' (such as 'Web & App Activity').
- **Inferred:** Movements and places visited.
- **Done:** Arizona's attorney general alleged Google misled users into thinking that switching off Location History stopped location tracking.
- **Company response:** Google said the case concerned outdated product policies it had changed years earlier, and pointed to its controls and auto-delete options. (Google statement, via press coverage (snippet))
- **Outcome:** $85 million settlement. (2022-10-04)
- **Limits:** Settled; the allegations were not tested at trial.

Sources:
- [Google to Pay $85 Million to Settle Arizona Geolocation Tracking Privacy Suit](https://www.huntonprivacyblog.com/2022/10/12/google-to-pay-85-million-to-settle-arizona-geolocation-tracking-privacy-suit/). Hunton Privacy Blog. secondary, snippet

### BetterHelp shared therapy sign-up answers with ad platforms

**DOCUMENTED** · 2023-03 · US · id `betterhelp-2023`

FTC order. BetterHelp did not admit wrongdoing.

- **Collected:** Email addresses, IP addresses and answers to an intake questionnaire, including whether someone had been in therapy before.
- **Inferred:** That a person was seeking mental-health help.
- **Done:** The FTC alleged BetterHelp shared this information with Facebook, Snapchat, Criteo and Pinterest for advertising, despite promising privacy, and in 2020 falsely denied press reports about it.
- **Company response:** BetterHelp says the settlement is not an admission of wrongdoing, and describes the practices as industry-standard. (betterhelp.com response page)
- **Outcome:** $7.8 million for partial refunds and a ban on sharing health data for advertising. Refund notices went to about 800,000 customers in 2024. (2023-07-14)
- **Limits:** Refunds were small (around $10 each per reports). The facts are the FTC's allegations, settled, not tried.

Sources:
- [FTC to Ban BetterHelp from Revealing Consumers' Data, Including Sensitive Mental Health Information, to Facebook and Others](https://www.ftc.gov/news-events/news/press-releases/2023/03/ftc-ban-betterhelp-revealing-consumers-data-including-sensitive-mental-health-information-facebook). US Federal Trade Commission. primary, opened, 2023-03-02
- [BetterHelp response to the recent FTC settlement](https://www.betterhelp.com/betterhelp-response-to-the-recent-ftc-settlement/). BetterHelp. primary, opened
- [BetterHelp customers to receive refunds over data misuse](https://www.nbcnews.com/business/consumer/betterhelp-online-therapy-customers-receive-refunds-over-data-misuse-rcna151546). NBC News. secondary, snippet

### BigBasket customer database offered for sale

**REPORTED** · 2020-11 · India · id `bigbasket-2020`

Security researchers' report. The company said it was evaluating the claim.

- **Collected:** Names, emails, password hashes, phones, addresses, dates of birth, location and login IP addresses.
- **Inferred:** Not applicable.
- **Done:** Security firm Cyble reported a database of about 20 million BigBasket users for sale on the dark web.
- **Company response:** BigBasket said it was confident financial data was secure and was "evaluating the extent of the breach and authenticity of the claim", and filed a police complaint. (BigBasket via The News Minute)
- **Outcome:** No follow-up findings published. (2020-11)
- **Limits:** Size not independently confirmed.

Sources:
- [BigBasket data breach](https://www.thenewsminute.com/atom/confident-financial-data-secure-bigbasket-data-breach-137304). The News Minute. secondary, opened

### boAt customer data posted on a hacker forum

**REPORTED** · 2024-04 · India · id `boat-2024`

Journalists checked a sample. The total is the hacker's claim.

- **Collected:** Names, phones, emails, addresses and order IDs.
- **Inferred:** Not applicable.
- **Done:** A hacker claimed to post data on more than 7.5 million customers. TechCrunch said part of a sample appeared genuine.
- **Company response:** boAt said it was aware of claims regarding a potential data leak and was investigating. (boAt via TechCrunch)
- **Outcome:** No published findings. (2024-04)
- **Limits:** The 7.5 million figure comes from the hacker.

Sources:
- [Indian audio giant boAt investigating data breach](https://techcrunch.com/2024/04/08/indian-audio-giant-boat-data-breach-investigation). TechCrunch. secondary, opened

### Brown v. Google: tracking in 'Incognito' mode

**ALLEGED** · 2024-04-01 · US · id `google-incognito-2024`

Private class-action settlement; no admission or finding.

- **Collected:** Browsing data while users were in Incognito/private mode.
- **Inferred:** Interests and identity.
- **Done:** Plaintiffs alleged Google collected browsing data in private mode despite implying privacy. Internal emails quoted in court filings called Incognito 'effectively a lie'.
- **Company response:** Google called the suit meritless and said it never associates Incognito data with users. (Google statement via The Register)
- **Outcome:** Google agreed to delete billions of records, update disclosures and block third-party cookies in Incognito for five years. No cash for the class. (2024-04-01)
- **Limits:** Settlement, not a ruling.

Sources:
- [Google will delete data collected in Incognito mode](https://www.theregister.com/2024/04/01/google_will_delete_data_incognito/). The Register. secondary, opened

### Cambridge Analytica: a personality quiz harvested friends' data

**DOCUMENTED** · 2019-12-06 · US, UK · id `cambridge-analytica-2019`

FTC opinion and order for the deception. That psychographic targeting was effective is CONTESTED: the UK ICO (2020) found the company's methods "knowingly oversold".

- **Collected:** Facebook profile data from people who took a quiz app (GSRApp) and from their friends.
- **Inferred:** Personality profiles ('psychographics') and political leanings.
- **Done:** The FTC found Cambridge Analytica deceived people about collecting identifiable data. At least 250,000 app users and 50-65 million of their friends were affected, per the FTC.
- **Company response:** Cambridge Analytica was bankrupt and did not respond; its former CEO and the app developer settled with the FTC. (FTC)
- **Outcome:** FTC order requiring deletion of data. UK ICO letter (2 October 2020, to Julian Knight MP) found no Facebook data used for Brexit and no evidence of Russian involvement beyond what was known. (2019-12-06)
- **Limits:** We could not open the ICO letter PDF itself.

Sources:
- [FTC Sues Cambridge Analytica, Settles with Former CEO and App Developer](https://www.ftc.gov/news-events/news/press-releases/2019/07/ftc-sues-cambridge-analytica-settles-former-ceo-app-developer). US Federal Trade Commission. primary, snippet
- [UK investigation confirms Cambridge Analytica sought to predict partisanship](https://techcrunch.com/2020/10/06/cambridge-analytica-sought-to-use-facebook-data-to-predict-partisanship-for-voter-targeting-uk-investigation-confirms). TechCrunch. secondary, opened

### Chicago ride-hail fares and neighbourhood demographics

**DOCUMENTED** · 2021 · US · id `pandey-caliskan-2021`

Peer-reviewed analysis. It measured NEIGHBOURHOODS, not individuals, and is correlational.

- **Collected:** City of Chicago public trip data (about 100 million trips) joined with census demographics.
- **Inferred:** Associations between fares and neighbourhood characteristics.
- **Done:** Pandey and Caliskan (AAAI/ACM AIES 2021) found fares were associated with neighbourhood share of non-white residents, poverty, age and education (effect sizes from small to medium).
- **Company response:** None found.
- **Outcome:** Academic finding. (2021)
- **Limits:** Cannot separate demand and surge effects from bias; not evidence of personal profiling.

Sources:
- [Disparate Impact of Artificial Intelligence Bias in Ridehailing Economy's Price Discrimination Algorithms](https://arxiv.org/abs/2006.04599). arXiv / AIES 2021. primary, opened

### Clearview AI scraped billions of faces

**DOCUMENTED** · 2024-09-03 · EU, UK, US, Global · id `clearview-ai`

Multiple regulator decisions. Clearview disputes EU jurisdiction.

- **Collected:** More than 30 billion photos scraped from the public web, per the Dutch regulator.
- **Inferred:** Face templates (biometric identifiers) that let a photo be matched to a person.
- **Done:** Clearview built a face-search tool sold mainly to law enforcement. EU regulators found it processed biometric data illegally.
- **Company response:** Clearview says it does not serve EU customers and disputes that EU law applies; it did not object to the Dutch decision. (Clearview statements via press coverage)
- **Outcome:** Fines in Italy, Greece, France (€20 million each) and the Netherlands (€30.5 million), largely unpaid. The UK fine is still in the courts. A US class settlement approved in March 2025 was vacated by the Seventh Circuit on 13 July 2026. (2026-07-13)
- **Limits:** Fines exist on paper but are hard to collect across borders.

Sources:
- [Clearview AI hit with its largest GDPR fine yet](https://techcrunch.com/2024/09/03/clearview-ai-hit-with-its-largest-gdpr-fine-yet-as-dutch-regulator-considers-holding-execs-personally-liable/). TechCrunch. secondary, snippet
- [Seventh Circuit undoes novel privacy class settlement](https://blogs.duanemorris.com/classactiondefense/2026/07/14/seventh-circuit-undoes-novel-privacy-class-settlement-due-to-lack-of-separate-representatives-for-nationwide-class-and-state-sub-classes/). Duane Morris. secondary, opened

### Consumer Reports: same ride, different prices on Uber and Lyft

**CONTESTED** · 2026-06-16 · US · id `cr-uber-lyft-2026`

Investigation REPORTED by Consumer Reports; both companies dispute the method. Press coverage often cites different figures (such as 50% or 11%). These are CR's own.

- **Collected:** Trip requests; the companies acknowledge using personal data for promotions.
- **Inferred:** Prices and which promotions to show.
- **Done:** Consumer Reports had 174 volunteers in March-April 2026 compare fares for matching trips. It reported a 42.4% median gap between lowest and highest quotes and found 12.4% of displayed discounts were illusory.
- **Company response:** Uber: the findings are "based on a flawed methodology" and it "does not personalize prices, period". Lyft: "We do not engage in surveillance pricing." (Uber newsroom; Lyft statement via CR)
- **Outcome:** Consumer Reports wrote to the FTC asking for an investigation; no FTC action found. (2026-07)
- **Limits:** Two requests a few seconds or metres apart are not perfectly identical. Prices change with supply and demand.

Sources:
- [Consumer Reports investigation reveals Uber and Lyft AI-driven pricing tactics](https://www.consumerreports.org/media-room/press-releases/2026/06/consumer-reports-investigation-reveals-uber-and-lyft-ai-driven-pricing-tactics-lead-to-significantly-different-prices/). Consumer Reports. primary, opened, 2026-06-16
- [Uber comment on Consumer Reports](https://www.uber.com/us/en/newsroom/uber-comment-consumer-reports/). Uber. primary, opened

### COVID-test records offered on a hacker forum

**REPORTED** · 2023-10 · India · id `icmr-2023`

Security researchers verified samples. The exact source (ICMR, NIC or the health ministry) is unknown.

- **Collected:** Names, phone numbers, addresses, Aadhaar and passport numbers.
- **Inferred:** Not applicable.
- **Done:** A seller claimed 815 million records. Security firm Resecurity checked samples against Aadhaar verification and found matches.
- **Company response:** No detailed public government response found; CERT-In reportedly alerted ICMR. (Press coverage)
- **Outcome:** Investigations reported; no public findings. (2023-10)
- **Limits:** Size is the seller's claim.

Sources:
- [81.5 crore Indians' personal data leaked, claims hacker](https://www.businesstoday.in/technology/story/815-crore-indians-personal-data-leaked-claims-hacker-403861-2023-10-30). Business Today. secondary, opened

### Dark patterns at scale: a crawl of 11,000 shopping sites

**DOCUMENTED** · 2019-11 · Global · id `mathur-dark-patterns-2019`

Peer-reviewed measurement.

- **Collected:** Not applicable (a measurement of website designs).
- **Inferred:** Not applicable.
- **Done:** Mathur et al. (ACM CSCW 2019) crawled about 53,000 product pages on about 11,000 shopping sites and found 1,818 dark-pattern instances of 15 types. 183 websites used clearly deceptive practices, and 22 third-party companies sold dark patterns as ready-made services.
- **Company response:** None found.
- **Outcome:** Widely cited by regulators. (2019)
- **Limits:** A lower bound: the crawler could not see every pattern.

Sources:
- [Dark Patterns at Scale: Findings from a Crawl of 11K Shopping Websites](https://arxiv.org/abs/1907.07032). arXiv / ACM CSCW 2019. primary, opened

### Data about people who never joined

**DOCUMENTED** · 2019 · Global · id `shadow-profiles-research`

Peer-reviewed research. Note the weak predictive power in Garcia's study.

- **Collected:** Contact lists uploaded by users; personal details friends share.
- **Inferred:** Information about non-users or about users from others' data.
- **Done:** Venkatadri et al. (PETS 2019) showed Facebook used personal details obtained from friends' contact uploads, and phone numbers given for two-factor login, for ad targeting. Garcia (Science Advances, 2017) showed friends' data could predict non-users' traits, but only modestly (AUC about 0.57-0.62, where 0.5 is chance).
- **Company response:** Mark Zuckerberg told Congress in 2018 that Facebook collects some data on people who have not signed up "for security purposes". (US House hearing, 11 April 2018)
- **Outcome:** Research findings. (2019)
- **Limits:** Predictions about non-users are much weaker than headlines suggest.

Sources:
- [Investigating sources of PII used in Facebook's targeted advertising](https://petsymposium.org/popets/2019/popets-2019-0013.php). PoPETs 2019. primary, snippet
- [Leaking privacy and shadow profiles in online social networks](https://pmc.ncbi.nlm.nih.gov/articles/PMC5544396/). Science Advances (via PMC). primary, opened

### Data brokers offered to sell mental-health data

**DOCUMENTED** · 2023-02 · US · id `duke-mental-health-brokers-2023`

A university research report describing its method (Duke Sanford School).

- **Collected:** Data about Americans' mental-health conditions, such as depression, anxiety, ADHD, bipolar disorder, insomnia and PTSD.
- **Inferred:** Who has which condition.
- **Done:** Researcher Joanne Kim contacted 37 brokers; 26 responded and 11 were willing to sell mental-health data. One quoted $275 for 5,000 aggregated counts; others offered subscriptions of $75,000 to $100,000 a year.
- **Company response:** None found.
- **Outcome:** No enforcement action tied to the report. (2023-02)
- **Limits:** The researcher did not complete large purchases, so the quality of what was offered is unknown.

Sources:
- [Data Brokers and the Sale of Americans' Mental Health Data](https://techpolicy.sanford.duke.edu/data-brokers-and-the-sale-of-americans-mental-health-data/). Duke Sanford School of Public Policy. primary, opened, 2023-02
- [Study finds data brokers selling Americans' mental health data](https://siliconangle.com/2023/02/13/study-finds-data-brokers-selling-americans-mental-health-data/). SiliconANGLE. secondary, snippet

### Delta's AI pricing: what it told investors versus senators

**STATEMENT** · 2025-07-31 · US · id `delta-fetcherr-2025`

Company statements. A widely quoted line about pricing 'to you, the individual' could not be verified by us.

- **Collected:** Demand and market data; Delta says no personal data is used in fares.
- **Inferred:** Fares for routes and times.
- **Done:** Delta told investors it was expanding AI-assisted pricing (about 3% of its domestic network in mid-2025). After senators wrote to it, Delta stated that it does not and will not use individualised prices based on personal data.
- **Company response:** "There is no fare product Delta has ever used, is testing or plans to use that targets customers with individualized prices based on personal data." (Delta letter to senators, 31 July 2025)
- **Outcome:** Senators said the reply left questions unanswered; no regulator action. (2025-08)
- **Limits:** We cannot see inside the pricing system either way.

Sources:
- [Delta responds to misinformation around AI pricing](https://news.delta.com/delta-responds-misinformation-around-ai-pricing). Delta News Hub. primary, opened, 2025-08-07

### Domino's India order data leak claim

**CONTESTED** · 2021-04 · India · id `dominos-india-2021`

Company confirmed a security incident but disputed that financial data leaked; the size is from researchers and sellers.

- **Collected:** Claimed: names, phones, addresses and order details.
- **Inferred:** Not applicable.
- **Done:** Researchers and sellers claimed about 180 million order records and 1 million cards were exposed.
- **Company response:** Jubilant FoodWorks confirmed an information security incident but said no financial information was accessed. (Jubilant via The News Minute)
- **Outcome:** No published findings. (2021-04)
- **Limits:** Size unverified.

Sources:
- [Domino's data breach: Jubilant says no financial data leaked](https://www.thenewsminute.com/article/dominos-pizza-data-breach-jubilant-foodworks-says-no-financial-data-leaked-147572). The News Minute. secondary, snippet

### Drivers' own data shows Uber's take rising under dynamic pay

**CONTESTED** · 2025-06 · UK · id `oxford-wie-uber-pay-2025`

Peer-reviewed study, but the sample is self-selected, and Uber disputes the figures.

- **Collected:** Trip and pay records, obtained by drivers under GDPR data-access rights.
- **Inferred:** Changes in hourly pay and the platform's cut.
- **Done:** Researchers (FAccT 2025) reported drivers' hourly pay fell from £22.20 to £19.06 after dynamic pay was introduced, and Uber's cut rose from about 25% to as high as 50% on some trips.
- **Company response:** Uber: "We do not recognise the figures in this report." (Uber statement via TaxiPoint)
- **Outcome:** Academic finding. (2025-06)
- **Limits:** 258 volunteers may not represent all drivers.

Sources:
- [Algorithmic pay audit of Uber drivers (FAccT 2025)](https://arxiv.org/abs/2506.15278). arXiv / ACM FAccT. primary, snippet
- [Uber rejects University of Oxford study](https://www.taxi-point.co.uk/post/uber-rejects-university-of-oxford-study-that-finds-drivers-see-drop-in-pay-under-dynamic-pricing). TaxiPoint. secondary, opened

### Epic Games: Fortnite purchase design and children's privacy ($520 million)

**DOCUMENTED** · 2022-12-19 · US · id `epic-fortnite-2022`

FTC orders. Epic did not admit wrongdoing.

- **Collected:** Children's personal information; in-game purchase behaviour.
- **Inferred:** Not the core issue. The case was about design and consent.
- **Done:** The FTC alleged Epic used dark patterns that led players into unwanted purchases, locked accounts of people who disputed charges, and broke children's privacy law, including turning voice and text chat on by default.
- **Company response:** Epic wrote that "no developer creates a game with the intention of ending up here" and said the laws had not changed but their application had. (Epic Games news post (snippet))
- **Outcome:** $275 million penalty under the children's privacy law (COPPA) plus $245 million in refunds: $520 million total. (2022-12-19)
- **Limits:** Settled.

Sources:
- [Fortnite Video Game Maker Epic Games to Pay More Than Half a Billion Dollars](https://www.ftc.gov/news-events/news/press-releases/2022/12/fortnite-video-game-maker-epic-games-pay-more-half-billion-dollars-over-ftc-allegations). US Federal Trade Commission. primary, opened, 2022-12-19
- [Epic Games agrees to pay record-breaking $520 million](https://therecord.media/epic-games-agrees-to-pay-record-breaking-520-million-for-privacy-violations). The Record. secondary, snippet

### Facebook's ad delivery skewed by gender and race even with neutral targeting

**DOCUMENTED** · 2019-11 · US · id `ali-ad-delivery-2019`

Peer-reviewed measurement.

- **Collected:** Engagement history used by the ad-delivery algorithm.
- **Inferred:** Who is most 'relevant' to an ad.
- **Done:** Ali et al. (CSCW 2019) ran real ads with identical, neutral targeting and found significant skew in delivery along gender and racial lines, driven by the ad's content and budget.
- **Company response:** None found.
- **Outcome:** Cited in the 2022 DOJ/HUD settlement with Meta. (2019)
- **Limits:** Measured specific ads at a specific time.

Sources:
- [Discrimination through optimization: How Facebook's ad delivery can lead to skewed outcomes](https://arxiv.org/abs/1904.02095). arXiv / ACM CSCW 2019. primary, opened

### Facebook's emotional contagion experiment

**DOCUMENTED** · 2014-06-02 · Global · id `emotional-contagion-2014`

Peer-reviewed (PNAS). The journal later published an Editorial Expression of Concern about consent. Whether it measured mood rather than word choice is CONTESTED.

- **Collected:** Posts in users' News Feeds and the words users then wrote.
- **Inferred:** Whether seeing fewer positive or negative posts changed what people wrote.
- **Done:** Researchers reduced positive or negative posts in feeds and measured emotional words in users' own posts. Removing positive posts reduced users' positive words by about 0.1 percentage points (effect size d = 0.02).
- **Company response:** Lead author Adam Kramer apologised publicly for how the paper described the research. (Press coverage)
- **Outcome:** PNAS Expression of Concern (July 2014) on informed consent and opt-out. (2014-07-03)
- **Limits:** Measured words, not feelings. Effects were very small.

Sources:
- [Experimental evidence of massive-scale emotional contagion through social networks](https://pmc.ncbi.nlm.nih.gov/articles/PMC4066473/). PNAS (via PubMed Central). primary, opened, 2014-06-02

### Fairwork India ratings of gig platforms

**REPORTED** · 2024-10 · India · id `fairwork-india-2024`

Academic-led ratings project with a published method.

- **Collected:** Not applicable (ratings).
- **Inferred:** Not applicable.
- **Done:** Fairwork India 2024 rated 11 platforms using desk research, platform evidence and interviews with 440 workers. BigBasket, Swiggy, Urban Company and Zomato scored highest at 6/10; Ola, Porter and Uber scored 0. No platform showed that all its workers earn a local living wage after costs.
- **Company response:** None found.
- **Outcome:** Ratings published. Rajasthan (2023) and Karnataka (2025) have since passed gig-worker welfare laws. (2024-10)
- **Limits:** A score reflects evidence the platform provided or researchers found; low scores can mean no evidence offered.

Sources:
- [Fairwork India Ratings 2024 report (PDF)](https://citapp.iiitb.ac.in/wp-content/uploads/2024/10/Fairwork-India-2024-Report.pdf). Fairwork India / IIIT Bangalore. primary, snippet
- [Fairwork India’s sixth report examines the changing nature of platform work](https://fairwork.oii.ox.ac.uk/en/fw/blog/fairwork-indias-sixth-report-examines-the-changing-nature-of-platform/). Fairwork (Oxford Internet Institute). secondary, snippet

### Flo period-tracking app shared health data through software kits

**DOCUMENTED** · 2021-01 · US, Global · id `flo-ftc-2021`

FTC order (5-0 vote). No admission of wrongdoing.

- **Collected:** Menstrual cycle and pregnancy information that users logged in the Flo app (more than 100 million users).
- **Inferred:** Pregnancy and reproductive health status.
- **Done:** The FTC alleged that, despite privacy promises, Flo shared this data with Facebook, Google, AppsFlyer and Flurry through software development kits (SDKs) built into the app, until a Wall Street Journal story in February 2019.
- **Company response:** None found.
- **Outcome:** Final order requiring user consent, notice to users and that recipients delete data. No money. (2021-06-22)
- **Limits:** The FTC order carried no money; two commissioners argued it should have been brought as a health-breach case.

Sources:
- [Developer of Popular Women's Fertility-Tracking App Settles FTC Allegations](https://www.ftc.gov/news-events/news/press-releases/2021/01/developer-popular-womens-fertility-tracking-app-settles-ftc-allegations-it-misled-consumers-about). US Federal Trade Commission. primary, opened, 2021-01-13

### FTC and states v. Live Nation/Ticketmaster: hidden fees

**ALLEGED** · 2025-09-18 · US · id `ticketmaster-ftc-2025`

Lawsuit filed; not decided. A separate DC drip-pricing settlement ($9.9 million, April 2026) was reported.

- **Collected:** Purchase behaviour.
- **Inferred:** Not the core issue.
- **Done:** The FTC and seven states allege Ticketmaster advertised prices lower than the total, revealing fees (in some cases up to 44%) late in checkout, and misrepresented ticket limits.
- **Company response:** Ticketmaster said it now uses all-in pricing consistent with FTC rules and denied engaging in unfair or deceptive acts; Live Nation has moved to dismiss parts of the case, arguing the FTC misreads the 2016 BOTS Act. (Company statements and filings, via secondary coverage (Relix, Hypebot))
- **Outcome:** Pending, per reports. (2025-09-18)
- **Limits:** Allegations only.

Sources:
- [FTC sues Live Nation and Ticketmaster](https://www.ftc.gov/news-events/news/press-releases/2025/09/ftc-sues-live-nation-ticketmaster-engaging-illegal-ticket-resale-tactics-deceiving-artists-consumers). US Federal Trade Commission. primary, snippet
- [Live Nation and Ticketmaster File to Dismiss FTC Ticket Resale Lawsuit](https://relix.com/news/detail/live-nation-and-ticketmaster-file-to-dismiss-ftc-ticket-resale-lawsuit). Relix. secondary, snippet

### FTC fines Facebook $5 billion over privacy deception

**DOCUMENTED** · 2019-07-24 · US · id `ftc-facebook-2019`

FTC order (3-2 vote). No admission of the allegations.

- **Collected:** Profile and friends' data available to third-party apps; phone numbers given for security (two-factor login).
- **Inferred:** Not the core issue.
- **Done:** The FTC alleged Facebook deceived users about their control over their data, breaking its 2012 FTC order, including letting apps access friends' data and using security phone numbers for advertising.
- **Company response:** None found.
- **Outcome:** $5 billion penalty, a 20-year order, an independent board privacy committee and quarterly certifications by the CEO. (2019-07-24)
- **Limits:** Two commissioners dissented, arguing it was too weak.

Sources:
- [FTC Imposes $5 Billion Penalty and Sweeping New Privacy Restrictions on Facebook](https://www.ftc.gov/news-events/news/press-releases/2019/07/ftc-imposes-5-billion-penalty-sweeping-new-privacy-restrictions-facebook). US Federal Trade Commission. primary, opened, 2019-07-24

### FTC study: the tools for 'surveillance pricing' exist

**DOCUMENTED** · 2025-01-17 · US · id `ftc-surveillance-pricing-2025`

Regulator study. It documents CAPABILITY, not actual use: the report used only hypothetical examples. Capability is not proof of use.

- **Collected:** Location, demographics, browsing history, mouse movements, items left in a cart, according to documents from pricing intermediaries.
- **Inferred:** Willingness to pay and the 'right' price or offer for an individual.
- **Done:** FTC staff reviewed documents from 6 intermediaries (Mastercard, Accenture, PROS, Bloomreach, Revionics and McKinsey) serving at least 250 clients, and found their products can use such data to set individualised prices or offers.
- **Company response:** None found.
- **Outcome:** Preliminary findings released on a 3-2 vote; the two Republican commissioners dissented. The new chair later closed the public comment request. Later status is unclear. (2025-01-17)
- **Limits:** No named retailer was shown using individualised pricing.

Sources:
- [FTC Surveillance Pricing Study Indicates Wide Range of Personal Data Used to Set Individualized Consumer Prices](https://www.ftc.gov/news-events/news/press-releases/2025/01/ftc-surveillance-pricing-study-indicates-wide-range-personal-data-used-set-individualized-consumer). US Federal Trade Commission. primary, opened, 2025-01-17

### FTC v. Kochava ends with limits on sensitive location data

**DOCUMENTED** · 2026-05-04 · US · id `kochava-2026`

FTC-approved stipulated order (2-0). We could not confirm the court had entered it as of November 2026.

- **Collected:** Precise location linked to mobile advertising IDs from millions of devices.
- **Inferred:** Visits to reproductive health clinics, places of worship, shelters and addiction-recovery centres, according to the FTC.
- **Done:** The FTC sued in 2022, alleging Kochava sold data that could identify people and track them to sensitive places.
- **Company response:** None found.
- **Outcome:** Order requiring consent for sensitive location data, a sensitive-locations program, supplier checks and data deletion. No money. (2026-05-04)
- **Limits:** Ended in an injunction only, so a court never ruled on the core question.

Sources:
- [FTC v. Kochava, Inc. case page](https://www.ftc.gov/legal-library/browse/cases-proceedings/ftc-v-kochava-inc). US Federal Trade Commission. primary, snippet
- [FTC Remains on the Location Data Beat](https://www.proskauer.com/blog/ftc-remains-on-the-location-data-beat-agency-settles-long-running-kochava-enforcement-even-as-state-regulation-has-already-changed-the-landscape). Proskauer. secondary, snippet

### FTC v. Uber: the Uber One subscription

**ALLEGED** · 2025-04-21 · US · id `uber-one-2025`

FTC lawsuit (amended December 2025). Not decided.

- **Collected:** Subscription and payment details.
- **Inferred:** Not the core issue.
- **Done:** The FTC alleges Uber enrolled people in Uber One without consent, overstated its savings, and made cancellation take up to 23 screens and 32 actions.
- **Company response:** Uber said it was disappointed and that cancelling takes about 20 seconds in the app. (Uber statement via press coverage (snippet))
- **Outcome:** Pending. (2025-04-21)
- **Limits:** Allegations only.

Sources:
- [FTC Takes Action Against Uber for Deceptive Billing and Cancellation Practices](https://www.ftc.gov/news-events/news/press-releases/2025/04/ftc-takes-action-against-uber-deceptive-billing-cancellation-practices). US Federal Trade Commission. primary, opened, 2025-04-21

### GM sold driving behaviour to firms that feed insurers

**DOCUMENTED** · 2026-01-14 · US · id `gm-onstar-2026`

FTC final order. GM did not admit wrongdoing. The names of the recipients come from NYT reporting (REPORTED); GM confirmed sharing 'certain insights'.

- **Collected:** Precise location and driving behaviour (speeding, hard braking, late-night driving) from GM cars through OnStar 'Smart Driver'.
- **Inferred:** Driving risk.
- **Done:** The FTC alleged GM sold this data to consumer reporting agencies. New York Times reporting (March 2024) named LexisNexis and Verisk, and drivers said their insurance rose.
- **Company response:** GM said it stopped sharing with LexisNexis and Verisk in March 2024, and that the FTC had formally approved the agreement reached the year before. (GM statements via NYT and TechCrunch)
- **Outcome:** Five-year ban on sharing location and driving data with consumer reporting agencies; consent, access and deletion rights for 20 years. No money. Texas also sued in August 2024 (ALLEGED). (2026-01-14)
- **Limits:** How much the scores changed individual premiums is not documented in the order. LexisNexis said the score was one factor of many.

Sources:
- [FTC Finalizes Order Settling Allegations GM and OnStar Collected and Sold Geolocation Data](https://www.ftc.gov/news-events/news/press-releases/2026/01/ftc-finalizes-order-settling-allegations-gm-onstar-collected-sold-geolocation-data-without-consumers). US Federal Trade Commission. primary, opened, 2026-01-14
- [The FTC's data-sharing order against GM is finally settled](https://techcrunch.com/2026/01/14/the-ftcs-data-sharing-order-against-gm-is-finally-settled/). TechCrunch. secondary, opened

### GoodRx shared prescription data for advertising

**DOCUMENTED** · 2023-02 · US · id `goodrx-2023`

FTC complaint resolved by a court order. GoodRx did not admit wrongdoing.

- **Collected:** Prescription medications, health conditions and contact details of people using GoodRx's discount app and website.
- **Inferred:** Health conditions, from which medications a person bought or searched for.
- **Done:** The FTC alleged GoodRx shared this data with advertising platforms and, in 2019, uploaded lists of users who bought particular medications to Facebook so it could target them with health-related ads. It also alleged a misleading HIPAA seal.
- **Company response:** GoodRx said it does not agree with the FTC's allegations, admits no wrongdoing, and settled to avoid the cost of litigation. (GoodRx statement, as reported in search results (original page blocked))
- **Outcome:** $1.5 million civil penalty and a permanent ban on sharing health data for advertising. The FTC called it its first enforcement of the Health Breach Notification Rule. (2023-02-01)
- **Limits:** The penalty is small next to the company's revenue, and the facts come from the FTC's complaint rather than a trial.

Sources:
- [FTC Enforcement Action to Bar GoodRx from Sharing Consumers' Sensitive Health Info for Advertising](https://www.ftc.gov/news-events/news/press-releases/2023/02/ftc-enforcement-action-bar-goodrx-sharing-consumers-sensitive-health-info-advertising). US Federal Trade Commission. primary, opened, 2023-02-01
- [FTC slaps online pharmacy GoodRx for sharing users' health data](https://techcrunch.com/2023/02/01/ftc-slaps-online-pharmacy-goodrx-for-sharing-users-health-data-with-facebook-and-google). TechCrunch. secondary, snippet

### Google Play: personal-loan apps can't read your contacts or photos

**DOCUMENTED** · 2023-05-31 · India, Global · id `play-personal-loan-policy`

Published platform policy. Reports say more than 2,000 loan apps were removed in India (REPORTED).

- **Collected:** Not applicable (a policy).
- **Inferred:** Not applicable.
- **Done:** Google Play's financial-services policy bars personal-loan apps from requesting access to contacts, photos and media, precise location and the full list of installed apps. In India, loan apps must appear on the RBI-reported list of digital lending apps.
- **Company response:** None found.
- **Outcome:** In force. (2023)
- **Limits:** Apps outside the Play Store are not covered.

Sources:
- [Financial Services policy](https://support.google.com/googleplay/android-developer/answer/9876821). Google Play Console Help. primary, opened

### Gravy Analytics and Mobilewalla: sensitive places and protest attendance

**DOCUMENTED** · 2024-12-03 · US · id `gravy-mobilewalla-2024`

FTC final orders (Gravy 5-0; Mobilewalla split vote). No admission of wrongdoing.

- **Collected:** Location data, including from real-time bidding (ad auctions) where apps broadcast data to many bidders.
- **Inferred:** Visits to healthcare facilities and places of worship; for Mobilewalla, pregnancy-centre visitors and people who attended protests, profiled by city and race (per FTC complaint and secondary summaries).
- **Done:** The FTC alleged both companies sold or used these sensitive inferences.
- **Company response:** None found.
- **Outcome:** Final orders banning the sale of sensitive location data; the first FTC claim that harvesting ad-auction data is itself unfair. (2025-01-14)
- **Limits:** Some segment details for Mobilewalla come from secondary summaries of the complaint.

Sources:
- [FTC Finalizes Order Prohibiting Gravy Analytics, Venntel from Selling Sensitive Location Data](https://www.ftc.gov/news-events/news/press-releases/2025/01/ftc-finalizes-order-prohibiting-gravy-analytics-venntel-selling-sensitive-location-data). US Federal Trade Commission. primary, opened, 2025-01-14
- [FTC Finalizes Orders Against Data Brokers Over Sensitive Location Data](https://www.hunton.com/privacy-and-cybersecurity-law-blog/ftc-finalizes-orders-against-data-brokers-over-sensitive-location-data). Hunton Andrews Kurth. secondary, opened

### How unique is a browser fingerprint?

**DOCUMENTED** · 2018 · Global · id `fingerprint-uniqueness`

Peer-reviewed measurements. The difference is about WHO was measured.

- **Collected:** Browser and device attributes any site can read (see the Mirror Room).
- **Inferred:** Whether a browser can be recognised again without cookies.
- **Done:** Eckersley (EFF, 2010) found 83.6% of 470,161 browsers unique; Laperdrix et al. (IEEE S&P 2016) found 89.4% of 118,934. Both used volunteers on privacy-test sites. Gómez-Boix et al. (The Web Conference 2018) studied 2,067,942 fingerprints from a general French website and found only 33.6% unique.
- **Company response:** None found.
- **Outcome:** Browsers (Safari, Firefox, Brave) have since reduced some exposed details. (2018)
- **Limits:** Browsers and populations keep changing.

Sources:
- [How Unique Is Your Web Browser?](https://coveryourtracks.eff.org/static/browser-uniqueness.pdf). Electronic Frontier Foundation. primary, snippet, 2010
- [Beauty and the Beast: Diverting modern web browsers to build unique browser fingerprints](https://hal.science/hal-01285470). IEEE S&P 2016 (HAL). primary, opened, 2016
- [Hiding in the Crowd: an Analysis of the Effectiveness of Browser Fingerprinting at Large Scale](https://hal.science/hal-01718234). The Web Conference 2018 (HAL). primary, snippet, 2018

### India bans 59 Chinese apps, including TikTok

**STATEMENT** · 2020-06-29 · India · id `india-app-ban-2020`

The government's stated reasons. No public technical evidence was released; the ban came during a border clash with China.

- **Collected:** Per the government: user data from apps such as TikTok.
- **Inferred:** Not stated.
- **Done:** India's IT ministry blocked 59 apps under Section 69A of the IT Act, saying they were "prejudicial to sovereignty and integrity of India" and citing concerns about data security and privacy.
- **Company response:** TikTok said it complied with Indian law. We did not find its exact statement in an opened source. (Press coverage)
- **Outcome:** Ban remains in place. (2020-06-29)
- **Limits:** Reasons are a statement, not a published finding.

Sources:
- [Government Bans 59 mobile apps](https://pib.gov.in/PressReleasePage.aspx?PRID=1635206). Press Information Bureau, Government of India. primary, snippet, 2020-06-29

### India names 13 dark patterns in official guidelines

**DOCUMENTED** · 2023-11-30 · India · id `india-dark-patterns-guidelines-2023`

Official government guidelines. A June 2025 advisory asking platforms to self-audit is reported by secondary sources.

- **Collected:** Not applicable.
- **Inferred:** Not applicable.
- **Done:** The Central Consumer Protection Authority (CCPA) issued the Guidelines for Prevention and Regulation of Dark Patterns, 2023, under the Consumer Protection Act 2019. The 13 patterns: false urgency, basket sneaking, confirm shaming, forced action, subscription trap, interface interference, bait and switch, drip pricing, disguised advertisement, nagging, trick question, SaaS billing, and rogue malware.
- **Company response:** None found.
- **Outcome:** In force; enforcement so far is mainly notices (for example on 'advance tips'). (2023-11-30)
- **Limits:** We could not open the official government PDF (blocked). No separate penalty is specified in the guidelines.

Sources:
- [Guidelines for Prevention and Regulation of Dark Patterns, 2023](https://www.mondaq.com/india/consumer-protection/1400578/guidelines-for-prevention-and-regulation-of-dark-patterns-2023). Mondaq (summary). secondary, snippet

### India's CCPA flags 'advance tip' prompts in ride-hail apps

**ALLEGED** · 2025-05 · India · id `ccpa-advance-tip-2025`

Regulator notice; no final order found.

- **Collected:** Tipping behaviour.
- **Inferred:** Who will pay extra for speed.
- **Done:** The CCPA issued a notice to Uber (and reportedly scrutinised Ola and Rapido) over prompts nudging riders to tip in advance for faster service.
- **Company response:** Uber said it continues to engage with authorities and had made app changes. (Press coverage)
- **Outcome:** Minister Pralhad Joshi: 'Forcing or nudging users to pay a tip in advance for faster service is unethical and exploitative.' No final order found. (2025-05)
- **Limits:** Notice only.

Sources:
- [CCPA flags Uber's advance tip feature as unfair trade practice](https://www.storyboard18.com/brand-marketing/ccpa-flags-ubers-advance-tip-feature-as-unfair-trade-practice-66889.htm). Storyboard18. secondary, opened

### India's CCPA notices to Ola and Uber over iPhone vs Android fares

**ALLEGED** · 2025-01-23 · India · id `ola-uber-ccpa-2025`

Regulator notice, not a finding. In March 2025 the minister told Parliament both firms denied it. We found no published CCPA finding as of November 2026.

- **Collected:** Phone type.
- **Inferred:** Claimed: willingness to pay.
- **Done:** After viral comparisons, the Central Consumer Protection Authority issued notices to Ola and Uber about alleged differential pricing based on phone model. The minister called it a 'prima facie unfair trade practice'.
- **Company response:** Uber: "We do not set prices based on a rider's phone manufacturer." It said pickup point, ETA and drop-off differed. Ola said it follows a homogeneous pricing structure and does not differentiate by phone for identical rides. (Company statements via Storyboard18 and Business Today)
- **Outcome:** No published finding. (2025-03)
- **Limits:** Two phones in one moment can still differ in exact location, account history and offers.

Sources:
- [Uber denies differential pricing based on phone models](https://www.storyboard18.com/brand-marketing/uber-denies-differential-pricing-based-on-phone-models-amid-ccpa-investigation-54545.htm). Storyboard18. secondary, snippet
- [Govt orders detailed probe into Ola, Uber over differential pricing](https://inc42.com/buzz/govt-orders-detailed-probe-into-ola-uber-over-differential-pricing). Inc42. secondary, opened

### InMarket built audiences like "wealthy and not healthy"

**DOCUMENTED** · 2024-01-18 · US · id `inmarket-2024`

FTC order. No admission of wrongdoing.

- **Collected:** Precise location from InMarket's own apps and its SDK in other apps.
- **Inferred:** Segments such as "Christian church goers", "parents of preschoolers" and "wealthy and not healthy".
- **Done:** The FTC alleged InMarket used the data to place people in nearly 2,000 advertising audiences without properly telling them.
- **Company response:** None found.
- **Outcome:** First FTC ban on a company selling or licensing precise location data. (2024-05-01)
- **Limits:** The segment names come from the FTC complaint; how often each list was used is not public.

Sources:
- [FTC Order Will Ban InMarket from Selling Precise Consumer Location Data](https://www.ftc.gov/news-events/news/press-releases/2024/01/ftc-order-will-ban-inmarket-selling-precise-consumer-location-data). US Federal Trade Commission. primary, opened, 2024-01-18

### InMobi inferred location from Wi-Fi even when users said no

**DOCUMENTED** · 2016-06-22 · US · id `inmobi-2016`

FTC settlement. No admission of wrongdoing.

- **Collected:** Nearby Wi-Fi network identifiers (BSSIDs).
- **Inferred:** Location, by matching Wi-Fi networks against a database.
- **Done:** The FTC alleged InMobi tracked consumers' locations, including those who had denied location permission, and collected children's data.
- **Company response:** None found.
- **Outcome:** $4 million penalty (suspended to $950,000 based on ability to pay). (2016-06-22)
- **Limits:** Operating systems have since restricted Wi-Fi scanning.

Sources:
- [Mobile Advertising Network InMobi Settles FTC Charges](https://www.ftc.gov/news-events/news/press-releases/2016/06/mobile-advertising-network-inmobi-settles-ftc-charges-it-tracked-hundreds-millions-consumers). US Federal Trade Commission. primary, snippet, 2016-06-22

### Instacart showed shoppers different prices for the same groceries

**DOCUMENTED** · 2025-12-09 · US · id `instacart-eversight-2025`

Investigation REPORTED by Consumer Reports and partners; Instacart confirmed the tests existed (company admission). There is no evidence they used personal data.

- **Collected:** Which test group a shopper was assigned to (Instacart says not personal or demographic data).
- **Inferred:** How demand changes at different prices (a price test).
- **Done:** Consumer Reports, Groundwork Collaborative and More Perfect Union had 437 volunteers shop the same items at the same time (193 submissions analysed). About 74% of items appeared at more than one price; the average gap between lowest and highest was 13%, up to 23%.
- **Company response:** Instacart said the tests were randomised and "never" used personal, demographic or user-level behavioural data, and later ended them: "if two families are shopping for the same items, at the same time, from the same store location on Instacart, they see the same prices — period." (Instacart statements via press coverage)
- **Outcome:** Instacart ended item price tests in December 2025. Reuters reported an FTC civil investigative demand. (A separate $60 million FTC settlement about delivery fees is a different case.) (2025-12-22)
- **Limits:** Random price testing is not personalised pricing. It still means two neighbours can pay different amounts.

Sources:
- [Instacart price investigation](https://groundworkcollaborative.org/work/instacart). Groundwork Collaborative. primary, opened, 2025-12-09
- [Instacart ends AI price test after Consumer Reports investigation](https://bgr.com/2059269/instacart-ends-ai-price-test-consumer-report-investigation). BGR. secondary, snippet

### Instagram's internal research on teen girls

**CONTESTED** · 2021-09 · US, UK · id `meta-teen-research-2021`

Leaked documents REPORTED by the WSJ; Meta disputes the interpretation. The 32% applies only to girls who already felt bad about their bodies, from non-causal research.

- **Collected:** Internal survey and focus-group research by Facebook (now Meta).
- **Inferred:** Effects of Instagram on teens' wellbeing.
- **Done:** The WSJ reported an internal slide: "32% of teen girls said that when they felt bad about their bodies, Instagram made them feel worse."
- **Company response:** Meta said the figure applied only to girls already struggling with body image, that teens reported Instagram helped on 11 of 12 wellbeing issues, and that some findings came from small focus groups. (Meta newsroom, 26 September 2021)
- **Outcome:** Congressional hearings; later state lawsuits (see New Mexico v. Meta). (2021)
- **Limits:** We could not open the WSJ original (paywalled).

Sources:
- [What Our Research Really Says About Teen Well-Being and Instagram](https://about.fb.com/news/2021/09/research-teen-well-being-and-instagram/). Meta. primary, opened, 2021-09-26

### Instant-loan apps used borrowers' contact lists for harassment

**REPORTED** · 2020-2022 · India · id `india-loan-apps-harassment`

Police actions and press investigations. The resulting rules (RBI 2022, Google Play policy) are DOCUMENTED separately.

- **Collected:** Borrowers' contact lists, photos and other phone data, through app permissions.
- **Inferred:** Who in a borrower's life could be used to apply social pressure.
- **Done:** Police and press reported recovery agents messaging borrowers’ relatives and contacts, including with morphed (edited) photos, to shame them into repaying. Suicides were linked to this harassment in police investigations, and Hyderabad-area police received dozens of complaints and made arrests.
- **Company response:** None found.
- **Outcome:** RBI rules and app-store bans followed (see related cases). (2022)
- **Limits:** Many apps were unregistered or offshore and are hard to trace. Specific apps are not named here.

Sources:
- [Hyderabad police find Chinese link in instant loan apps cases that drove 3 to suicide](https://theprint.in/india/hyderabad-police-find-chinese-link-in-instant-loan-apps-cases-that-drove-3-to-suicide/572729/). ThePrint. secondary, snippet
- [Loan app torture: Pics of Hyderabad woman who borrowed money morphed, agent held](https://www.thenewsminute.com/article/loan-app-torture-pics-hyderabad-woman-who-borrowed-money-morphed-agent-held-164469). The News Minute. secondary, snippet

### iOS 14 caught apps reading the clipboard

**REPORTED** · 2020-06 · Global · id `ios14-clipboard-2020`

Independent developer research, confirmed in practice by Apple's new warning. TikTok's explanation is a STATEMENT.

- **Collected:** Whatever was on the clipboard (passwords, messages, links).
- **Inferred:** Varies; often unknown.
- **Done:** Developers Mysk and Haj Bakry reported more than 50 apps reading the clipboard. Apple's iOS 14 beta added a notification, which showed TikTok reading it every few keystrokes.
- **Company response:** TikTok said the behaviour came from an anti-spam feature and pushed an update to remove it. (TikTok statement via press coverage)
- **Outcome:** Apple's paste notification became standard. (2020-06)
- **Limits:** Reading the clipboard is not proof the data was sent away.

Sources:
- [Popular iPhone and iPad apps snooping on the pasteboard](https://www.mysk.blog/2020/03/10/popular-iphone-and-ipad-apps-snooping-on-the-pasteboard/). Mysk. primary, snippet

### Jury finds Meta liable over Flo app data

**DOCUMENTED** · 2025-08-01 · US · id `flo-jury-2025`

Jury verdict. Damages had not been set as of November 2026; further appeals are possible.

- **Collected:** Data from Flo app users sent to Meta through its software kit.
- **Inferred:** Reproductive health information, according to plaintiffs.
- **Done:** A federal jury in Frasco v. Flo Health found Meta liable under the California Invasion of Privacy Act. Google, Flo and Flurry settled before the verdict for a combined $59.5 million.
- **Company response:** Meta said it disagreed with the verdict and would explore all legal options. (Press coverage (secondary))
- **Outcome:** Meta's post-trial motions were denied (September 2025, per secondary reports). A damages decision was still pending as of November 2026. (2025-08-01)
- **Limits:** The case page belongs to the plaintiffs' lawyers. The final damages and any appeal outcome are unknown.

Sources:
- [Frasco v. Flo Health, Inc. case page](https://www.labaton.com/cases/frasco-v-flo-health-inc). Labaton Keller Sucharow (plaintiffs' counsel). primary, opened
- [Jury Finds Meta Liable for Misusing Women's Health Data](https://www.lawdragon.com/news-features/2025-08-25-big-tech-on-trial-jury-finds-meta-liable-for-misusing-women-health-data). Lawdragon. secondary, snippet

### Juspay payment-gateway breach

**DOCUMENTED** · 2021-01 · India · id `juspay-2021`

Company admitted the breach. The SIZE is CONTESTED.

- **Collected:** Masked card data, card fingerprints, emails and phone numbers.
- **Inferred:** Not applicable.
- **Done:** An attacker accessed Juspay systems in August 2020 using a developer access key. A researcher claimed 10 crore (100 million) records; Juspay said about 3.5 crore.
- **Company response:** Juspay called the 10-crore figure incorrect and said no full card numbers, PINs or passwords leaked. (Juspay via The News Minute)
- **Outcome:** Juspay changed internal access controls. (2021-01)
- **Limits:** Neither count independently verified.

Sources:
- [Juspay refutes 10 cr card data breach claim](https://www.thenewsminute.com/article/juspay-refutes-10-cr-card-data-breach-claim-says-info-only-35-cr-users-leaked-140921). The News Minute. secondary, opened

### Massachusetts v. Robinhood: 'gamified' investing

**DOCUMENTED** · 2024-01-18 · US · id `robinhood-ma-2024`

State consent order. Robinhood neither admitted nor denied the gamification allegations.

- **Collected:** Trading behaviour and app engagement.
- **Inferred:** Who could be prompted to trade more.
- **Done:** Massachusetts securities regulators alleged Robinhood used game-like features (confetti, scratch-off rewards, frequent notifications and top-mover lists) to encourage inexperienced investors to trade.
- **Company response:** "We reject the premise that any part of our app, past or present, is 'gamified.'" (Robinhood statement via InvestmentNews)
- **Outcome:** $7.5 million settlement (also covering a 2021 data breach affecting about 117,000 Massachusetts customers). (2024-01-18)
- **Limits:** Settled.

Sources:
- [Robinhood to pay $7.5M to settle Massachusetts charges](https://www.investmentnews.com/regulation-and-legislation/news/robinhood-to-pay-7-5m-to-settle-massachusetts-charges-248214). InvestmentNews. secondary, opened

### Measuring price discrimination and steering on 16 sites

**DOCUMENTED** · 2014-11 · US · id `hannak-2014`

Peer-reviewed measurement. Most individual experiments found no personalisation; the 9 of 16 refers to sites with at least some evidence.

- **Collected:** Account status, browsing history, device type (mobile vs desktop).
- **Inferred:** Which prices or result orders to show.
- **Done:** Hannak et al. (ACM IMC 2014) tested 10 retailers and 6 travel sites with about 300 real users plus control accounts. They found personalisation on 9 of 16: price differences on Cheaptickets and Orbitz (logged-in members), steering on Expedia and Hotels.com, and mobile differences on Home Depot and Travelocity.
- **Company response:** None found.
- **Outcome:** Academic finding. (2014-11)
- **Limits:** 2014 data; sites change their systems constantly.

Sources:
- [Is the price right? Study finds price discrimination online](https://news.northeastern.edu/2014/10/23/ecommerce-study/). Northeastern University. secondary, opened
- [Measuring Price Discrimination and Steering on E-commerce Web Sites](https://dl.acm.org/doi/10.1145/2663716.2663744). ACM IMC 2014. primary, snippet

### Meta Pixel on hospital websites

**REPORTED** · 2022-06-16 · US · id `hospital-pixel-2022`

Investigative journalism with a published, reproducible technical method. Class-action claims about it are ALLEGED.

- **Collected:** Clicks on 'schedule appointment' buttons, doctors' names, search terms such as 'pregnancy termination' and, inside some patient portals, medications and allergies.
- **Inferred:** Possible health conditions linked to a browser or Facebook account.
- **Done:** The Markup tested the top 100 US hospitals and found the pixel sending such data to Meta on 33 of their websites, and inside 7 patient portals.
- **Company response:** Meta said that sensitive data its systems detect "will be removed before it can be stored in our ads systems". (Meta spokesperson quoted by The Markup)
- **Outcome:** Many hospitals removed the pixel after the report; at least 35 of 40 systems later contacted had done so. Lawsuits followed. (2022-09)
- **Limits:** Shows data was sent, not what Meta did with it afterwards.

Sources:
- [Facebook Is Receiving Sensitive Medical Information from Hospital Websites](https://themarkup.org/pixel-hunt/2022/06/16/facebook-is-receiving-sensitive-medical-information-from-hospital-websites). The Markup. primary, opened
- [Meta Faces Mounting Questions from Congress](https://themarkup.org/pixel-hunt/2022/09/19/meta-faces-mounting-questions-from-congress-on-health-data-privacy-as-hospitals-remove-facebook-tracker). The Markup. secondary, opened

### MobiKwik KYC data leak claim

**CONTESTED** · 2021-03 · India · id `mobikwik-2021`

Researchers' claim versus company denial; no public audit result found.

- **Collected:** Claimed: KYC (identity-verification) documents and card data.
- **Inferred:** Not applicable.
- **Done:** Researchers claimed the data of about 100 million users was offered online. The RBI ordered a forensic audit.
- **Company response:** MobiKwik denied a breach. (Press coverage)
- **Outcome:** RBI directed a forensic audit by a CERT-In-empanelled auditor; no public result found. (2021-04)
- **Limits:** Unresolved in public.

Sources:
- [RBI directs MobiKwik to carry out forensic audit](https://www.thenewsminute.com/money/rbi-directs-mobikwik-carry-out-forensic-audit-over-alleged-data-breach-146337). The News Minute. secondary, snippet

### Motion sensors can leak what you tap

**DOCUMENTED** · 2016 · Global · id `motion-sensor-pins`

Peer-reviewed research under lab conditions. No evidence of widespread real-world abuse.

- **Collected:** Accelerometer and gyroscope readings.
- **Inferred:** Taps, scrolls, and digits typed on a keypad.
- **Done:** Cai and Chen (2011) inferred over 70% of keys on a number pad from orientation data in an Android app. Mehrnezhad et al. (2016) showed JavaScript could distinguish touch actions and infer PINs; browser makers adopted countermeasures.
- **Company response:** Mozilla, Google, Apple and Opera adopted some countermeasures, according to the researchers; iPhones now require permission for motion data in web pages. (Mehrnezhad et al.)
- **Outcome:** Browsers restricted sensor access. (2019)
- **Limits:** Lab conditions; specific devices.

Sources:
- [TouchSignatures: Identification of User Touch Actions and PINs Based on Mobile Sensor Data via JavaScript](https://arxiv.org/abs/1602.04115). arXiv / JISA 2016. primary, opened

### Mozilla's review of mental-health apps

**REPORTED** · 2023-05-02 · Global · id `mozilla-mental-health-apps-2023`

Independent NGO review of privacy policies and app behaviour, with a described method. Not a regulator finding.

- **Collected:** Varies by app: moods, journal entries, chats with counsellors or bots, device data.
- **Inferred:** Mental state and personal struggles.
- **Done:** Mozilla's *Privacy Not Included team reviewed 32 mental-health apps; in 2023, 19 of 32 still earned its privacy warning label. It reported one app (Cerebral) loading 799 trackers in the first minute.
- **Company response:** None found.
- **Outcome:** Some apps improved policies between 2022 and 2023, according to Mozilla. (2023-05-02)
- **Limits:** Mozilla's 2022 baseline figures are reported inconsistently across its own pages. A warning label reflects policy and practice concerns, not proof of misuse.

Sources:
- [Shady Mental Health Apps Inch Toward Privacy and Security Improvements](https://www.mozillafoundation.org/en/blog/shady-mental-health-apps-inch-toward-privacy-and-security-improvements-but-many-still-siphon-personal-data/). Mozilla Foundation. primary, opened, 2023-05-02

### Musical.ly (now TikTok) and children's data ($5.7 million)

**DOCUMENTED** · 2019-02-27 · US · id `musically-2019`

FTC settlement. No admission of wrongdoing.

- **Collected:** Children's personal information.
- **Inferred:** Not the core issue.
- **Done:** The FTC alleged Musical.ly collected personal information from children under 13 without parental consent.
- **Company response:** None found.
- **Outcome:** $5.7 million, then the largest children's privacy penalty. (2019-02-27)
- **Limits:** Settled.

Sources:
- [Video Social Networking App Musical.ly Agrees to Settle FTC Allegations](https://www.ftc.gov/news-events/news/press-releases/2019/02/video-social-networking-app-musically-agrees-settle-ftc-allegations-it-violated-childrens-privacy). US Federal Trade Commission. primary, snippet, 2019-02-27

### New Mexico jury orders Meta to pay $375 million

**DOCUMENTED** · 2026-03-24 · US · id `nm-v-meta-2026`

Jury verdict. Meta is appealing.

- **Collected:** Not the core issue.
- **Inferred:** Not applicable.
- **Done:** After a six-week trial in Santa Fe, a jury found Meta violated New Mexico consumer-protection law by misleading users about teen safety and designing its platforms in ways that put young users at risk, and imposed $375 million in civil penalties ($5,000 per violation, the state maximum).
- **Company response:** "We respectfully disagree with the verdict and will appeal." (Meta statement via NPR/KUNC)
- **Outcome:** $375 million in civil penalties; Meta says it will appeal. A separate remedies phase before the judge was scheduled. Dozens of other states sued Meta in 2023 (ALLEGED). (2026-03-24)
- **Limits:** Under appeal; we relied on secondary coverage for the details.

Sources:
- [New Mexico jury says Meta harms children’s mental health and safety, violating state law](https://www.kunc.org/npr-news/2026-03-24/new-mexico-jury-says-meta-harms-childrens-mental-health-and-safety-violating-state-law). NPR (via KUNC). secondary, snippet, 2026-03-24
- [Meta faces $375M penalty as jury finds liability](https://www.mlex.com/mlex/articles/2456595/meta-faces-375m-penalty-as-jury-finds-liability-in-new-mexico-social-media-trial). MLex. secondary, snippet

### Norway fines Grindr: using the app reveals your sexual orientation

**DOCUMENTED** · 2021-12 · Norway, EU · id `grindr-norway-2021`

Regulator decision, upheld by the Privacy Appeals Board, Oslo District Court and the Borgarting Court of Appeal (21 October 2025).

- **Collected:** GPS location, advertising ID, and the fact of using Grindr.
- **Inferred:** Sexual orientation.
- **Done:** Norway's data protection authority found Grindr shared users' data with ad-tech partners without valid consent, and that using Grindr reveals sexual orientation, which is special-category data under GDPR.
- **Company response:** Grindr argued the authority relied on a number of misjudgements. (Grindr, via Norwegian press)
- **Outcome:** NOK 65 million fine (about €5.5 million), upheld on appeal. The appeals court also called Grindr's 'we do not sell your personal user information' claim clearly misleading. (2025-10-21)
- **Limits:** We could not open the Norwegian authority's original decision.

Sources:
- [Borgarting Court of Appeal upheld NOK 65 million fine against Grindr](https://digitalpolicyalert.org/event/34840-borgarting-court-of-appeal-upheld-nok-65-million-fine-against-grindr-over-personal-data-breach). Digital Policy Alert. secondary, snippet

### Orbitz showed Mac users pricier hotels first

**DOCUMENTED** · 2012-06-26 · US · id `orbitz-mac-2012`

Reported by the Wall Street Journal and confirmed by Orbitz as a test (company admission).

- **Collected:** The visitor's operating system (Mac or PC), which every website can read.
- **Inferred:** Mac users tended to spend more: Orbitz's data suggested $20-30 more per night on average.
- **Done:** Orbitz tested ranking pricier hotels higher for Mac users. This was steering (changing the order), not charging Mac users more for the same room.
- **Company response:** Orbitz said the same room cost the same on any computer, and users could sort results by price. (Orbitz, via WSJ and Engadget)
- **Outcome:** No regulatory action. (2012-06-26)
- **Limits:** Paywalled original. Often misreported as 'Mac users charged 30% more', which is not what happened.

Sources:
- [On Orbitz, Mac Users Steered to Pricier Hotels](https://www.wsj.com/articles/SB10001424052702304458604577488822667325882). The Wall Street Journal. primary, snippet, 2012-06-26
- [Orbitz profiles Mac users with pricier hotels](https://www.engadget.com/2012-06-26-orbitz-profiles-mac-users-with-pricier-hotels-heres-how-to-blo.html). Engadget. secondary, snippet

### Panoptispy: no secret microphone recording found, but secret screen recording

**DOCUMENTED** · 2018 · Global · id `panoptispy-2018`

Peer-reviewed measurement.

- **Collected:** Tested for: audio, images, video and screenshots leaving apps.
- **Inferred:** Not applicable.
- **Done:** Pan, Ren, Lindorfer, Wilson and Choffnes (PETS 2018) analysed 17,260 apps and found no evidence of covert microphone exfiltration, but found third-party libraries recording and uploading screen video and screenshots without telling users.
- **Company response:** One affected app removed the screen-recording SDK after disclosure. (Researchers / press coverage)
- **Outcome:** Research finding. (2018)
- **Limits:** Android, 2017-era apps. Absence of evidence in a big sample is strong but not total.

Sources:
- [Panoptispy: Characterizing Audio and Video Exfiltration from Android Applications](https://petsymposium.org/popets/2018/popets-2018-0030.php). PoPETs 2018. primary, opened
- [Android apps can slurp your screen](https://www.theregister.com/2018/07/04/most_android_apps_can_slurp_your_screen_and_you_wouldnt_even_know/). The Register. secondary, snippet

### Prayer app location data and the US military supply chain

**REPORTED** · 2020-11 · US, Global · id `muslim-pro-2020`

Investigative journalism. The FTC's 2024 X-Mode order separately confirmed sales to government contractors in general, not this specific claim.

- **Collected:** Location data from users of Muslim Pro, a prayer and Quran app.
- **Inferred:** Religious practice and movements.
- **Done:** Motherboard (Vice) reported that X-Mode sold location data that reached US military contractors.
- **Company response:** Muslim Pro called the report incorrect and untrue, denied selling data directly to the military, and stopped working with X-Mode. (Muslim Pro statement, via press coverage)
- **Outcome:** Apple and Google banned the X-Mode SDK from their app stores in December 2020. (2020-12)
- **Limits:** The full data path was not independently confirmed, and the app disputes the report.

Sources:
- [How the U.S. Military Buys Location Data from Ordinary Apps](https://www.vice.com/en/article/muslim-apps-location-data-military-xmode). Motherboard / Vice. primary, snippet
- [US military buys location data of Muslim apps](https://www.aljazeera.com/news/2020/11/17/report-us-military-buying-location-data-on-popular-muslim-apps). Al Jazeera. secondary, snippet

### Princeton Review tutoring prices by ZIP code

**REPORTED** · 2015-09-01 · US · id `princeton-review-2015`

Investigative data analysis. The company confirmed regional pricing but disputes that it is discrimination.

- **Collected:** The ZIP code a customer typed in.
- **Inferred:** Which regional price tier to show.
- **Done:** ProPublica found Premier SAT tutoring priced from $6,600 to $8,400 by ZIP code. Customers in areas with a high share of Asian residents were 1.8 times as likely to be offered higher prices, regardless of income.
- **Company response:** The Princeton Review said prices reflect regional costs and competition, and that calling this discrimination "misconstrues both the literal, legal and moral meaning of the word". (ProPublica)
- **Outcome:** No regulatory action. (2015-09-01)
- **Limits:** Correlation at ZIP-code level. Does not show the company intended a racial effect. Correlation is not intent.

Sources:
- [Asians Nearly Twice as Likely to Get Higher Price from Princeton Review](https://www.propublica.org/article/asians-nearly-twice-as-likely-to-get-higher-price-from-princeton-review). ProPublica. primary, opened, 2015-09-01

### Ransomware takes down AIIMS Delhi's systems

**DOCUMENTED** · 2022-11-23 · India · id `aiims-2022`

Government confirmation in Parliament. Whether data was stolen was not confirmed.

- **Collected:** Patient records and lab data on hospital servers.
- **Inferred:** Not applicable.
- **Done:** A ransomware attack hit AIIMS Delhi's e-hospital servers. The government told Parliament five physical servers were affected.
- **Company response:** AIIMS said e-hospital data had been restored and systems were being sanitised. (AIIMS statement, 29 November 2022)
- **Outcome:** Police registered an extortion and cyber-terrorism case. (2022-12)
- **Limits:** Attribution to any country rests on police sources only.

Sources:
- [Cyberattack on top Indian hospital highlights security risk](https://www.aljazeera.com/economy/2022/12/7/cyberattack-on-top-indian-hospital-highlights-security-risk). Al Jazeera. secondary, opened

### RBI barred lending apps from reading contacts and call logs

**DOCUMENTED** · 2022-08-10 · India · id `rbi-digital-lending-2022`

Central-bank regulation.

- **Collected:** Not applicable (a rule).
- **Inferred:** Not applicable.
- **Done:** An RBI working group (November 2021) said about 600 of some 1,100 lending apps it examined were illegal. RBI's digital-lending framework (announced 10 August 2022) bars lenders' apps from accessing phone resources such as contacts, media files and call logs.
- **Company response:** None found.
- **Outcome:** In force. (2022-08-10)
- **Limits:** Rules apply to regulated entities; illegal apps ignore them.

Sources:
- [RBI releases Recommendations of the Working Group on Digital Lending](https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=54187). Reserve Bank of India. primary, snippet, 2022-08-10
- [RBI spots 600 illegal lending apps out of 1,100 available](https://inc42.com/buzz/rbi-spots-600-illegal-lending-apps-out-of-1100-available). Inc42. secondary, snippet

### RBI restricts Paytm Payments Bank

**DOCUMENTED** · 2024-01-31 · India · id `paytm-rbi-2024`

Central-bank order. This is a governance case, NOT a confirmed data breach; reports of data flowing abroad were not confirmed by the RBI.

- **Collected:** Not the core issue.
- **Inferred:** Not applicable.
- **Done:** The RBI barred Paytm Payments Bank from taking new deposits or wallet top-ups (deadline extended to 15 March 2024), citing persistent non-compliance and material supervisory concerns.
- **Company response:** None found.
- **Outcome:** Restrictions took effect in March 2024. (2024-03-15)
- **Limits:** Included to correct a common misunderstanding, not as a data-misuse case.

Sources:
- [Action against Paytm Payments Bank Ltd](https://www.rbi.org.in/scripts/BS_PressReleaseDisplay.aspx?prid=57224). Reserve Bank of India. primary, snippet, 2024-01-31

### RealPage's rent algorithm and pooled landlord data

**ALLEGED** · 2025-11-24 · US · id `realpage-2025`

DOJ lawsuit with a proposed settlement (no admission); court approval pending when checked.

- **Collected:** Landlords' non-public rent and occupancy data.
- **Inferred:** Recommended rents.
- **Done:** The Justice Department alleged the shared data and recommendations amounted to illegal coordination among landlords.
- **Company response:** RealPage said it was pleased with the settlement. (Press coverage (snippet))
- **Outcome:** Proposed settlement: no real-time non-public data, models trained only on data at least a year old, for seven years. (2025-11-24)
- **Limits:** Not decided.

Sources:
- [DOJ's RealPage settlement: a blueprint for safer algorithmic pricing](https://www.fenwick.com/insights/publications/dojs-realpage-settlement-a-blueprint-for-safer-algorithmic-pricing). Fenwick. secondary, snippet

### Researchers measured smart-TV content recognition on Samsung and LG

**DOCUMENTED** · 2024-09-10 · UK, US · id `acr-imc-2024`

Peer-reviewed measurement study (ACM Internet Measurement Conference).

- **Collected:** Snapshots of what is on screen, sent to the TV maker's content-recognition servers.
- **Inferred:** What you watch, including content from devices plugged into the TV.
- **Done:** Anselmi et al. ('Watching TV with the Second-Party', IMC 2024) audited Samsung and LG TVs in the UK and US. ACR ran on live TV and on input from external devices (HDMI), not on apps like Netflix; opting out stopped the traffic.
- **Company response:** None found.
- **Outcome:** Academic finding; no enforcement linked. (2024)
- **Limits:** Two brands, two countries, specific models.

Sources:
- [Watching TV with the Second-Party: A First Look at Automatic Content Recognition Tracking in Smart TVs](https://arxiv.org/abs/2409.06203). arXiv / ACM IMC 2024. primary, opened, 2024-09-10

### Reverse-engineering a block puzzle: are your pieces dealt by ad value?

**REPORTED** · 2026-10-15 · Global · id `block-blast-analysis-2026`

Independent reverse-engineering by one author: decompiled apps, decrypted rule files run on 28 test cases, live observation. Only partly reproducible because the decryption key is withheld; the author also used an AI model to port some code. No independent replication or developer response found.

- **Collected:** Your score, personal best, history of watched rewarded ads, and the value of the ad currently loaded, according to the analysis.
- **Inferred:** Per the analysis: each player's ad value, and the moment a 'revive' ad would earn the most.
- **Done:** Ayo Omolewa's breakdown says encrypted, server-downloaded rules can request a 'lethal puzzle' (three pieces that cannot be placed) when a player is 1,000 points past their high score, has finished three rewarded ads, and the loaded ad is worth at least 3.5 times the last one.
- **Company response:** None found.
- **Outcome:** No regulator action. The author offers to publish corrections. (2026-10-15)
- **Limits:** Single source. Server-side models cannot be inspected. The author does not use the term 'loss aversion'; that framing is ours. Our 'Stack Shift' game is an original, simplified WHAT-IF, not a copy of this game.

Sources:
- [Block Blast breakdown](https://ayoships.com/breakdowns/block-blast). Ayo Omolewa (ayoships.com). primary, opened, 2026-10-15

### Rite Aid's facial recognition falsely flagged shoppers

**DOCUMENTED** · 2023-12-19 · US · id `rite-aid-facial-recognition-2023`

FTC order. Rite Aid disagreed with the allegations.

- **Collected:** Shoppers' faces from in-store cameras.
- **Inferred:** Whether a shopper matched a 'person of interest' (suspected shoplifter).
- **Done:** The FTC alleged the system produced thousands of false matches, falling more heavily on women and people of colour, who could then be followed, searched or asked to leave.
- **Company response:** Rite Aid said it "fundamentally disagree[s]" with the allegations and that the technology was a limited pilot it had stopped more than three years earlier. (Rite Aid statement via press coverage)
- **Outcome:** Five-year ban on using facial recognition for surveillance. (2023-12-19)
- **Limits:** We could not open the FTC's own page.

Sources:
- [FTC bans Rite Aid from using facial surveillance systems for five years](https://www.engadget.com/ftc-bans-rite-aid-from-using-facial-surveillance-systems-for-five-years-053134856.html). Engadget. secondary, opened

### Session replay scripts recorded everything you typed

**DOCUMENTED** · 2017-11-15 · Global · id `session-replay-2017`

Reproducible technical analysis by university researchers (blog report, not peer-reviewed).

- **Collected:** Mouse movements, clicks, scrolling and keystrokes, sometimes before you press 'submit'.
- **Inferred:** Where users struggle or hesitate; personal data on the page.
- **Done:** Princeton researchers found replay scripts from 7 vendors on 482 of the top 50,000 sites (a lower bound). They observed a full card number and CVV sent to a replay vendor on one retailer's site and a prescription name on another.
- **Company response:** None found.
- **Outcome:** Some sites and vendors changed settings after disclosure. (2017)
- **Limits:** 2017 data.

Sources:
- [No boundaries: Exfiltration of personal data by session-replay scripts](https://blog.citp.princeton.edu/2017/11/15/no-boundaries-exfiltration-of-personal-data-by-session-replay-scripts/). Princeton CITP. primary, opened, 2017-11-15

### Siri accidental recordings class action ($95 million)

**ALLEGED** · 2025-01 · US · id `siri-lopez-2025`

Private class-action settlement, not a regulator finding. The ad-targeting claims were never proven. That contractors reviewed some Siri recordings was widely reported in 2019.

- **Collected:** Audio recorded when Siri activated by mistake, without the wake word.
- **Inferred:** Plaintiffs claimed overheard words (for example brand names or a surgery) were used to target ads.
- **Done:** Plaintiffs in Lopez v. Apple alleged accidental recordings were captured and shared with contractors, and some claimed they then saw related ads.
- **Company response:** Apple settled to avoid further litigation and said Siri data has never been used to build marketing profiles or sold. (Apple statement via press coverage)
- **Outcome:** $95 million proposed settlement; we did not confirm final approval. (2025-01)
- **Limits:** A settlement is not proof. See the Myths room on 'your phone is listening'.

Sources:
- [Apple Siri settlement: who is eligible](https://www.entrepreneur.com/business-news/apple-siri-settlement-who-is-eligible-for-a-cash-payout/485115). Entrepreneur. secondary, opened
- [Apple offers $95M to settle Siri privacy lawsuit](https://www.darkreading.com/cyber-risk/apple-offers-95m-to-settle-siri-privacy-lawsuit). Dark Reading. secondary, snippet

### Staples online prices varied by distance to rival stores

**REPORTED** · 2012-12-24 · US · id `staples-2012`

Investigative journalism with a described test method.

- **Collected:** Approximate location from the visitor's IP address.
- **Inferred:** Whether an OfficeMax or Office Depot store was nearby (roughly within 20 miles).
- **Done:** The Wall Street Journal tested prices from tens of thousands of ZIP codes and found higher online prices where rival stores were far away. In practice, lower-income areas were less likely to see the lower price.
- **Company response:** Staples said prices vary based on factors such as local costs. (Reported via secondary coverage)
- **Outcome:** No regulatory action. (2012-12-24)
- **Limits:** Original paywalled; detailed figures come from secondary coverage.

Sources:
- [Websites Vary Prices, Deals Based on Users' Information](https://www.wsj.com/articles/SB10001424127887323777204578189391813881534). The Wall Street Journal. primary, snippet, 2012-12-24
- [Staples online prices change based on location](https://venturebeat.com/business/staples-online-stores-price-changes/). VentureBeat. secondary, snippet

### Star Health insurance data sold through Telegram chatbots

**REPORTED** · 2024-09 · India · id `star-health-2024`

Journalists verified sample documents. The insider claim is ALLEGED and was denied.

- **Collected:** Names, ID documents, insurance claim files and medical details.
- **Inferred:** Not applicable.
- **Done:** An attacker calling themselves 'xenZen' offered the data and ran Telegram chatbots that returned customers' documents. The attacker claimed the company's own security chief sold it the data.
- **Company response:** Star Health admitted "unauthorized and illegal access to certain data" and said its security chief "has not been found guilty" of any wrongdoing. (Star Health statements via The Register)
- **Outcome:** Star Health won an interim court injunction (24 September 2024) against Telegram, Cloudflare and the attacker. (2024-09-24)
- **Limits:** Total number affected and forensic findings not public.

Sources:
- [Star Health breach](https://www.theregister.com/2024/10/11/star_health_breach/). The Register. secondary, opened
- [Telegram argues against policing role in Star Health data breach case](https://www.outlookbusiness.com/technology/telegram-argues-against-policing-role-in-star-health-data-breach-case). Outlook Business. secondary, opened

### Strava's heatmap outlined military bases

**DOCUMENTED** · 2018-01-27 · Global · id `strava-heatmap-2018`

The heatmap was public; the revealed sites were independently confirmed by journalists.

- **Collected:** GPS traces from about a billion recorded activities.
- **Inferred:** Where people repeatedly exercise, which reveals the shape of bases and patrol routes.
- **Done:** Strava published an aggregated global heatmap. Analyst Nathan Ruser pointed out it revealed military bases and routes, including in conflict zones.
- **Company response:** "We are committed to helping people better understand our settings to give them control over what they share." (Strava, to the Washington Post via TechCrunch)
- **Outcome:** The US military reviewed its use of personal devices and apps. (2018)
- **Limits:** No individual was named. The harm came from the pattern.

Sources:
- [US military reviewing tech use after Strava privacy snafu](https://techcrunch.com/2018/01/29/us-military-reviewing-tech-use-after-strava-privacy-snafu). TechCrunch. secondary, opened

### Target's pregnancy prediction model

**STATEMENT** · 2012-02 · US · id `target-pregnancy-2012`

The model was described by a Target employee (STATEMENT). The father anecdote is single-sourced and was never confirmed by Target.

- **Collected:** Shopping baskets (about 25 products, such as unscented lotion and supplements).
- **Inferred:** Pregnancy and approximate due date.
- **Done:** A Target statistician described a pregnancy-prediction model at a 2010 conference; the New York Times Magazine reported it in 2012 with an anecdote about a father learning of his daughter's pregnancy from coupons.
- **Company response:** None found.
- **Outcome:** No regulator action. (2012)
- **Limits:** We could not open the NYT original.

Sources:
- [How Companies Learn Your Secrets](https://www.nytimes.com/2012/02/19/magazine/shopping-habits.html). The New York Times Magazine. primary, snippet
- [Did Target really predict a teen's pregnancy? The inside story](https://www.kdnuggets.com/2014/05/target-predict-teen-pregnancy-inside-story.html). KDnuggets. secondary, snippet

### Tax-filing websites sent financial details to Meta and Google

**DOCUMENTED** · 2023-07-12 · US · id `meta-pixel-tax-2022`

Company acknowledgements in a congressional report; original findings REPORTED by The Markup.

- **Collected:** Filing status, income, refund amounts and details of dependants.
- **Inferred:** Financial situation.
- **Done:** The Markup reported in 2022 that tax-preparation sites sent such data to Meta; a 2023 congressional report said the companies acknowledged sharing it.
- **Company response:** TaxAct: "Protecting the rights and privacy of our customers is our top priority." Meta says it filters sensitive data; Google says site owners are responsible for what they send. (Company statements via The Markup)
- **Outcome:** No penalty found. (2023-07-12)
- **Limits:** What Meta did with the data downstream is not documented.

Sources:
- [Congressional report finds Meta and tax-prep companies recklessly shared taxpayers' data](https://themarkup.org/pixel-hunt/2023/07/12/congressional-report-finds-meta-and-tax-prep-companies-recklessly-shared-taxpayers-data). The Markup. primary, opened

### Texas sues five TV makers over content recognition

**ALLEGED** · 2025-12-15 · US · id `texas-tv-acr-2025`

Lawsuits filed; no court has ruled.

- **Collected:** Screen contents, according to the lawsuits.
- **Inferred:** Viewing habits.
- **Done:** Texas's attorney general sued Sony, Samsung, LG, Hisense and TCL, alleging the TVs captured screen contents (reportedly every 500 milliseconds on some models) and used dark patterns to get consent.
- **Company response:** Hisense and LG declined to comment on pending litigation; TCL and Sony declined to comment. (The Record)
- **Outcome:** Pending. (2025-12-15)
- **Limits:** The capture intervals are the state's claims and differ between reports.

Sources:
- [Texas sues 5 smart TV makers over ACR tech](https://therecord.media/texas-sues-5-smart-tv-makers-over-acr-tech). The Record. secondary, snippet

### Texas v. Allstate and Arity: driving data collected through other apps

**ALLEGED** · 2025-01-13 · US · id `allstate-arity-2025`

State lawsuit; the first under a comprehensive state privacy law. No ruling yet.

- **Collected:** Location (as often as every 15 seconds), accelerometer and gyroscope readings, and phone pick-ups while driving, according to Texas.
- **Inferred:** Driving risk scores.
- **Done:** Texas alleges the data was sold and used to set insurance prices, covering more than 45 million Americans.
- **Company response:** Allstate says Arity helps consumers get the most accurate auto insurance price after they consent in a simple and transparent way. (Allstate statement via The Record)
- **Outcome:** Pending. (2025-01-13)
- **Limits:** Allegations only; Allstate disputes them.

Sources:
- [Texas sues Allstate over data privacy](https://therecord.media/texas-sues-allstate-data-privacy-cars). The Record. secondary, opened
- [Attorney General Ken Paxton Sues Allstate and Arity](https://www.texasattorneygeneral.gov/news/releases/attorney-general-ken-paxton-sues-allstate-and-arity-unlawfully-collecting-using-and-selling-over-45). Texas Attorney General. primary, snippet

### Texas v. Google: location, voiceprints and face data ($1.375 billion)

**DOCUMENTED** · 2025-05 · US · id `texas-google-2025`

State attorney-general settlement. Google did not admit wrongdoing.

- **Collected:** Location data, Incognito-mode browsing, and voiceprints and face geometry, according to the state.
- **Inferred:** Identity, movements and interests.
- **Done:** Texas alleged Google collected and used this data without proper consent under state law.
- **Company response:** Google said the settlement resolved old claims about policies it had already changed: "We are pleased to put them behind us, and we will continue to build robust privacy controls." (Google spokesperson via The Record)
- **Outcome:** $1.375 billion settlement. (2025-05)
- **Limits:** The settlement terms were not fully disclosed.

Sources:
- [Google to pay Texas $1.375 billion over privacy violations](https://therecord.media/google-texas-privacy-violations-billions). The Record. secondary, opened

### The '375 million Airtel users' leak claim

**CONTESTED** · 2024-07 · India · id `airtel-claim-2024`

Seller's claim versus company denial; researchers lean towards recycled data.

- **Collected:** Claimed: phones, emails, Aadhaar numbers and addresses.
- **Inferred:** Not applicable.
- **Done:** A forum post offered data on 375 million Airtel users for $50,000. The forum removed it as a suspected scam; researchers suggested it combined older leaked datasets.
- **Company response:** Airtel called it "nothing short of a desperate attempt to tarnish Airtel's reputation by vested interests" and said there was no breach. (Airtel via TechCrunch)
- **Outcome:** No evidence of a new breach found. (2024-07)
- **Limits:** Old leaks resurface under new names.

Sources:
- [India's Airtel dismisses data breach reports](https://techcrunch.com/2024/07/05/indias-airtel-dismisses-data-breach-reports-amid-customer-concerns). TechCrunch. secondary, opened

### The battery level that became a tracking ID

**DOCUMENTED** · 2015 · Global · id `battery-api-2015`

Peer-reviewed privacy analysis; browser changes are documented in their release notes.

- **Collected:** Battery level and charge or discharge time.
- **Inferred:** A short-lived identifier, because the precise reading was unusual.
- **Done:** Olejnik, Acar, Castelluccia and Diaz (2015) showed the readings were precise enough to act as a short-term tracking ID across sites.
- **Company response:** Firefox removed the API from web pages in version 52 (2017); Safari never shipped it; Chrome still supports it. (Browser documentation (MDN, caniuse))
- **Outcome:** Removed in Firefox; never in Safari; still in Chromium browsers. (2017-03)
- **Limits:** Mostly historical; rarely used by trackers (about two scripts in a 2016 crawl).

Sources:
- [The leaking battery: A privacy analysis of the HTML5 Battery Status API](https://eprint.iacr.org/2015/616). IACR ePrint. primary, snippet
- [Battery Status API support](https://caniuse.com/battery-status). caniuse.com. secondary, opened

### The FTC's 'Click-to-Cancel' rule was struck down

**DOCUMENTED** · 2025-07-08 · US · id `click-to-cancel-2025`

Court decision.

- **Collected:** Not applicable.
- **Inferred:** Not applicable.
- **Done:** The 8th Circuit Court of Appeals vacated the FTC's rule on procedural grounds (missing preliminary regulatory analysis) on 8 July 2025, before its 14 July compliance date.
- **Company response:** None found.
- **Outcome:** Rule vacated; state auto-renewal laws still apply. (2025-07-08)
- **Limits:** Procedural ruling, not a ruling that the practices are fine.

Sources:
- [Eighth Circuit vacates FTC Click-to-Cancel rule](https://www.fenwick.com/insights/publications/eighth-circuit-vacates-ftcs-click-to-cancel-rule). Fenwick. secondary, snippet

### The Netflix Prize data was de-anonymised

**DOCUMENTED** · 2008 · US · id `netflix-prize-2008`

Peer-reviewed research. The famous high percentages describe how UNIQUE records are, not how many people were actually named; the real IMDb test was small.

- **Collected:** Movie ratings and dates from about 500,000 Netflix subscribers, released 'anonymised' for a contest.
- **Inferred:** Identity, by matching to public IMDb reviews.
- **Done:** Narayanan and Shmatikov (IEEE S&P 2008) showed that a few ratings with approximate dates are enough to make most records unique, and matched some records to public IMDb profiles.
- **Company response:** None found.
- **Outcome:** Netflix cancelled a planned second contest after a lawsuit and regulator questions. (2010)
- **Limits:** Uniqueness is not the same as identification.

Sources:
- [Robust De-anonymization of Large Sparse Datasets](https://arxiv.org/abs/cs/0610105). arXiv / IEEE S&P 2008. primary, snippet

### The Tribune buys access to Aadhaar details for ₹500

**REPORTED** · 2018-01 · India · id `aadhaar-tribune-2018`

Investigative journalism (the reporter bought access). The authority says it was misuse, not a breach.

- **Collected:** Name, address, phone and photo linked to Aadhaar numbers.
- **Inferred:** Not applicable.
- **Done:** The Tribune reported buying access that returned details for any Aadhaar number entered.
- **Company response:** UIDAI said "there has not been any breach of biometric database", called the story misreporting, and filed a police complaint. (UIDAI statement via Scroll)
- **Outcome:** Police complaint filed; biometric data was not shown to be exposed. (2018-01)
- **Limits:** Biometric data not exposed.

Sources:
- [UIDAI response to Tribune report](https://scroll.in/latest/863787/). Scroll.in. secondary, opened

### Truecaller and people who never signed up

**REPORTED** · 2019 · India, Global · id `truecaller-non-users`

NGO case study. The court petition is ALLEGED; no Indian privacy regulator has ruled.

- **Collected:** Names and numbers of non-users, from users' uploaded contact books and tags.
- **Inferred:** Who a number belongs to, and labels such as workplace or 'spam'.
- **Done:** Privacy International documented how non-users' details enter Truecaller's directory without their consent. A 2021 public-interest petition in the Bombay High Court raised the same concern.
- **Company response:** Truecaller points to its 'unlist' option, which lets non-users remove their number. (Truecaller, via Privacy International)
- **Outcome:** In 2024 India's competition regulator dismissed a separate complaint about Google giving Truecaller contact access (no prima facie case). (2024)
- **Limits:** Opting out requires knowing you are in the database.

Sources:
- [Truecaller case study](https://privacyinternational.org/node/2997). Privacy International. primary, opened
- [CCI turns down plea alleging Google shared contact data with Truecaller](https://inc42.com/buzz/cci-turns-down-plea-alleging-google-of-sharing-contact-data-with-truecaller). Inc42. secondary, opened

### Twitter used security phone numbers and emails for ads ($150 million)

**DOCUMENTED** · 2022-05-25 · US · id `twitter-2fa-ads-2022`

FTC/DOJ order. No admission of wrongdoing.

- **Collected:** Phone numbers and email addresses provided for account security.
- **Inferred:** Matches with advertisers' customer lists.
- **Done:** The FTC alleged that from 2014 to 2019 Twitter let advertisers target more than 140 million users using contact details given for security.
- **Company response:** Twitter said it had never disclosed or shared phone numbers or email addresses with advertisers. (Twitter statement (snippet))
- **Outcome:** $150 million penalty. (2022-05-25)
- **Limits:** Settled.

Sources:
- [FTC Charges Twitter with Deceptively Using Account Security Data to Sell Targeted Ads](https://www.ftc.gov/news-events/news/press-releases/2022/05/ftc-charges-twitter-deceptively-using-account-security-data-sell-targeted-ads). US Federal Trade Commission. primary, opened, 2022-05-25

### Uber said low-battery riders accept surge pricing more

**STATEMENT** · 2016-05 · US · id `uber-battery-2016`

What an Uber insider said. There is NO evidence battery level is used in pricing.

- **Collected:** Battery level, which the Uber app reads for its own power-saving mode.
- **Inferred:** Urgency.
- **Done:** Keith Chen, then Uber's head of economic research, said on NPR's Hidden Brain that riders with low batteries are more likely to accept surge prices. He said Uber does not use battery level to set prices.
- **Company response:** Uber said it does not use battery level to set prices. (Keith Chen, NPR (2016))
- **Outcome:** None. (2016-05)
- **Limits:** The claim that battery drives prices is a myth built on this interview.

Sources:
- [This Is Your Brain on Uber](https://www.npr.org/2016/05/17/478266839/this-is-your-brain-on-uber). NPR Hidden Brain. primary, snippet
- [Uber knows you'll pay more for surge pricing when your battery is low](https://www.engadget.com/2016-05-20-uber-surge-pricing-battery-life.html). Engadget. secondary, snippet

### Uber's 'Greyball' tool evaded regulators

**DOCUMENTED** · 2017-03-03 · US, Global · id `uber-greyball-2017`

Reported by the NYT; Uber acknowledged the tool and said it would stop using it against regulators (company admission).

- **Collected:** User data such as location, payment details and app behaviour.
- **Inferred:** Whether a user was likely to be a regulator or enforcement officer.
- **Done:** The New York Times reported Uber used 'Greyball' to identify suspected officials and show them phantom cars or deny them rides. A Portland audit found 17 blocked accounts, 16 of them officials.
- **Company response:** Uber's chief security officer said the company was "expressly prohibiting" its use to target regulators. (Uber statement, March 2017)
- **Outcome:** A federal grand-jury subpoena was reported in 2017; no public outcome found. (2017)
- **Limits:** No public legal resolution of Greyball.

Sources:
- [How Uber Deceives the Authorities Worldwide](https://www.nytimes.com/2017/03/03/technology/uber-greyball-program-evade-authorities.html). The New York Times. primary, snippet
- [Uber used Greyball in Portland](https://fortune.com/2017/09/15/uber-portland-greyball/). Fortune. secondary, snippet

### Uber's 2016 breach and its cover-up

**DOCUMENTED** · 2016-11 · US, Global · id `uber-breach-2016`

FTC revised order. Uber's former security chief was later criminally convicted over the cover-up.

- **Collected:** Names, emails and phone numbers of riders and drivers; about 600,000 driver's licence numbers.
- **Inferred:** Not applicable.
- **Done:** The FTC said Uber paid the intruders $100,000 through its bug-bounty programme and did not disclose the breach until November 2017, while the FTC was investigating it. Earlier, staff tools ('God View') had allowed broad access to riders' trips.
- **Company response:** None found.
- **Outcome:** Expanded FTC order requiring breach reporting and regular assessments. (2018-04-12)
- **Limits:** The often-cited '57 million' is Uber's own combined figure.

Sources:
- [Uber Agrees to Expanded Settlement with FTC](https://www.ftc.gov/news-events/news/press-releases/2018/04/uber-agrees-expanded-settlement-ftc-related-privacy-security-claims). US Federal Trade Commission. primary, opened, 2018-04-12

### Ultrasonic beacons: TV ads that talk to your phone

**DOCUMENTED** · 2017 · Global · id `silverpush-2016`

FTC warning letters (advisory, not enforcement) and peer-reviewed measurement.

- **Collected:** Inaudible audio tones picked up by a phone microphone.
- **Inferred:** Which ad you saw or which shop you entered, linking devices.
- **Done:** The FTC warned 12 app developers in March 2016 about SilverPush code. Arp et al. (IEEE EuroS&P 2017) found 234 app samples containing SilverPush code and beacons in 4 of 35 shops tested.
- **Company response:** None found.
- **Outcome:** Warnings issued; no penalty. (2016-03-17)
- **Limits:** Requires microphone permission. Uptake appears limited.

Sources:
- [FTC Issues Warning Letters to App Developers Using 'Silverpush' Code](https://www.ftc.gov/news-events/news/press-releases/2016/03/ftc-issues-warning-letters-app-developers-using-silverpush-code). US Federal Trade Commission. primary, opened, 2016-03-17
- [Privacy Threats through Ultrasonic Side Channels on Mobile Devices](https://vamos.mlsec.org/docs/2017a-eurosp.pdf). IEEE EuroS&P 2017. primary, snippet

### US v. Meta: housing ads settlement

**DOCUMENTED** · 2022-06-21 · US · id `doj-meta-housing-2022`

DOJ settlement. No admission of wrongdoing.

- **Collected:** User data used for ad targeting and delivery.
- **Inferred:** Lookalike audiences ('Special Ad Audience').
- **Done:** The Justice Department alleged Meta's housing-ad targeting and delivery discriminated in violation of the Fair Housing Act.
- **Company response:** None found.
- **Outcome:** Meta paid $115,054 (the legal maximum), dropped the Special Ad Audience tool and built a 'Variance Reduction System' to even out delivery, with compliance targets agreed in January 2023. (2022-06-21)
- **Limits:** Applies to housing ads in the US.

Sources:
- [Justice Department Secures Groundbreaking Settlement Agreement with Meta Platforms](https://www.justice.gov/opa/pr/justice-department-secures-groundbreaking-settlement-agreement-meta-platforms-formerly-known). US Department of Justice. primary, snippet
- [Meta settles lawsuit over housing ads](https://www.theregister.com/2022/06/23/meta_settles_lawsuit_adverts/). The Register. secondary, opened

### US v. TikTok: children's privacy, settled for $400 million

**DOCUMENTED** · 2026-08-21 · US · id `tiktok-doj-2026`

DOJ settlement. TikTok/ByteDance did not admit liability; the claims remain allegations.

- **Collected:** Children's personal data.
- **Inferred:** Not the core issue.
- **Done:** The Justice Department's 2024 complaint alleged TikTok knowingly allowed children under 13 to create accounts, collected their data without parental consent, and obstructed parents' deletion requests.
- **Company response:** None found.
- **Outcome:** $400 million: $300 million now and $100 million once the 2019 Musical.ly order is vacated. (2026-08-21)
- **Limits:** We could not open the DOJ's own release. Court approval not confirmed.

Sources:
- [TikTok settles with US Justice Department for $400m](https://www.aljazeera.com/news/2026/8/21/tiktok-settles-with-us-justice-department-for-400m-over-child-privacy-laws). Al Jazeera. secondary, opened
- [TikTok will pay $400 million to settle DOJ lawsuit](https://www.engadget.com/2241964/tiktok-will-pay-400-million-to-settle-doj-lawsuit-over-child-privacy/). Engadget. secondary, snippet

### Viral claims of an 'iPhone tax' on quick-commerce apps

**ALLEGED** · 2025-01 · India · id `zepto-iphone-2025`

Viral screenshots; no controlled test. Other users suggested a 'Super Saver' mode explained the gap.

- **Collected:** Device type, which any app knows.
- **Inferred:** Claimed: iPhone users will pay more.
- **Done:** Users posted side-by-side screenshots of Zepto showing different prices on Android and iPhone. India's consumer affairs minister directed the Central Consumer Protection Authority (CCPA) to look into such complaints.
- **Company response:** Zepto did not respond to afaqs' request for comment. We found no published response. (afaqs)
- **Outcome:** No published CCPA outcome found. (2025-01)
- **Limits:** Two screenshots cannot rule out other differences (location, account, offers, time). See the Auditor's Lab.

Sources:
- [Influencers expose price bias as q-comm platforms levy 'Apple tax'](https://www.afaqs.com/news/brands/influencers-expose-price-bias-as-q-comm-platforms-levy-apple-tax-8630634). afaqs. primary, opened

### Vizio smart TVs tracked what people watched

**DOCUMENTED** · 2017-02-06 · US · id `vizio-2017`

FTC and New Jersey court order. No admission of wrongdoing.

- **Collected:** Second-by-second information about what was shown on the screen, from broadcast, cable and streaming sources.
- **Inferred:** Viewing habits, linked to household details such as age, income and marital status, according to the FTC.
- **Done:** The FTC and New Jersey alleged Vizio sold viewing histories to third parties for advertising and audience measurement without telling viewers or getting consent.
- **Company response:** None found.
- **Outcome:** $2.2 million ($1.5 million to the FTC; $1 million to New Jersey, $300,000 of it suspended), plus consent and deletion requirements. (2017-02-06)
- **Limits:** An older case; TV makers have changed defaults since, but ACR remains common.

Sources:
- [VIZIO to Pay $2.2 Million to FTC, State of New Jersey](https://www.ftc.gov/news-events/news/press-releases/2017/02/vizio-pay-22-million-ftc-state-new-jersey-settle-charges-it-collected-viewing-histories-11-million). US Federal Trade Commission. primary, opened, 2017-02-06

### X-Mode sold location data that could reveal visits to clinics and places of worship

**DOCUMENTED** · 2024-01-09 · US · id `xmode-2024`

FTC order. No admission of wrongdoing.

- **Collected:** Precise location data from phones, gathered through X-Mode's software kit inside other companies' apps and from other suppliers.
- **Inferred:** Visits to medical and reproductive health clinics, places of worship and domestic-abuse shelters.
- **Done:** The FTC alleged X-Mode (later Outlogic) sold raw location data that could track people to such places, including to government contractors.
- **Company response:** None found.
- **Outcome:** First FTC order banning a data broker from selling sensitive location data; it also covers LGBTQ+ service locations and protest sites. (2024-04)
- **Limits:** The order restricts future conduct; the full list of past buyers is not public.

Sources:
- [FTC Order Prohibits Data Broker X-Mode Social and Outlogic from Selling Sensitive Location Data](https://www.ftc.gov/news-events/news/press-releases/2024/01/ftc-order-prohibits-data-broker-x-mode-social-outlogic-selling-sensitive-location-data). US Federal Trade Commission. primary, opened, 2024-01-09

### YouTube collected data from children watching kids' channels ($170 million)

**DOCUMENTED** · 2019-09-04 · US · id `youtube-coppa-2019`

FTC and New York settlement. No admission of wrongdoing.

- **Collected:** Persistent identifiers (cookies and device IDs) from viewers of child-directed channels.
- **Inferred:** Viewing interests for ad targeting.
- **Done:** The FTC and New York alleged Google/YouTube collected children's identifiers without parental consent and used them for targeted ads.
- **Company response:** None found.
- **Outcome:** $170 million ($136 million to the FTC, $34 million to New York), then a record under the children's privacy law. (2019-09-04)
- **Limits:** Settled.

Sources:
- [Google and YouTube Will Pay Record $170 Million](https://www.ftc.gov/news-events/news/press-releases/2019/09/google-youtube-will-pay-record-170-million-alleged-violations-childrens-privacy-law). US Federal Trade Commission. primary, opened, 2019-09-04

## Myths

### "My phone is secretly listening to my conversations to show me ads."

**NOT SUPPORTED.** The largest test (Panoptispy, 17,260 Android apps) found no covert microphone recording, though it did find apps secretly recording the SCREEN. A marketing firm's 'Active Listening' pitch deck made the claim but showed no technical evidence; Meta and Amazon denied involvement. Apple settled a Siri case for $95 million over accidental recordings while denying the ad claims. Ultrasonic beacons are real but rare.

- Fair test: Watch what data an app actually sends (traffic analysis) while you talk about an unusual product near it, compared with a control period, many times.
- Would change our mind: Captured network traffic showing audio, or transcripts derived from it, being uploaded for ad targeting.
- Related cases: `panoptispy-2018`, `cmg-active-listening-2024`, `siri-lopez-2025`, `silverpush-2016`

### "Apps charge iPhone users more than Android users for the same thing."

**UNVERIFIED.** Viral side-by-side screenshots in India (Ola, Uber, Zepto) led to a regulator notice in January 2025, and the companies denied it. No published finding as of November 2026. Orbitz in 2012 re-ranked results by device but did not charge more for the same room.

- Fair test: Same account type, same exact spot, same second, many repetitions, then swap the phones between people. Compare averages, not single screenshots.
- Would change our mind: A controlled audit, or a regulator finding, showing a consistent device-linked gap.
- Related cases: `ola-uber-ccpa-2025`, `zepto-iphone-2025`, `orbitz-mac-2012`

### "Uber raises prices when your battery is low."

**NOT SUPPORTED.** In 2016 an Uber economist said low-battery riders are MORE WILLING to accept surge, and that Uber does NOT use battery in pricing. The myth grew from that interview. No evidence shows battery is used.

- Fair test: Request the same trip at the same moment from two identical phones, one at 5% and one at 95% battery, many times.
- Would change our mind: A consistent battery-linked price gap in a controlled test, or internal documents.
- Related cases: `uber-battery-2016`, `battery-api-2015`

### "Target knew a teenager was pregnant before her father did."

**UNVERIFIED.** A Target statistician did describe a pregnancy-prediction model. The famous anecdote about the angry father comes from one unnamed source and was never confirmed by Target.

- Fair test: Confirmation from the people involved, or from Target.
- Would change our mind: A named, confirmed account.
- Related cases: `target-pregnancy-2012`

### "90% of browsers have a unique fingerprint."

**OVERSTATED.** 83.6% and 89.4% came from volunteers visiting privacy-test sites. A study of over 2 million ordinary visitors found 33.6% unique.

- Fair test: Measure a large, ordinary population, not self-selected volunteers.
- Would change our mind: A large general-population study with high uniqueness on today's browsers.
- Related cases: `fingerprint-uniqueness`

### "Cambridge Analytica used Facebook data to hack people's minds and swing elections."

**OVERSTATED.** The data harvesting and the deception are documented by the FTC. The UK regulator found the company's techniques were 'knowingly oversold' and found no evidence it used Facebook data for the Brexit referendum.

- Fair test: Experiments comparing votes or attitudes of targeted and untargeted groups.
- Would change our mind: Rigorous evidence of large persuasion effects from its psychographic targeting.
- Related cases: `cambridge-analytica-2019`

### "Facebook proved it can control your mood."

**MISREAD.** The 2014 experiment changed the share of emotional WORDS people posted by about 0.1 percentage points (d = 0.02). That is a real but tiny effect on word choice, not a measure of mood.

- Fair test: Measure mood directly, with consent, and report effect sizes.
- Would change our mind: Large, replicated effects on measured wellbeing.
- Related cases: `emotional-contagion-2014`

### "Instagram harms one in three teenage girls."

**MISREAD.** The leaked slide said 32% of teen girls WHO ALREADY FELT BAD ABOUT THEIR BODIES said Instagram made them feel worse. That is a worrying finding about a subgroup, not one in three of all girls, and it was not designed to show cause.

- Fair test: Long-term studies that can separate cause from correlation.
- Would change our mind: Strong causal evidence across all teen girls.
- Related cases: `meta-teen-research-2021`

### "375 million Airtel users' data leaked in 2024."

**NOT SUPPORTED.** A seller's forum post, removed as a suspected scam. Airtel denied a breach; researchers thought the data was compiled from older leaks.

- Fair test: Check fresh samples against records that only the company would hold.
- Would change our mind: Verified samples containing new, Airtel-only data.
- Related cases: `airtel-claim-2024`

### "Researchers re-identified 99% of people in 'anonymous' datasets."

**MISREAD.** Most such figures measure how UNIQUE records are (Netflix, 'Unique in the Crowd') or are model ESTIMATES (99.98%). Naming someone takes outside data. The risk is real; the headline wording is usually not.

- Fair test: Count actual, confirmed re-identifications against outside data.
- Would change our mind: Large-scale confirmed re-identifications (which researchers usually avoid for ethical reasons).
- Related cases: `netflix-prize-2008`, `de-montjoye-2013`, `rocher-2019`

## Credits

The Block Blast analysis is the work of Ayo Omolewa (https://ayoships.com/breakdowns/block-blast). The Stack Shift mini-game is our own original, simplified illustration, not a copy of any game.
