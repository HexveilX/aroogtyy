/* ————————————————————————————————————————————————
   Aroogty's Little Universe — the copy, part two.
   letters · daily touch · soon · moon · visits · chapter nav ·
   play · whispers · stars · coupons · constellation · nudge ·
   time capsule · her page · postcard · mixtape · ticket stubs

   Same rule as part one: two carefully written versions of
   every line — English, and Egyptian Arabic.
———————————————————————————————————————————————— */

import { bi, type Bi } from "./bi";
import type { ViewId } from "./arooqtyContent";

/* ————— letters ————— */
export const mainLetter = {
  greeting: bi("My Aroogty,", "أروجتي،"),
  paragraphs: [
    bi(
      "I built you a little universe. It isn't much — some paper, some burgundy ink, and every small thing I never wanted to forget. But it's ours, and it will be here for as long as you want it.",
      "بنيتلك عالم صغير. مش حاجة كبيرة — شوية ورق، وحبر عنابي، وكل حاجة صغيرة عمري ما كنت عايز أنساها. بس هو بتاعنا، وهيفضل هنا قد ما تحبي.",
    ),
    bi(
      "I keep thinking about how quietly all of this began. One assignment. One conversation that had no reason to matter and somehow mattered completely. I didn't hear the moment everything changed — the same way you never hear the exact moment you fall asleep.",
      "براجّع في دماغي ازاي كل ده بدأ بهدوء. أسايمنت واحد. كلام واحد مكانوش أي سبب يبقى مهم — وبقى مهم بجد. ما سمعتش لحظة إن الدنيا اتغيرت — زي ما محدش بيسمع لحظة نومه بالظبط.",
    ),
    bi(
      "I should tell you what I actually love, since the word is too small to hold it. Your voice when you're half-asleep and still talking. The way you laugh halfway through a sentence and finish it anyway. The look in your eyes a second before you win an argument. The version of an ordinary day that has you in it. The list never closes — that's the part that amazes me most.",
      "لازم أقولك بحب إيه بالظبط، بما إن الكلمة صغيرة على اللي جواها. صوتك وانتِ نص نايمة ولسه بتتكلمي. طريقتك إنك تضحكي في نص الجملة وتكمّليها برضه. نظرة عينيك قبل ما تكسب النقاش بثانية. نسخة اليوم العادي اللي انتِ فيها. الليستة دي بتطول كل يوم — ودي أكتر حاجة تدهشني.",
    ),
    bi(
      "There's a word we say a lot, and it keeps coming out smaller than what I actually feel: بحبك. I started this letter knowing the word wouldn't be enough. But there is no bigger one in either language — so I keep choosing it. بحبك.",
      "في كلمة بنقولها كتير، وبتفضل أصغر من اللي إحنا فيه: بحبك. بدأت أكتب الرسالة دي وأنا عارف إن الكلمة مش هتكفيني — بس مفيش كلمة أكبر منها، فخليتها هي. بحبك.",
    ),
    bi(
      "People talk about love like it's one big decision. In my experience it's a thousand small ones — and I have made every single one of them on purpose. I choose you on the easy days. I'd choose you on the hard ones twice.",
      "الناس بتتكلم عن الحب كأنه قرار واحد كبير. اللي أنا شفته إنه ألف قرار صغير — وعملت كل واحد فيهم بقصد. باختارك في اليوم السهل. وفي اليوم التقيل كنت هختارك مرتين.",
    ),
    bi(
      "And now there's a counter at the top of this page that never stops, and I hope it never has a reason to. Years from now I want to open this on some ordinary Tuesday, see an absurd number of days, and feel exactly what I feel tonight.",
      "ودلوقتي فيه عدّاد فوق في الصفحة دي مش بيواقف أبدًا — ويا ريت مفيش يوم سبب يخليه يواقف. بعد سنين، عايز أفتح المكان ده في ثلاثاء عادي، أشوف رقم أيام مش معقول، وأحس بنفس اللي أنا حاسه بيه الليلة دي.",
    ),
    bi(
      "So here it all is — the notes, the little things, the memories, the words I only say out loud when it's dark. Keep them. Come back on the good days and the bad ones.",
      "وده كله — الورق، التفاصيل الصغيرة، الذكريات، والكلام اللي بقوله بصوت عالي بس لما تكون الدنيا ضلمة. خديهم. وارجعي في اليوم الحلو واليوم التقيل.",
    ),
    bi(
      "You are my favorite part of every day — even the days that haven't happened yet.",
      "أنتِ أحلى حاجة في يومي — حتى الأيام اللي لسه مجاتش.",
    ),
  ] as Bi[],
  signature: bi("yours, entirely", "مِلكك — خالص."),
};

export const sealedLetterLabels = {
  /** under a locked letter: {date} is the pretty open date */
  keptForTemplate: bi("kept for {date}", "محفوظة لـ {date}"),
  /** tiny countdown chip on a locked letter; {n} = days remaining */
  countdownTemplate: bi("{n} days", "{n} يوم"),
  /** locked letter hint */
  tapToBreakLabel: bi("tap to break the seal", "دوسي تكسري الختم"),
  readAgainLabel: bi("read again", "اقرئيها تاني"),
  openedLabel: bi("opened", "اتفتحت"),
};

export interface SealedLetter {
  id: string;
  title: Bi;
  /** ISO date — letter stays sealed until then. null = openable anytime. */
  openOn: string | null;
  body: Bi[];
}

export const sealedLetters: SealedLetter[] = [
  {
    id: "miss-me",
    title: bi("Open when you feel the quiet", "افتحيها لما تحسي بالهدوء"),
    openOn: null,
    body: [
      bi(
        "If you're reading this, tonight has too much quiet in it.",
        "لو انتي بتقرا دي، يبقى الليلة فيها هدوء زيادة عن اللزوم.",
      ),
      bi(
        "So — close your eyes for a second. I'm there. I'm in every page of this little place, and I'm one message away, and I miss you more.",
        "بصي — قفلي عينك ثانية. أنا هناك. أنا في كل صفحة في المكان الصغير ده، وبُعدي عنك رسالة، وأنا اللي وحشني أكتر.",
      ),
      bi(
        "Now go easy on yourself, and remember: you are loved here more than you know.",
        "دلوقتي ارفقي بنفسك، وافتكري: انتي محبوبة هنا أكتر من اللي انتي متخيلة.",
      ),
    ],
  },
  {
    id: "hard-day",
    title: bi("Open on a hard day", "افتحيها في يوم تقيل"),
    openOn: null,
    body: [
      bi(
        "Today was heavy. I don't need the details to know this much: you've carried worse, and you were gentle the whole way through.",
        "النهاردة كان تقيل. مش محتاج التفاصيل عشان أعرف كده: شيلتي أصعب من كده، وفضلتي لطيفة طول السكة.",
      ),
      bi(
        "Drink something warm. Breathe slowly. You don't have to be impressive tonight — you only have to rest.",
        "اشربي حاجة دافية. خدي نفس بهدوء. مش لازم تعملي في نفسك بطولة الليلة — بس لازم ترتاحي.",
      ),
      bi("I'm proud of you. I always am.", "أنا فخور بيكِ. ودايمًا كده."),
    ],
  },
  {
    id: "anniversary",
    title: bi("Open on our first anniversary", "افتحيها في أول سنة لينا"),
    openOn: "2027-05-19",
    body: [
      bi(
        "One year. Three hundred and sixty-five days of you — and the counter up there finally agrees with how long this has felt like home.",
        "سنة. 365 يوم منك — والعدّاد اللي فوق بقى أخيرًا موافق إن المكان ده بيت من زمان.",
      ),
      bi(
        "Thank you for every ordinary day you made extraordinary.",
        "شكرًا على كل يوم عادي انتي خلتيه استثنائي.",
      ),
      bi(
        "Here's to all the years the counter doesn't know about yet.",
        "عقبال كل السنين اللي العدّاد لسه مش عارفها.",
      ),
    ],
  },
  {
    id: "reminder",
    title: bi("Open when you need someone to tell you", "افتحيها وقت ما تحتاجي حد يقولك"),
    openOn: null,
    body: [
      bi(
        "In case nobody told you today: you are extraordinary. Not in the loud way — in the way that makes rooms softer, conversations better, and my whole day brighter.",
        "لو محدش قاللك النهاردة: انتي استثنائية. مش بالطريقة العالية — بالطريقة اللي بتخلي الأوض أدفى، والكلام أحلى، ويومي كله أنور.",
      ),
      bi(
        "Whatever made you open this letter, it was wrong about you.",
        "أي حاجة خلتك تفتحي الرسالة دي، هي غلط في حقك.",
      ),
      bi("I'm right about you. Trust me.", "وأنا صح فيكِ. اثقي فيّا."),
    ],
  },
  {
    id: "six-months",
    title: bi("Open six months in", "افتحيها بعد ست شهور"),
    openOn: "2026-11-19",
    body: [
      bi(
        "Half a year. One hundred and eighty-four days of choosing you over and over, and not one of them regretting it.",
        "نص سنة. 184 يوم بختارك فيهم مرة ورا مرة — ولا يوم واحد فيهم ندمت.",
      ),
      bi(
        "Somewhere around month three I stopped being able to tell which parts of the day were mine and which were ours — good-mornings that beat the sunrise, Dairy Milk diplomacy, the word بجااااد living rent-free in my head. It stopped feeling like a countdown. It started feeling like home.",
        "في حتة حوالين الشهر التالت، بقيت مش قادر أفرّق إيه اللي من يومي وإيه اللي لينا — صباح الخير اللي بيسابق الشمس، دبلوماسية الـ Dairy Milk، وكلمة بجااااد اللي ساكنة في دماغي من غير إيجار. بطّل يحس إنه عدّ تنازلي. بقى يحس إنه بيت.",
      ),
      bi(
        "If the next six months are even half as good as the first, I'm in serious trouble. The good kind.",
        "لو الست شهور الجاية نص الأوليين في الحلاوة، يبقى أنا في ورطة جدية. من النوع الحلو.",
      ),
    ],
  },
  {
    id: "valentines",
    title: bi("Open on Valentine's Day", "افتحيها في عيد الحب"),
    openOn: "2027-02-14",
    body: [
      bi(
        "I don't really trust a single day to hold the whole of how I feel about you — that's what every other day in this little place is for.",
        "أنا مش مؤمن إن يوم واحد يقدر يشيل قد إيه بحبك — عشان كده فيه كل يوم تاني في المكان ده.",
      ),
      bi(
        "But if today is the loud day, then here: I love you. Loudly. With intent. With the whole of my chest.",
        "بس لو النهاردة هي اليوم العالي الصوت، خدي: بحبك. بصوت عالي. بقصد. بكل اللي جوّه صدري.",
      ),
      bi(
        "Now go find the nearest Dairy Milk and pretend I'm there sharing it.",
        "دلوقتي روحي أقرب Dairy Milk وتخيلي إنني هناك بنقتسمها معاكي.",
      ),
    ],
  },
];

