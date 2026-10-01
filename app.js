/* Stratum Zero catalog
   Schema version 1.0 — client index, no framework.

   FILE SHAPE
   {
     id, n, tier: "nuclear"|"standard", status: "curated"|"scaffold",
     department, verse, summary, keywords, serialLabel,
     manuscript: { tradition, witnesses: [{ label, lang, dir, text, literal }] } | null,
     kjv: string, modern: { niv, esv } | null,
     forensic: { serials: string[], critical: string, body: string },
     witnessLanguage, edition, lens   // scaffolds only
   }

   PAYLOAD EXPANSION PAST 350
   1. ARCHIVE_MILESTONE is the cap this page is built to hold.
   2. Add real dossiers to CURATED, or stop calling buildScaffolds() once every
      slot is bound. Preferred production path: fetch("/data/archive.json")
      and pass the array to renderArchive(). Keep this same shape.
   3. Never mint a museum serial. status stays "scaffold" until forensic.serials
      names a real object, edition, or sample.
   4. Card faces stay summary-only. renderDetail() runs on open so a larger
      payload does not paint every manuscript into the grid.
   5. NIV and ESV stay tracks (reading, footnote, base text). Do not store
      their full verses; those translations are copyrighted.
   6. When the archive outgrows one page, emit a static URL per bound file
      and keep this document as the index.
*/

const SCHEMA_VERSION = "1.0";
const ARCHIVE_MILESTONE = 350;

const DEPARTMENTS = [
  "Archaeology",
  "Scribal Revisions",
  "Roman Politics",
  "Primitive Science",
  "Moral Defections"
];

const SCAFFOLD_QUOTA = {
  Archaeology: 66,
  "Scribal Revisions": 66,
  "Roman Politics": 65,
  "Primitive Science": 65,
  "Moral Defections": 64
};

const DEPT_QUESTION = {
  Archaeology: "Which stratum, inscription, or sample actually constrains this verse?",
  "Scribal Revisions": "Which manuscript family changes the wording, and at which siglum?",
  "Roman Politics": "Which dated Roman office, edict, or imperial setting collides with this notice?",
  "Primitive Science": "Which ancient physical model sits in the lexicon, and what does the material record say about it?",
  "Moral Defections": "What does the legal or command clause require once later cushioning is removed?"
};

const KJV_NOTE = "Public-domain King James text in the 1769 spelling of the 1611 translation. Original 1611 orthography is normalized for the screen.";
const MODERN_NOTE = "NIV (Biblica) and ESV (Crossway) are copyrighted. This panel tracks the reading, the footnote, and the textual base. It does not reproduce the full modern verse.";

const TABS = [
  ["manuscript", "Manuscript Layer"],
  ["kjv", "King James Version (1611)"],
  ["modern", "Modern Translations"],
  ["forensic", "Forensic Note"]
];

const GREEK_BOOKS = new Set(["Matthew", "Mark", "Luke", "John", "Revelation"]);

/* Chapter pools for unbound slots. Verse numbers below are real.
   Replace this table when the production catalog arrives. */
const RANGES = [
  ["Genesis", 1, 1, 31, "Primitive Science"],
  ["Genesis", 2, 1, 25, "Primitive Science"],
  ["Job", 38, 1, 12, "Primitive Science"],
  ["Genesis", 6, 1, 22, "Archaeology"],
  ["Genesis", 11, 1, 32, "Archaeology"],
  ["Exodus", 14, 1, 31, "Archaeology"],
  ["Deuteronomy", 32, 1, 43, "Scribal Revisions"],
  ["Psalm", 22, 1, 31, "Scribal Revisions"],
  ["Isaiah", 7, 1, 25, "Scribal Revisions"],
  ["John", 1, 1, 18, "Scribal Revisions"],
  ["Matthew", 2, 1, 23, "Roman Politics"],
  ["Luke", 2, 1, 20, "Roman Politics"],
  ["Mark", 15, 1, 15, "Roman Politics"],
  ["Revelation", 13, 1, 18, "Roman Politics"],
  ["Exodus", 21, 1, 36, "Moral Defections"],
  ["Numbers", 31, 1, 20, "Moral Defections"],
  ["Deuteronomy", 20, 1, 20, "Moral Defections"]
];

const CHAPTER_LENS = {
  "Genesis 1": "ordering of light, raqia, luminaries, and the seven-day frame",
  "Genesis 2": "sequence of water, soil, plants, animals, and the human pair beside Genesis 1",
  "Job 38": "cosmic questions: storehouses, the sea's limit, and the ancient sky",
  "Genesis 6": "sons of God, Nephilim, and flood narrative parallels",
  "Genesis 11": "city, tower, and the claim of linguistic scattering",
  "Exodus 14": "yam suf, the east wind, and the geography of the crossing",
  "Deuteronomy 32": "Song of Moses, divine-council language, and versional splits. English 32 and Hebrew 32 align; confirm the verse in BHS",
  "Psalm 22": "English numbering. Hebrew verses in this psalm often sit one higher. The hands-and-feet crux is English 22:16 / Hebrew 22:17",
  "Isaiah 7": "Syro-Ephraimite setting, almah, and the Immanuel sign",
  "John 1": "Logos prologue and its text in the early papyri",
  "Matthew 2": "Herod, the star notice, and the infancy chronology",
  "Luke 2": "census, Quirinius, and the gubernatorial date",
  "Mark 15": "Pilate hearing, titulus, and Roman execution procedure",
  "Revelation 13": "beast numeration, 616 and 666, and the imperial cult",
  "Exodus 21": "injury law, slave statutes, and the talion",
  "Numbers 31": "war statute, spoil census, and the command clauses",
  "Deuteronomy 20": "siege rules and the exemptions written into the chapter"
};

