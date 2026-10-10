/* ————————————————————————————————————————————————
   Aroogty's Little Universe — the copy, part one.
   gate · identity · relationship · doorframe · timeline ·
   little things · memories · birthday · footer · song · ui

   Every string is written twice: once in English,
   once in Egyptian Arabic — each version written to be
   beautiful in its own language, never machine-translated.
———————————————————————————————————————————————— */

import { bi, type Bi } from "./bi";
import type { ViewId } from "./arooqtyContent";

/* ————— the little code (the sealed envelope) ————— */
export const gate = {
  /** the passcode to enter (never translated — the little word stays the little word) */
  password: "love",
  /** the headline on the sealed letter */
  title: bi("A little universe for Aroogty", "عالم صغير… لأروجتي"),
  /** the line beneath it, in italic */
  quote: bi(
    "Everything in here has the same reason.",
    "كل اللي جوّه هنا سببه واحد.",
  ),
  /** the small label above the input */
  label: bi("The little word —", "الكلمة الصغيرة —"),
  error: bi(
    "Not quite. Try the little word again.",
    "مش دي… جربي الكلمة الصغيرة تاني.",
  ),
  stayUnlockedLabel: bi(
    "keep it unlocked on this device",
    "خليه مفتوح على الجهاز ده",
  ),
  /** the button that unseals the letter */
  unsealLabel: bi("come in", "اتفضلي"),
};

/* ————— who & what ————— */
export const identity = {
  herName: "Aroogty",
  siteTitle: "Aroogty's Little Universe",
  tagline: bi("a little universe for two", "عالم صغير لاتنين"),
  /** the little word above her name on the home screen */
  overline: bi("a little universe for", "عالم صغير لـ"),
  openingMessage: bi(
    "This place exists because one ordinary conversation refused to stay ordinary. Everything in it is ours — the small things, the inside jokes, the days worth keeping, and the ones only we understand. Open it on a good day. Open it on a hard one. It was built to be here either way.",
    "المكان ده موجود لأن كلام عادي واحد رفض يفضل عادي. كل اللي فيه لينا — الحاجات الصغيرة، النكت اللي محدش فاهمها غيرنا، الأيام اللي تستاهل، واللي بيفهمها إحنا بس. افتحيه في يوم حلو، وافتحيه في يوم تقيل. اتبنى عشان يفضل هنا في الحالتين.",
  ),
};

/* ————— time together (the flagship counter) ————— */
export const relationship = {
  /** RELATIONSHIP_START_DATE — ISO format */
  startDate: "2026-05-19",
  /** RELATIONSHIP_START_TIME — 24h HH:mm */
  startTime: "16:35",
  /** TIMEZONE */
  timezone: "Africa/Cairo",
  /** pretty copy of the original moment — dates stay elegant in English */
  sinceLabel: "19 May 2026 · 4:35 PM",
  /** START_MESSAGE */
  startMessage: bi(
    "Since an ordinary Tuesday became the important one —",
    "من يوم ما ثلاثاء عادي بقى هو المهم —",
  ),
  /** quiet total line, {days} is replaced */
  daysTemplate: bi(
    "{days} days — from one small message to everything.",
    "{days} يوم — من رسالة صغيرة… لكل حاجة.",
  ),
  /** rotating sentences under the counter */
  counterPhrases: [
    bi(
      "Every day since then has had a little more of you in it.",
      "كل يوم من يومها كان فيه منك حاجة صغيرة زيادة.",
    ),
    bi(
      "From one assignment to my favorite part of the day.",
      "من أسايمنت عادي… لأحلى جزء في يومي.",
    ),
    bi(
      "Still counting. Still grateful.",
      "لسه بحسب. ولسه مبسوط إنك موجودة.",
    ),
    bi(
      "Some things started quietly. This one changed everything.",
      "حاجات كتير بتيجي بصوت واطي. دي غيرت كل حاجة.",
    ),
    bi(
      "The best conversations are the ones that forget to end.",
      "أحلى الكلام اللي بينسى يخلص.",
    ),
    bi(
      "It was a Tuesday like any other. That's exactly why I'll never forget it.",
      "كان ثلاثاء زي أي ثلاثاء. وعشان كده بالظبط عمري ما هنساه.",
    ),
    bi(
      "Most numbers only count. This one remembers.",
      "الأرقام بتعدّ وبس. الرقم ده بيفتكر.",
    ),
  ] as Bi[],
};

/* ————— the doorframe — pencil marks for little anniversaries ————— */
export const doorframe = {
  overline: bi("the doorframe —", "باب الأوضة —"),
  /** the little heading beside the marks */
  title: bi(
    "little anniversaries, marked in pencil",
    "مناسبات صغيرة، متسجلة برصاص",
  ),
  /** sr-only description of the strip */
  srLabel: bi(
    "Pencil marks on a doorframe — our little anniversary milestones",
    "علامات رصاص على باب — مناسباتنا الصغيرة",
  ),
  /** when she lands exactly on a milestone day */
  todayTemplate: bi("today — {label} ♥", "النهاردة — {label} ♥"),
  /** day numbers worth a pencil mark; {n} = day number */
  milestones: [
    { day: 1, label: bi("day one — where the pencil started", "أول يوم — أول خط رصاص") },
    { day: 100, label: bi("one hundred days", "مية يوم") },
    { day: 200, label: bi("two hundred days", "ميتين يوم") },
    { day: 300, label: bi("three hundred days", "تلتمية يوم") },
    { day: 365, label: bi("one whole year", "سنة كاملة") },
    { day: 500, label: bi("five hundred days", "خمسمية يوم") },
    { day: 730, label: bi("two years", "سنتين") },
    { day: 1000, label: bi("a thousand days", "ألف يوم") },
  ] as { day: number; label: Bi }[],
  /** tick under a passed milestone: {label} replaced with the label */
  tickTemplate: "{label}",
  /** chip on a future milestone: {n} = days until it */
  untilTemplate: bi("in {n} days", "باقي {n} يوم"),
  /** the tiny line under the whole strip */
  footLine: bi(
    "pencil marks on a doorframe don't measure height — they measure staying.",
    "علامات الرصاص على الباب مش بتقيس طول — بتقيس إننا لسه هنا.",
  ),
  /** the little pencil tag at her current day */
  youAreHere: bi("you are here", "أنتِ هنا"),
  /** tiny fragment after the day number in the footnote */
  dayFragment: bi("· day {n}", "· يوم {n}"),
};