/* ————— a line for today (Home) ————— */
export const dailyTouch = {
  overline: bi("a line for today —", "جملة النهاردة —"),
  lines: [
    bi(
      "Today, notice one small thing you'd usually walk past. Tell me about it later.",
      "النهاردة، بصي لحاجة صغيرة انتي عادة بتعدي عليها. وقوليلي عليها بعدين.",
    ),
    bi(
      "Somewhere in the middle of an ordinary day, someone is quietly glad you exist. (It's me. It's always me.)",
      "في نص يوم عادي، في حد مبسوط بصمت إنك موجودة. (ده أنا. دايمًا أنا.)",
    ),
    bi(
      "You don't have to be impressive today. You only have to be you — that's already the good part.",
      "مش لازم تباني النهاردة. بس لازم تكوني انتي — دي أصلًا أحلى حاجة في اليوم.",
    ),
    bi(
      "If tonight feels long, remember: the counter never stops, and neither do I.",
      "لو الليلة طويلة، افتكري: العدّاد مش بيواقف، وأنا كمان.",
    ),
    bi(
      "Today's forecast: mostly ordinary, with a chance of me thinking about you.",
      "توقعات النهاردة: عادي غالبًا، مع احتمال إني بفكر فيكي.",
    ),
    bi(
      "You are the reason a whole website exists. Just saying.",
      "انتي السبب إن موقع كامل موجود. بحب أقول وبس.",
    ),
    bi(
      "Pick one memory from the drawer today. Even the small ones are worth re-living.",
      "اختاري ذكرى واحدة من الدرج النهاردة. حتى الصغيرة منهم تستاهل تتعاود.",
    ),
    bi(
      "Be gentle with yourself today — you're the person I'm gentlest with, and I'd like the favor returned.",
      "ارفقي بنفسك النهاردة — انتي أكثر حد بلطف معاه، وحابب المعاملة تترجع.",
    ),
    bi(
      "New day, same fact: best part of it is you.",
      "يوم جديد، نفس الحقيقة: أحلى حاجة فيه انتي.",
    ),
    bi(
      "If you find a burgundy rose anywhere today, that's the universe agreeing with me.",
      "لو لقتي وردة عنابي في أي حتة النهاردة، دي الكون بيوافقني الرأي.",
    ),
    bi(
      "Hum the song today. I'll hear it somehow.",
      "دندني الأغنية النهاردة. هسمعها بطريقة ما.",
    ),
    bi(
      "A year from now, we'll open this on some ordinary day and smile at how far the counter has come.",
      "بعد سنة، هنفتح المكان ده في يوم عادي ونبتسم لقد إيه العدّاد وصل.",
    ),
    bi(
      "Somewhere between an assignment and a heartbeat, you became my favorite habit.",
      "في حتة ما بين الأسايمنت ونبضة قلب، بقيتي عادتي المفضلة.",
    ),
    bi(
      "Today needs nothing special in it. You walking through it is already the special part.",
      "النهاردة مش محتاجة حاجة خاصة. مرورك بيها هو الجزء الخاص.",
    ),
    bi(
      "Check the moon tonight — it's been keeping an eye on us since day one.",
      "بصي للقمر الليلة — من أول يوم وهو بيرعانا.",
    ),
    bi(
      "Open the memory drawer and pick a random one. I already know which one you'll hope for.",
      "افتحي درج الذكريات واختاري واحدة عشوائي. عارف انتي هتتمنيها تكون مين.",
    ),
    bi(
      "Somewhere in your day today there's a small good thing with your name on it. Keep an eye out.",
      "في حتة في يومك النهاردة حاجة كويسة صغيرة اسمك عليها. خلي عينك مفتوحة.",
    ),
    bi(
      "Read today's whisper in the letters room — I unsealed it just for you.",
      "اقرئي همسة النهاردة في أوضة الرسايل — فتحتها ليكِ بس.",
    ),
    bi(
      "Fact: you've survived 100% of your hardest days so far. Today doesn't stand a chance.",
      "حقيقة: عديتي 100% من أصعب أيامك لحد دلوقتي. النهاردة مالهاش فرصة.",
    ),
    bi(
      "If we were sharing a table right now, I'd be stealing glances over my cup. Consider this line a glance.",
      "لو كنا قاعدين على نفس الترابيزة دلوقتي، كنت هبصّلك من فوق الفنجان. اعتبري السطر ده بصّة.",
    ),
  ] as Bi[],
};

/* ————— soon — a quiet countdown to the next date worth waiting for ————— */
export interface SoonDate {
  id: string;
  /** ISO date — the day itself */
  iso: string;
  /** what we're counting down to, lowercase */
  label: Bi;
  /** pretty copy of the date */
  prettyDate: string;
  /** which section to peek at when she taps the card */
  view: ViewId;
  /** {days} is replaced */
  daysTemplate: Bi;
}

export const soonCard = {
  overline: bi("soon —", "قريب —"),
  /** shown on the day itself, {label} is replaced */
  todayTemplate: bi("it's today — {label} ♥", "إنه النهاردة — {label} ♥"),
  /** shown the day before */
  tomorrowTemplate: bi("tomorrow — {label}", "بكره — {label}"),
  /** small link line on the card */
  linkLabel: bi("keep it company", "خليكي معاها"),
  /** aria line for the whole card */
  ariaTemplate: bi(
    "{days} days until {label}, {date}",
    "باقي {days} يوم على {label}، {date}",
  ),
  /** day / days unit under the number */
  dayUnit: bi("day", "يوم"),
  daysUnit: bi("days", "أيام"),
  /** dates worth counting down to; the nearest future one shows */
  dates: [
    {
      id: "birthday-19",
      iso: "2026-09-18",
      label: bi("her 19th birthday", "عيد ميلادها التسعتاشر"),
      prettyDate: "18 September 2026",
      view: "birthday",
      daysTemplate: bi("{days} days until", "باقي {days} يوم على"),
    },
    {
      id: "first-anniversary",
      iso: "2027-05-19",
      label: bi("one whole year of us", "سنة كاملة لينا"),
      prettyDate: "19 May 2027",
      view: "beginning",
      daysTemplate: bi("{days} days until", "باقي {days} يوم على"),
    },
    {
      id: "birthday-20",
      iso: "2027-09-18",
      label: bi("her 20th birthday", "عيد ميلادها العشرين"),
      prettyDate: "18 September 2027",
      view: "birthday",
      daysTemplate: bi("{days} days until", "باقي {days} يوم على"),
    },
  ] as SoonDate[],
};

/* ————— the moon (Our Beginning) ————— */
export const moonCard = {
  overline: bi("and the moon —", "والقمر —"),
  thatNightLabel: bi("the night we began", "الليلة اللي بدأنا فيها"),
  tonightLabel: bi("tonight", "الليلة"),
  line: bi("different moon, same us.", "قمر مختلف… وإحنا نفسنا."),
  /** tiny caption under each moon: {phase} is replaced with the phase name */
  captionTemplate: bi("{phase}", "{phase}"),
  /** aria for each disc: {p} percent lit, {phase} name */
  ariaTemplate: bi("{p} percent lit — {phase}", "{p}% منوّر — {phase}"),
  /** Egyptian Arabic names for the eight phases, keyed by the engine's English name */
  phaseNames: {
    "new moon": bi("new moon", "محاق"),
    "waxing crescent": bi("waxing crescent", "هلال متزايد"),
    "first quarter": bi("first quarter", "التربيع الأول"),
    "waxing gibbous": bi("waxing gibbous", "أحدب متزايد"),
    "full moon": bi("full moon", "بدر"),
    "waning gibbous": bi("waning gibbous", "أحدب متناقص"),
    "last quarter": bi("last quarter", "التربيع الأخير"),
    "waning crescent": bi("waning crescent", "هلال متناقص"),
  } as Record<string, Bi>,
};

/* ————— the visit keepsake (Home) ————— */
export const visitKeepsake = {
  /** shown on the very first day */
  firstLine: bi(
    "your first day here — welcome home ♥",
    "أول يوم ليكي هنا — أهلاً بيكي في البيت ♥",
  ),
  /** {days} is replaced */
  template: bi("you've been here {days} days now", "بقيتي هنا {days} يوم"),
  /** special lines on milestone days (day count → line) */
  milestones: {
    10: bi(
      "ten days of visiting — this place likes you.",
      "عشرة أيام زيارة — المكان ده بيحبك.",
    ),
    50: bi(
      "fifty days — it's officially your little corner too.",
      "خمسين يوم — بقى رسميًا ركنك الصغير كمان.",
    ),
    100: bi(
      "one hundred days of coming back. thank you, always.",
      "مية يوم رجوع. شكرًا، دايمًا.",
    ),
    365: bi(
      "a whole year of visits — my favorite regular. ♥",
      "سنة كاملة زيارة — أحلى زبونة عندي. ♥",
    ),
  } as Record<number, Bi>,
};

