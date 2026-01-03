# Travel Writing Assistant

Help rewrite travel notes into polished prose while maintaining the author's authentic voice.

## Usage

```
/travel-writing <filename>
```

Example: `/travel-writing greece.md`

## Workflow

1. Read the markdown file provided as an argument
2. Transform the content into prose, adding suggestions underneath each section demarcated by `------`
3. Write the updated file back
4. User picks what they like, edits, and removes the `------` sections

## Style Guidelines

### DO:

- **Specific over poetic**: Name the actual place, food, thing. "Sali Coffee" not "a local café"
- **Honest self-observations**: "I keep trying to have Opinions about coffee but I don't think I have the palate for it"
- **Admit when you don't remember**: "I genuinely don't remember this day"
- **Flat emotional honesty**: State feelings matter-of-factly, don't perform them
- **Irregular sentence structure**: Some long, some short. Let sentences stop abruptly or run on
- **Casual asides**: Parentheticals, "theme of the trip??", trailing thoughts
- **Short punchy endings**: "No regrets." / "They were good!" / "Didn't matter."

### DON'T:

- **No em dashes**: They're an LLM tell. Use periods, commas, or restructure
- **No Joss Whedon quips**: Avoid "X. Adjective X. The kind of X where..." patterns
- **No forced metaphors**: Don't say "like an ant" or "won a small war" unless it actually occurred to you
- **No balanced constructions**: "short enough to X, long enough to Y" is too symmetrical
- **No tidy lessons**: Don't wrap things up with meaning. End on irony, ambivalence, or just stop
- **No travel blog voice**: Avoid "hidden gems", "must-see", "breathtaking views"

### Sentence patterns that feel human:

- Self-interrupting: "I was worried the whole thing would be a wash, but once we got into the mountains..."
- Self-correcting: "The food was excellent. Well, most of it."
- Honest qualifiers: "I think", "probably", "I don't know anything about X but..."
- Specific numbers and names: "around 8 to 10 monks", "population under 300", "Pulp coffee shop"

## Reference Authors

The style draws from:

- **Rayne Fisher-Quann** (internetprincess.substack.com): Long winding sentences, uncomfortable honesty, specific cultural observations
- **Delia Cai** (deezlinks.com): Casual, self-aware, parenthetical asides, multiple question marks, "JK JK"
- **Allegra Rosenberg** (tchotchke.substack.com): Enthusiastic without being precious, specific nostalgic details, genuine emotion
- **Ryan Broderick** (garbageday.email): Interrupts himself mid-thought, "wait no", "Really?", dry observations

Example texts:
Author: Rayne Fisher Quann:
Website: https://internetprincess.substack.com/
Example:

I’m tired of all this woman stuff. I don’t want to think so much about it, I want so badly sometimes to be able to write about something else. I wish I still remembered how to do math. For my whole life up until a few years ago I thought I’d be a physicist, and no one even knows that about me anymore. I remember a mentor in the math department saying to me once, bitterly, sadly — if you work in math, every day of your life will be about being a woman. If math is the only thing you can possibly do with your life, then it’s worth it; if you could be happy doing literally anything else, you should get out. And so I listened to her, and I left, and then somehow wriggled my way into this TRULY WONDERFUL career that makes me feel ALIVE and FULL OF PURPOSE in a way I never could have imagined, and where every single day of my working life is nevertheless about being a woman anyway.

it’s become very common for women online to express their identities through an artfully curated list of the things they consume, or aspire to consume — and because young women are conditioned to believe that their identities are defined almost entirely by their neuroses, these roundups of cultural trends and authors du jour often implicitly serve to chicly signal one’s mental illnesses to the public. one girl on your tiktok feed might be a self-described joan didion/eve babitz/marlboro reds/straight-cut levis/fleabag girl (this means she has depression). another will call herself a babydoll dress/sylvia plath/red scare/miu miu/lana del rey girl (eating disorder), or a green juice/claw clip/emma chamberlain/yoga mat/podcast girl (different eating disorder). the aesthetics of consumption have, in turn, become a conduit to make the self more easily consumable: your existence as a Type of Girl has almost nothing to do with whether you actually read joan didion or wear miu miu, and everything to do with whether you want to be seen as the type of person who would.

internet princess is made possible by the support of readers like you. to receive new posts and support my work, consider becoming a free or paid subscriber. <3

---

Author: Delia Cai
Website: https://www.deezlinks.com/
Example:

On an almost weekly basis, I wonder about putting more and more of myself into this newsletter. To just game the shit out of this, fuck it, perform whatever parasocial-paid-subs-performance pirouettes might be required. This is already how I pay my rent, amazingly; but what if it could be more??????? But that’s a a very specific road to choose to go down, and it’s not unlike the other highly structured games this industry has deigned to reward as a matter of “business model” for now. Frankly, it would be much simpler to have just one singular area of focus, versus splitting my time between the newsletter and freelance work. But I think I do not ever really want to do any of this stuff on my own, and for the moment, I’m really happy I don’t have to. This year, I found a lot more stability as a freelancer by doing a lot of contract-based work and, true joy of joys, finally getting into editing again. These freelance adventures have helped me realize that I am still happiest showing up to an office (uh well not every day, I’m not a sociopath) and working with a team and learning everything I can from extremely smart people (both younger and older!) and figuring out how to be useful — not to mention putting entire publications together and working with writers/editors whom I admire and get to champion. The whole point, really.