/* ————— our beginning ————— */
export interface TimelineMoment {
  id: string;
  date: Bi;
  title: Bi;
  line: Bi;
  image?: string;
  imageAlt?: Bi;
  note?: Bi;
}

export const timelineMoments: TimelineMoment[] = [
  {
    id: "assignment",
    date: bi("19 May 2026", "19 May 2026"),
    title: bi("It started with an assignment.", "الحكاية بدأت بأسايمنت."),
    line: bi(
      "One normal conversation that quietly became important.",
      "كلام عادي خالص… بقى مهم على مهل.",
    ),
    image: "/timeline/assignment.png",
    imageAlt: bi(
      "A desk at night with an open notebook and a phone beside it",
      "مكتب بالليل، دفتر مفتوح وموبايل جنبه",
    ),
    note: bi(
      "The first message was completely ordinary — a question about a subject. Neither of us knew it was about to open every door that mattered.",
      "أول رسالة كانت عادية جدًا… سؤال في مادة.\nمحدش فينا كان يعرف إن الرسالة دي هتفتح باب لكل ده.",
    ),
  },
  {
    id: "late-night",
    date: bi("the first weeks", "أول الأسابيع"),
    title: bi("The conversation that forgot to end.", "الكلام اللي نسي يخلص."),
    line: bi(
      "study questions at midnight — answers that led to better questions",
      "أسئلة مذاكرة بعد نص الليل — وإجابات بتفتح أسئلة أحلى",
    ),
    image: "/timeline/late-night.png",
    imageAlt: bi(
      "A phone glowing softly on a dark blanket late at night",
      "موبايل منوّر على مرتحة غامقة بالليل",
    ),
    note: bi(
      "Nobody decided anything. One night the goodnight just… took longer than the homework.",
      "محدش قرر حاجة. في ليلة، «تصبح على خير» بقى أطول من المذاكرة نفسها.",
    ),
  },
  {
    id: "first-table",
    date: bi("those first weeks", "نفس الأسابيع دي"),
    title: bi("The day started with you.", "اليوم بقى بيبدأ بيكِ."),
    line: bi(
      "good morning first, the assignment second — that became the order of everything",
      "صباح الخير الأول، والأسايمنت بعده — الدنيا اتظبطت كده",
    ),
    note: bi(
      "The plan was to study. Somewhere along the way we ended up with a language of our own — بجااااد, ي الله, and the emoji that means exactly what you mean. I never noticed the moment it happened. It just was.",
      "الخطة كانت نذاكر. في نص السكة بقى عندنا لغة لينا — بجااااد، ي الله، والإيموجي اللي بيقصد بالظبط اللي انتِ قصداه. عمري ما حسيت بلحظة إن ده حصل. كان كده وخلاص.",
    ),
  },
  {
    id: "cinema",
    date: bi("still on the list", "لسه في القايمة"),
    title: bi("The watchlist.", "قايمة الأفلام."),
    line: bi(
      "four films, two seats, one shared armrest — pending",
      "أربع أفلام، كرسيين، ومسند واحد بنقتسمه — قريبًا",
    ),
    image: "/timeline/cinema.png",
    imageAlt: bi(
      "Two cinema seats in warm dim light, waiting",
      "كرسيين سينما في نور خافت دافي، مستنيين",
    ),
    note: bi(
      "Not a memory yet — a plan. I already know you'll narrate the whole first act. I have no intention of stopping you.",
      "لسه ذكرى لأ — ده مخطط. عارف إنك هتحكيلي كل أول ساعة في الفيلم. ومش ناوي أوقفك.",
    ),
  },
  {
    id: "rose",
    date: bi("along the way", "على السكة"),
    title: bi("Why this place is burgundy.", "ليه المكان ده عنابي."),
    line: bi(
      "a color that quietly started meaning you",
      "لون من غير ما حد يلاحظ بقى معناه «أنتِ»",
    ),
    note: bi(
      "There's no rose pressed in any book. There's just this shade I couldn't stop associating with you — so I built a whole universe out of it.",
      "مفيش ورد مضغوط في أي كتاب. فيه بس اللون ده اللي مقدرتش أفرّق بينه وبينك — فبنيته عالم كامل.",
    ),
  },
  {
    id: "august-shift",
    date: bi("August 2026", "أغسطس 2026"),
    title: bi("The quiet turning point.", "نقطة التحوّل الهادية."),
    line: bi(
      "nothing was announced — it just became permanent",
      "محدش أعلن حاجة — بس الحاجة بقت ثابتة",
    ),
    note: bi(
      "August asked for no speech. Somewhere inside it, 'still here' quietly turned into the plan — no words needed. That's the month this place started being built, too. Not a coincidence.",
      "أغسطس مطلبش خطبة. في حتة جواه، «لسه هنا» اتحوّلت على مهل للخطة نفسها — من غير كلمة واحدة. والشهر ده كمان هو اللي المكان ده بدأ يتبنى فيه. مش صدفة.",
    ),
  },
  {
    id: "now",
    date: bi("Today", "النهاردة"),
    title: bi("Still counting.", "لسه بحسب."),
    line: bi(
      "The thread keeps going — and I'm still holding my end.",
      "الخيط لسه ماشي — وأنا لسه ماسك طرفي.",
    ),
  },
];

/* ————— little things ————— */
export type LittleThingObject =
  | "note"
  | "chocolate"
  | "polaroid"
  | "flower"
  | "word"
  | "sticker"
  | "cassette";

export interface LittleThing {
  id: string;
  object: LittleThingObject;
  ariaLabel: Bi;
  title: Bi;
  note: Bi;
}