/* ————— it's today (Home, on her birthday itself) ————— */
export const birthdayToday = {
  overline: bi("18 September — it's today", "18 سبتمبر — إنه النهاردة"),
  /** {name} is replaced */
  headline: bi("Happy Birthday, {name} ♥", "كل سنة وأنتِ طيبة، {name} ♥"),
  line: bi(
    "the little birthday room is open — one wish is waiting on its candles.",
    "أوضة العيد الصغيرة مفتوحة — فيه أمنية مستنية شموعها.",
  ),
  linkLabel: bi("go make your wish", "روحي اتمني"),
  ariaLabel: bi(
    "It's her birthday today — open the birthday room",
    "عيد ميلادها النهاردة — افتحي أوضة العيد",
  ),
  /** tiny suffix appended to the link's aria-label */
  ariaSuffix: bi("— open the birthday room", "— افتحي أوضة العيد"),
};

/* ————— chapter footer navigation (prev / next at the end of every section) ————— */
export const chapterNav = {
  /** {label} is replaced with the destination section name */
  backTemplate: bi("Back to {label}", "ارجعي لـ {label}"),
  continueTemplate: bi("Continue to {label}", "كمّلي لـ {label}"),
  /** {current} and {total} are replaced, e.g. "3 of 7" */
  counterTemplate: bi("{current} of {total}", "{current} من {total}"),
  /** tiny line above the tabs */
  overline: bi("keep going —", "كمّلي —"),
  /** the little overline word on each tab */
  backWord: bi("back to", "رجوع إلى"),
  continueWord: bi("continue to", "التالي"),
  /** sr-only label for the whole nav */
  ariaLabel: bi("Chapter navigation", "تنقّل الفصول"),
};

/* ————— play a little (the drawer at the bottom of Little Things) ————— */
export interface QuizOption {
  label: Bi;
  /** the small personal note revealed when she picks this option */
  note: Bi;
}

export interface QuizQuestion {
  question: Bi;
  options: QuizOption[];
  /** index of the intended answer inside options */
  answerIndex: number;
}

export interface MatchCard {
  kind: "photo" | "hand" | "bubble" | "italic" | "object";
  image?: string;
  text?: Bi;
  object?: "rose" | "chocolate";
}

export interface MatchPair {
  id: string;
  a: MatchCard;
  b: MatchCard;
  /** the little line revealed once the pair is matched */
  note: Bi;
}