const CURATED = [
  {
    tier: "nuclear",
    department: "Archaeology",
    verse: "Deuteronomy 32:8",
    serialLabel: "Bound · 4Q37",
    keywords: "qumran dead sea scrolls sons of god divine council 4QDeutj DJD",
    summary: "The Masoretic Text ends the verse with the sons of Israel. Qumran manuscript 4Q37 and the Septuagint do not. The receipt is a fragment, not a theology.",
    manuscript: {
      tradition: "Masoretic Text against 4QDeutj (4Q37), collated in DJD XIV. Greek witnesses read angels or sons of God (ἀγγέλων θεοῦ / υἱῶν θεοῦ), not Israel.",
      witnesses: [
        {
          label: "Masoretic clause",
          lang: "he",
          dir: "rtl",
          text: "למספר בני ישראל",
          literal: "according to the number of the sons of Israel"
        },
        {
          label: "4Q37 clause",
          lang: "he",
          dir: "rtl",
          text: "למספר בני אלהים",
          literal: "according to the number of the sons of God"
        }
      ]
    },
    kjv: "When the most High divided to the nations their inheritance, when he separated the sons of Adam, he set the bounds of the people according to the number of the children of Israel.",
    modern: {
      niv: "Printings that still read “sons of Israel” or “children of Israel” are following the medieval Masoretic Text. Bind the exact NIV edition. The track is which base text the committee kept.",
      esv: "ESV-tradition editions have moved to a divine-sons reading and footnoted the Masoretic “sons of Israel.” Confirm the printing in hand. The split itself is the finding."
    },
    forensic: {
      serials: [
        "4Q37 (4QDeutj), Qumran Cave 4 — DJD XIV",
        "Masoretic comparison text: Leningrad Codex, photographed in BHS",
        "Greek: Rahlfs–Hanhart at Deuteronomy 32:8"
      ],
      critical: "4Q37 does not read “sons of Israel.” A note that treats the Masoretic clause as the only ancient Hebrew wording is ignoring the fragment.",
      body: "This is a transmission file. It does not, by itself, reconstruct Israelite religion. It does force the later Hebrew reading to answer an older witness from Cave 4 and a Greek tradition that never had Israel in the line."
    }
  },
  {
    tier: "nuclear",
    department: "Scribal Revisions",
    verse: "Isaiah 7:14",
    serialLabel: "Bound · 1QIsaᵃ",
    keywords: "almah parthenos virgin young woman great isaiah scroll matthew",
    summary: "The Hebrew noun is almah. The Great Isaiah Scroll agrees. “Virgin” is the Greek parthenos that Matthew quotes. The King James line follows the Greek, not the Hebrew noun.",
    manuscript: {
      tradition: "Masoretic Text and 1QIsaᵃ (Great Isaiah Scroll). Septuagint lemma παρθένος. Matthew 1:23 quotes the Greek.",
      witnesses: [
        {
          label: "Isaiah 7:14, consonantal clause",
          lang: "he",
          dir: "rtl",
          text: "הנה העלמה הרה וילדת בן",
          literal: "Behold, the young woman is pregnant and bearing a son"
        },
        {
          label: "Septuagint lemma",
          lang: "grc",
          dir: "ltr",
          text: "παρθένος",
          literal: "virgin — the word Matthew 1:23 takes up"
        }
      ]
    },
    kjv: "Therefore the Lord himself shall give you a sign; Behold, a virgin shall conceive, and bear a son, and shall call his name Immanuel.",
    modern: {
      niv: "NIV prints “virgin” in the main text of Isaiah 7:14 and footnotes “Or young woman.” A further note records a Dead Sea Scrolls variation on who names the child. The footnote is the track.",
      esv: "ESV keeps a virgin reading in Isaiah and carries an alternate in the footnote apparatus. Matthew’s citation is a Greek citation. Record the printing; do not collapse Hebrew almah into the New Testament quotation."
    },
    forensic: {
      serials: [
        "1QIsaᵃ, Great Isaiah Scroll — Shrine of the Book, Israel Museum",
        "Masoretic Text, BHS Isaiah 7:14",
        "Greek Isaiah, Göttingen / Rahlfs at 7:14; Matthew 1:23 in NA28"
      ],
      critical: "The Hebrew word in this line is almah, not betulah. 1QIsaᵃ does not turn it into parthenos.",
      body: "Betulah is the clearer Hebrew term where virginity is the point. Almah names a young woman of marriageable age. The virgin reading becomes explicit in the Greek, and the Gospel quotes that Greek. An English main text can choose parthenos. It cannot claim the Hebrew noun already said it."
    }
  },
  {
    tier: "nuclear",
    department: "Scribal Revisions",
    verse: "Mark 16:8–20",
    serialLabel: "Bound · Add MS 43725",
    keywords: "longer ending sinaiticus vaticanus mark resurrection",
    summary: "Codex Sinaiticus and Codex Vaticanus end Mark at “for they were afraid.” The twelve verses that follow in the King James Version are absent from both fourth-century Bibles.",
    manuscript: {
      tradition: "Greek New Testament. Ending absent from 01 (Sinaiticus) and 03 (Vaticanus). A shorter intermediate ending exists in a minority of witnesses; bind those sigla from the NA28 apparatus before listing them.",
      witnesses: [
        {
          label: "Mark 16:8, closing words in 01 and 03",
          lang: "grc",
          dir: "ltr",
          text: "ἐφοβοῦντο γάρ",
          literal: "for they were afraid"
        }
      ]
    },
    kjv: "And they went out quickly, and fled from the sepulchre; for they trembled and were amazed: neither said they any thing to any man; for they were afraid. The King James text then continues with the longer ending. Verse 9 opens: “Now when Jesus was risen early the first day of the week, he appeared first to Mary Magdalene, out of whom he had cast seven devils.” Verses 19–20 close it with the ascension and the preaching. Verses 10–18 are the same public-domain longer ending.",
    modern: {
      niv: "NIV keeps 16:9–20 in the printed chapter and attaches a textual note that the earliest manuscripts end at 16:8. The note is the track.",
      esv: "ESV likewise prints the longer ending with a textual note that the earliest manuscripts do not include 16:9–20. Brackets in a given printing should be recorded with the ISBN of that book."
    },
    forensic: {
      serials: [
        "Codex Sinaiticus — British Library Add MS 43725 (Gregory-Aland 01). Other leaves: Leipzig, St Petersburg, St Catherine’s",
        "Codex Vaticanus — Vatican Library, Vat.gr.1209 (Gregory-Aland 03)",
        "NA28 apparatus at Mark 16:8"
      ],
      critical: "The two earliest complete Bibles of Mark stop at 16:8. The King James ending is a later text in those copies.",
      body: "Absence from 01 and 03 is the receipt. It does not decide what happened on the first day of the week. It decides what those manuscripts of Mark contain. Later copies, lectionaries, and the King James tradition preserve the longer ending as scripture. The file keeps both facts."
    }
  },
  {
    tier: "nuclear",
    department: "Scribal Revisions",
    verse: "1 John 5:7–8",
    serialLabel: "Bound · GA 61",
    keywords: "comma johanneum erasmus montfortianus trinity",
    summary: "The heavenly witnesses — Father, Word, and Holy Spirit — are a King James verse. They are not in Greek manuscripts of the first millennium. Erasmus printed them in his third edition after a late copy was produced.",
    manuscript: {
      tradition: "Greek epistle. The early text has one trio on earth. The heavenly trio enters Greek late, notably in GA 61 (Codex Montfortianus), shown to Erasmus.",
      witnesses: [
        {
          label: "Early Greek trio (King James verse 8)",
          lang: "grc",
          dir: "ltr",
          text: "τὸ πνεῦμα καὶ τὸ ὕδωρ καὶ τὸ αἷμα",
          literal: "the Spirit, and the water, and the blood"
        },
        {
          label: "Late comma, not first-millennium Greek",
          lang: "grc",
          dir: "ltr",
          text: "ὁ πατὴρ, ὁ λόγος, καὶ τὸ ἅγιον πνεῦμα",
          literal: "the Father, the Word, and the Holy Spirit"
        }
      ]
    },
    kjv: "For there are three that bear record in heaven, the Father, the Word, and the Holy Ghost: and these three are one. And there are three that bear witness in earth, the Spirit, and the water, and the blood: and these three agree in one.",
    modern: {
      niv: "NIV omits the heavenly witnesses from the main text. A footnote records that late manuscripts add them. The main text follows the early Greek.",
      esv: "ESV omits the comma from the main text and notes the late addition. The track is an omission with a manuscript footnote, the reverse of the King James verse division."
    },
    forensic: {
      serials: [
        "GA 61, Codex Montfortianus — early 16th century Greek copy associated with Erasmus’s 1522 edition",
        "Erasmus, Novum Instrumentum / Novum Testamentum, third edition (1522)",
        "NA28 at 1 John 5:7–8"
      ],
      critical: "No Greek manuscript from the first millennium contains the heavenly witnesses. The King James verse depends on a late, Latin-influenced Greek line.",
      body: "The doctrine of the Trinity does not stand or fall on this clause; it is argued from other texts. This file is narrower. The clause itself has a paper trail, and the trail does not begin in a first-millennium Greek copy of 1 John."
    }
  },
  {
    tier: "nuclear",
    department: "Scribal Revisions",
    verse: "John 7:53–8:11",
    serialLabel: "Bound · P66 · P75",
    keywords: "pericope adulterae bodmer vaticanus sinaiticus",
    summary: "The account of the woman accused of adultery is missing from this place in the earliest copies of John, including P66, P75, Sinaiticus, and Vaticanus. The King James Version prints it as continuous text.",
    manuscript: {
      tradition: "Absent here in P66, P75, 01, and 03. Later Byzantine copies include it; some mark the block with signs in the margin. Bind those sigla from NA28.",
      witnesses: [
        {
          label: "Later Greek opening of the pericope (John 8:1)",
          lang: "grc",
          dir: "ltr",
          text: "Ἰησοῦς δὲ ἐπορεύθη εἰς τὸ ὄρος τῶν ἐλαιῶν",
          literal: "And Jesus went to the Mount of Olives"
        }
      ]
    },
    kjv: "The King James Version prints the pericope here in full, from “And every man went unto his own house” through the line “He that is without sin among you, let him first cast a stone at her,” and on to 8:11. That English is public domain. The forensic issue is the Greek copies, not the English wording.",
    modern: {
      niv: "NIV sets John 7:53–8:11 off with a textual note that the earliest manuscripts omit the passage, and still prints it. Record whether the printing uses brackets.",
      esv: "ESV prints the passage with a textual note of the same kind. The track is the note plus the decision to keep the story in the chapter."
    },
    forensic: {
      serials: [
        "P66 — Bodmer Papyrus II",
        "P75 — Vatican Library (Hanna Papyrus)",
        "Codex Sinaiticus, Add MS 43725; Codex Vaticanus, Vat.gr.1209"
      ],
      critical: "The earliest papyri of John and the two great fourth-century Bibles do not contain this story at this location.",
      body: "Whether the story circulated on its own is a different question and needs its own witnesses. This file records one receipt: in the earliest continuous copies of the Gospel, the narrative is not between 7:52 and 8:12."
    }
  },
  {
    tier: "nuclear",
    department: "Primitive Science",
    verse: "Genesis 1:6–8",
    serialLabel: "Bound · BHS · LXX στερέωμα",
    keywords: "raqia firmament vault expanse enumah elish cosmology",
    summary: "The Hebrew noun is raqia, from a root used for hammering metal. The King James calls it a firmament. The Septuagint calls it a stereoma, a solid thing. Waters sit above it in the verse itself.",
    manuscript: {
      tradition: "Masoretic Genesis. Septuagint στερέωμα. Enuma Elish is a thematic parallel (Marduk splits Tiamat), not a line quoted inside Genesis. Bind the tablet from Lambert, Babylonian Creation Myths (2013).",
      witnesses: [
        {
          label: "Genesis 1:6, consonantal clause",
          lang: "he",
          dir: "rtl",
          text: "יהי רקיע בתוך המים",
          literal: "Let there be a raqia in the midst of the waters"
        },
        {
          label: "Septuagint lemma",
          lang: "grc",
          dir: "ltr",
          text: "στερέωμα",
          literal: "a solid body; the Greek choice behind Latin firmamentum"
        }
      ]
    },
    kjv: "And God said, Let there be a firmament in the midst of the waters, and let it divide the waters from the waters. And God made the firmament, and divided the waters which were under the firmament from the waters which were above the firmament: and it was so. And God called the firmament Heaven.",
    modern: {
      niv: "NIV 2011 uses “vault” for raqia in Genesis 1:6. The older English “firmament” has been replaced in the main text. Check the footnote of the printing in hand before quoting an alternate such as “expanse.”",
      esv: "ESV main text uses “expanse” and footnotes “Or a canopy” at Genesis 1:6. It does not put “firmament” in that footnote. The lexical problem is unchanged: the verse puts water above the structure."
    },
    forensic: {
      serials: [
        "BHS / Leningrad Codex, Genesis 1:6–8",
        "Septuagint στερέωμα at Genesis 1:6",
        "Enuma Elish — bind the British Museum tablet via Lambert 2013, not a paraphrase"
      ],
      critical: "The verse places water above the raqia and names that structure heaven. “Expanse” and “vault” are English choices laid over a harder ancient model.",
      body: "Job 37:18 and Ezekiel 1:22 belong in the same lexical file: the raqia is compared to cast metal and can be stood on. A modern sky can be read back into the word. The Hebrew line, the Greek stereoma, and the water above it are the receipt."
    }
  },
  {
    tier: "nuclear",
    department: "Roman Politics",
    verse: "Luke 2:1–2",
    serialLabel: "Bound · Josephus, Ant. 18",
    keywords: "quirinius census herod cyrenius judea 6 ce",
    summary: "Luke dates the birth census to Quirinius’s governorship of Syria. Josephus dates Quirinius’s Judean census to 6 CE, after Herod’s son Archelaus was deposed. Matthew places the birth under Herod, who died about 4 BCE.",
    manuscript: {
      tradition: "Greek Luke. The name in the text is Κυρήνιος, Latin Quirinius, King James Cyrenius. Historical anchor: Josephus, Jewish Antiquities 18.1–2.",
      witnesses: [
        {
          label: "Luke 2:2, Greek clause",
          lang: "grc",
          dir: "ltr",
          text: "ἡγεμονεύοντος τῆς Συρίας Κυρηνίου",
          literal: "while Quirinius was governing Syria"
        }
      ]
    },
    kjv: "And it came to pass in those days, that there went out a decree from Caesar Augustus, that all the world should be taxed. (And this taxing was first made when Cyrenius was governor of Syria.)",
    modern: {
      niv: "NIV renders the census under Quirinius. Do not assume the footnote dates it to 6 CE. If the printing is silent on the Josephus date, that silence is part of the track.",
      esv: "ESV likewise keeps Quirinius as governor at the time of the registration. The wording is stable. The collision is chronological, not lexical."
    },
    forensic: {
      serials: [
        "Josephus, Jewish Antiquities 18.1–2 — census after the deposition of Archelaus, 6 CE",
        "NA28 Luke 2:1–2",
        "Herod’s death, consensus chronology near 4 BCE — bind the Josephus passages and the eclipse notice used in the argument"
      ],
      critical: "A census under Quirinius in 6 CE is not a birth under Herod. Herod was already dead. No Syrian census edict naming Quirinius in Herod’s reign is bound in this file.",
      body: "An earlier posting for Quirinius is a hypothesis. It becomes evidence when an inscription or a dated edict is on the table. Until that object is bound, the two Gospel chronologies and Josephus do not describe one year."
    }
  },
  {
    tier: "nuclear",
    department: "Archaeology",
    verse: "Joshua 6",
    serialLabel: "Bound · Tell es-Sultan",
    keywords: "jericho kenyon city iv middle bronze conquest",
    summary: "Kathleen Kenyon’s sections at Tell es-Sultan put the great fortification collapse at the end of the Middle Bronze Age, about 1550 BCE, with little Late Bronze city for a conventional conquest to burn.",
    manuscript: {
      tradition: "Masoretic Joshua. The archaeological receipt is the published phasing, not a museum souvenir number.",
      witnesses: [
        {
          label: "Joshua 6:20, consonantal clause",
          lang: "he",
          dir: "rtl",
          text: "ותפל החומה תחתיה",
          literal: "and the wall fell down in its place"
        }
      ]
    },
    kjv: "So the people shouted when the priests blew with the trumpets: and it came to pass, when the people heard the sound of the trumpet, and the people shouted with a great shout, that the wall fell down flat, so that the people went up into the city, every man straight before him, and they took the city.",
    modern: {
      niv: "NIV narrates the wall’s fall in ordinary English and does not carry Kenyon’s phase dates in the footnote. The silence is not a refutation of the dig.",
      esv: "ESV likewise translates the narrative. The track is textual, not stratigraphic. The collision lives in the forensic panel."
    },
    forensic: {
      serials: [
        "Tell es-Sultan (Jericho) — Kenyon excavations, published London 1960–1983",
        "City IV destruction, end of Middle Bronze, circa 1550 BCE, in Kenyon’s phasing",
        "Dissent: Bryant Wood’s Late Bronze reading, published as a rebuttal, not as Kenyon’s section"
      ],
      critical: "Kenyon’s published destruction does not land in the Late Bronze horizon a 13th-century conquest needs. A re-date has to re-read her sections.",
      body: "Wood’s pottery argument is part of the file because it is published dissent. It is not the dig’s own phase. Population genetics are a separate dossier (see the Levant aDNA file) and do not date this wall."
    }
  },
  {
    tier: "standard",
    department: "Scribal Revisions",
    verse: "Psalm 22:16 (Hebrew 22:17)",
    serialLabel: "Bound · MT כארי · LXX ὤρυξαν",
    keywords: "pierced lion nahal hever hands feet",
    summary: "The Masoretic consonants read ka’ari, “like a lion,” in a line that is grammatically harsh. The Septuagint has “they dug” or “they pierced.” The Nahal Hever letter people cite for a piercing verb is damaged.",
    manuscript: {
      tradition: "Masoretic Psalm 22:17 (English 22:16). Septuagint ὤρυξαν χεῖράς μου καὶ πόδας. Nahal Hever Psalms scroll (5/6HevPs): the decisive letter is disputed.",
      witnesses: [
        {
          label: "Masoretic consonants",
          lang: "he",
          dir: "rtl",
          text: "כארי ידי ורגלי",
          literal: "like a lion my hands and my feet — syntactically difficult"
        },
        {
          label: "Septuagint verb",
          lang: "grc",
          dir: "ltr",
          text: "ὤρυξαν",
          literal: "they dug / pierced"
        }
      ]
    },
    kjv: "For dogs have compassed me: the assembly of the wicked have inclosed me: they pierced my hands and my feet.",
    modern: {
      niv: "Committees that print a piercing verb owe the reader a footnote to Hebrew “like a lion.” Check the NIV printing. The main text often follows the Greek tradition.",
      esv: "ESV’s tradition prints a piercing verb and footnotes the Hebrew “like a lion.” Confirm the footer of the edition cited. The footnote is the Masoretic receipt inside a Greek-based main text."
    },
    forensic: {
      serials: [
        "BHS Psalm 22:17 (English 22:16)",
        "Septuagint ὤρυξαν",
        "5/6HevPs — damaged letter; do not call the verb settled from a photograph in a secondary article"
      ],
      critical: "“Pierced” is a versional reading. The medieval Hebrew consonants say “like a lion,” and the clause does not parse cleanly.",
      body: "A New Testament echo cannot be used to repair the Hebrew line and then cited as if the Hebrew had always agreed. The damage at Nahal Hever is real. Damage is not a decision."
    }
  },
  {
    tier: "standard",
    department: "Scribal Revisions",
    verse: "Jeremiah 8:8",
    serialLabel: "Bound · עט שקר",
    keywords: "lying pen scribes torah jeremiah",
    summary: "The Hebrew noun phrase is a pen of falsehood. The King James renders the failure as “in vain.” That is a softer English choice than the noun in front of the translator.",
    manuscript: {
      tradition: "Masoretic Jeremiah. Key noun phrase only; bind the full BHS line before a diplomatic edition of this file.",
      witnesses: [
        {
          label: "Jeremiah 8:8, key phrase",
          lang: "he",
          dir: "rtl",
          text: "עט שקר ספרים",
          literal: "a pen of falsehood, of the scribes"
        }
      ]
    },
    kjv: "How do ye say, We are wise, and the law of the LORD is with us? Lo, certainly in vain made he it; the pen of the scribes is in vain.",
    modern: {
      niv: "NIV’s crux lemma is “the lying pen of the scribes,” which tracks sheqer more closely than the King James “in vain.”",
      esv: "ESV-tradition renderings stay with falsehood or a lie in the pen, not with mere vanity. Compare the printing. The noun is the track."
    },
    forensic: {
      serials: [
        "BHS Jeremiah 8:8",
        "Key consonants: עט שקר"
      ],
      critical: "The Hebrew says the pen is false. “In vain” is an English softening, not a second Hebrew noun.",
      body: "The verse is internal to the tradition: a prophet accusing scribes who claim the Torah is with them. It is not a modern manifesto. It is also not the harmless line the King James English suggests."
    }
  },
  {
    tier: "standard",
    department: "Archaeology",
    verse: "Exodus 14:21",
    serialLabel: "Bound · yam suf",
    keywords: "red sea reeds east wind exodus",
    summary: "The Hebrew sea is yam suf, the Sea of Reeds. “Red Sea” is a Greek interpretation, erythra thalassa, that the King James tradition made standard English.",
    manuscript: {
      tradition: "Masoretic Exodus. Septuagint ἐρυθρὰ θάλασσα. No New Kingdom itinerary is bound in this slot yet; do not name a lake as if a tablet had identified it.",
      witnesses: [
        {
          label: "Exodus 14:21, wind clause",
          lang: "he",
          dir: "rtl",
          text: "ברוח קדים עזה",
          literal: "by a strong east wind"
        }
      ]
    },
    kjv: "And Moses stretched out his hand over the sea; and the LORD caused the sea to go back by a strong east wind all that night, and made the sea dry land, and the waters were divided.",
    modern: {
      niv: "NIV often keeps “Red Sea” in the main text of the exodus narrative and footnotes the Hebrew “Sea of Reeds.” Confirm the printing. The footnote is the Hebrew.",
      esv: "ESV’s tradition likewise uses “Red Sea” with a reed-sea note in many study layouts. The track is whether the Hebrew phrase is visible without a commentary."
    },
    forensic: {
      serials: [
        "BHS Exodus 14:21 — ים סוף in the chapter’s own usage",
        "Septuagint ἐρυθρὰ θάλασσα",
        "Site identification: unbound. No catalogued itinerary is attached."
      ],
      critical: "The Hebrew is Sea of Reeds. Red Sea is a Greek choice that entered English through the King James tradition.",
      body: "The east-wind clause is in the Hebrew sentence, not only in a naturalistic retelling. Geography beyond that clause needs a map tied to an inscription or a core, which this file does not yet have."
    }
  },
  {
    tier: "standard",
    department: "Moral Defections",
    verse: "Exodus 21:20–21",
    serialLabel: "Bound · כי כספו הוא",
    keywords: "slavery rod property silver money covenant code",
    summary: "If a person beats an enslaved man or woman with a rod and the victim dies at once, the beating is punished. If the victim survives a day or two, it is not punished, because the person is the beater’s property.",
    manuscript: {
      tradition: "Masoretic Covenant Code, Exodus 21. Full diplomatic line should be bound to BHS; the property clause is the crux.",
      witnesses: [
        {
          label: "Exodus 21:21, property clause",
          lang: "he",
          dir: "rtl",
          text: "כי כספו הוא",
          literal: "for he is his silver / his money"
        }
      ]
    },
    kjv: "And if a man smite his servant, or his maid, with a rod, and he die under his hand; he shall be surely punished. Notwithstanding, if he continue a day or two, he shall not be punished: for he is his money.",
    modern: {
      niv: "NIV’s track uses “slave” or “servant” according to printing and keeps the property rationale. The punishment gap — death under the hand versus survival for a day — is the clause to compare, not a smoothed summary.",
      esv: "ESV renders the victim as the striker’s property (“his money” / “his property,” depending on the printing’s footnote). Record the noun the edition chose."
    },
    forensic: {
      serials: [
        "BHS Exodus 21:20–21",
        "Property clause: כי כספו הוא"
      ],
      critical: "Survival for a day or two cancels punishment because the enslaved person is reckoned as the striker’s silver. That is the clause.",
      body: "Later moral readings that start from a different law do not delete this one. Comparative ancient Near Eastern law codes can be set beside it only when the tablet and the paragraph number are bound. None is invented here."
    }
  },
  {
    tier: "standard",
    department: "Moral Defections",
    verse: "Deuteronomy 22:28–29",
    serialLabel: "Bound · fifty shekels",
    keywords: "deuteronomy marriage silver unbetrothed statute",
    summary: "The statute assigns fifty shekels to the woman’s father and a marriage that the man cannot end. The file records the legal clauses. It does not add an age the verse does not state.",
    manuscript: {
      tradition: "Masoretic Deuteronomy 22. Silver clause bound below; the divorce prohibition is continuous in the King James panel. Bind the full BHS consonants before a letter-by-letter edition.",
      witnesses: [
        {
          label: "Payment clause",
          lang: "he",
          dir: "rtl",
          text: "חמשים כסף",
          literal: "fifty of silver"
        }
      ]
    },
    kjv: "If a man find a damsel that is a virgin, which is not betrothed, and lay hold on her, and lie with her, and they be found; Then the man that lay with her shall give unto the damsel’s father fifty shekels of silver, and she shall be his wife; because he hath humbled her, he may not put her away all his days.",
    modern: {
      niv: "NIV keeps the payment and the marriage-without-divorce outcome. Compare any footnote that softens the force of the Hebrew verb. The outcome clauses are the track.",
      esv: "ESV likewise retains the fifty shekels paid to the father and the bar on divorce. The track is those two legal results."
    },
    forensic: {
      serials: [
        "BHS Deuteronomy 22:28–29",
        "Payment: חמשים כסף",
        "Middle Assyrian Laws comparison: unbound until a cited tablet paragraph is attached"
      ],
      critical: "The statute prices the act at fifty shekels paid to the father and then closes divorce. Later discomfort does not erase either clause.",
      body: "This dossier refuses two errors: pretending the verse is a modern consent statute, and inventing a victim’s age the Hebrew line does not fix. The words that are present are enough."
    }
  },
  {
    tier: "standard",
    department: "Moral Defections",
    verse: "1 Samuel 15:3",
    serialLabel: "Bound · herem of Amalek",
    keywords: "amalek herem samuel saul spare not",
    summary: "The command is herem against Amalek: do not spare. The King James object list includes men, women, infants, and animals. The file does not replace that list with a softer verb.",
    manuscript: {
      tradition: "Masoretic 1 Samuel 15. Opening clause bound here; the object list is carried in the public-domain English rather than a reconstructed consonantal string.",
      witnesses: [
        {
          label: "Opening command",
          lang: "he",
          dir: "rtl",
          text: "עתה לך והכיתה את עמלק",
          literal: "Now go and strike Amalek"
        }
      ]
    },
    kjv: "Now go and smite Amalek, and utterly destroy all that they have, and spare them not; but slay both man and woman, infant and suckling, ox and sheep, camel and ass.",
    modern: {
      niv: "NIV retains “totally destroy” / devote-to-destruction language and the full object list. A footnote may mention the ban (herem). The list is the track.",
      esv: "ESV uses “devote to destruction” and keeps infants and livestock in the command. The verb choice should be recorded; the objects should not be dropped in quotation."
    },
    forensic: {
      serials: [
        "BHS 1 Samuel 15:3",
        "Opening clause: עתה לך והכיתה את עמלק"
      ],
      critical: "The command, as written, includes infants and animals. Paraphrase that drops them is no longer this verse.",
      body: "Herem is a known ancient category. Naming the category does not shrink the objects. Saul’s later sparing of Agag and the flocks is a separate narrative beat; it does not rewrite verse 3."
    }
  },
  {
    tier: "standard",
    department: "Roman Politics",
    verse: "Revelation 13:18",
    serialLabel: "Bound · P.Oxy. 4499",
    keywords: "666 616 nero p115 ephraemi beast",
    summary: "Most witnesses number the beast 666. Codex Ephraemi and the published reading of P115 number it 616. Both figures have been tied to Nero, and neither tie is a mathematical proof.",
    manuscript: {
      tradition: "Greek Revelation. 666 is χξϛ (P47, Sinaiticus, Alexandrinus, and the mass of manuscripts). 616 is χιϛ in Codex Ephraemi (C). P.Oxy. 4499 (P115) was published as 616; the line is damaged and must be cited from Chapa’s edition, not from a slogan.",
      witnesses: [
        {
          label: "Majority numeral",
          lang: "grc",
          dir: "ltr",
          text: "χξϛ",
          literal: "666"
        },
        {
          label: "Minority numeral",
          lang: "grc",
          dir: "ltr",
          text: "χιϛ",
          literal: "616"
        }
      ]
    },
    kjv: "Here is wisdom. Let him that hath understanding count the number of the beast: for it is the number of a man; and his number is Six hundred threescore and six.",
    modern: {
      niv: "NIV prints 666 and footnotes manuscripts that read 616. The footnote is the entire track.",
      esv: "ESV prints 666 with a textual note on 616. Confirm that the note names manuscripts rather than only “some ancient authorities.”"
    },
    forensic: {
      serials: [
        "P115 — P.Oxy. 4499, Ashmolean Museum; ed. Juan Chapa, Oxyrhynchus Papyri LXVI",
        "Codex Ephraemi Rescriptus (C), Paris, Bibliothèque nationale",
        "Irenaeus, Against Heresies 5.30, who knows 616 and rejects it"
      ],
      critical: "616 is ancient, not a modern stunt. It is still the minority figure. P115’s digits are damaged and have to be read in the edition.",
      body: "Hebrew gematria for Neron Caesar (666) versus Nero Caesar (616) is a coherent explanation and not a demonstration. Irenaeus already treated 666 as original. The file keeps his preference and the manuscript that disagrees."
    }
  },
  {
    tier: "standard",
    department: "Scribal Revisions",
    verse: "Matthew 27:9–10",
    serialLabel: "Bound · Ἰερεμίου",
    keywords: "jeremiah zechariah thirty pieces potter field attribution",
    summary: "Matthew names Jeremiah. The thirty pieces of silver are Zechariah 11. A potter and a field also echo Jeremiah. A merged echo is not the same thing as an accurate citation.",
    manuscript: {
      tradition: "Greek Matthew. The attribution is explicit. Zechariah 11:12–13 supplies the silver. Jeremiah 19 and 32 supply potter and field motifs.",
      witnesses: [
        {
          label: "Matthew’s attribution",
          lang: "grc",
          dir: "ltr",
          text: "διὰ Ἰερεμίου τοῦ προφήτου",
          literal: "through Jeremiah the prophet"
        }
      ]
    },
    kjv: "Then was fulfilled that which was spoken by Jeremy the prophet, saying, And they took the thirty pieces of silver, the price of him that was valued, whom they of the children of Israel did value.",
    modern: {
      niv: "NIV keeps “Jeremiah” in the main text. Some printings footnote Zechariah. If the footnote is missing, the track is a silent attribution.",
      esv: "ESV keeps Jeremiah and notes the Zechariah parallel in study editions. Record whether the note is in the biblical text or only in a commentary layer."
    },
    forensic: {
      serials: [
        "NA28 Matthew 27:9",
        "Zechariah 11:12–13, BHS",
        "Jeremiah 19 and 32, BHS — thematic, not the silver formula"
      ],
      critical: "The spoken name is Jeremiah. The thirty pieces of silver are a Zechariah text. The citation as written does not match the book it names.",
      body: "Scribal repairs that change Matthew’s “Jeremiah” into “Zechariah” are themselves revisions, and they are late. The file cites the Gospel’s own word and the two prophetic passages. It does not pretend they are one quotation."
    }
  },
  {
    tier: "standard",
    department: "Primitive Science",
    verse: "Genesis 5:27",
    serialLabel: "Bound · WB 444",
    keywords: "methuselah 969 sumerian king list weld-blundell",
    summary: "Methuselah’s 969 years are the Masoretic figure. The Sumerian King List, on the Weld-Blundell Prism, gives antediluvian reigns that are also not biological ages. The comparison is of literary numbers, not of fossils.",
    manuscript: {
      tradition: "Masoretic Genesis 5. Production transcription should be taken from the Leningrad Codex facsimile. The number in this dossier is the King James figure, which matches the Masoretic total.",
      witnesses: [
        {
          label: "Name clause",
          lang: "he",
          dir: "rtl",
          text: "ויהיו כל ימי מתושלח",
          literal: "and all the days of Methuselah were"
        }
      ]
    },
    kjv: "And all the days of Methuselah were nine hundred sixty and nine years: and he died.",
    modern: {
      niv: "NIV prints 969. There is no textual track that turns the number into a modern lifespan. Footnotes, if any, are interpretive.",
      esv: "ESV prints 969. Same track: the figure is stable, and it is not a biological claim the translation can rescue."
    },
    forensic: {
      serials: [
        "BHS Genesis 5:27 — 969 years",
        "Weld-Blundell Prism, Sumerian King List — Ashmolean Museum WB 444",
        "Do not cite a reign from WB 444 without the line number in the edition"
      ],
      critical: "969 is a textual number. The prism’s reigns are textual numbers. Neither object is a skeleton of a man who lived a millennium.",
      body: "Septuagint and Samaritan Pentateuch shift some Genesis 5 totals. That versional file should be opened separately and bound to those editions. It will not make the figures into ordinary human ages."
    }
  },
  {
    tier: "standard",
    department: "Roman Politics",
    verse: "Acts 18:12–16",
    serialLabel: "Bound · Delphi, Gallio",
    keywords: "gallio proconsul achaia delphi claudius inscription",
    summary: "Acts places Paul before Gallio, proconsul of Achaia. A letter of Claudius inscribed at Delphi names Gallio and fixes that office in the early 50s. The inscription dates the office. It does not script the dialogue.",
    manuscript: {
      tradition: "Greek Acts. Historical receipt: the Gallio inscription from Delphi. Bind the exact SIG or Fouilles de Delphes number from the edition before citation in print.",
      witnesses: [
        {
          label: "Acts 18:12, office clause",
          lang: "grc",
          dir: "ltr",
          text: "Γαλλίωνος δὲ ἀνθυπάτου ὄντος τῆς Ἀχαΐας",
          literal: "while Gallio was proconsul of Achaia"
        }
      ]
    },
    kjv: "And when Gallio was the deputy of Achaia, the Jews made insurrection with one accord against Paul, and brought him to the judgment seat.",
    modern: {
      niv: "NIV uses “proconsul,” which is the Roman office, where the King James said “deputy.” That lexical update matches ἀνθύπατος. The date still comes from the inscription, not from the translation.",
      esv: "ESV also uses “proconsul.” Same track. A study note that mentions the Delphi letter should be checked against the Greek text of the inscription, not quoted as the inscription."
    },
    forensic: {
      serials: [
        "Gallio inscription, Delphi — letter of Claudius; bind SIG³ / FD inventory from the epigraphic edition",
        "NA28 Acts 18:12",
        "Office dated to about 51–52 CE by the imperial titulature on the stone"
      ],
      critical: "The stone dates Gallio’s proconsulship. It does not prove the speech in Acts 18. It does put the office in the early 50s.",
      body: "A forensic archive keeps receipts that anchor a narrative as carefully as receipts that collide with one. This file is an anchor, with the limit written on it."
    }
  },
  {
    tier: "standard",
    department: "Archaeology",
    verse: "Numbers 6:24–26",
    serialLabel: "Bound · Ketef Hinnom",
    keywords: "silver scrolls priestly blessing barkay ketef hinnom",
    summary: "Two silver amulets from a Jerusalem tomb carry the priestly blessing. They show the blessing was worn in the late monarchic period. They do not show a finished Pentateuch.",
    manuscript: {
      tradition: "Masoretic Numbers 6, compared with the Ketef Hinnom plaques excavated by Gabriel Barkay. Conventionally late seventh or early sixth century BCE; bind the locus publication before tightening the decade.",
      witnesses: [
        {
          label: "Numbers 6:24",
          lang: "he",
          dir: "rtl",
          text: "יברכך יהוה וישמרך",
          literal: "May YHWH bless you and keep you"
        }
      ]
    },
    kjv: "The LORD bless thee, and keep thee: The LORD make his face shine upon thee, and be gracious unto thee: The LORD lift up his countenance upon thee, and give thee peace.",
    modern: {
      niv: "NIV’s English blessing is stable. The track that matters is whether a footnote tells the reader the words exist on seventh-century silver. Most printings do not.",
      esv: "ESV likewise prints the blessing without the amulets. The archaeological receipt is not inside the translation."
    },
    forensic: {
      serials: [
        "Ketef Hinnom I–II — Israel Museum; excavator Gabriel Barkay",
        "BHS Numbers 6:24–26",
        "Date: bind Barkay’s locus, not a souvenir caption"
      ],
      critical: "The amulets quote the blessing. They are the oldest objects that do. They are not a bound copy of the Pentateuch.",
      body: "Over-claiming these scrolls into a complete Torah, or dismissing them because they are amulets, both ignore the object. The object is a worn text of this blessing."
    }
  },
  {
    tier: "standard",
    department: "Archaeology",
    verse: "2 Kings 3:4–5",
    serialLabel: "Bound · Louvre AO 5066",
    keywords: "mesha moabite stone chemosh KAI 181",
    summary: "The Mesha Stele names Mesha king of Moab, Omri, and Israel, and tells a victory 2 Kings 3 does not give him. The basalt is in the Louvre. The narratives are not the same story twice.",
    manuscript: {
      tradition: "Masoretic Kings beside the Moabite inscription. Script is Moabite, language close to Hebrew. Lines must be cited from a squeeze or from KAI 181, not from memory of a translation.",
      witnesses: [
        {
          label: "2 Kings 3:4, name clause",
          lang: "he",
          dir: "rtl",
          text: "מישע מלך מואב",
          literal: "Mesha king of Moab"
        }
      ]
    },
    kjv: "And Mesha king of Moab was a sheepmaster, and rendered unto the king of Israel an hundred thousand lambs, and an hundred thousand rams, with the wool. But it came to pass, when Ahab was dead, that the king of Moab rebelled against the king of Israel.",
    modern: {
      niv: "NIV keeps Mesha, the tribute, and the rebellion after Ahab. It does not summarize the stele. The track is the biblical side only.",
      esv: "ESV matches that narrative content. Comparison with Mesha’s own version belongs in this forensic panel, not in a translator’s footnote most readers never see."
    },
    forensic: {
      serials: [
        "Louvre AO 5066 — also MNB 752, MNB 752 BIS; catalogue KAI 181",
        "Findspot: Dhiban. Louvre, Sully wing",
        "Related fragments and squeezes: AO 2142, AO 5060, AO 5019, AO 5020"
      ],
      critical: "Mesha says he threw Israel off and restored Moabite territory. 2 Kings 3 does not award him that victory. Both texts exist. They disagree.",
      body: "The stele is genuine basalt with a 19th-century restoration history; cite the Louvre record and a modern epigraphic drawing together. Jordan has asked for the stone’s return. Custody is not the same question as authenticity."
    }
  },
  {
    tier: "standard",
    department: "Archaeology",
    verse: "Genesis 6:1–4",
    serialLabel: "Bound · phrase בני האלהים",
    keywords: "nephilim watchers enoch qumran sons of god",
    summary: "The Hebrew calls the fathers “sons of God” and the offspring Nephilim. Later Enoch literature builds a watcher story on this paragraph. Qumran preserves Aramaic Enoch; a fragment number still has to be bound from DJD.",
    manuscript: {
      tradition: "Masoretic Genesis 6. 1 Enoch is not a biblical manuscript. Aramaic Enoch copies from Qumran are the material bridge, once a plate number is attached.",
      witnesses: [
        {
          label: "Genesis 6:2, the two groups",
          lang: "he",
          dir: "rtl",
          text: "בני האלהים … בנות האדם",
          literal: "the sons of God … the daughters of humankind"
        }
      ]
    },
    kjv: "The sons of God saw the daughters of men that they were fair; and they took them wives of all which they chose. … There were giants in the earth in those days.",
    modern: {
      niv: "NIV often prints “sons of God” and footnotes alternatives such as “sons of the princes” or a human-line reading. “Nephilim” is usually retained rather than the King James “giants.” Check the footer.",
      esv: "ESV prints “sons of God” and “Nephilim,” with notes. The track is the refusal to hide the divine-sons phrase, plus the footnote that tries to humanize it."
    },
    forensic: {
      serials: [
        "BHS Genesis 6:1–4",
        "Qumran Aramaic Enoch — bind the DJD plate before naming a 4Q number in print",
        "Phrase: בני האלהים"
      ],
      critical: "The paragraph says sons of God took daughters of humankind and Nephilim were on the earth. A human-only reading is a later interpretation, and it should be labeled as one.",
      body: "Deuteronomy 32:8 is the companion file: the same “sons of God” wording has a Qumran receipt there. Genesis 6 still lacks a comparable Hebrew variant that deletes the phrase. The Enoch expansion is later literature, not the verse."
    }
  },
  {
    tier: "standard",
    department: "Scribal Revisions",
    verse: "1 Corinthians 14:34–35",
    serialLabel: "Bound · displacement note",
    keywords: "women silent western text interpolation paul",
    summary: "In a set of Western witnesses these two verses stand after 14:40 instead of after 14:33. The paragraph moved. That fact forces the interpolation hypothesis onto the table. It does not, alone, prove it.",
    manuscript: {
      tradition: "Greek 1 Corinthians. Displacement in part of the Western tradition. Bind the individual sigla from NA28 before a printed apparatus is copied into this file.",
      witnesses: [
        {
          label: "1 Corinthians 14:34, opening",
          lang: "grc",
          dir: "ltr",
          text: "Αἱ γυναῖκες ἐν ταῖς ἐκκλησίαις σιγάτωσαν",
          literal: "Let the women keep silent in the churches"
        }
      ]
    },
    kjv: "Let your women keep silence in the churches: for it is not permitted unto them to speak; but they are commanded to be under obedience, as also saith the law. And if they will learn any thing, let them ask their husbands at home: for it is a shame for women to speak in the church.",
    modern: {
      niv: "NIV prints the silence command in place. A textual footnote, when present, should mention manuscripts that locate the verses after 14:40. If the printing has no such note, the displacement is invisible to the reader.",
      esv: "ESV prints the verses in the traditional location. Study notes sometimes discuss interpolation. The biblical footnote and the study note are different layers; record which one you saw."
    },
    forensic: {
      serials: [
        "NA28 at 1 Corinthians 14:34–35 and 14:40",
        "Western displacement: sigla unbound in this milestone — attach the apparatus, do not recite it from memory"
      ],
      critical: "Some copies place the silence command after 14:40. The paragraph traveled. Travel is evidence of a seam, not yet a verdict of forgery.",
      body: "A file that calls the verses a proven interpolation without the sigla is ahead of its receipt. A file that refuses to mention the displacement is behind it. This one stops at the displacement."
    }
  },
  {
    tier: "standard",
    department: "Archaeology",
    verse: "Joshua 6:21 · Levantine aDNA",
    serialLabel: "Bound · papers, not a battle serial",
    keywords: "agranat-tamir feldman ashekelon canaanite ancient dna",
    summary: "Published genomes from the Bronze and Iron Age southern Levant show Canaanite-related continuity plus limited later admixture. They are not a serial number for anyone killed in Joshua 6.",
    manuscript: {
      tradition: "Masoretic Joshua 6:21 is a herem line. The genetic receipt is a pair of papers, cited by journal, not by a minted sample ID.",
      witnesses: [
        {
          label: "Herem verb",
          lang: "he",
          dir: "rtl",
          text: "ויחרימו",
          literal: "and they devoted to destruction"
        }
      ]
    },
    kjv: "And they utterly destroyed all that was in the city, both man and woman, young and old, and ox, and sheep, and ass, with the edge of the sword.",
    modern: {
      niv: "NIV keeps the total destruction of the city. No genomic footnote belongs in the translation, and none should be implied.",
      esv: "ESV uses devote-to-destruction language. Same limit: the translation is not a genetic paper."
    },
    forensic: {
      serials: [
        "Agranat-Tamir et al., “The Genomic History of the Bronze Age Southern Levant,” Cell 181 (2020)",
        "Feldman et al., “Ancient DNA sheds light on the genetic origins of early Iron Age Philistines,” Science Advances 5 (2019) — Ashkelon infants",
        "Sample IDs: use each paper’s supplement. Do not invent one here."
      ],
      critical: "These genomes do not timestamp Joshua 6. Treating a PCA plot as a body count is a misuse of the sample.",
      body: "What the papers support is population history: substantial continuity from Canaanite-related ancestry into later Levantine groups, and a detectable European-related pulse in early Iron Age Philistines at Ashkelon that later dilutes. A conquest narrative has to be argued from strata and texts. It is not a CSV of alleles."
    }
  },
  {
    tier: "standard",
    department: "Primitive Science",
    verse: "Genesis 1:2 · Rigveda 10.129.1",
    serialLabel: "Bound · comparative, IAST",
    keywords: "nasadiya sukta tohu bohu sanskrit creation",
    summary: "A comparative file, not a claim that Genesis quotes the Veda. Both openings talk about a state before differentiation. The Sanskrit here is the standard first pada in IAST, pending a bound metrical edition.",
    manuscript: {
      tradition: "Hebrew Genesis beside Rigveda 10.129. Bind the van Nooten–Holland metrical text before treating the IAST as a diplomatic copy. The pada itself is the received opening.",
      witnesses: [
        {
          label: "Rigveda 10.129.1, IAST",
          lang: "sa",
          dir: "ltr",
          text: "nāsad āsīn no sad āsīt tadānīm",
          literal: "There was not the non-existent, nor the existent, then"
        },
        {
          label: "Genesis 1:2, consonantal clause",
          lang: "he",
          dir: "rtl",
          text: "תהו ובהו",
          literal: "tohu and bohu — without form and void, in the King James gloss"
        }
      ]
    },
    kjv: "And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.",
    modern: {
      niv: "NIV’s short gloss for tohu vavohu is “formless and empty.” The track is that phrase, not a Vedic parallel the committee is not making.",
      esv: "ESV uses “without form and void,” close to the King James pair. Neither translation cites Rigveda 10.129. This file does, and labels the comparison as comparative."
    },
    forensic: {
      serials: [
        "BHS Genesis 1:2 — תהו ובהו and תהום",
        "Rigveda 10.129 — bind van Nooten–Holland or an equivalent metrical edition",
        "No museum tablet is shared by these two lines. Do not invent one."
      ],
      critical: "Parallel imagery is not descent. The receipt is lexical: each tradition has language for a pre-differentiated state, and the languages are not the same language.",
      body: "Genetics and archaeology do not enter this file. It is comparative linguistics with the limit written on the card. Promotion to a stronger claim needs a dated manuscript of the hymn and a stated direction of influence, which this dossier does not have."
    }
  }
];