export const littleThings: LittleThing[] = [
  {
    id: "folded-note",
    object: "note",
    ariaLabel: bi("A small folded note", "ورقة صغيرة مطوية"),
    title: bi("The folded note", "الورقة المطوية"),
    note: bi(
      "You make ordinary conversations feel softer. Same words, same day — but somehow gentler once they pass through you.",
      "الكلام العادي بيبقى أنعم لما يعدي منك. نفس الكلمات، نفس اليوم — بس حِسّها بيبقى أرطب.",
    ),
  },
  {
    id: "chocolate",
    object: "chocolate",
    ariaLabel: bi("A chocolate wrapper", "غلاف شوكولاتة"),
    title: bi("The chocolate wrapper", "غلاف الشوكولاتة"),
    note: bi(
      "Dairy Milk, specifically. You'd think after all this time I'd stop bringing it up. I have not. I will not.",
      "Dairy Milk، بالظبط. هتقولي لسه بتفتح الموضوع لحد دلوقتي؟ أيوه. ومش هقفله.",
    ),
  },
  {
    id: "polaroid",
    object: "polaroid",
    ariaLabel: bi("A small polaroid", "بولارويد صغيرة"),
    title: bi("The polaroid", "البولارويد"),
    note: bi(
      "Your eye for the small stuff. Half of what you point out, I'd have walked right past — the other half I only see now because you taught me to look.",
      "عينك على التفاصيل الصغيرة. نص اللي بتشاوري عليه كنت هعدي من جنبه من غير ما شوفه — والنص التاني مبقتش شايفه غير لما فتحتي عيني عليه.",
    ),
  },
  {
    id: "flower",
    object: "flower",
    ariaLabel: bi("A tiny flower", "وردة صغيرة"),
    title: bi("The tiny flower", "الوردة الصغيرة"),
    note: bi(
      "You have this way of being warm without making a thing of it. The world runs warmer wherever you're standing.",
      "عندك طريقة تدفّي من غير ما تعمل منها موضوع. الدنيا بتدفي في أي حتة انتِ واقفة فيها.",
    ),
  },
  {
    id: "word",
    object: "word",
    ariaLabel: bi("A handwritten word", "كلمة مكتوبة بإيد"),
    title: bi("The handwritten word", "الكلمة المكتوبة بإيد"),
    note: bi(
      "بجااااد — the most dramatic word in any language, and you deliver it like breaking news, every single time. And زوز, and يكوكي — words that don't translate, because they were never general knowledge. They're ours.",
      "«بجااااد» — أكتر كلمة فيها دراما في أي لغة، وبتوصّليها زي خبر عاجل كل مرة. و«زوز»، و«يكوكي» — كلمات بتترجمش، لأنها عمرها ما كانت معلومات عامة. دي بتاعتنا.",
    ),
  },
  {
    id: "sticker",
    object: "sticker",
    ariaLabel: bi("A heart sticker", "استيكر قلب"),
    title: bi("The sticker", "الاستيكر"),
    note: bi(
      "🤭🤭 — your signature move. I know the exact shape of a message that's about to end in two of them.",
      "🤭🤭 — توقيعك الرسمي. عارف بالظبط شكل الرسالة اللي هتخلص بيهم.",
    ),
  },
  {
    id: "cassette",
    object: "cassette",
    ariaLabel: bi("A cassette tape", "شريط كاسيت"),
    title: bi("The cassette", "الكاسيت"),
    note: bi(
      "I don't hum. Except apparently I do now — one little tune, every night this place was being built, and every night it was you it was about. You made a hummer out of me.",
      "أنا مش باغني أصلًا. غير إن لحن صغير بيلف في دماغي — كل ليلة والمكان ده بيتبني، وكل ليلة كان عنك. انتِ اللي خلتي واحد مش بيغني يغني.",
    ),
  },
];

export const littleThingsAllFound = bi(
  "You found them all — of course you did.",
  "لقتيهم كلهم — طبعًا كده.",
);

/* ————— our memory drawer ————— */
export type MemoryKind =
  | "polaroid"
  | "strip"
  | "chat"
  | "ticket"
  | "note"
  /* a tall real photo, taped in at the top — shown whole,
     never cropped into a square */
  | "taped";

export interface ChatBubble {
  from: "her" | "me";
  text: string;
}

export interface MemoryItem {
  id: string;
  kind: MemoryKind;
  date: Bi;
  caption: Bi;
  longNote?: Bi;
  image?: string;
  images?: string[];
  imageAlt?: Bi;
  chat?: ChatBubble[];
  ticket?: { main: string; sub: Bi; stub: string };
  noteText?: string;
}