export const playLittle = {
  drawerLabel: bi("play a little ♡", "اتسلي شوية ♡"),
  drawerHint: bi(
    "five tiny things to do, when you feel like it",
    "خمس حاجات صغيرة تعمليها، وقت ما تحبي",
  ),
  backLabel: bi("back", "رجوع"),

  activities: [
    { key: "quiz", label: bi("the quiz", "الكويز"), sub: bi("five little questions", "خمس أسئلة صغيرة") },
    { key: "match", label: bi("memory match", "ماتش الذكريات"), sub: bi("three pairs, six cards", "تلات أزواج، ست كروت") },
    { key: "jar", label: bi("pick a note", "اسحبي ورقة"), sub: bi("for ordinary days", "للأيام العادية") },
    { key: "reasons", label: bi("a reason", "سبب"), sub: bi("for heavier days", "للأيام التقيلة") },
    { key: "coupon", label: bi("a coupon", "كوبون"), sub: bi("scratch when you need one", "اكشطي وقت ما تحتاجيه") },
  ] as { key: string; label: Bi; sub: Bi }[],

  quiz: {
    title: bi("Aroogty's little quiz", "كويز أروجتي الصغير"),
    sub: bi(
      "five little questions — there are no wrong answers here",
      "خمس أسئلة صغيرة — مفيش إجابة غلط هنا",
    ),
    softRight: bi(
      "Of course. That one's practically your signature.",
      "طبعًا. دي تقريبًا توقيعك.",
    ),
    softWrong: bi(
      "Almost. But this answer is very you too.",
      "قريب. بس الاختيار ده شكلك انتِ كمان.",
    ),
    revealNoteLabel: bi("a small note —", "ملاحظة صغيرة —"),
    nextLabel: bi("next question", "السؤال اللي بعده"),
    finishLabel: bi("see how you did", "شوفي عملتي إزاي"),
    completeLine: bi(
      "…that's her, entirely. Five for five in my heart.",
      "…دي هي بالظبط. خمسة من خمسة في قلبي.",
    ),
    unlockLine: bi("you just unlocked a hidden letter ♥", "كشفتي رسالة مخفية ♥"),
    readLetterLabel: bi("read the hidden letter", "اقرئي الرسالة المخفية"),
    againLabel: bi("take it again", "خديها تاني"),
    /** {n} of {total} progress */
    counterTemplate: bi("{n} of {total}", "{n} من {total}"),
    /** shown again later if she wants to re-read the earned letter */
    letterEarnedLine: bi("you earned a hidden letter here ♥", "خدتي هنا رسالة مخفية ♥"),
    questions: [
      {
        question: bi(
          "Which emoji is basically her signature?",
          "إيه الإيموجي اللي توقيعها بالظبط؟",
        ),
        options: [
          {
            label: bi("🤭🤭", "🤭🤭"),
            note: bi(
              "Two of them, minimum. I know the exact shape of a message that's about to end in them.",
              "اتنين على الأقل. عارف بالظبط شكل الرسالة اللي هتخلص بيهم.",
            ),
          },
          {
            label: bi("😐😐", "😐😐"),
            note: bi("This would be concerning, honestly.", "دي كانت هتقلقني بصراحة."),
          },
          {
            label: bi("🥲🥲", "🥲🥲"),
            note: bi(
              "Sweet — but no. You're the 🤭 one.",
              "حلوة — بس لأ. انتي بتاعة الـ 🤭.",
            ),
          },
        ],
        answerIndex: 0,
      },
      {
        question: bi(
          "What word does she say too much?",
          "إيه الكلمة اللي بتقولها كتير عن اللزوم؟",
        ),
        options: [
          {
            label: bi("obviously", "obviously"),
            note: bi("I wish. That one's mine.", "ياريت. دي بتاعتي أنا."),
          },
          {
            label: bi("بجااااد", "بجااااد"),
            note: bi(
              "The most dramatic word in any language — and you deliver it perfectly every single time.",
              "أكتر كلمة فيها دراما في أي لغة — وأنتِ بتوصّليها بإتقان كل مرة.",
            ),
          },
          {
            label: bi("yalla", "ي الله"),
            note: bi(
              "Usually aimed at me. Usually deserved.",
              "غالبًا موجّهة ليا. وغالبًا على حق.",
            ),
          },
        ],
        answerIndex: 1,
      },
      {
        question: bi(
          "The one non-negotiable chocolate?",
          "الشوكولاتة اللي مفيش فيها نقاش؟",
        ),
        options: [
          {
            label: bi("Dairy Milk", "Dairy Milk"),
            note: bi(
              "The correct answer was never in doubt. There's probably one within your reach right now.",
              "الإجابة الصح عمرها ما كانت محل شك. على الأرجح فيه واحدة في مدي إيدك دلوقتي.",
            ),
          },
          {
            label: bi("anything dark", "أي حاجة دارك"),
            note: bi("Respectable. Wrong, but respectable.", "محترمة. غلط، بس محترمة."),
          },
          {
            label: bi("whatever's near the checkout", "أي حاجة جنب الكاشير"),
            note: bi("That's survival, not chocolate.", "دي اسمها نجاة، مش شوكولاتة."),
          },
        ],
        answerIndex: 0,
      },
      {
        question: bi("How did all of this start?", "كل ده بدأ إزاي؟"),
        options: [
          {
            label: bi("a university assignment", "أسايمنت في الجامعة"),
            note: bi(
              "One ordinary message about a subject. Neither of us knew what it was going to become.",
              "رسالة عادية عن مادة. محدش فينا كان عارف هيبقى إيه.",
            ),
          },
          {
            label: bi("a mutual friend", "صاحب مشترك"),
            note: bi(
              "No setup crew — just a deadline and a message.",
              "مفيش حد رتّبنا — بس ديادلاين ورسالة.",
            ),
          },
          {
            label: bi("a coffee shop", "كافيه"),
            note: bi(
              "There was no café. There was Canvas. Somehow that's better.",
              "مفيش كافيه. كان فيه Canvas. ومش عارف إزاي، بس ده أحسن.",
            ),
          },
        ],
        answerIndex: 0,
      },
      {
        question: bi(
          "Why is this whole place burgundy?",
          "ليه المكان ده كله عنابي؟",
        ),
        options: [
          {
            label: bi("because the color means her", "لأن اللون بقى معناه أنتِ"),
            note: bi(
              "You've seen the palette. There was never another color.",
              "شفتي الألوان. عمره ما كان فيه لون تاني.",
            ),
          },
          {
            label: bi("it was the only ink left", "كان آخر حبر في الدنيا"),
            note: bi("Poetic — but no. There was a reason.", "شعري — بس لأ. كان فيه سبب."),
          },
          {
            label: bi("random choice", "اختيار عشوائي"),
            note: bi(
              "Nothing in here is random. You should know that by now.",
              "مفيش حاجة هنا عشوائية. كان لازمك تعرفي كده من زمان.",
            ),
          },
        ],
        answerIndex: 0,
      },
    ] as QuizQuestion[],
  },

  match: {
    title: bi("Memory match", "ماتش الذكريات"),
    sub: bi(
      "three pairs, six cards — turn them over gently",
      "تلات أزواج، ست كروت — اقلبيهم براحة",
    ),
    matchedLabel: bi("matched ♥", "اتلاقوا ♥"),
    completeLine: bi(
      "You keep more of us than you realize. ♡",
      "انتِ محتفظة بينا أكتر من اللي واخدة بالك. ♡",
    ),
    playAgainLabel: bi("shuffle & play again", "اخلطي وكمّلي تاني"),
    /** face descriptions for aria, keyed by card kind */
    faces: {
      photo: bi("a small photograph", "صورة صغيرة"),
      hand: bi("a small handwritten word", "كلمة صغيرة مكتوبة بإيد"),
      bubble: bi("a little chat bubble of ours", "فقاعة كلام من اللي بنقوله"),
      italic: bi("a small keepsake line", "سطر صغير محفوظ"),
      object: bi("a small keepsake", "تذكار صغير"),
    } as Record<string, Bi>,
    ariaUp: bi("Memory card, face up: {label}", "كارت ذكرى، واجهة لفوق: {label}"),
    ariaDown: bi(
      "A face-down memory card — tap to turn it over",
      "كارت ذكرى مقلوب — دوسي تقلبيه",
    ),
    pairs: [
      {
        id: "cafe-date",
        a: {
          kind: "photo",
          image: "/memories/cafe.png",
        },
        b: {
          kind: "hand",
          text: bi("the everyday", "اليومي"),
        },
        note: bi(
          "Somewhere in the first weeks, ‘someone from the assignment’ became the first message of every day.",
          "في أول الأسابيع، «وحدة من الأسايمنت» بقيت أول رسالة كل يوم.",
        ),
      },
      {
        id: "late-night",
        a: {
          kind: "bubble",
          text: bi("لسه صاحية؟", "لسه صاحية؟"),
        },
        b: {
          kind: "italic",
          text: bi(
            "the conversation that forgot to end",
            "الكلام اللي نسي يخلص",
          ),
        },
        note: bi(
          "One of us was always ‘about to sleep’. Both of us never were.",
          "واحد فينا دايمًا «هيرقد حالا». واتنين أبدًا ما كنا.",
        ),
      },
      {
        id: "rose-page",
        a: {
          kind: "object",
          object: "rose",
        },
        b: {
          kind: "hand",
          text: bi("the palette", "الألوان"),
        },
        note: bi(
          "No rose in a book — just a color that quietly became yours.",
          "مفيش ورد في كتاب — بس لون بقى ليكِ بهدوء.",
        ),
      },
    ] as MatchPair[],
  },

  jar: {
    title: bi("Pick a note", "اسحبي ورقة"),
    sub: bi("a little jar for ordinary days", "برطمان صغير للأيام العادية"),
    pickLabel: bi("pick a note", "اسحبي ورقة"),
    againLabel: bi("pick another", "اسحبي كمان واحدة"),
    jarLabel: bi("the jar", "البرطمان"),
    ariaTemplate: bi(
      "Pick a folded note from the jar (note {n})",
      "اسحبي ورقة مطوية من البرطمان (ورقة {n})",
    ),
    notes: [
      bi(
        "If today was ordinary — thank you for making ordinary feel like enough.",
        "لو النهاردة كان عادي — شكرًا إنك خلتي العادي كفاية.",
      ),
      bi(
        "If today feels ordinary — remember someone still calls it a good day, just because you're in it.",
        "لو النهاردة عادية — افتكري إن فيه حد لسه بيسميها يوم حلو، بس عشان انتي فيها.",
      ),
      bi(
        "Whatever made you open this jar, it was wrong about you.",
        "أي حاجة خلتك تفتحي البرطمان ده، هي غلط في حقك.",
      ),
      bi("One message away. Always.", "بُعدك عني رسالة. دايمًا."),
      bi(
        "Still counting. Still grateful. Still yours.",
        "لسه بحسب. لسه مبسوط. لسه ليكِ.",
      ),
      bi("Close your eyes for a second — I'm there.", "قفلي عينك ثانية — أنا هناك."),
      bi(
        "You make rooms softer just by being in them.",
        "الأوض بتدفى وبس انتي فيها.",
      ),
      bi(
        "Drink something warm. Breathe slowly. I'm proud of you.",
        "اشربي حاجة دافية. خدي نفس براحة. أنا فخور بيكِ.",
      ),
      bi(
        "The jar never runs out. Neither do I.",
        "البرطمان عمره ما بيخلص. وأنا كمان.",
      ),
      bi(
        "Tonight, put your phone down for one minute and just breathe. That's me hugging you long-distance.",
        "الليلة، نزّلي الموبايل دقيقة واحدة وخدي نفس. دي أنا بحضنك من بعيد.",
      ),
      bi(
        "If loving you is a habit, it's the only one I never once tried to quit.",
        "لو حبك عادة، هي العادة الوحيدة اللي عمري ما حاولت أبطلها.",
      ),
      bi(
        "If the day was loud, here is one quiet corner of it. It was always yours.",
        "لو اليوم كان عالي الصوت، دي ركن هادية منه. كانت دايمًا بتاعتك.",
      ),
    ] as Bi[],
  },

  reasons: {
    title: bi("A reason, when you need one", "سبب، وقت ما تحتاجيه"),
    sub: bi("a small deck, kept for heavier days", "كوتشينة صغيرة، متخزنة للأيام التقيلة"),
    drawLabel: bi("draw a card", "اسحبي كارت"),
    againLabel: bi("draw another", "اسحبي كمان"),
    deckLabel: bi("the deck", "الكوتشينة"),
    /** shown once every card has been seen */
    seenAllLine: bi(
      "that was the whole deck — and still not all of them. ♡",
      "دي كانت الكوتشينة كلها — ولسه مش كل الأسباب. ♡",
    ),
    reshuffleLabel: bi("shuffle & start over", "اخلطي وابدئي من الأول"),
    emptyLine: bi("— empty —", "— فاضية —"),
    remainingTemplate: bi(
      "{n} of {total} left in the deck",
      "فاضل {n} من {total} في الكوتشينة",
    ),
    overline: bi("a reason —", "سبب —"),
    reasons: [
      bi(
        "Because you laugh with your whole face, every single time.",
        "لأنك بتضحكي بوشك كله، كل مرة.",
      ),
      bi(
        "Because “we'll figure it out” sounds believable when you say it.",
        "لأن «هنظبطها» بتبقى معقولة لما انتي اللي بتقوليها.",
      ),
      bi(
        "Because you notice the small things I stopped noticing years ago — you taught me to look again.",
        "لأنك بتشوفي التفاصيل اللي أنا بطّلت أشوفها من سنين — انتي اللي فتحتي عيني عليها تاني.",
      ),
      bi(
        "Because even your “one more episode” promises are honest attempts.",
        "لأن حتى وعود «حلقة كمان» بتاعتك محاولات صادقة.",
      ),
      bi(
        "Because the world is genuinely softer where you're standing.",
        "لأن الدنيا بجد أدفى في الحتة اللي انتي واقفة فيها.",
      ),
      bi(
        "Because you care about people quietly, without needing credit for it.",
        "لأنك بتقلبي على الناس بهدوء، من غير ما تحتاجي حد يشكرك.",
      ),
      bi(
        "Because your good-mornings have better timing than sunrise.",
        "لأن صباحاتك بتوقيت أحسن من الشمس.",
      ),
      bi(
        "Because you make ordinary Tuesdays feel worth writing down.",
        "لأنك بتخلي أي ثلاثاء عادي يستاهل يتكتب.",
      ),
      bi(
        "Because you never make anyone feel like too much — especially me.",
        "لأنك عمري ما خليتي حد يحس إنه تقيل — خصوصًا أنا.",
      ),
      bi(
        "Because my favorite silence is the one with you in it.",
        "لأن أحلى سكوت عندي هو اللي انتي فيه.",
      ),
      bi(
        "Because you're trying, always trying — and it shows.",
        "لأنك بتحاولي، دايمًا بتحاولي — وبان.",
      ),
      bi(
        "Because this whole place exists, and you're the reason it needed to.",
        "لأن المكان ده كله موجود، وانتي السبب إنه احتاج يكون.",
      ),
      bi(
        "Because your name on my screen still gets read first, every time, no matter what else is waiting.",
        "لأن اسمك على شاشتي بيتقري الأول، كل مرة، مهما كان مستني غيره.",
      ),
      bi(
        "Because home stopped being a place the day it became a person.",
        "لأن البيت بطّل مكان من يوم ما بقى شخص.",
      ),
    ] as Bi[],
  },
};

/* ————— the hidden letter earned by finishing the quiz ————— */
export const quizHiddenLetter = {
  title: bi("A letter you earned", "رسالة انتي كسبتيها"),
  paragraphs: [
    bi(
      "You just answered five questions about yourself like it was nothing — which means you already know what I'm about to say.",
      "جوبتي على خمس أسئلة عن نفسك كأنها ولا حاجة — يعني انتي أصلًا عارفة اللي أنا ناوي أقوله.",
    ),
    bi(
      "There was never a wrong answer on that list. Every option was you, because I wrote all of them while thinking about you.",
      "عمره ما كانت فيه إجابة غلط في الليستة دي. كل اختيار كان انتي، لأني كتبتهم كلهم وأنا مفكر فيكي.",
    ),
    bi(
      "So here is your hidden letter, as promised: I am proud of you, I am lucky, and I would build you a hundred of these little universes if you asked.",
      "ودي رسالتك المخفية زي ما وعدت: أنا فخور بيكِ، وأنا محظوظ، وهبني ليكِ مية عالم صغير زي ده لو طلبتي.",
    ),
  ] as Bi[],
  signature: bi("earned, honestly — ♥", "عن جدارة — ♥"),
};