const state = {
  dept: "all",
  sort: "id",
  query: "",
  boundOnly: false
};

let archive = [];
const byId = new Map();
let searchTimer = 0;

function buildScaffolds() {
  const buckets = Object.fromEntries(DEPARTMENTS.map((dept) => [dept, []]));

  RANGES.forEach(([book, chapter, start, end, dept]) => {
    const lens = CHAPTER_LENS[`${book} ${chapter}`];
    if (!lens) {
      throw new Error(`Missing chapter lens for ${book} ${chapter}`);
    }
    for (let verse = start; verse <= end; verse += 1) {
      buckets[dept].push({
        ref: `${book} ${chapter}:${verse}`,
        lens,
        dept
      });
    }
  });

  const scaffolds = [];
  DEPARTMENTS.forEach((dept) => {
    const pool = buckets[dept];
    const need = SCAFFOLD_QUOTA[dept];
    if (!pool || pool.length < need) {
      throw new Error(`${dept} has ${pool ? pool.length : 0} slots, needs ${need}`);
    }
    for (let i = 0; i < need; i += 1) {
      scaffolds.push(makeScaffold(pool[i], i));
    }
  });
  return scaffolds;
}

function makeScaffold(slot, index) {
  const book = slot.ref.split(" ")[0];
  const greek = GREEK_BOOKS.has(book);
  const edition = greek ? "NA28" : "BHS";
  const language = greek ? "Greek" : "Hebrew";
  const tails = [
    "Unbound slot, excluded from citation.",
    "Catalog serial not bound. Do not cite.",
    "Ingest record only. Promotion requires a real receipt."
  ];
  return {
    tier: "standard",
    status: "scaffold",
    department: slot.dept,
    verse: slot.ref,
    summary: `${slot.ref} under ${slot.dept}. Locus: ${slot.lens}. ${DEPT_QUESTION[slot.dept]} Working edition: ${edition}. ${tails[index % tails.length]}`,
    keywords: `${slot.lens} ${language} ${edition} unbound scaffold`,
    serialLabel: "Serial unbound",
    witnessLanguage: language,
    edition,
    lens: slot.lens,
    manuscript: null,
    kjv: "",
    modern: null,
    forensic: {
      serials: [],
      critical: "This slot has no catalog serial. It is not evidence.",
      body: `Promote ${slot.ref} by binding a diplomatic transcription, the public-domain King James clause, an NIV/ESV track, and a real serial. Inventing a museum number to fill the grid is a protocol breach.`
    }
  };
}