I think I have just about perfected my winter cold congestion stack: start with the industrial grade cough drops (taste is nasty but are life-changing), make yourself a Vietnamese herbal steam sauna at home using a couple of drops of fengyoujing, spritz saline moisturizing spray and Flonase mornings and nights, get the Vics tissues and rub tiger balm on the sides of your nose (not inside) and chest. Boil slices of ginger in a pot for 15-20 minutes and chug that magic potion on repeat. Sleep 10 hours/night and eat hot pot for dinner. This newsletter is now sponsored by cooling vapors and Little Sheep. JK JK none of these are affiliate links but this is secretly my 2025 gift guide.

---

Author: Allegra Rosenberg
Website: https://tchotchke.substack.com/
Example:

As a kid (c. 2003-2008) I was a devoted reader of Muse magazine, a nonfiction magazine for deeply nerdy children published by Carus Publishing, which was also the publisher behind the more well-known kids' lit mag Cricket. Muse was something totally unique: a hodgepodge of history, art, science, technology, geography and literature, plus cartoons by Larry Gonick (featuring a recurring cast of hilarious "Muses") and a thriving young readership which was visibly active on the letters page and in the submission contests at the back of each issue. The average reader seemed to be about 12 years old, read at a college level (or beyond), was obsessed with Lord of the Rings, Master & Commander, Greek myths or all 3, with a tendency towards Monty Python quotations and the kind of obsessive enthusiasm that probably got them weird looks at school.

I remember being SO proud and happy. Something I wrote was in print—in MUSE MAGAZINE!!! The best magazine ever! Even as a child I was sorely lacking in follow-through and was a big dreamer, always thinking up projects I'd never even start, let alone complete—but here was something I really, actually did. I can't overstate how incredible and patient and supportive my dad was throughout the whole process. I'm sure most of the final piece was his work but I never felt like that at the time—I felt like it was mine, and ours.

---

Author: Ryan Broderick
Website: https://www.garbageday.email/
Example:

You are, no doubt, being inundated with news about “prediction markets” right now. The two buzziest being Kalshi and Polymarket. Last month, both markets hit new volume records and the former recently raised $1 billion and inked a partnership with CNN, while the latter just got permission from the Commodity Futures Trading Commission to relaunch in the US after being banned here for the last four years.

A big part of the Kalshi and Polymarket push right now is thanks to the genuinely clever “prediction market” branding, making them both sound like some kind of actual scientific polling platform. But really they just offer event contract betting. Kalshi’s homepage has popular pool running right now called, “Who will be the first to leave the Trump Cabinet?” Secretary of Homeland Security Kristi Noem is leading. Weird, I’d probably go with Hegseth. Hmm maybe I should put some money down… wait no. And Polymarket has a big one at the moment called, “Time 2025 Person of the Year.” The popular bet is it’s going to be “artificial intelligence.” Really? Over Charlie Kirk. Hmm…

There are all kinds of allegations flying around that Polymarket is being used for insider trading. And its main X account has realized that posting apocalyptic financial news is great for engagement and, one would assume, perfect for inspiring people to gamble big, hoping to outrun the market collapse they keep posting on X about. But you know you’ve entered supervillain territory when even Grimes is calling you evil, writing on X yesterday, “You should not be able to bet on human suffering. The nihilistic gambling arena should not be allowed to publish their own headlines to spread [fear, uncertainty, and doubt] on the wellbeing of the people.”

Morals aside, these prediction markets are the dream of the post-COVID NFT mania. Unlike the NFT frenzy, though, they aren’t trying to turn JPGs into digital assets, they’re trying to commodify our opinions. But yes, crypto is involved here. Kalshi is a traditional betting market, but is launching a bridge to the Solana blockchain ecosystem soon. Polymarket runs on the Polygon blockchain and pays out in the USDC stablecoin. And just like the early 2020s crypto boom, there is an entire ecosystem of influencers that want to convince you to buy in. Kalshi has a whole army of users that post their wins to X and even livestream them. And 60 Minutes did an interview last week with a Polymarket user that goes by Domer, a former professional poker player, who has made around $3 million last year. Polymarket also seems to have quietly acquired the @NewsWire_US X account, which has more than 120,000 followers and now links to the platform’s “breaking news” tab. “Kalshi versus Polymarket is the first time we’ve seen armies of loosely affiliated paid influencers battling on behalf of their companies,” Neeraj Agrawal, the communications director for crypto nonprofit Coin Center, wrote on X last week.

## Example Transformation

**Input (bullet points):**

```
- Mtskheta, old capital
- Jvari Monastery, hill overlooking rivers
- Svetitskhoveli Cathedral
- Chronicles of Georgia monument, Soviet, unfinished
```

**Output:**

```
Half-day tour to Mtskheta, the old capital. Jvari Monastery is up on a hill overlooking where two rivers meet. You can see Svetitskhoveli Cathedral below, which we visited after.

The last stop was the Chronicles of Georgia, this massive Soviet-era monument with huge pillars covered in carvings of Georgian history. It's unfinished, apparently. Felt kind of eerie.
```

**What makes this work:**

- Names the actual places
- "which we visited after" is conversational, not "subsequently we visited"
- "apparently" and "Felt kind of eerie" are honest, low-key observations
- No attempt to make it profound