/* ————— whispers — one small note from him, unsealed each day ————— */
export const whispers = {
  overline: bi("whispers —", "همسات —"),
  title: bi("Whispers, one a day", "همسات، وحدة كل يوم"),
  sub: bi(
    "a tiny note unseals itself each day you visit",
    "ورقة صغيرة بتفتح ختمها بنفسها كل يوم تزوري فيه",
  ),
  /** {n} is replaced — e.g. "whisper no. 4" */
  dayTemplate: bi("whisper no. {n}", "همسة رقم {n}"),
  todayLabel: bi("today's whisper", "همسة النهاردة"),
  earlierLabel: bi("earlier whispers", "الهمسات اللي فاتت"),
  /** the little postal stamp on today's slip — {date} is replaced */
  stampTemplate: bi("unsealed {date}", "اتفكت {date}"),
  /** {n} of {total} */
  progressTemplate: bi("{n} of {total} unsealed", "اتفكوا {n} من {total}"),
  tomorrowLine: bi(
    "a new one unseals itself tomorrow",
    "وحدة جديدة هتفك نفسها بكره",
  ),
  allUnsealedLine: bi(
    "that's every whisper — but I keep saying them anyway. ♡",
    "دي كل الهمسات — بس أنا لسه بقولها برضه. ♡",
  ),
  /** the wax-heart stamp text */
  stampText: bi("with love", "بالمحبة"),
  notes: [
    bi(
      "If you're reading this before noon — good morning, my love. The day officially starts now.",
      "لو انتي بتقرا دي قبل الضهر — صباح الخير يا حبيبتي. اليوم بيبدأ رسميًا دلوقتي.",
    ),
    bi(
      "I practiced saying something romantic for three minutes today. Then your name lit up my screen and I forgot all of it.",
      "اتمرنت على جملة رومانسية تلات دقايق النهاردة. وبعدين اسمك نوّر الشاشة ونسيتها كلها.",
    ),
    bi(
      "You know that thing you do, laughing halfway through a sentence? I'd build a second website just for that.",
      "عارفة الحاجة اللي بتعمليها، بتضحكي في نص الجملة؟ كنت هبني موقع تاني عشانها وبس.",
    ),
    bi(
      "Today I thought about you at 3:12 PM for no reason at all. No reason was needed.",
      "النهاردة فكرت فيكي 3:12 الضهر من غير أي سبب. ومكانش سبب مطلوب أصلًا.",
    ),
    bi(
      "If we ever argue about who loves who more, I want it noted that I coded an entire universe. In the dark. For you.",
      "لو اتعاركنا يوم مين بيحب مين أكتر، عايز يتسجل إني كودت عالم كامل. في الضلمة. ليكِ.",
    ),
    bi(
      "Somewhere today, someone heard our song by accident and didn't even know it was ours. Their loss.",
      "في حتة النهاردة، حد سمع أغنيتنا بالغلط ومتعرفش إنها لينا. خسارته.",
    ),
    bi(
      "Reminder, in writing: you are the exact right amount of wonderful. Not one drop less.",
      "تذكير، بالكتابة: انتي بالظبط القدّ الصح من الروعة. ولا نقطة أقل.",
    ),
    bi(
      "I left this whisper here instead of texting it, so it would find you at the right moment. Hi. That's it. Hi.",
      "سيبت الهمسة دي هنا بدل ما أبعتها، عشان تلاقيكي في اللحظة الصح. أهلاً. خلاص كده. أهلاً.",
    ),
    bi(
      "If tonight feels heavy, set it down for a second. I'll hold it while you breathe.",
      "لو الليلة تقيلة، حطيها ثانية. أنا هشيلها لحد ما تاخدي نفس.",
    ),
    bi(
      "If tonight is one of the long ones — I'm one message away. That's not a line, that's logistics.",
      "لو الليلة من الطويلات — بُعدي عنك رسالة. دي مش جملة حلوة، دي لوجستيات.",
    ),
    bi(
      "Fun fact: the counter on the home page never sleeps. Neither does the thing it's counting.",
      "معلومة ممتعة: العدّاد في الصفحة الرئيسية عمره ما بيينام. ولا الحاجة اللي بيعدّها.",
    ),
    bi(
      "I hope today gave you at least one moment worth keeping in the drawer.",
      "يا ريت اليوم ادالك لحظة واحدة على الأقل تستاهل الدرج.",
    ),
    bi(
      "You make my whole favorites list. There isn't even a second place.",
      "انتي الليستة المفضلة كلها. مفيش حتى مركز تاني.",
    ),
    bi(
      "Last one — for now: whatever today was, tomorrow gets a fresh version of me loving you.",
      "الأخيرة — لحد دلوقتي: أيًا كان اليوم إيه، بكره بياخد نسخة جديدة مني وأنا بحبك.",
    ),
    bi(
      "I caught myself humming our song while doing something boring today. The boring thing got less boring. Funny how that works.",
      "مسكت نفسي بدندن أغنيتنا وأنا بعمل حاجة مملة النهاردة. الحاجة المملة بقت أقل ملل. عجيبة الدنيا.",
    ),
    bi(
      "There are exactly two kinds of days now: the ones I talk to you, and the ones I wait to.",
      "فيه نوعين أيام دلوقتي بالظبط: اللي بتكلمك فيها، واللي باستنى فيها.",
    ),
    bi(
      "Being away from you taught me one thing: I don't actually know how to be away from you.",
      "البعد عنك علّمني حاجة واحدة: أنا أصلًا مش عارف أبعد عنك.",
    ),
    bi(
      "There's a tiny heart somewhere on this page that's dim until you finish what it stands for. Hunt one down today.",
      "في قلب صغير في حتة في الصفحة دي ضلمان لحد ما تكمّلي اللي بيمثله. دوّري على واحد النهاردة.",
    ),
    bi(
      "If today's nudge feels random — it is. Picked just for you, just for today. Don't tell the others.",
      "لو دفعة النهاردة عشوائية — هي كده. متختارة ليكِ بس، للنهاردة بس. متقوليش للباقيين.",
    ),
    bi(
      "Reminder: 'we'll figure it out' is a complete sentence and a full plan. It works because we mean it.",
      "تذكير: «هنظبطها» جملة كاملة وخطة كاملة. بتشتغل لأننا قاصدينها.",
    ),
  ] as Bi[],
};

/* ————— the sky that night (Our Beginning) ————— */
export const starMap = {
  overline: bi("the sky that night —", "السما الليلة دي —"),
  title: bi("19 May 2026, nightfall", "19 May 2026، مع الغروب"),
  sub: bi(
    "every star that was out the evening we began — and one constellation that wasn't",
    "كل نجمة كانت طالعة الليلة اللي بدأنا فيها — وبرج مش موجود في أي خريطة تانية",
  ),
  /** the accessible label for the canvas picture */
  ariaLabel: bi(
    "A night sky full of stars on the evening of 19 May 2026, with a small heart-shaped constellation connected by thin rose lines, labelled for us",
    "سما ليلية مليانة نجوم في ليلة 19 May 2026، وبرج قلب صغير متوصل بخيوط وردية رفيعة، مكتوب عليه لينا",
  ),
  /** the little wish button under the sky */
  wishLabel: bi("catch a falling star", "امسكي شهاب"),
  /** shown once, the first time she catches one */
  wishCaughtLine: bi(
    "caught it. wish wisely — they count double here.",
    "مسكتيها. اتمني بذكاء — بيتحسبوا هنا بضعف.",
  ),
  wishAgainLabel: bi("another one", "واحدة كمان"),
  /** the tiny label drawn next to the constellation */
  heartLabel: bi("for us", "لينا"),
};

/* ————— coupons — scratch one when you need it ————— */
export interface Coupon {
  id: string;
  title: Bi;
  body: Bi;
}

export const coupons = {
  title: bi("A coupon", "كوبون"),
  sub: bi("for when you need one", "لوقت ما تحتاجيه"),
  /** {n} of {total} left in the booklet */
  remainingTemplate: bi(
    "{n} of {total} left in the booklet",
    "فاضل {n} من {total} في الكراسة",
  ),
  scratchHint: bi("scratch gently to reveal", "كشطي براحة، يبان"),
  /** accessible skip-the-scratching button */
  peekLabel: bi("too impatient — just peek", "قلقانة — شوفي على طول"),
  anotherLabel: bi("another coupon", "كوبون تاني"),
  useLabel: bi("I used this one", "استخدمت دي"),
  usedLabel: bi("used ♥", "استُخدمت ♥"),
  usedLine: bi("redeemed — no refunds on love", "اتصرفت — الحب مفيهوش استرجاع"),
  allUsedLine: bi(
    "every coupon used. (I'll print more. I always will.)",
    "كل الكوبونات خلصت. (هطبع أكتر. وعلى طول.)",
  ),
  resetLabel: bi("start a fresh booklet", "ابدئي كراسة جديدة"),
  /** the little overline on each ticket */
  ticketOverline: bi("love coupon", "كوبون حب"),
  /** printed tiny along the bottom of each ticket */
  validityLine: bi(
    "valid forever · no expiration · bearer: you",
    "صالح للأبد · مينتهيش · لحاملتها: أنتِ",
  ),
  ariaScratch: bi(
    "Scratch panel covering the coupon — drag across it to reveal, or use the peek button below. Coupon {n} of {total}",
    "طبقة كشط فوق الكوبون — اسحبي عليها عشان يبان، أو استخدمي زرار المعاينة اللي تحت. كوبون {n} من {total}",
  ),
  list: [
    {
      id: "hug",
      title: bi("One (1) uninterrupted hug", "حضنة (1) من غير مقاطعة"),
      body: bi(
        "Minimum five minutes. Squeezing allowed. No letting go until the timer ends.",
        "خمس دقايق على الأقل. الضغط مسموح. مفيش ترك قبل ما الوقت يخلص.",
      ),
    },
    {
      id: "movie",
      title: bi("One (1) movie night, your pick", "سهرة فيلم (1)، اختيارك"),
      body: bi(
        "Even if it's the one with the plot I pretend to dislike. I'll bring the snacks.",
        "حتى لو هي اللي قصتها بدّعي إني مش بحبها. أنا جايب السناكس.",
      ),
    },
    {
      id: "breakfast",
      title: bi("One (1) breakfast in bed", "فطار (1) في السرير"),
      body: bi(
        "Pancakes shaped suspiciously like hearts. This part is not negotiable.",
        "بانكيك شكلهم مشبوه زي القلوب. الجزء ده مش قابل للتفاوض.",
      ),
    },
    {
      id: "photoshoot",
      title: bi("One (1) photoshoot, patient edition", "جلسة تصوير (1)، نسخة الصبور"),
      body: bi(
        "Every take, zero sighs. Pose freely. Direct me gently — I'll learn.",
        "كل لقطة، صفر زفرات. اتصوري براحتك. وجهيني بلطف — هتعلّم.",
      ),
    },
    {
      id: "walk",
      title: bi("One (1) slow evening walk", "مشية (1) بالراحة بالليل"),
      body: bi(
        "Destination: wherever. Pace: ours. Goodnight said no more than three times.",
        "المكان: أي حتة. السرعة: بتاعتنا. تصبح على خير مش أكتر من تلات مرات.",
      ),
    },
    {
      id: "song",
      title: bi("One (1) song on demand", "أغنية (1) بالطلب"),
      body: bi(
        "Sung badly, on purpose, with full commitment. Requests honored at any hour.",
        "هغنّيها وحش، بقصد، وبالتزام كامل. الطلبات بتتنفذ أي وقت.",
      ),
    },
    {
      id: "dairy-milk",
      title: bi("One (1) Dairy Milk, no questions asked", "Dairy Milk (1)، من غير أي أسئلة"),
      body: bi(
        "Bad day, good day, no reason at all — the answer is already yes.",
        "يوم وحش، يوم حلو، ولا أي سبب — الإجابة أصلًا أيوه.",
      ),
    },
  ] as Coupon[],
};