function finalize(list) {
  return list.map((file, index) => {
    const n = index + 1;
    const id = `SZ-${String(n).padStart(4, "0")}`;
    const status = file.status || "curated";
    const serials = (file.forensic && file.forensic.serials) || [];
    const blob = [
      id,
      file.department,
      file.verse,
      file.summary,
      file.keywords,
      file.serialLabel,
      file.tier,
      status,
      file.forensic && file.forensic.critical,
      serials.join(" ")
    ].join("\n").toLowerCase();
    return { ...file, n, id, status, blob };
  });
}

function assertCurated(file) {
  if (!file.verse || !file.summary || !file.department || !file.manuscript || !file.kjv || !file.modern || !file.forensic) {
    throw new Error(`Incomplete curated dossier: ${file.verse || "(missing verse)"}`);
  }
  if (!DEPARTMENTS.includes(file.department)) {
    throw new Error(`Unknown department on ${file.verse}`);
  }
}

function buildArchive() {
  CURATED.forEach(assertCurated);
  const files = finalize([...CURATED, ...buildScaffolds()]);
  if (files.length !== ARCHIVE_MILESTONE) {
    throw new Error(`Archive length ${files.length} !== ${ARCHIVE_MILESTONE}`);
  }
  const nuclear = files.filter((file) => file.tier === "nuclear").length;
  if (nuclear < 1) {
    throw new Error("Nuclear tier is empty");
  }
  return files;
}