export const memories: MemoryItem[] = [
  {
    id: "night-walk",
    kind: "polaroid",
    date: bi("19 May 2026", "19 May 2026"),
    caption: bi("The first goodnight", "أول تصبح على خير"),
    longNote: bi(
      "More goodnights than one night needed, and the chat still didn't close. Whatever that was, it started on day one.",
      "«تصبح على خير» أكتر من مرة في نفس الليلة، والمحادثة لسه مقفلتش. أيًا كان ده — بدأ من أول يوم.",
    ),
    image: "/memories/night-walk.png",
    imageAlt: bi(
      "A warm dark street under street lamps — the evening of our first conversation",
      "شارع غامق دافي تحت لمّات النور — ليلة أول كلام لنا",
    ),
  },
  {
    id: "chat-147",
    kind: "chat",
    date: bi("spring 2026 · after midnight", "ربيع 2026 · بعد نص الليل"),
    caption: bi("How most nights went", "شكل معظم الليالي"),
    longNote: bi(
      "No particular night — just the shape of them: one of us ‘about to sleep’, both of us still there an hour later.",
      "مش ليلة معينة — ده شكلهم: واحد فينا «نايم تقريبًا»، واتنين لسه صاحيين بعد ساعة.",
    ),
    chat: [
      { from: "her", text: "لسه صاحية؟" },
      { from: "me", text: "أصلًا كنت بس أقفل 🤭" },
      { from: "her", text: "أكيد" },
      { from: "me", text: "…طب ما تنامي؟" },
      { from: "her", text: "بجااااد هرقد بعد شوية" },
    ],
  },
  {
    id: "cafe",
    kind: "polaroid",
    date: bi("the first weeks", "أول الأسابيع"),
    caption: bi("When you became the routine", "لما بقيتي الروتين"),
    longNote: bi(
      "Somewhere in there, ‘someone from the assignment’ became the first message of every day. It never went back.",
      "في حتة من الزمن دي، «وحدة من الأسايمنت» بقيت أول رسالة كل يوم. وعمري ما رجع تاني.",
    ),
    image: "/memories/cafe.png",
    imageAlt: bi(
      "Two cups of coffee in warm light — the everyday routine we became",
      "فنجانين قهوة في نور دافي — الروتين اللي بقينا",
    ),
  },
  {
    id: "strip",
    kind: "strip",
    date: bi("someday —", "يوم ما —"),
    caption: bi("Three frames we haven't taken yet", "تلات صور لسه ماتاخدوش"),
    longNote: bi(
      "Not yet, anyway. The sea, the lights, the rooftop — they're on the list, waiting for us to get there. Kept here so we don't forget to.",
      "لسه لأ. البحر، الليتات، والسطح — كلهم في القايمة مستنيننا نوصل. محططين هنا عشان مننساش.",
    ),
    images: [
      "/memories/sea.png",
      "/memories/fairy-lights.png",
      "/memories/rooftop-sunset.png",
    ],
    imageAlt: bi(
      "Three scenes waiting for us: the sea, fairy lights, and a rooftop sunset",
      "تلات مشاهد مستنيانا: البحر، وليتات، وغروب على السطح",
    ),
  },
  {
    id: "ticket",
    kind: "ticket",
    date: bi("queued", "في الطابور"),
    caption: bi("Two seats, pending", "كرسيين… لسه"),
    longNote: bi(
      "Admit two — the film's not chosen yet, the night's not booked. The ticket's printed anyway. Optimism.",
      "تذكرة لاتنين — الفيلم لسه متاختارش، والليلة لسه متحجزتش. التذكرة اتطبعت خلاص. تفاؤل.",
    ),
    ticket: {
      main: "ADMIT TWO",
      sub: bi("film · tbd · two seats", "فيلم · قريبًا · كرسيين"),
      stub: "T·BD",
    },
  },
  {
    id: "rose",
    kind: "polaroid",
    date: bi("along the way", "على السكة"),
    caption: bi("Why this place is burgundy", "ليه المكان ده عنابي"),
    longNote: bi(
      "No rose in a book — just a color that kept meaning you until it became the whole palette. Look around. That's what you look like to me.",
      "مفيش ورد في كتاب — بس لون فضل معناه «أنتِ» لحد ما بقى المكان كله. بصي حواليكي. ده أنتي بعيني.",
    ),
    image: "/memories/rose.png",
    imageAlt: bi(
      "A single deep burgundy rose on dark velvet — the color this universe is built from",
      "وردة عنابي غامقة على مخمل أسود — اللون اللي الكون ده مبني منه",
    ),
  },
  {
    id: "note",
    kind: "note",
    date: bi("kept close", "محتفظ بيها قريب"),
    caption: bi("The note about one word", "ورقة عن كلمة"),
    longNote: bi(
      "Some words arrive smaller than the feeling. I keep this note as a reminder that the feeling still wins.",
      "في كلمات بتوصل أصغر من الإحساس. سايب الورقة دي عشان أفتكر إن الإحساس لسه بيكسب.",
    ),
    noteText: "كلمة بحبك صغيرة على اللي أنا فيه.\nبس هي اللي عندي.\nبحبك.",
  },
  {
    /* a real photo, kept from our chat — no story invented,
       just a sweet photo that earned its place in the drawer */
    id: "sweetest",
    kind: "taped",
    date: bi("kept close", "محفوظة قريب"),
    caption: bi("The sweetest photo I kept", "أحلى صورة احتفظت بيها"),
    longNote: bi(
      "No date attached, no story made up for it — just a photo that made everything around it softer the second it arrived. Kept, obviously.",
      "من غير تاريخ، ومن غير حكاية متلفت عليها — بس صورة خلّت كل حاجة حواليها أهدى أول ما وصلت. اتحفظت، طبعًا.",
    ),
    image: "/photos/sweetest.jpg",
    imageAlt: bi(
      "A real photo kept from our chat — three little girls in pink, all smiles",
      "صورة حقيقية محفوظة من التشات — تلات بنات صغيرات بالوردي، كلهم ضحكة",
    ),
  },
];

/** the memory previewed on the home screen */
export const homePreview = {
  memoryId: "cafe",
  overline: bi("from the memory drawer", "من درج الذكريات"),
};

/* ————— the real photos, placed where they belong —————
   Real keepsakes from Ziad's phone. Each lives in the room
   where it means the most — none of them invented a story,
   none of them got a false date. They are just… kept. */
export const realPhotos = {
  /* a printed chat moment, taped into the playful room —
     the timestamps in the screenshot itself say 6:56 pm */
  chatMoment: {
    src: "/photos/chat-moment.jpg",
    overline: bi("from our chat —", "من التشات بتاعنا —"),
    caption: bi("an ordinary evening, 6:56 pm", "مساء عادي، الساعة 6:56"),
    alt: bi(
      "A screenshot of our chat — the same table-tennis puppet photo sent back and forth, four times in a row",
      "سكرين شوت من التشات — نفس صورة الدمية بتلعب تنس، متبعتة ورا بعض أربع مرات",
    ),
  },
  /* a real handwritten page — it says it in both languages,
     so the caption only has to point at it */
  loveNote: {
    src: "/photos/love-note.jpg",
    overline: bi("found, and kept —", "اتلقت، واتحفظت —"),
    caption: bi(
      "a real page, saying it in both languages",
      "صفحة حقيقية، بتقولها بالاتنين",
    ),
    alt: bi(
      "A real handwritten notebook page — “I love you Arooga” written in Arabic and English, with little red hearts",
      "صفحة نوت حقيقية بخط اليد — «بحبك يا روجا» مكتوبة بالعربي والإنجليزي، مع قلوب حمرا صغيرة",
    ),
  },
};