/* ————— the heart constellation (Home) ————— */
export interface ConstellationHeart {
  /** which localStorage key tracks this ritual's completion */
  storageKey:
    | "littleThings"
    | "openedMemories"
    | "birthdayWishSent"
    | "quizLetterEarned"
    | "matchCompleted"
    | "jarPicked"
    | "reasonDrawn"
    | "couponScratched";
  /** the section the heart jumps to (or the view) */
  view: ViewId;
  /** short label, shown under the heart on hover/focus (or via sr text) */
  label: Bi;
  /** the little prompt to whisper when the heart is dim (and the section is still unfinished) */
  hint: Bi;
}

export const heartConstellation = {
  overline: bi("the constellation —", "البرج —"),
  ariaLabel: bi(
    "Heart constellation — your progress through this little place",
    "برج القلوب — تقدمك في المكان الصغير ده",
  ),
  /** shown above the grid; {n} of {total} is replaced */
  counterTemplate: bi("{n} of {total} lit", "{n} من {total} منوّرين"),
  /** shown once all of them are lit */
  completeLine: bi(
    "all eight — and still every one feels small next to you. ♥",
    "التمانية — ومع ذلك كل واحدة فيهم صغيرة جنبك. ♥",
  ),
  /** a quiet subline under the grid */
  subline: bi("tap a dim heart to follow it home", "دوسي على قلب ضلمان يمشي بيكِ للبيت"),
  /** shown below the grid once everything is lit */
  allDoneLine: bi(
    "every heart is lit — this place is yours now. ♥",
    "كل القلوب منوّرة — المكان ده بقى بيتك. ♥",
  ),
  /** shown once when exactly one new heart lit since her last visit — {label} is the ritual's name */
  newOneTemplate: bi("a new heart just lit — {label} ♥", "قلب جديد اتولّع — {label} ♥"),
  /** shown once when several new hearts lit since her last visit — {n} is the count */
  newManyTemplate: bi(
    "{n} new hearts lit while you were away ♥",
    "{n} قلب اتولّع وانتِ مش هنا ♥",
  ),
  hearts: [
    {
      storageKey: "littleThings",
      view: "things",
      label: bi("all seven little things", "السبع تفاصيل الصغيرة"),
      hint: bi("find all seven little things", "دوري على السبع تفاصيل الصغيرة"),
    },
    {
      storageKey: "openedMemories",
      view: "memories",
      label: bi("the memory drawer", "درج الذكريات"),
      hint: bi("open every memory in the drawer", "افتحي كل الذكريات اللي في الدرج"),
    },
    {
      storageKey: "birthdayWishSent",
      view: "birthday",
      label: bi("the wish was sent", "الأمنية اتبعتت"),
      hint: bi("light the candles and make the wish", "ولّعي الشموع واتمني"),
    },
    {
      storageKey: "quizLetterEarned",
      view: "things",
      label: bi("the quiz", "الكويز"),
      hint: bi("take the little quiz to earn a letter", "خدي الكويز الصغير تكسب رسالة"),
    },
    {
      storageKey: "matchCompleted",
      view: "things",
      label: bi("memory match", "ماتش الذكريات"),
      hint: bi("match all three pairs", "ظبطي التلات أزواج"),
    },
    {
      storageKey: "jarPicked",
      view: "things",
      label: bi("the note jar", "برطمان الورق"),
      hint: bi("pick a note from the jar", "اسحبي ورقة من البرطمان"),
    },
    {
      storageKey: "reasonDrawn",
      view: "things",
      label: bi("the reason deck", "كوتشينة الأسباب"),
      hint: bi("draw a card from the reason deck", "اسحبي كارت من كوتشينة الأسباب"),
    },
    {
      storageKey: "couponScratched",
      view: "things",
      label: bi("a coupon scratched", "كوبون اتكشط"),
      hint: bi("scratch one coupon in the booklet", "اكشطي كوبون في الكراسة"),
    },
  ] as ConstellationHeart[],
};

/* ————— today's nudge (Home) ————— */
export interface TodaysNudge {
  /** short lowercase label that appears above the prompt */
  overline: Bi;
  /** the line itself */
  line: Bi;
  /** where the nudge should take her */
  view: ViewId;
  /** tiny CTA word */
  cta: Bi;
}

export const todaysNudge = {
  overline: bi("today's nudge —", "دفعة النهاردة —"),
  /** shown when she's done it already today (no-op nudge) */
  alreadyDoneLine: bi(
    "you already did today's little thing — rest is allowed too. ♥",
    "حاجة النهاردة الصغيرة خلصت — والراحة مسموحة كمان. ♥",
  ),
  /** shown when there's nothing left to nudge toward */
  allDoneLine: bi(
    "everything here is lit. honestly, just rest your eyes a second. ♥",
    "كل حاجة هنا منوّرة. بجد، ارتاحي عينك ثانية. ♥",
  ),
  /** the rotating prompts; one per UTC day, deterministically */
  prompts: [
    {
      overline: bi("today's nudge —", "دفعة النهاردة —"),
      line: bi(
        "Today's whisper unsealed itself in the letters room. Read it slowly.",
        "همسة النهاردة اتفكت في أوضة الرسايل. اقرئيها على مهل.",
      ),
      view: "letters",
      cta: bi("go read it", "روحي اقرئيها"),
    },
    {
      overline: bi("today's nudge —", "دفعة النهاردة —"),
      line: bi(
        "There's a coupon in the booklet with your name on it. Scratch it.",
        "في كوبون في الكراسة اسمك عليه. اكشطيه.",
      ),
      view: "things",
      cta: bi("open the booklet", "افتحي الكراسة"),
    },
    {
      overline: bi("today's nudge —", "دفعة النهاردة —"),
      line: bi(
        "Draw one card from the reason deck. Just one. Sit with it.",
        "اسحبي كارت واحد من كوتشينة الأسباب. واحد بس. واقعدي معاه.",
      ),
      view: "things",
      cta: bi("draw a card", "اسحبي كارت"),
    },
    {
      overline: bi("today's nudge —", "دفعة النهاردة —"),
      line: bi(
        "Pick a note from the jar — the right one always finds you on purpose.",
        "اسحبي ورقة من البرطمان — الصح بيلقاكي بقصد دايمًا.",
      ),
      view: "things",
      cta: bi("pick a note", "اسحبي ورقة"),
    },
    {
      overline: bi("today's nudge —", "دفعة النهاردة —"),
      line: bi(
        "Hit shuffle on the memory drawer and let it surprise you.",
        "دوسي الخلط على درج الذكريات وسيبيه يفاجئك.",
      ),
      view: "memories",
      cta: bi("shuffle the drawer", "اخلطي الدرج"),
    },
    {
      overline: bi("today's nudge —", "دفعة النهاردة —"),
      line: bi(
        "Take the quiz once more — there's no wrong answer, only a softer note.",
        "خدي الكويز تاني — مفيش إجابة غلط، بس ملاحظة ألطف.",
      ),
      view: "things",
      cta: bi("take it again", "خديها تاني"),
    },
    {
      overline: bi("today's nudge —", "دفعة النهاردة —"),
      line: bi(
        "Re-light the candles on the cake. Make one ordinary wish.",
        "ولّعي شموع التورتة تاني. اتمني أمنية عادية.",
      ),
      view: "birthday",
      cta: bi("open the cake room", "افتحي أوضة التورتة"),
    },
  ] as TodaysNudge[],
};

/* ————— a page for you (Letters) ————— */
export interface HerNote {
  id: string;
  text: string;
  /** epoch ms — the moment she kept the line */
  at: number;
}

/* ————— a letter to later — her own sealed notes ————— */

export interface TimeCapsuleNote {
  id: string;
  text: string;
  /** epoch ms — when she sealed it */
  writtenAt: number;
  /** epoch ms — the first moment it may be unsealed */
  openAt: number;
  /** epoch ms — set once she has broken the seal (null while sealed) */
  openedAt: number | null;
}