function esc(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  }[ch]));
}

function paragraphs(text) {
  return String(text).split(/\n\n/).map((part) => `<p>${esc(part)}</p>`).join("");
}

function tabShell(uid, panels) {
  const tabs = TABS.map(([id, label], index) => {
    const selected = index === 0;
    return `<button class="tab" type="button" role="tab" id="${uid}-tab-${id}" data-tab="${id}" aria-selected="${selected ? "true" : "false"}" aria-controls="${uid}-panel-${id}" tabindex="${selected ? "0" : "-1"}">${esc(label)}</button>`;
  }).join("");
  const bodies = panels.map((panel, index) => {
    return `<div class="tab-panel" role="tabpanel" id="${uid}-panel-${panel.id}" data-panel="${panel.id}" aria-labelledby="${uid}-tab-${panel.id}"${index === 0 ? "" : " hidden"}>${panel.html}</div>`;
  }).join("");
  return `<div class="tab-list" role="tablist" aria-label="Dossier layers">${tabs}</div>${bodies}`;
}

function renderCuratedDetail(file, uid) {
  const witnesses = file.manuscript.witnesses.map((witness) => {
    const dir = witness.dir === "rtl" ? "rtl" : "ltr";
    return `<div class="witness-block"><p class="witness-label">${esc(witness.label)}</p><p class="witness" lang="${esc(witness.lang)}" dir="${dir}">${esc(witness.text)}</p><p class="literal"><strong>Literal.</strong> ${esc(witness.literal)}</p></div>`;
  }).join("");
  const serials = file.forensic.serials.length
    ? `<ul class="serials">${file.forensic.serials.map((serial) => `<li>${esc(serial)}</li>`).join("")}</ul>`
    : "<p>No serial is bound.</p>";
  return tabShell(uid, [
    {
      id: "manuscript",
      html: `<p class="panel-kicker">Witness</p><p>${esc(file.manuscript.tradition)}</p>${witnesses}`
    },
    {
      id: "kjv",
      html: `<p class="panel-kicker">King James Version (1611)</p><blockquote class="kjv">${esc(file.kjv)}</blockquote><p class="fine">${esc(KJV_NOTE)}</p>`
    },
    {
      id: "modern",
      html: `<h4>NIV track</h4><p>${esc(file.modern.niv)}</p><h4>ESV track</h4><p>${esc(file.modern.esv)}</p><p class="fine">${esc(MODERN_NOTE)}</p>`
    },
    {
      id: "forensic",
      html: `<p class="panel-kicker">Receipt</p>${serials}<p class="fact-critical"><span>Critical fact.</span> ${esc(file.forensic.critical)}</p>${paragraphs(file.forensic.body)}`
    }
  ]);
}