/* ————— birthday ————— */
export const birthday = {
  /** ISO date of her 19th birthday */
  date: "2026-09-18",
  prettyDate: "18 September 2026",
  age: 19,
  title: bi(
    "Your 19th, kept here forever.",
    "عيدك التسعتاشر، محفوظ هنا للأبد.",
  ),
  message: bi("Nineteen looks unfairly good on you.", "التسعتاشر شكله عليكي ظلم."),
  wishes: [
    bi(
      "A year that is gentle with you — you've earned gentle.",
      "سنة تكون فيها الدنيا هادية معاكي — تستاهلي الدنيا تديلك الهادية.",
    ),
    bi(
      "Every song you love stuck in my head too.",
      "كل أغنية بتحبيها تلزق في دماغي أنا كمان.",
    ),
    bi("Me — right here, still counting.", "وأنا — مكاني هنا، لسه بحسب."),
    bi(
      "Everything you don't even know to wish for yet.",
      "وكل حاجة لسه مبتعرفيش تتمنيها دلوقتي — تيجي على مهل.",
    ),
    bi(
      "At least one perfect ordinary day — the kind you make without trying.",
      "يوم عادي واحد كامل — من النوع اللي بتعمليه من غير ما تحاولي أصلًا.",
    ),
  ] as Bi[],
  photo: "/birthday/cake.png",
  photoAlt: bi(
    "A small birthday cake with candles, on a dark table",
    "تورتة صغيرة بشموع، على ترابيزة غامقة",
  ),
  photoCaption: bi("candles, wishes, and you", "شموع، أمنيات، وأنتِ"),
  /** shown once the birthday has passed */
  keepsakeLine: bi(
    "18 September 2026 — a day worth keeping.",
    "18 September 2026 — يوم يستاهل يتحفظ.",
  ),
  /** shown before the birthday, {days} is replaced — the date
      itself is not repeated here; it lives on the card */
  upcomingTemplate: bi("in {days} days", "باقي {days} يوم"),
  /** shown on the day itself */
  todayLine: bi("it's today — happy 19th ♥", "إنه النهاردة — كل سنة وأنتِ أحلى ♥"),

  /* ——— the candle ritual (press & hold, then swipe up,
         or blow into the mic) ——— */
  ritual: {
    /** initial state — candles unlit */
    wishPrompt: bi(
      "Make one wish first. Then blow gently.",
      "اتمني أمنية الأول. وبعدين انفخي براحة.",
    ),
    holdHint: bi(
      "press & hold the cake while you wish",
      "دوسي مطوّل على التورتة وأنتِ بتتمني",
    ),
    /** shown while holding */
    holdingHint: bi("keep holding… almost there", "كمّلي دوس… قرّبنا"),
    /** shown once the wish is made and candles are lit */
    wishKept: bi("Okay. Keep it to yourself. ♡", "تمام. خليها ليكِ بس. ♡"),
    swipePrompt: bi(
      "Now swipe upward across the candles.",
      "دلوقتي اسحبي لفوق على الشموع.",
    ),
    /** accessible fallback copy for keyboard users */
    keyboardHint: bi(
      "(or press Enter to blow them out)",
      "(أو دوسي Enter عشان تطفيهم)",
    ),
    /** the quiet gesture-free fallback, next to the mic option */
    wishMadeFallback: bi(
      "i made my wish — blow them out for me",
      "أنا اتمنيت أمنيتي — طفيهم عني",
    ),
    /** after the flames are out */
    wishSent: bi("Wish kept safe. ♡", "الأمنية في أمان. ♡"),
    lightAgain: bi("Light them again", "ولّعيهم تاني"),
    /** the elegant fallback, offered only if the browser
        refused to let the wish start her song by itself */
    songFallback: bi("play your song ♡", "شغّلي أغنيتك ♡"),

    /* ——— the optional microphone path (the swipe always works too) ——— */
    mic: {
      optionLabel: bi("or blow, for real —", "أو انفخي بجد —"),
      listeningHint: bi("listening… blow gently", "بسمع… انفخي براحة"),
      listeningLabel: bi("listening", "بسمع"),
      stopLabel: bi("stop listening", "اقفلي السماع"),
      deniedLine: bi(
        "No mic? Swipe upward to blow them out.",
        "مفيش مايك؟ اسحبي لفوق وخليهم يطفيوا.",
      ),
      timeoutLine: bi(
        "didn't catch that — try again, or simply swipe.",
        "مسمعتش كويس — جربي تاني، أو اسحبي لفوق وخلاص.",
      ),
    },
    /** the words that arrive once the candles give in — his
        voice, Egyptian Arabic, always (the one moment of the
        room that never switches languages). The lines arrive
        one by one, like ink settling into paper */
    postWish:
      "اتمنى الأمنية دي تكون من نصيبك…\nوتفضل كل أمنية حلوة في حياتك تلاقي طريقها ليكي.\nولو كان ليا أمنية أنا كمان…\nفهي إني أفضل موجود في كل سنة جاية،\nوأشوف ضحكتك فيها وهي أحلى من السنة اللي قبلها. ♡",
    /** the last line — a beat after the message settles,
        the room's quiet birthday sentence */
    postWishFinal: "كل سنة وإنتي حبيبتي يا أروجتي. ♡",
  },

  /* ——— the little birthday song — a private gift hidden
         inside the birthday room. It belongs to this room
         only: it never follows her anywhere else, and it
         always waits for her own press — never autoplays,
         never loops, never competes with مكانك or the tape.

         To change the song: drop the new file into
         /public/audio and update audioUrl below; the title
         and artist are edited right here ——— */
  song: {
    /** the audio file kept in /public/audio — the exact
        file, byte for byte, never swapped for another
        version, never streamed from anywhere else */
    audioUrl: "/audio/birthday-song.mp3",
    /** the song's own name — taken from the file's own tags
        (Enzel Ya Gameel · إنزل يا جميل), latin reading for
        EN, native script for AR */
    title: bi("Enzel Ya Gameel", "إنزل يا جميل"),
    artist: bi("Walid Toufic", "وليد توفيق"),
    /** the tiny handwritten mark on the card's paper tab */
    tab: bi("for you", "ليكي"),
    /** the small line above the title */
    overline: bi(
      "a little birthday song for you ♡",
      "أغنية عيد ميلاد صغيرة، ليكِ ♡",
    ),
    /** the handwritten line under the artist — an original
        line, written for her, not borrowed from anywhere */
    note: bi(
      "hidden between the candles and the confetti — today only, and only for you. it starts by itself, the moment your wish is done.",
      "مخبيّة هنا بين الشموع — للنهاردة بس، وليكي بس. وهتشغّل لوحدها لحظة ما أمنيتك تخلص.",
    ),
    ariaCard: bi(
      "A little birthday song, hidden inside the birthday card",
      "أغنية عيد ميلاد صغيرة، متخبيّة في كارت العيد",
    ),
    ariaPlay: bi(
      "Play the little birthday song",
      "شغّلي أغنية العيد الصغيرة",
    ),
    ariaPause: bi(
      "Pause the little birthday song",
      "وقّفي أغنية العيد الصغيرة",
    ),
    ariaSeek: bi(
      "Seek within the birthday song",
      "تنقّلي داخل أغنية العيد",
    ),
    ariaMute: bi("Mute the birthday song", "اكتمي أغنية العيد"),
    ariaUnmute: bi("Unmute the birthday song", "شغّلي صوت أغنية العيد"),
    ariaVolume: bi("Birthday song volume", "صوت أغنية العيد"),
    /** the small state line under the player */
    stateLoading: bi("finding the little song…", "بنلاقي الأغنية الصغيرة…"),
    statePlaying: bi("playing, just for today ♥", "بتشتغل، للنهاردة بس ♥"),
    stateEnded: bi(
      "the little song finished — play it again",
      "الأغنية الصغيرة خلصت — شغّليها تاني",
    ),
    stateError: bi(
      "the song wouldn't load — press play to try again",
      "الأغنية مش راضية تحمّل — شغّليها وجربي تاني",
    ),
  },
};