export const timeCapsule = {
  overline: bi("a letter to later —", "رسالة لبعدين —"),
  title: bi("Write to the you of someday", "اكتبي لِـ انتي اللي بكره"),
  sub: bi(
    "seal a note for your future self — this site keeps it shut until the day comes",
    "اقفلي ورقة لنفسك الجاية — الموقع ده هيحفظها مقفولة لحد ما اليوم يجي",
  ),
  inputLabel: bi(
    "Write a letter to your future self",
    "اكتبي رسالة لِـ انتي اللي بكره",
  ),
  placeholder: bi(
    "dear future me… whatever you want to remind her of",
    "يا أنا اللي بكره… أي حاجة تحبي تفتكريها",
  ),
  sealLabel: bi("seal it until —", "اقفليها لحد —"),
  /** choices offered for when the note may be opened; {date} is replaced with the pretty date */
  durations: [
    { days: 7, label: bi("one week", "أسبوع") },
    { days: 30, label: bi("one month", "شهر") },
    { days: 182, label: bi("six months", "ست شهور") },
    { days: 365, label: bi("one year", "سنة") },
  ] as { days: number; label: Bi }[],
  sealButtonLabel: bi("seal this letter", "اقفلي الرسالة دي"),
  /** shown on the button for a moment after sealing */
  sealedButtonLabel: bi("sealed ♥", "اتقفلت ♥"),
  /** on each sealed note while it waits; {date} is the pretty open date */
  keptForTemplate: bi("sealed until {date}", "مقفولة لحد {date}"),
  /** {n} replaced with days remaining */
  countdownTemplate: bi("unseals in {n} days", "بتتفك بعد {n} يوم"),
  /** shown on the day it can be opened */
  readyLabel: bi("today — break the seal", "النهاردة — اكسري الختم"),
  /** re-reading a note she already opened */
  readAgainLabel: bi("read it again", "اقرئيها تاني"),
  /** the stamp on an opened note */
  openedLabel: bi("opened", "اتفتحت"),
  /** the little sealed-state line while a note waits */
  sealedStill: bi(
    "sealed — the words keep still until then",
    "مقفولة — والكلام بيستنى هادي لحد ساعتها",
  ),
  /** stamp template on an opened note */
  stampTemplate: bi("sealed {a} · opened {b}", "اتقفلت {a} · اتفتحت {b}"),
  /** her signature on the sealed letter */
  signature: bi("— past you ♥", "— انتي القديمة ♥"),
  /** empty state under the writing area */
  emptyLine: bi(
    "no letters waiting yet — future you is patient.",
    "مفيش رسايل مستنية لسه — انتي اللي بكره صبورة.",
  ),
  removeLabel: bi(
    "Unseal early — open this letter now",
    "افكّيها بدري — افتحي الرسالة دي دلوقتي",
  ),
  /** discarding a sealed letter entirely */
  discardLabel: bi("Discard this sealed letter", "الغي الرسالة المقفولة دي"),
  /** confirmation when she breaks a seal early (opens immediately) */
  earlyOpenTitle: bi("Open it now?", "نفتحها دلوقتي؟"),
  earlyOpenBody: bi(
    "It was sealed for {date}. Some letters shouldn't wait — are you sure?",
    "كانت مقفولة لحد {date}. في رسايل مش لازم تستنى — متأكدة؟",
  ),
  earlyOpenConfirm: bi("yes, open it", "أيوه، افتحيها"),
  earlyOpenCancel: bi("keep it sealed", "سيبها مقفولة"),
  /** how long a letter may be */
  maxChars: 500,
  /** how many sealed letters she may keep */
  maxNotes: 10,
  /** the tiny line under the section */
  privateLine: bi(
    "sealed on this device only — even he can't read these. ♥",
    "مقفولة على الجهاز ده بس — حتى هو مش هيعرف يقراها. ♥",
  ),
};

export const herPage = {
  overline: bi("a page for you —", "صفحة ليكِ —"),
  title: bi("Write back, if you ever want to", "ردي عليها، وقت ما تحبي"),
  /** the small honest line about where her words live */
  sub: bi(
    "the only page in here that's yours — kept on this device, nowhere else",
    "الصفحة الوحيدة هنا اللي بتاعتك — على الجهاز ده، ومش أي مكان تاني",
  ),
  /** label for the textarea (screen readers) */
  inputLabel: bi("Write a note on your page", "اكتبي سطر في صفحتك"),
  placeholder: bi(
    "anything at all. a good day, a bad hour, one sentence, one word…",
    "أي حاجة. يوم حلو، ساعة وحشة، جملة، كلمة…",
  ),
  saveLabel: bi("keep this line", "خلي السطر"),
  /** shown on the button for a moment after saving */
  savedLabel: bi("kept ♥", "اتخزن ♥"),
  emptyLine: bi(
    "nothing written yet — this page waits patiently.",
    "لسه مكتوبش حاجة — الصفحة بتستنى على راحتها.",
  ),
  /** shown under each kept note; {date} is replaced */
  noteLabel: bi("written {date}", "اتكتبت {date}"),
  removeLabel: bi("Remove this note", "شيلي السطر"),
  /** sr-only label for the list of her lines */
  listAria: bi("Your kept lines", "سطورك المتخزنة"),
  /** keep one of her lines as a little picture (saved on her device) */
  keepAsImageLabel: bi("Keep this line as a picture", "خدي السطر صورة"),
  /** shown on the button for a moment after the picture is saved */
  imageSavedLabel: bi("saved ♥", "اتحفظت ♥"),
  /** printed at the very bottom of the exported picture */
  imageFooter: bi(
    "from a little universe — for Aroogty, always",
    "من عالم صغير — لأروجتي، دايمًا",
  ),
  /** the small line above the note on the exported picture */
  imageOverline: bi("A PAGE FOR YOU", "صفحة ليكِ"),
  /** the tiny privacy promise under the notebook */
  privateLine: bi(
    "your words never leave this device — the little camera on a line keeps a picture for you, if you ever want to show him in person. ♥",
    "كلامك عمره ما بيخرج من الجهاز ده — الكاميرا الصغيرة على السطر بتاخدلك صورة، لو حبيتي توريها له بنفسك. ♥",
  ),
  /** longest a single line may be */
  maxChars: 500,
  /** how many lines the notebook keeps (oldest steps aside first) */
  maxNotes: 40,
};

/* ————— a postcard for today (Home) ————— */
export const postcard = {
  overline: bi("for today —", "للنهاردة —"),
  title: bi("A Postcard for Today", "كارت بريد للنهاردة"),
  /** the faint hint above the card, in his voice */
  craftHint: bi(
    "found among the things he keeps meaning to tell you",
    "من الحاجات اللي دايمًا يفكر يقولها",
  ),
  /** label on the action button — turns to the next postcard */
  askLabel: bi("read another", "اقرئي كمان"),
  /** the day stamp template — {date} is the pretty cairo-tz date */
  dayStampTemplate: bi("POSTMARKED {date}", "ختم بريد {date}"),
  /** the postmark's origin word */
  cairoStamp: bi("cairo ·", "القاهرة ·"),
  /** the signature at the bottom of each postcard */
  signature: bi("— wherever I am, still yours", "— أي حتة أكون فيها، لسه ليكِ"),
  /** his pre-written postcards. Each day starts on a
      different one; she can always turn to the next. */
  lines: [
    bi(
      "Tonight the room is quiet and so am I, and somehow both of those things are because of you. Hello, from wherever I am right now.",
      "الليلة الأوضة هادية وأنا كمان، ومش عارف إزاي الاتنين بسببك. أهلاً، من أي حتة أنا فيها دلوقتي.",
    ),
    bi(
      "Wherever you're reading this — I hope the light is warm there. I'm writing to you from a different hour, and it's still your name I keep coming back to.",
      "أي حتة انتي بتقرا فيها دي — ياريت النور فيها دافي. أنا بجرب أكتب ليكِ من ساعة تانية، ولسه اسمك اللي بارجعله.",
    ),
    bi(
      "Small thing, written late: today I noticed the exact shade of the sky I always think of when I think of you. So it was a good day, by definition.",
      "حاجة صغيرة، اتكتبت بالليل: النهاردة شفت درجة السما اللي بفتكرها كل ما أفكر فيكي. يعني بالتعريف، كان يوم حلو.",
    ),
    bi(
      "From later, with love: I'm still the same person who built you this little place. The ink hasn't dried yet on this one.",
      "من بعدين، بالمحبة: لسه نفس الشخص اللي بنالك المكان الصغير ده. والحبر لسه مينشفش.",
    ),
    bi(
      "If you're holding the phone too close to your face right now, that's very on-brand for you. Hello, my love. From wherever I am.",
      "لو انتي ماسكة الموبايل قريب من وشك دلوقتي، دي معروفة عنك جدًا. أهلاً بحبيبتي. من أي حتة أنا فيها.",
    ),
    bi(
      "Tonight's small thing: I missed you on purpose, on schedule, and with great care. From later, with love.",
      "حاجة الليلة الصغيرة: وحشتيني بقصد، بجدول، وبعناية فائقة. من بعدين، بالمحبة.",
    ),
    bi(
      "I wrote this one on an ordinary day, because those are the ones I want to keep too. Nothing happened. I just thought of you, and stayed a while.",
      "كتبت دي في يوم عادي، لأن دي اللي أنا عايز أحتفظ بيها كمان. مفيش حاجة حصلت. بس فكرت فيكي، وقعدت شوية.",
    ),
    bi(
      "The day is almost done wherever you are. Whatever it was, I'd have rather heard about it from you, at length, twice.",
      "اليوم قرب يخلص أي حتة انتي فيها. أيًا كان إيه، كنت أفضل أسمعه منك، بالتفصيل، مرتين.",
    ),
    bi(
      "If you ask me when I last thought of you — wrong question. Ask me when I last didn't.",
      "لو سألتيني امتى آخر مرة فكرت فيكي — سؤال غلط. اسألي: امتى آخر مرة مكنتش.",
    ),
    bi(
      "Somewhere tonight, a lamp is burning past midnight over a half-built page — again. Consider this a candle I lit for you. Look after yourself.",
      "في حتة الليلة دي، لمبة مشتعلة بعد نص الليل على نص صفحة — تاني. اعتبريها شمعة ولّعتها ليكِ. خدي بالك من نفسك.",
    ),
  ] as Bi[],
  /** tiny line under the card */
  privateLine: bi(
    "his postcards, kept here on this device — for the day you're in. ♥",
    "كروتته، محفوظة هنا على الجهاز ده — لليوم اللي انتي فيه. ♥",
  ),
};