function renderScaffoldDetail(file, uid) {
  return tabShell(uid, [
    {
      id: "manuscript",
      html: `<p class="panel-kicker">Witness</p><p>Expected language for ${esc(file.verse)}: ${esc(file.witnessLanguage)}. Chapter locus: ${esc(file.lens)}.</p><p>No glyphs are fabricated in an unbound slot. A diplomatic transcription is attached only when the dossier is promoted.</p>`
    },
    {
      id: "kjv",
      html: `<p class="panel-kicker">King James Version (1611)</p><p>Public-domain text for ${esc(file.verse)} attaches at promotion. This panel is reserved so the 1611 layer has a stable place in every card.</p><p class="fine">${esc(KJV_NOTE)}</p>`
    },
    {
      id: "modern",
      html: `<h4>NIV track</h4><p>Not written. On promotion, name the reading, the footnote, and the base text (${esc(file.edition)} or a stated versional departure).</p><h4>ESV track</h4><p>Not written. Same rule. Full modern verses are not stored.</p><p class="fine">${esc(MODERN_NOTE)}</p>`
    },
    {
      id: "forensic",
      html: `<p class="panel-kicker">Receipt</p><p class="fact-critical"><span>Critical fact.</span> ${esc(file.forensic.critical)}</p>${paragraphs(file.forensic.body)}<p>Working edition named for the slot: ${esc(file.edition)}.</p>`
    }
  ]);
}