/* ————— footer ————— */
export const footer = {
  /** the small signature — the quiet mark under every normal
      room. A signature, not a message: it never competes with
      the room it lives beneath, and it never grows. The long
      goodbye belongs to the last room alone */
  small: bi("made just for Aroogty ♡", "صنعته مخصوص لأروجتي ♡"),
  /** the final closing — the last words of the whole universe,
      a letter that answers the question she never has to ask.
      Blank lines mark the paragraph breaths; the lines arrive
      one by one as she reaches the very end of the page */
  closing: bi(
    "And if you ever ask me why I made all of this for you…\nthe answer is probably simpler than all these words.\n\nBecause you became one of the things my heart likes to keep safe.\nSo I wanted to leave you a small place…\nwith a little of our days,\na little of our words,\nand a little of my heart.\n\nA place you can come back to after a long time,\nand remember that once, on some ordinary day,\nthere was someone who loved you exactly like this.\n\nAnd maybe the most beautiful part of the story…\nis that this is still only the beginning. ♡",
    "ولو سألتيني ليه عملتلك كل ده…\nفيمكن الإجابة أبسط من كل الكلام ده.\n\nعلشان إنتي بقيتي من الحاجات اللي قلبي بيحب يحافظ عليها.\nفحبيت أسيبلك مكان صغير…\nفيه شوية من أيامنا،\nوشوية من كلامنا،\nوشوية من قلبي.\n\nمكان ترجعي له بعد وقت طويل،\nوتفتكري إن في يوم من الأيام\nكان فيه حد بيحبك بالشكل ده كله.\n\nويمكن أجمل حاجة في الحكاية…\nإن دي لسه مجرد البداية. ♡",
  ),
  /** the quiet signature, under everything else */
  signature: bi("for Aroogty — always", "لأروجتي — دايمًا"),
};