/* ————— mixtape (side C) — songs I'd queue for you ————— */
export interface MixtapeSong {
  id: string;
  title: string;
  artist: string;
  /** one short line about why it's on the tape */
  why: Bi;
  /** the official video on YouTube — every card's back face
      carries a little scrapbook "watch it" ticket that opens
      this link in a new tab. The cards are visual flip
      cards only: they never play audio inside the site. */
  youtube?: string;
}

export const mixtape = {
  overline: bi("side C —", "الوجه التالت —"),
  title: bi("Songs I'd queue for you", "أغاني كنت هشغّلها ليكِ"),
  sub: bi(
    "five little dedications, in the order I'd press play",
    "خمس إهداءات صغيرة، بترتيب التشغيل",
  ),
  /** the handwritten title on the back of every card */
  reasonOverline: bi("why this song?", "ليه الأغنية دي؟"),
  /** label on the action button when the card is face-up */
  flipLabel: bi("why this one", "ليه دي"),
  /** label on the action button when the card is face-down */
  flipBackLabel: bi("the song", "الأغنية"),
  /** the little scrapbook ticket on the back of the cards —
      opens the official video on YouTube */
  watchLabel: bi("hear it on youtube", "اسمعيها على يوتيوب"),
  /** screen-reader note for the watch ticket */
  watchSr: bi(
    "Opens the official video on YouTube in a new tab",
    "يفتح الفيديو الرسمي على يوتيوب في تاب جديد",
  ),
  /** tiny footnote under the mixtape */
  footLine: bi(
    "no real tape — just songs I'd queue for you, each with its own little ticket.",
    "مفيش شريط حقيقي — أغاني كنت هشغّلها ليكِ، وكل واحدة فيها التيكت الصغير بتاعها.",
  ),
  /** aria template for each cassette card */
  ariaTemplate: bi(
    "{title} — {artist}. {flip}. Currently showing {which}.",
    "{title} — {artist}. {flip}. بيعرض دلوقتي {which}.",
  ),
  ariaWhichReason: bi("the reason", "السبب"),
  ariaWhichSong: bi("the song", "الأغنية"),
  songs: [
    {
      id: "perfect",
      title: "Perfect",
      artist: "Ed Sheeran",
      /* the official video — the ticket on the back opens it */
      youtube: "https://www.youtube.com/watch?v=2Vv-BfVoq4g",
      why: bi(
        "The first one I ever queued for you — it started everything I'm still trying to say.",
        "أول أغنية رتبتها ليكِ في حياتي — دي اللي بدأت كل اللي لسه بحاول أقوله.",
      ),
    },
    {
      id: "maak-alby",
      title: "معاك قلبي",
      artist: "عمرو دياب",
      youtube: "https://www.youtube.com/watch?v=hy4qC7CTQTg",
      why: bi(
        "A song about a heart that chooses one person, then stops looking. I knew the feeling the moment it started — mine had chosen long before.",
        "أغنية عن قلب بيختار واحدة وبس. سمعتها وعرفت الإحساس — قلبي كان واخد نفس القرار بدري.",
      ),
    },
    {
      id: "el-lilady",
      title: "الليلادي",
      artist: "عمرو دياب",
      youtube: "https://www.youtube.com/watch?v=McP5XM3sBQY",
      why: bi(
        "A night that deserves its own song. Ever since, I've seen your 18 September in it — the countdown, the waiting, the joy at the end of it.",
        "ليلة بتستاهل أغنيتها. من ساعتها وأنا بشوف فيها ليلة 18 سبتمبر: العدّ التنازلي، والترقب، والفرحة في آخرها.",
      ),
    },
    {
      id: "w-maleh",
      title: "وماله",
      artist: "عمرو دياب",
      youtube: "https://www.youtube.com/watch?v=amy2fttDCb8",
      why: bi(
        "Love needs no occasion. Since you got close, the ordinary day got lighter — so what? We have each other.",
        "الحب مش محتاج مناسبة. من يوم ما بقيتي قريبة، اليوم العادي بقى أخف — وماله؟ إحنا في بعض.",
      ),
    },
    {
      id: "wayah",
      title: "وياه",
      artist: "عمرو دياب",
      youtube: "https://www.youtube.com/watch?v=QFN5xMPFhyo",
      why: bi(
        "The title is the whole reason — 'with her'. Nothing grand: just the ordinary day itself, with you in it.",
        "العنوان هو السبب كله — «وياه». مفيش حاجة كبيرة: اليوم العادي نفسه — بس وياكِ فيه.",
      ),
    },
  ] as MixtapeSong[],
  /** her side of the tape — a sixth slot she fills herself,
      so the mixtape points both ways */
  yours: {
    overline: bi("your side of the tape —", "الوجه بتاعك من الشريط —"),
    /** the empty slot's invitation */
    emptyTitle: bi(
      "add the song you'd queue for me",
      "ضيفي الأغنية اللي كنتِ هتشغّليها ليا",
    ),
    emptyHint: bi("tap — the pen's already warm", "دوسي — القلم أصلًا سخن"),
    /** small tag printed on her card once it's filled */
    pickTag: bi("her pick", "اختيارها"),
    /** the flip-back label on her card */
    flipLabel: bi("why you picked it", "ليه اخترتيها"),
    flipBackLabel: bi("the song", "الأغنية"),
    /** form fields */
    titlePlaceholder: bi("song title", "اسم الأغنية"),
    artistPlaceholder: bi("who sings it — optional", "مين بيغنيها — اختياري"),
    whyPlaceholder: bi(
      "why this one… optional, a word is enough",
      "ليه دي… اختياري، كلمة كفاية",
    ),
    /** shown on the back when she left the reason blank */
    blankWhy: bi(
      "no reason written — it just sounded like us, maybe",
      "مفيش سبب مكتوب — يمكن بس كانت شكلنا",
    ),
    /** the dialog's little heading */
    dialogTitle: bi("One slot, yours", "مكان واحد، بتاعك"),
    dialogHint: bi(
      "the rest of the tape was mine — this one's your pick. it stays on this device, like everything you write here.",
      "باقي الشريط كان ليا — ده اختيارك. هيفضل على الجهاز، زي كل اللي بتكتبيه هنا.",
    ),
    saveLabel: bi("press it onto the tape", "سجّليها على الشريط"),
    cancelLabel: bi("never mind", "سيبيها"),
    changeLabel: bi("change it", "غيّريها"),
    /** what the flip side overline says */
    reasonOverline: bi("why you picked it —", "ليه اخترتيها؟"),
    ariaHerReason: bi("her reason", "سببها"),
    ariaHerSong: bi("her song", "أغنيتها"),
  },
};

/* ————— ticket stubs — films queued for us (Little Things) ————— */
export interface TicketStubFilm {
  id: string;
  title: string;
  /** one short line on why it's queued */
  why: Bi;
}

export const ticketStubs = {
  overline: bi("ticket stubs —", "قسائم التذاكر —"),
  title: bi("Films queued for us", "أفلام في طابورنا"),
  sub: bi(
    "four we keep meaning to watch — punch one when we do",
    "أربع بنقول دايمًا هنشوفهم — اخرمي واحدة لما نشوف",
  ),
  /** printed tiny on every stub */
  admitLabel: "ADMIT TWO",
  /** the punch action before a stub is punched */
  punchLabel: bi("punch it", "اخرميها"),
  /** sr-only explanation of the punch */
  punchSr: bi(
    "Punch this ticket stub when we've watched the film",
    "اخرمي القسيمة دي لما نكون شفنا الفيلم",
  ),
  /** the stamp pressed onto a punched stub */
  watchedLabel: bi("watched", "اتشافت"),
  /** undo affordance on a punched stub */
  undoLabel: bi("un-punch", "ارجّعيها"),
  /** tiny footnote under the row of stubs */
  footLine: bi(
    "kept the way real stubs are — one day, a shoebox of these",
    "محفوظين زي القسائم الحقيقية — يوم ما، صندوق كامل من دول",
  ),
  /** line that appears once every stub is punched */
  allWatchedLine: bi(
    "…that's the whole first reel. queueing the next one.",
    "…ده آخر الريل الأول. بجهّز اللي بعده.",
  ),
  /** aria for a watched stub */
  ariaWatched: bi("Film stub: {title} — watched", "قسيمة فيلم: {title} — اتشافت"),
  ariaUnpunch: bi(
    "Un-punch the stub for {title} — mark it as not watched yet",
    "رجّعي قسيمة {title} — علّميها إنها لسه متتشافتش",
  ),
  /** sr-only confirmation right after punching */
  justPunchedTemplate: bi("{title} — marked as watched.", "{title} — اتعلّمت متشافة."),
  films: [
    {
      id: "la-la-land",
      title: "La La Land",
      why: bi(
        "Stars, pianos, and two people who keep finding their way back to the same bench. I have thoughts about the ending. You'll have better ones.",
        "نجوم، وبيانو، واتنين بيفضلوا يرجعوا لنفس البنش. عندي رأي في النهاية. وانتي هتجيبي أحلى منه.",
      ),
    },
    {
      id: "before-sunrise",
      title: "Before Sunrise",
      why: bi(
        "Ninety-nine percent talking, one percent missing the last train. Very us.",
        "99% كلام، و1% تفويت آخر قطار. دي إحنا جدًا.",
      ),
    },
    {
      id: "your-name",
      title: "Your Name",
      why: bi(
        "Stars, distance, and one year gotten exactly right. You'll cry. I'll pretend not to.",
        "نجوم، ومسافة، وسنة واحدة متظبوطة بالظبط. هتعيّطي. وأنا هدّعي إني مش بيعيّط.",
      ),
    },
    {
      id: "about-time",
      title: "About Time",
      why: bi(
        "For the thing it keeps teaching: live the ordinary day twice, once on purpose.",
        "للحاجة اللي بتفكرنا بيها على طول: عيشي اليوم العادي مرتين، مرة فيهم بقصد.",
      ),
    },
  ] as TicketStubFilm[],
};