function renderDetail(file, uid) {
  return file.status === "scaffold"
    ? renderScaffoldDetail(file, uid)
    : renderCuratedDetail(file, uid);
}

function renderCard(file, region) {
  const article = document.createElement("article");
  article.className = `file-card${file.tier === "nuclear" ? " file-card--nuclear" : ""}`;
  article.dataset.id = file.id;
  article.dataset.department = file.department;
  const uid = `${region}-${file.id}`;
  const detailId = `${uid}-detail`;
  const tier = file.tier === "nuclear" ? `<span class="tier-tag">Nuclear tier</span>` : "";
  const statusClass = file.status === "curated" ? "status-tag--bound" : "status-tag--unbound";
  const statusLabel = file.status === "curated" ? "Bound" : "Unbound";
  article.innerHTML = `
    <div class="tag-row">
      <p class="file-id">${esc(file.id)}</p>
      ${tier}
      <span class="dept-tag">${esc(file.department)}</span>
      <span class="status-tag ${statusClass}">${statusLabel}</span>
    </div>
    <h3>${esc(file.verse)}</h3>
    <p class="summary">${esc(file.summary)}</p>
    <p class="serial-line">${esc(file.serialLabel)}</p>
    <button class="expand" type="button" aria-expanded="false" aria-controls="${detailId}">Open dossier</button>
    <div class="detail" id="${detailId}" hidden></div>
  `;
  return article;
}