/* ————— our song ————— */
export const song = {
  /** the song chosen to represent this whole little universe —
      its soundtrack, not a feature of any room. It lives in
      the little paper scrap that follows her through every
      room of the place, and it rises with the opening letter
      the moment the gate accepts her word */
  siteSong: {
    /** the audio file kept in /public/audio — exact file, no
        external player, no autoplay before the gate */
    audioUrl: "/audio/makanak.mp3",
    /** the song's own name — Arabic is its native script, so
        both languages read the same word */
    title: "مكانك",
    /** the latin reading, so the song stays recognizable in
        both languages */
    subtitle: bi("Makanak — Amr Diab", "عمرو دياب"),
    /** the small line above the title */
    overline: bi("the song of this little universe", "أغنية العالم الصغير ده"),
    /** the handwritten line under the title */
    why: bi(
      "I kept a song here because it reminds me of you.",
      "سيبت أغنية هنا لأنها بتفكّرني بيكِ.",
    ),
  },
  /** the personal recording — them, singing, on side A */
  title: bi("our song", "أغنيتنا"),
  artist: bi("Ziad + Arooga", "زياد + أروجتي"),
  why: bi(
    "Because somehow every line sounds like something I should have said first.",
    "لأن كل سطر فيها شكله حاجة كان لازم أقولها الأول.",
  ),
  /** Set a URL (e.g. "/song.mp3") to play a real recording.
      Leave empty to use the built-in music-box arrangement. */
  audioUrl: "/audio/our-song.mp3",
  playerNote: bi(
    "a music-box arrangement, made for you",
    "توزيع صندوق موسيقى، معمول ليكِ",
  ),
  /** shown under the player when the real recording is the
      one on the tape */
  realNote: bi(
    "a real recording — us, actually singing",
    "تسجيل حقيقي — إحنا، فعلًا بغنّوا",
  ),
  /** the other side of the tape — a second song that
      belongs to the two of them, just as much as side A.
      Not a filler, not a dedication — one more of theirs */
  sideB: {
    /** the supplied recording, kept as-is in /public/audio —
        the exact file, never swapped for another version */
    audioUrl: "/audio/our-song-b.mp3",
    title: bi("another one of ours", "أغنية تانية لينا"),
    artist: bi("Ziad + Arooga", "زياد + أروجتي"),
    why: bi(
      "Because apparently one song was never enough for us.",
      "لأن واضح إن أغنية واحدة مكانتش هتكفي.",
    ),
    /** shown under the player while this side's recording rests */
    realNote: bi(
      "another real recording — ours too",
      "تسجيل حقيقي تاني — لينا هو كمان",
    ),
    playerNote: bi(
      "a lullaby, written straight onto the tape",
      "تهويدة، اتكتبت على الشريط على طول",
    ),
    /** the folded note that appears under the player on side B */
    noteOverline: bi("why there's a second song —", "ليه فيه أغنية تانية —"),
    noteLines: [
      bi(
        "You flip it thinking one song was the whole story. It never is with us — the other side was holding another one of ours all along.",
        "بتقلبي الشريط وأنتي فاكرة إن أغنية واحدة هي كل الحكاية. إحنا عمرنا ما كنا كده — الوجه التاني كان ماسك أغنية تانية لينا من الأول.",
      ),
      bi(
        "Same tape, same two people who can never leave a song alone. Hand us any song — even one called «من غير كلام» — and somehow it ends up being about us too.",
        "نفس الشريط، نفس الاتنين اللي مش بيسيبوا أغنية في حالها. ادينا أي أغنية — حتى اللي اسمها «من غير كلام» — وهتلاقيها في الآخر بقت بتتحكى عننا.",
      ),
    ] as Bi[],
  },
  /** the little switch under the player */
  flipLabel: bi("flip the tape", "اقلبي الشريط"),
  /** what the cassette corner says on each side */
  sideALabel: bi("side A — ours", "الوجه الأول — لينا"),
  sideBLabel: bi("side B — also ours", "الوجه التاني — لينا كمان"),
  /** short sr-only line describing the flip control */
  flipSrLabel: bi(
    "Flip the cassette to the other side",
    "اقلبي الكاسيت على الوجه التاني",
  ),
};

/* ————— interface microcopy (nav, section headings, arias) ————— */
export const ui = {
  nav: {
    items: [
      { id: "home" as ViewId, label: bi("Home", "الرئيسية"), short: bi("home", "الرئيسية") },
      { id: "beginning" as ViewId, label: bi("Our Beginning", "حكايتنا"), short: bi("beginning", "الحكاية") },
      { id: "things" as ViewId, label: bi("Little Things", "التفاصيل الصغيرة"), short: bi("things", "التفاصيل") },
      { id: "memories" as ViewId, label: bi("Memories", "الذكريات"), short: bi("memories", "الذكريات") },
      { id: "birthday" as ViewId, label: bi("Birthday", "عيد الميلاد"), short: bi("birthday", "عيدك") },
      { id: "song" as ViewId, label: bi("Our Song", "أغنيتنا"), short: bi("song", "أغنيتنا") },
      { id: "letters" as ViewId, label: bi("Letters", "الرسايل"), short: bi("letters", "الرسايل") },
    ],
    homeAria: bi("Aroogty — back to home", "أروجتي — ارجعي للبيت"),
  },
  common: {
    close: bi("Close", "إغلاق"),
    openSection: bi("— open the section", "— افتحي القسم"),
    done: bi("— done", "— خلصنا"),
    back: bi("back", "رجوع"),
    /** time-of-day fallback when the clock runs past midnight words */
    late: bi("late", "بالليل"),
    /** extra frames in a photo strip preview: {n} replaced */
    plusMoreTemplate: bi("+{n} more", "+{n} كمان"),
    /** the tiny overline on the cinema ticket artifact */
    cinemaOverline: bi("cinema", "سينما"),
  },
  sections: {
    beginning: {
      overline: bi("our beginning", "بدايتنا"),
      title: bi("Our Beginning", "حكايتنا من أولها"),
      sub: bi(
        "the short version of a long, good story",
        "النسخة القصيرة من حكاية طويلة وحلوة",
      ),
    },
    things: {
      overline: bi("little things", "التفاصيل"),
      title: bi("Little Things That Are So You", "حاجات صغيرة شكلها أنتِ"),
      sub: bi(
        "seven small things live on this board — tap one",
        "سبع حاجات صغيرة عايشة على اللوح ده — دوسي على واحدة",
      ),
      /** aria suffix on a discovered object */
      foundAria: bi(" (found)", " (لقيتيها)"),
      /** dialog fallback title */
      fallbackTitle: bi("Little thing", "حاجة صغيرة"),
      /** the little cassette art labels */
      cassetteSong: bi("our song", "أغنيتنا"),
      cassetteSide: bi("side a", "الوجه الأول"),
    },
    memories: {
      overline: bi("memories", "الذكريات"),
      title: bi("Our Memory Drawer", "درج الذكريات"),
      sub: bi("a drawer we keep filling — tap anything", "درج بنملّيه على راحتنا — دوسي على أي حاجة"),
    },
    birthday: {
      overline: bi("birthday", "عيد الميلاد"),
    },
    song: {
      overline: bi("our song", "أغنيتنا"),
      title: bi("Our Song", "أغنيتنا"),
      sub: bi(
        "press play — it never starts without you",
        "شغّليها — عمره ما بيبدأ من غيرك",
      ),
    },
    letters: {
      overline: bi("letters", "الرسايل"),
      title: bi("Letters", "الرسايل"),
      sub: bi("quiet things, kept safe for you", "حاجات هادية، محفوظة ليكِ"),
    },
  },
  wander: {
    overline: bi("wander through —", "خدي لفة براحتك —"),
    aria: bi("Sections", "الأقسام"),
    links: [
      { view: "beginning" as ViewId, label: bi("our beginning", "حكايتنا") },
      { view: "things" as ViewId, label: bi("little things", "التفاصيل") },
      { view: "memories" as ViewId, label: bi("memories", "الذكريات") },
      { view: "birthday" as ViewId, label: bi("birthday", "عيدك") },
      { view: "song" as ViewId, label: bi("our song", "أغنيتنا") },
      { view: "letters" as ViewId, label: bi("letters", "الرسايل") },
    ],
    memoryAria: bi(
      "Open this memory in our memory drawer",
      "افتحي الذكرى دي في درج الذكريات",
    ),
  },
  visits: {
    earlierToday: bi("you were here earlier today ♥", "كنتي هنا بدري النهاردة ♥"),
    yesterday: bi("…last time you were here: yesterday", "…آخر مرة كنتي هنا: امبارح"),
    daysAgoTemplate: bi(
      "…last time you were here: {n} days ago",
      "…آخر مرة كنتي هنا: من {n} يوم",
    ),
  },
  time: {
    /* the counter is a visual, archival object — its numbers
       and units stay in elegant English / LTR (like the dates),
       isolated with dir="ltr" where they render */
    years: "years",
    months: "months",
    days: "days",
    hours: "hours",
    minutes: "minutes",
    seconds: "seconds",
    ariaLabel: bi("Time together — live counter", "الوقت مع بعض — عدّاد حي"),
  },
  timeline: {
    readNote: bi("read the little note", "اقرئي الورقة الصغيرة"),
    andCounting: bi("and counting, always", "وبنحسب، على طول"),
  },
  memoriesUi: {
    shuffle: bi("pick a random memory", "اختاري ذكرى عشوائي"),
    openAria: bi("Open memory: {caption}, {date}", "افتحي الذكرى: {caption}، {date}"),
    frame: bi(", frame {n}", "، إطار {n}"),
    fallbackTitle: bi("Memory", "ذكرى"),
  },
  birthdayUi: {
    cakeAria: bi(
      "Birthday cake with the number candles one and nine — press and hold while you make a wish",
      "تورتة عيد ميلاد بشمعتين رقم واحد وتسعة — دوسي مطوّل وأنتِ بتتمني",
    ),
    candlesAria: bi(
      "Candles lit — swipe upward across them, or press Enter, to blow them out",
      "الشموع ولّعت — اسحبي لفوق عليهم، أو دوسي Enter، عشان تطفيهم",
    ),
    completeAria: bi("Birthday ritual complete", "طقوس عيد الميلاد اكتملت"),
    ritualAria: bi(
      "Finish the ritual without gestures — blow the candles out for me",
      "كمّلي الطقوس من غير حركات — طفي الشموع عني",
    ),
    yearsOfYou: bi("years of you", "سنة من عمرك"),
  },
  songUi: {
    ariaSideB: bi("A cassette tape, side B — {title}", "شريط كاسيت، الوجه التاني — {title}"),
    ariaMain: bi("A cassette tape of our song", "شريط كاسيت لأغنيتنا"),
    ariaUnmute: bi("Unmute the music", "شغّلي الصوت"),
    ariaMute: bi("Mute the music", "اكتمي الصوت"),
    ariaProgress: bi("Song progress", "تقدم الأغنية"),
    ariaPause: bi("Pause our song", "وقفي أغنيتنا"),
    ariaPlay: bi("Play our song", "شغّلي أغنيتنا"),
    ariaFlip: bi("Flip the cassette to {side}", "اقلبي الكاسيت على {side}"),
    sideNowB: bi("currently side B", "دلوقتي الوجه التاني"),
    sideNowA: bi("currently side A", "دلوقتي الوجه الأول"),
    sideChipB: bi("· side B", "· الوجه التاني"),
    sideChipA: bi("· side A", "· الوجه الأول"),
    builder: bi("— the builder of this place", "— اللي بنى المكان ده"),
    /* ————— the site song (مكانك) — its little global scrap ————— */
    ariaDock: bi(
      "Makanak — the song of this place",
      "مكانك — أغنية المكان ده",
    ),
    ariaExpandDock: bi(
      "Open the song's little player",
      "افتحي المشغّل الصغير بتاع الأغنية",
    ),
    ariaCollapseDock: bi(
      "Close the song's little player",
      "اقفلي المشغّل الصغير بتاع الأغنية",
    ),
    ariaPlaySite: bi(
      "Play Makanak — the song of this place",
      "شغّلي مكانك — أغنية المكان ده",
    ),
    ariaPauseSite: bi("Pause Makanak", "وقّفي مكانك"),
    ariaSeek: bi("Seek within the song", "تنقّلي داخل الأغنية"),
    ariaVolumeSite: bi("Makanak volume", "صوت مكانك"),
    loadingSite: bi("finding the song…", "بنلاقي الأغنية…"),
    playingSite: bi("playing…", "بتشتغل…"),
    endedSite: bi(
      "the song finished — play it again",
      "الأغنية خلصت — شغّليها تاني",
    ),
    errorSite: bi(
      "the song wouldn't load — press play to try again",
      "الأغنية مش راضية تحمّل — شغّليها وجربي تاني",
    ),
    /* ————— the personal recording ————— */
    loadingOurs: bi("loading our song…", "بنجهّز أغنيتنا…"),
    playingOurs: bi("that's us, singing ♥", "ده إحنا، بغنّوا ♥"),
    endedOurs: bi("the tape ran out — play us again", "الشريط خلص — شغّلنا تاني"),
    errorOurs: bi(
      "the recording wouldn't load — press play to try again",
      "التسجيل مش راضي يحمل — شغّليه وجربي تاني",
    ),
  },
  lettersUi: {
    forLaterOverline: bi("For later —", "لوقت تاني —"),
    forLaterSub: bi(
      "sealed, and waiting for the right day",
      "مقفولة، ومستنية اليوم المناسب",
    ),
    fallbackTitle: bi("Sealed letter", "رسالة مقفولة"),
  },
};