function compareFiles(a, b) {
  if (state.sort === "department") {
    const dept = a.department.localeCompare(b.department) || a.id.localeCompare(b.id);
    return dept;
  }
  if (state.sort === "verse") {
    return a.verse.localeCompare(b.verse) || a.id.localeCompare(b.id);
  }
  if (state.sort === "tier") {
    if (a.tier !== b.tier) return a.tier === "nuclear" ? -1 : 1;
    return a.id.localeCompare(b.id);
  }
  return a.id.localeCompare(b.id);
}

function matches(file) {
  if (state.boundOnly && file.status !== "curated") return false;
  if (state.dept !== "all" && file.department !== state.dept) return false;
  if (state.query && !file.blob.includes(state.query)) return false;
  return true;
}

function sortContainer(container) {
  const cards = [...container.querySelectorAll(".file-card")];
  cards.sort((a, b) => compareFiles(byId.get(a.dataset.id), byId.get(b.dataset.id)));
  const fragment = document.createDocumentFragment();
  cards.forEach((card) => fragment.appendChild(card));
  container.appendChild(fragment);
}

function applyVisibility() {
  const feed = document.getElementById("feed-grid");
  const nuclear = document.getElementById("nuclear-grid");
  let shown = 0;
  feed.querySelectorAll(".file-card").forEach((card) => {
    const ok = matches(byId.get(card.dataset.id));
    card.classList.toggle("is-hidden", !ok);
    if (ok) shown += 1;
  });
  let nuclearShown = 0;
  nuclear.querySelectorAll(".file-card").forEach((card) => {
    const ok = matches(byId.get(card.dataset.id));
    card.classList.toggle("is-hidden", !ok);
    if (ok) nuclearShown += 1;
  });
  document.getElementById("nuclear").hidden = nuclearShown === 0;
  document.getElementById("empty-state").hidden = shown !== 0;
  document.getElementById("result-count").textContent = `${shown} shown · ${ARCHIVE_MILESTONE} indexed`;
}

function renderChips() {
  const host = document.getElementById("dept-filters");
  const buttons = ["All", ...DEPARTMENTS].map((name) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "chip";
    button.textContent = name === "All" ? "All" : name;
    button.dataset.dept = name === "All" ? "all" : name;
    button.setAttribute("aria-pressed", name === "All" ? "true" : "false");
    return button;
  });
  host.replaceChildren(...buttons);
}

function renderArchive(files) {
  const feed = document.createDocumentFragment();
  const nuclear = document.createDocumentFragment();
  files.forEach((file) => {
    feed.appendChild(renderCard(file, "feed"));
    if (file.tier === "nuclear") nuclear.appendChild(renderCard(file, "nuclear"));
  });
  document.getElementById("feed-grid").replaceChildren(feed);
  document.getElementById("nuclear-grid").replaceChildren(nuclear);
  applyVisibility();
}

function toggleCard(button) {
  const card = button.closest(".file-card");
  const detail = card.querySelector(".detail");
  const open = button.getAttribute("aria-expanded") === "true";
  if (open) {
    button.setAttribute("aria-expanded", "false");
    button.textContent = "Open dossier";
    detail.hidden = true;
    return;
  }
  if (!detail.dataset.ready) {
    const file = byId.get(card.dataset.id);
    detail.innerHTML = renderDetail(file, detail.id.replace(/-detail$/, ""));
    detail.dataset.ready = "1";
  }
  button.setAttribute("aria-expanded", "true");
  button.textContent = "Close dossier";
  detail.hidden = false;
}

function switchTab(button) {
  const card = button.closest(".file-card");
  const name = button.dataset.tab;
  card.querySelectorAll("[data-tab]").forEach((tab) => {
    const on = tab === button;
    tab.setAttribute("aria-selected", on ? "true" : "false");
    tab.tabIndex = on ? 0 : -1;
  });
  card.querySelectorAll("[data-panel]").forEach((panel) => {
    panel.hidden = panel.dataset.panel !== name;
  });
}

function moveTab(current, key) {
  const tabs = [...current.closest(".tab-list").querySelectorAll("[data-tab]")];
  const index = tabs.indexOf(current);
  let next = index;
  if (key === "ArrowRight") next = (index + 1) % tabs.length;
  if (key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
  if (key === "Home") next = 0;
  if (key === "End") next = tabs.length - 1;
  if (next === index) return;
  switchTab(tabs[next]);
  tabs[next].focus();
}

function openFromHash() {
  const id = decodeURIComponent(location.hash.replace("#", "")).toUpperCase();
  if (!/^SZ-\d{4}$/.test(id) || !byId.has(id)) return;
  const card = document.querySelector(`#feed-grid .file-card[data-id="${id}"]`);
  if (!card) return;
  const button = card.querySelector(".expand");
  if (button.getAttribute("aria-expanded") !== "true") toggleCard(button);
  card.scrollIntoView({ block: "start" });
}

function bind() {
  document.getElementById("dept-filters").addEventListener("click", (event) => {
    const button = event.target.closest(".chip");
    if (!button) return;
    state.dept = button.dataset.dept;
    document.querySelectorAll("#dept-filters .chip").forEach((chip) => {
      chip.setAttribute("aria-pressed", chip === button ? "true" : "false");
    });
    applyVisibility();
  });

  document.getElementById("q").addEventListener("input", (event) => {
    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(() => {
      state.query = event.target.value.trim().toLowerCase();
      applyVisibility();
    }, 60);
  });

  document.getElementById("sort").addEventListener("change", (event) => {
    state.sort = event.target.value;
    sortContainer(document.getElementById("feed-grid"));
    sortContainer(document.getElementById("nuclear-grid"));
    applyVisibility();
  });

  document.getElementById("bound-only").addEventListener("change", (event) => {
    state.boundOnly = event.target.checked;
    applyVisibility();
  });

  document.getElementById("archive").addEventListener("click", (event) => {
    const tab = event.target.closest("[data-tab]");
    if (tab) {
      switchTab(tab);
      return;
    }
    const button = event.target.closest(".expand");
    if (button) toggleCard(button);
  });

  document.getElementById("archive").addEventListener("keydown", (event) => {
    if (!event.target.closest("[data-tab]")) return;
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    moveTab(event.target, event.key);
  });
}

function init() {
  const milestone = document.getElementById("milestone-count");
  const footer = document.getElementById("footer-meta");
  try {
    archive = buildArchive();
    byId.clear();
    archive.forEach((file) => byId.set(file.id, file));
    if (milestone) milestone.textContent = String(ARCHIVE_MILESTONE);
    const bound = archive.filter((file) => file.status === "curated").length;
    if (footer) {
      footer.textContent = `${archive.length} files indexed · ${bound} bound · schema ${SCHEMA_VERSION}`;
    }
    renderChips();
    renderArchive(archive);
    bind();
    openFromHash();
  } catch (error) {
    const feed = document.getElementById("feed-grid");
    if (feed) feed.textContent = `Archive failed to build: ${error.message}`;
    if (footer) footer.textContent = "Catalog failed.";
  }
}

if (typeof document === "undefined") {
  const built = buildArchive();
  const counts = Object.fromEntries(DEPARTMENTS.map((dept) => [dept, 0]));
  built.forEach((file) => {
    counts[file.department] += 1;
  });
  console.log(JSON.stringify({
    ok: built.length === ARCHIVE_MILESTONE,
    length: built.length,
    bound: built.filter((file) => file.status === "curated").length,
    nuclear: built.filter((file) => file.tier === "nuclear").length,
    counts
  }));
} else {
  init();
}
