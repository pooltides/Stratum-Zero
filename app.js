/* Stratum Zero catalog — schema 1.1
   350 files, AUDIT-001 through AUDIT-350.
   status "forensic" = 8 nuclear targets (IDs fixed below).
   status "bound" = 16 further dossiers with real sigla. Together these 24 are the bound set.
   status "scaffold" = the other 326. Their sigla array is a warning, not a serial.
   Detail HTML is built only when a card is opened.

   PAYLOAD PAST 350
   Raise ARCHIVE_MILESTONE, or replace buildArchive() with fetch("/data/archive.json")
   of the same shape. Do not mint museum numbers. Leave status "scaffold" until
   sigla names a real object. Keep renderDetail() lazy. Do not store full NIV,
   ESV, or NASB verses; those translations are copyrighted.
*/

const SCHEMA_VERSION = "1.1";
const ARCHIVE_MILESTONE = 350;

const DEPARTMENTS = [
  "Archaeology",
  "Scribal Revisions",
  "Roman Politics",
  "Primitive Science",
  "Moral Defections"
];

const KJV_NOTE = "Public-domain King James text in the 1769 spelling of the 1611 translation.";
const MODERN_NOTE = "NASB (Lockman), NIV (Biblica), and ESV (Crossway) are copyrighted. This panel tracks the reading, the footnote, and the base text. It does not store the full modern line.";
const UNBOUND_SIGLUM = "Unbound. This file is excluded from peer-review tracking until a real museum receipt is linked. No catalog number is assigned.";

const TABS = [
  ["manuscript", "Manuscript Layer"],
  ["kjv", "KJV"],
  ["modern", "Modern"],
  ["forensic", "Forensic Note"]
];

const GREEK_BOOKS = new Set(["Matthew", "Mark", "Luke", "John", "Acts", "Romans", "Revelation"]);

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
  "Genesis 1": "light, raqia, luminaries, and the seven-day frame",
  "Genesis 2": "order of water, soil, plants, animals, and the human pair beside Genesis 1",
  "Job 38": "storehouses, the sea's limit, and the ancient sky",
  "Genesis 6": "sons of God, Nephilim, and flood parallels",
  "Genesis 11": "city, tower, and linguistic scattering",
  "Exodus 14": "yam suf, the east wind, and the crossing",
  "Deuteronomy 32": "Song of Moses and the divine-council split",
  "Psalm 22": "English numbering; the hands-and-feet crux is English 22:16 / Hebrew 22:17",
  "Isaiah 7": "almah and the Immanuel sign",
  "John 1": "Logos prologue in the early papyri",
  "Matthew 2": "Herod and the infancy chronology",
  "Luke 2": "census and Quirinius",
  "Mark 15": "Pilate, the titulus, and Roman execution",
  "Revelation 13": "616 and 666",
  "Exodus 21": "injury law and the slave statutes",
  "Numbers 31": "war statute and spoil census",
  "Deuteronomy 20": "siege rules and exemptions"
};

function w(label, lang, dir, text, literal) {
  return { label, lang, dir, text, literal };
}

/* Eight nuclear targets. IDs, verses, departments, and assigned labels match the brief.
   Forensic bodies correct a label when the object is a different text. */
const NUCLEAR = {
  1: {
    verse: "Joshua 6:20",
    department: "Archaeology",
    serialLabel: "Tell es-Sultan Stratum VII",
    keywords: "jericho kenyon city iv tell es-sultan wall",
    summary: "The wall collapse is claimed at Tell es-Sultan. Kenyon's published burn of the Middle Bronze fortifications is City IV, about 1550 BCE. Her reports do not name that phase Stratum VII.",
    manuscript: {
      tradition: "Masoretic Joshua. The archaeological receipt is the tell and Kenyon's published phase, not a souvenir number.",
      witnesses: [w("Joshua 6:20, collapse clause", "he", "rtl", "ותפל החומה תחתיה", "and the wall fell down in its place")]
    },
    kjv: "So the people shouted when the priests blew with the trumpets: and it came to pass, when the people heard the sound of the trumpet, and the people shouted with a great shout, that the wall fell down flat, so that the people went up into the city, every man straight before him, and they took the city.",
    modern: {
      nasb: "NASB narrates the wall falling in place. It does not footnote Kenyon's phase. The track is narrative English, not stratigraphy.",
      niv: "NIV likewise narrates the fall. No stratum number appears in the translation footnote.",
      esv: "ESV keeps the narrative. The collision with the dig is in this forensic panel, not in the English verb."
    },
    forensic: {
      sigla: [
        "Tell es-Sultan (Jericho)",
        "Kenyon, City IV destruction, end of Middle Bronze, circa 1550 BCE",
        "Assigned label on this card: Tell es-Sultan Stratum VII"
      ],
      critical: "Kenyon published that destruction as City IV, not as Stratum VII. The roman numeral is not her receipt. The site and her phase are.",
      body: "Bryant Wood's Late Bronze re-reading is published dissent. It does not rename her sections. A file that cites Stratum VII without an excavator's sequence is ahead of the report."
    }
  },
  32: {
    verse: "John 7:53–8:11",
    department: "Scribal Revisions",
    serialLabel: "P.Oxy. 4499 / P66",
    keywords: "pericope adulterae p66 p75 p115 oxyrhynchus bodmer",
    summary: "The pericope is missing from this place in P66, P75, Sinaiticus, and Vaticanus. P.Oxy. 4499 is not a John manuscript. It is P115, a Revelation papyrus.",
    manuscript: {
      tradition: "Greek John. Absence at this location in P66, P75, 01, and 03. Later Byzantine copies include the block.",
      witnesses: [w("Later Greek opening, John 8:1", "grc", "ltr", "Ἰησοῦς δὲ ἐπορεύθη εἰς τὸ ὄρος τῶν ἐλαιῶν", "And Jesus went to the Mount of Olives")]
    },
    kjv: "The King James Version prints the passage here in full, from “And every man went unto his own house” through “He that is without sin among you, let him first cast a stone at her,” and on to 8:11. That English is public domain. The forensic issue is which Greek copies contain it.",
    modern: {
      nasb: "NASB prints the passage with a textual note that the earliest manuscripts omit it. Record whether the printing uses brackets.",
      niv: "NIV sets 7:53–8:11 off with the same kind of note and still prints the story.",
      esv: "ESV prints it with a textual note of omission in the earliest manuscripts. The note is the track."
    },
    forensic: {
      sigla: [
        "P66 — Bodmer Papyrus II (omits the pericope here)",
        "P75 — Vatican Library; Codex Sinaiticus Add MS 43725; Codex Vaticanus Vat.gr.1209",
        "P.Oxy. 4499 — Ashmolean, papyrus P115 of Revelation, not of John"
      ],
      critical: "P.Oxy. 4499 does not witness this passage. P66 does, by lacking it. Treating the Oxyrhynchus Revelation papyrus as a John receipt is a wrong crosswalk.",
      body: "Whether the story circulated apart from this spot in John is a separate question and needs its own witnesses. This file records the copies of John."
    }
  },
  43: {
    verse: "Isaiah 7:14",
    department: "Scribal Revisions",
    serialLabel: "1QIsa-a (Great Isaiah Scroll)",
    keywords: "almah parthenos virgin 1QIsaa great isaiah scroll",
    summary: "The Hebrew noun is almah. The Great Isaiah Scroll agrees. Virgin is the Greek parthenos that Matthew quotes. The King James line follows the Greek.",
    manuscript: {
      tradition: "Masoretic Text and 1QIsaᵃ. Septuagint lemma παρθένος. Matthew 1:23 quotes the Greek.",
      witnesses: [
        w("Isaiah 7:14, consonantal clause", "he", "rtl", "הנה העלמה הרה וילדת בן", "Behold, the young woman is pregnant and bearing a son"),
        w("Septuagint lemma", "grc", "ltr", "παρθένος", "virgin — the word Matthew 1:23 takes up")
      ]
    },
    kjv: "Therefore the Lord himself shall give you a sign; Behold, a virgin shall conceive, and bear a son, and shall call his name Immanuel.",
    modern: {
      nasb: "NASB prints a virgin reading in Isaiah 7:14 and footnotes an alternate such as maiden. Confirm the edition. The footnote is the Hebrew noun.",
      niv: "NIV prints “virgin” and footnotes “Or young woman.” A further note records a Dead Sea Scrolls variation on who names the child.",
      esv: "ESV keeps a virgin reading and carries an alternate in the footnote. Matthew quotes the Greek, not the Hebrew noun almah."
    },
    forensic: {
      sigla: [
        "1QIsaᵃ, Great Isaiah Scroll — Shrine of the Book, Israel Museum",
        "BHS Isaiah 7:14",
        "Greek Isaiah and Matthew 1:23"
      ],
      critical: "The Hebrew word in this line is almah, not betulah. 1QIsaᵃ does not turn it into parthenos.",
      body: "Betulah is the clearer Hebrew term where virginity is the point. Almah names a young woman of marriageable age. An English main text can choose the Greek. It cannot claim the Hebrew noun already said it."
    }
  },
  44: {
    verse: "Luke 2:1–2",
    department: "Roman Politics",
    serialLabel: "Roman Provincial Inscriptions",
    keywords: "quirinius census herod josephus cyrenius",
    summary: "Luke dates the birth registration to Quirinius, governing Syria. Josephus dates Quirinius's Judean census to 6 CE, after Herod's death near 4 BCE. No provincial inscription in this file puts Quirinius in Herod's reign.",
    manuscript: {
      tradition: "Greek Luke. The name is Κυρήνιος, Latin Quirinius, King James Cyrenius. Historical anchor: Josephus, Jewish Antiquities 18.1–2.",
      witnesses: [w("Luke 2:2", "grc", "ltr", "ἡγεμονεύοντος τῆς Συρίας Κυρηνίου", "while Quirinius was governing Syria")]
    },
    kjv: "And it came to pass in those days, that there went out a decree from Caesar Augustus, that all the world should be taxed. (And this taxing was first made when Cyrenius was governor of Syria.)",
    modern: {
      nasb: "NASB renders the census under Quirinius. Do not assume the footnote dates it to 6 CE. Silence on Josephus is part of the track.",
      niv: "NIV uses Quirinius and keeps the registration. The wording is stable. The collision is the date.",
      esv: "ESV likewise keeps Quirinius as governor. Same track."
    },
    forensic: {
      sigla: [
        "Josephus, Jewish Antiquities 18.1–2 — census of 6 CE",
        "NA28 Luke 2:1–2",
        "Roman provincial inscriptions naming Quirinius under Herod: none bound in this file"
      ],
      critical: "A census under Quirinius in 6 CE is not a birth under Herod. No inscription in this dossier closes that gap.",
      body: "An earlier posting for Quirinius becomes evidence when a dated edict is on the table. The class label “Roman Provincial Inscriptions” is not itself an object."
    }
  },
  52: {
    verse: "1 John 5:7–8",
    department: "Scribal Revisions",
    serialLabel: "Codex Vaticanus",
    keywords: "comma johanneum vaticanus vat.gr.1209 erasmus",
    summary: "Codex Vaticanus does not contain the heavenly witnesses. The Father, the Word, and the Holy Spirit in the King James verse are absent from Greek copies of the first millennium.",
    manuscript: {
      tradition: "Greek epistle. Vaticanus (GA 03) has the earthly trio. The heavenly trio enters Greek late, notably in GA 61, shown to Erasmus.",
      witnesses: [
        w("Early Greek trio", "grc", "ltr", "τὸ πνεῦμα καὶ τὸ ὕδωρ καὶ τὸ αἷμα", "the Spirit, and the water, and the blood"),
        w("Late comma, not in Vaticanus", "grc", "ltr", "ὁ πατὴρ, ὁ λόγος, καὶ τὸ ἅγιον πνεῦμα", "the Father, the Word, and the Holy Spirit")
      ]
    },
    kjv: "For there are three that bear record in heaven, the Father, the Word, and the Holy Ghost: and these three are one. And there are three that bear witness in earth, the Spirit, and the water, and the blood: and these three agree in one.",
    modern: {
      nasb: "NASB omits the heavenly witnesses from the main text and notes the late addition. Vaticanus is among the witnesses for the shorter text.",
      niv: "NIV omits the comma and footnotes the late manuscripts that add it.",
      esv: "ESV omits it from the main text and notes the addition. The track is an omission with a manuscript footnote."
    },
    forensic: {
      sigla: [
        "Codex Vaticanus — Vatican Library, Vat.gr.1209 (GA 03)",
        "GA 61, Codex Montfortianus, and Erasmus's 1522 edition for the late Greek comma",
        "NA28 at 1 John 5:7–8"
      ],
      critical: "Vaticanus is a receipt for the absence of the heavenly witnesses, not for their presence. No Greek manuscript from the first millennium contains them.",
      body: "The Trinity is argued from other texts. This file is only the clause. The King James verse depends on a late, Latin-influenced Greek line."
    }
  },
  62: {
    verse: "Genesis 1:6–8",
    department: "Primitive Science",
    serialLabel: "Louvre AO 5066 (Babylonian Map)",
    keywords: "raqia firmament stereoma ao 5066 bm 92687 mesha",
    summary: "The Hebrew noun is raqia. The Septuagint calls it a stereoma, a solid thing, with water above it. Louvre AO 5066 is not a Babylonian map. It is the Mesha Stele. The map of the world is British Museum 92687.",
    manuscript: {
      tradition: "Masoretic Genesis. Septuagint στερέωμα. Enuma Elish is a thematic parallel; bind the tablet from Lambert, Babylonian Creation Myths (2013).",
      witnesses: [
        w("Genesis 1:6", "he", "rtl", "יהי רקיע בתוך המים", "Let there be a raqia in the midst of the waters"),
        w("Septuagint lemma", "grc", "ltr", "στερέωμα", "a solid body; the Greek behind Latin firmamentum")
      ]
    },
    kjv: "And God said, Let there be a firmament in the midst of the waters, and let it divide the waters from the waters. And God made the firmament, and divided the waters which were under the firmament from the waters which were above the firmament: and it was so. And God called the firmament Heaven.",
    modern: {
      nasb: "NASB uses “expanse” and footnotes “firmament” in standard editions. Confirm the printing. The water above the structure remains in the verse.",
      niv: "NIV 2011 uses “vault” for raqia in Genesis 1:6. Check the footnote before quoting an alternate such as expanse.",
      esv: "ESV uses “expanse” and footnotes “Or a canopy” at Genesis 1:6. It does not put firmament in that footnote."
    },
    forensic: {
      sigla: [
        "BHS Genesis 1:6–8 — רקיע",
        "Septuagint στερέωμα",
        "Louvre AO 5066 — Mesha Stele, KAI 181, not a map",
        "British Museum 92687 — Babylonian Map of the World"
      ],
      critical: "AO 5066 is the Mesha Stele. Calling it a Babylonian map assigns the wrong object. BM 92687 is the map, and it is not a manuscript of Genesis.",
      body: "The lexical receipt is the Hebrew noun, the Greek stereoma, and the water the verse places above heaven. Job 37:18 and Ezekiel 1:22 belong in the same file: the raqia is compared to cast metal."
    }
  },
  98: {
    verse: "Deuteronomy 32:8",
    department: "Moral Defections",
    serialLabel: "4Q37 (4QDeut-j)",
    keywords: "4Q37 sons of god divine council qumran deut 32:8",
    summary: "The Masoretic Text ends the verse with the sons of Israel. Qumran manuscript 4Q37 and the Septuagint do not. The receipt is the fragment. The filing department does not change the reading.",
    manuscript: {
      tradition: "Masoretic Text against 4QDeutj (4Q37), DJD XIV. Greek witnesses read angels or sons of God, not Israel.",
      witnesses: [
        w("Masoretic clause", "he", "rtl", "למספר בני ישראל", "according to the number of the sons of Israel"),
        w("4Q37 clause", "he", "rtl", "למספר בני אלהים", "according to the number of the sons of God")
      ]
    },
    kjv: "When the most High divided to the nations their inheritance, when he separated the sons of Adam, he set the bounds of the people according to the number of the children of Israel.",
    modern: {
      nasb: "Where NASB still prints sons or children of Israel, it follows the medieval Masoretic Text. Bind the edition. The track is which base text was kept.",
      niv: "NIV printings that read Israel are on the Masoretic side of the split. Printings that move to heavenly beings have changed the base. Record which one you hold.",
      esv: "ESV-tradition editions have moved to a divine-sons reading and footnoted Masoretic sons of Israel. Confirm the printing."
    },
    forensic: {
      sigla: [
        "4Q37 (4QDeutj), Qumran Cave 4 — DJD XIV",
        "Leningrad Codex via BHS",
        "Rahlfs–Hanhart at Deuteronomy 32:8"
      ],
      critical: "4Q37 does not read sons of Israel. A note that treats the Masoretic clause as the only ancient Hebrew wording is ignoring the fragment.",
      body: "This file does not reconstruct a moral system from one line. It forces the later Hebrew reading to answer Cave 4 and a Greek tradition that never had Israel in the clause."
    }
  },
  130: {
    verse: "Mark 16:9–20",
    department: "Roman Politics",
    serialLabel: "Add MS 43725 (Codex Sinaiticus)",
    keywords: "longer ending sinaiticus vaticanus mark 16 irenaeus second century not a late medieval insertion",
    summary: "Codex Sinaiticus ends Mark at “for they were afraid.” So does Codex Vaticanus. The twelve verses that follow in the King James Version are absent from both fourth-century Bibles, which stop at 16:8. The ending was already known in the late 2nd century CE: Irenaeus cites it in Against Heresies 3.10.5. It is not a late medieval insertion. The timeline is CE. The department label does not add a Roman edict.",
    manuscript: {
      tradition: "Greek New Testament. Mark 16:9–20 is absent from 01 (Sinaiticus) and 03 (Vaticanus). Irenaeus cites Mark 16:19 in the late second century CE (Against Heresies 3.10.5). That is second-century reception, not a second-century BCE text, and it is not a late medieval insertion. A shorter intermediate ending exists in a minority of witnesses; bind those sigla from NA28 before listing them.",
      witnesses: [w("Mark 16:8 in 01 and 03", "grc", "ltr", "ἐφοβοῦντο γάρ", "for they were afraid")]
    },
    kjv: "And they went out quickly, and fled from the sepulchre; for they trembled and were amazed: neither said they any thing to any man; for they were afraid. The King James text then continues. Verse 9 opens: “Now when Jesus was risen early the first day of the week, he appeared first to Mary Magdalene, out of whom he had cast seven devils.” Verses 19–20 close with the ascension. Verses 10–18 are the same public-domain longer ending.",
    modern: {
      nasb: "NASB keeps 16:9–20 and attaches a note that the earliest manuscripts end at 16:8. Record brackets if the printing uses them.",
      niv: "NIV keeps the longer ending in the chapter with a textual note that the earliest manuscripts end at 16:8.",
      esv: "ESV prints the longer ending with the same class of note. The note is the track."
    },
    forensic: {
      sigla: [
        "Codex Sinaiticus — British Library Add MS 43725 (GA 01)",
        "Codex Vaticanus — Vat.gr.1209 (GA 03)",
        "NA28 apparatus at Mark 16:8"
      ],
      critical: "Sinaiticus and Vaticanus stop Mark at 16:8. The King James ending is not in those two fourth-century Bibles. Irenaeus already cites the ending in the late 2nd century CE, in Against Heresies 3.10.5. It is not a late medieval insertion. No Roman inscription is bound to these twelve verses.",
      body: "Absence decides what those two manuscripts contain. It does not decide what happened on the first day of the week, and it does not date every other copy to the Middle Ages. Irenaeus, writing in the late second century CE, treats the ascension sentence as Mark's closing. Later copies and the King James tradition preserve the longer ending as scripture. The file keeps the manuscript gap and the second-century citation together."
    }
  }
};

const BOUND = {
  19: {
    verse: "2 Samuel 21:19",
    department: "Scribal Revisions",
    serialLabel: "Aleppo Codex",
    keywords: "elhanan goliath aleppo codex chronicles lahmi",
    summary: "The Masoretic text of Samuel has Elhanan strike Goliath. Chronicles has Elhanan strike Lahmi, the brother of Goliath. The King James Samuel line supplies “the brother of” in italic type. The Aleppo Codex is the Masoretic witness for the Former Prophets.",
    manuscript: {
      tradition: "Masoretic 2 Samuel against 1 Chronicles 20:5. Aleppo Codex (Keter Aram Tzova), Israel Museum. Bind the surviving folio before a letter-by-letter claim.",
      witnesses: [
        w("Samuel, the object", "he", "rtl", "את גלית הגתי", "Goliath the Gittite"),
        w("Chronicles, the object", "he", "rtl", "את לחמי אחי גלית", "Lahmi, the brother of Goliath")
      ]
    },
    kjv: "And there was again a battle in Gob with the Philistines, where Elhanan the son of Jaareoregim, a Bethlehemite, slew the brother of Goliath the Gittite, the staff of whose spear was like a weaver's beam. In printings that mark supplied words, “the brother of” is italic. It is not in the Hebrew of Samuel.",
    modern: {
      nasb: "NASB of Samuel follows the Hebrew name Goliath and footnotes the Chronicles parallel and the King James supplied words. Confirm the footer.",
      niv: "NIV Samuel identifies the slain man as Goliath and footnotes Chronicles, where the name is Lahmi his brother.",
      esv: "ESV keeps Goliath in Samuel and points the reader to 1 Chronicles 20:5. The footnote is the whole track."
    },
    forensic: {
      sigla: ["Aleppo Codex, Israel Museum — Former Prophets", "BHS 2 Samuel 21:19 and 1 Chronicles 20:5"],
      critical: "Samuel's Hebrew does not say “the brother of.” Chronicles does, and it also names Lahmi. The King James italic words import the Chronicles fix into Samuel.",
      body: "The Aleppo Codex is a 10th-century Masoretic witness, damaged and incomplete. It does not invent the split. The split is already between the two biblical books."
    }
  },
  20: {
    verse: "Exodus 2:3",
    department: "Archaeology",
    serialLabel: "BM ME K.3401",
    keywords: "sargon basket bitumen nineveh K.3401 moses",
    summary: "Exodus puts the child in a reed container sealed with bitumen and sets it in the river. British Museum ME K.3401, from Ashurbanipal's library at Nineveh, tells that story of Sargon. It is a parallel legend, not a copy of Exodus.",
    manuscript: {
      tradition: "Masoretic Exodus 2:3 beside the Neo-Assyrian Sargon birth legend. The tablet is 7th century BCE. The legend's king is much older. Direction of dependence is not decided by the object.",
      witnesses: [w("Exodus 2:3, the container", "he", "rtl", "תבת גמא", "a container of reeds / bulrushes")]
    },
    kjv: "And when she could not longer hide him, she took for him an ark of bulrushes, and daubed it with slime and with pitch, and put the child therein; and she laid it in the flags by the river's brink.",
    modern: {
      nasb: "NASB uses a wicker or papyrus basket coated with tar and pitch. The track is the material clause, which matches the bitumen lid in the Sargon legend. Confirm the nouns in the printing.",
      niv: "NIV uses a papyrus basket coated with tar and pitch. Same material track.",
      esv: "ESV uses a basket of bulrushes daubed with bitumen and pitch. Same track."
    },
    forensic: {
      sigla: [
        "British Museum ME K.3401 — Sargon birth legend, Nineveh, Ashurbanipal's library",
        "BM collection database entry for ME K.3401",
        "BHS Exodus 2:3"
      ],
      critical: "K.3401 is not a Hebrew manuscript of Exodus. It is a cuneiform tablet with a reed basket, bitumen, and a river. The parallel is real. Identity of the two infants is not on the tablet.",
      body: "The copy is Neo-Assyrian. Using it as a 15th-century or 13th-century eyewitness report overreaches the object. Using it as if the basket motif were unique to Exodus ignores the object."
    }
  },
  21: {
    verse: "Psalm 22:16 (Hebrew 22:17)",
    department: "Scribal Revisions",
    serialLabel: "Masoretic כארי / LXX ὤρυξαν",
    keywords: "pierced lion psalm 22 nahal hever",
    summary: "The Masoretic consonants read ka'ari, “like a lion,” in a harsh clause. The Septuagint has “they dug” or “they pierced.” The Nahal Hever letter often cited for a piercing verb is damaged.",
    manuscript: {
      tradition: "Masoretic Psalm 22:17 (English 22:16). Septuagint ὤρυξαν. 5/6HevPs: the decisive letter is disputed.",
      witnesses: [
        w("Masoretic consonants", "he", "rtl", "כארי ידי ורגלי", "like a lion my hands and my feet"),
        w("Septuagint verb", "grc", "ltr", "ὤρυξαν", "they dug / pierced")
      ]
    },
    kjv: "For dogs have compassed me: the assembly of the wicked have inclosed me: they pierced my hands and my feet.",
    modern: {
      nasb: "NASB prints a piercing verb and footnotes the Hebrew “like a lion.” Confirm the edition. The footnote is the Masoretic receipt.",
      niv: "NIV often follows the Greek tradition in the main text. Check for a footnote to “like a lion.”",
      esv: "ESV prints a piercing verb and footnotes Hebrew “like a lion.”"
    },
    forensic: {
      sigla: ["BHS Psalm 22:17", "Septuagint ὤρυξαν", "5/6HevPs — damaged letter, not a settled verb"],
      critical: "“Pierced” is a versional reading. The medieval Hebrew consonants say “like a lion,” and the clause parses badly.",
      body: "A New Testament echo cannot repair the Hebrew and then be cited as the Hebrew. Damage at Nahal Hever is not a decision."
    }
  },
  22: {
    verse: "Jeremiah 8:8",
    department: "Scribal Revisions",
    serialLabel: "BHS עט שקר",
    keywords: "lying pen scribes jeremiah sheqer",
    summary: "The Hebrew noun phrase is a pen of falsehood. The King James renders the failure as “in vain,” which is softer than the noun.",
    manuscript: {
      tradition: "Masoretic Jeremiah. Key phrase bound here; the full diplomatic line belongs to BHS.",
      witnesses: [w("Jeremiah 8:8", "he", "rtl", "עט שקר ספרים", "a pen of falsehood, of the scribes")]
    },
    kjv: "How do ye say, We are wise, and the law of the LORD is with us? Lo, certainly in vain made he it; the pen of the scribes is in vain.",
    modern: {
      nasb: "NASB tracks sheqer with falsehood or a lie in the pen, not with mere vanity. Confirm the noun.",
      niv: "NIV's crux lemma is “the lying pen of the scribes.”",
      esv: "ESV-tradition renderings stay with a lying or false pen. The noun is the track."
    },
    forensic: {
      sigla: ["BHS Jeremiah 8:8", "עט שקר"],
      critical: "The Hebrew says the pen is false. “In vain” is an English softening, not a second Hebrew noun.",
      body: "The verse accuses scribes who claim the Torah is with them. It is not a modern manifesto, and it is not the harmless line the King James English suggests."
    }
  },
  23: {
    verse: "Exodus 14:21",
    department: "Archaeology",
    serialLabel: "BHS ים סוף",
    keywords: "yam suf red sea reeds east wind",
    summary: "The Hebrew sea in this chapter is yam suf, the Sea of Reeds. “Red Sea” is the Greek erythra thalassa that the King James tradition made standard English. No itinerary tablet is bound to a named lake.",
    manuscript: {
      tradition: "Masoretic Exodus. Septuagint ἐρυθρὰ θάλασσα. Site identification remains unbound.",
      witnesses: [w("Exodus 14:21, wind clause", "he", "rtl", "ברוח קדים עזה", "by a strong east wind")]
    },
    kjv: "And Moses stretched out his hand over the sea; and the LORD caused the sea to go back by a strong east wind all that night, and made the sea dry land, and the waters were divided.",
    modern: {
      nasb: "NASB often prints Red Sea and footnotes Sea of Reeds. The footnote is the Hebrew. Confirm the edition.",
      niv: "NIV keeps Red Sea in many exodus printings and footnotes Sea of Reeds.",
      esv: "ESV uses Red Sea. The Hebrew phrase is a study-note problem unless the printing shows it."
    },
    forensic: {
      sigla: ["BHS Exodus 14:21", "Septuagint ἐρυθρὰ θάλασσα", "Named body of water: no catalogued itinerary is attached"],
      critical: "The Hebrew is Sea of Reeds. Red Sea is a Greek choice that entered English through the King James tradition.",
      body: "The east-wind clause is in the Hebrew sentence. Geography beyond that clause needs a map tied to an inscription, which this file does not have."
    }
  },
  24: {
    verse: "Exodus 21:20–21",
    department: "Moral Defections",
    serialLabel: "BHS כי כספו הוא",
    keywords: "slavery rod property silver exodus 21",
    summary: "If an enslaved person dies under the rod at once, the beating is punished. If the person survives a day or two, it is not, because the person is the striker's silver.",
    manuscript: {
      tradition: "Masoretic Covenant Code. The property clause is the crux.",
      witnesses: [w("Exodus 21:21", "he", "rtl", "כי כספו הוא", "for he is his silver")]
    },
    kjv: "And if a man smite his servant, or his maid, with a rod, and he die under his hand; he shall be surely punished. Notwithstanding, if he continue a day or two, he shall not be punished: for he is his money.",
    modern: {
      nasb: "NASB keeps the one-day or two-day gap and the property rationale. Record the noun the edition uses for the enslaved person.",
      niv: "NIV keeps the punishment gap and the statement that the person is the owner's property.",
      esv: "ESV renders the victim as property (“his money” or a footnoted equivalent). Record the noun."
    },
    forensic: {
      sigla: ["BHS Exodus 21:20–21", "כי כספו הוא"],
      critical: "Survival for a day or two cancels punishment because the enslaved person is reckoned as silver. That is the clause.",
      body: "Comparative law codes can be set beside it only when a tablet and a paragraph number are bound. None is invented here."
    }
  },
  25: {
    verse: "Deuteronomy 22:28–29",
    department: "Moral Defections",
    serialLabel: "BHS חמשים כסף",
    keywords: "fifty shekels deuteronomy marriage statute",
    summary: "The statute assigns fifty shekels to the woman's father and a marriage the man cannot end. The verse does not state an age. This file does not add one.",
    manuscript: {
      tradition: "Masoretic Deuteronomy 22. Silver clause bound; the divorce ban is continuous in the King James panel.",
      witnesses: [w("Payment clause", "he", "rtl", "חמשים כסף", "fifty of silver")]
    },
    kjv: "If a man find a damsel that is a virgin, which is not betrothed, and lay hold on her, and lie with her, and they be found; Then the man that lay with her shall give unto the damsel's father fifty shekels of silver, and she shall be his wife; because he hath humbled her, he may not put her away all his days.",
    modern: {
      nasb: "NASB keeps the fifty shekels paid to the father and the bar on divorce. Those two results are the track.",
      niv: "NIV keeps the payment and the marriage without divorce. Compare any footnote that softens the verb.",
      esv: "ESV retains both legal results."
    },
    forensic: {
      sigla: ["BHS Deuteronomy 22:28–29", "חמשים כסף", "Middle Assyrian comparison: unbound until a cited law paragraph is attached"],
      critical: "The statute prices the act at fifty shekels to the father and then closes divorce. Later discomfort does not erase either clause.",
      body: "The file refuses two errors: reading the verse as a modern consent statute, and inventing an age the Hebrew line does not fix."
    }
  },
  26: {
    verse: "1 Samuel 15:3",
    department: "Moral Defections",
    serialLabel: "BHS herem of Amalek",
    keywords: "amalek herem samuel spare not",
    summary: "The command is herem against Amalek: do not spare. The King James object list includes men, women, infants, and animals.",
    manuscript: {
      tradition: "Masoretic 1 Samuel 15. Opening clause bound; the object list is carried in the public-domain English.",
      witnesses: [w("Opening command", "he", "rtl", "עתה לך והכיתה את עמלק", "Now go and strike Amalek")]
    },
    kjv: "Now go and smite Amalek, and utterly destroy all that they have, and spare them not; but slay both man and woman, infant and suckling, ox and sheep, camel and ass.",
    modern: {
      nasb: "NASB uses devote-to-destruction language and keeps the full object list, including infants and livestock.",
      niv: "NIV retains totally destroy and the same list. A footnote may name the ban.",
      esv: "ESV uses devote to destruction and keeps infants and animals in the command."
    },
    forensic: {
      sigla: ["BHS 1 Samuel 15:3"],
      critical: "The command, as written, includes infants and animals. A paraphrase that drops them is no longer this verse.",
      body: "Naming herem as a category does not shrink the objects. Saul's later sparing of Agag does not rewrite verse 3."
    }
  },
  27: {
    verse: "Revelation 13:18",
    department: "Roman Politics",
    serialLabel: "P.Oxy. 4499 (P115)",
    keywords: "666 616 nero p115 ephraemi beast",
    summary: "Most witnesses number the beast 666. Codex Ephraemi and the published reading of P115 number it 616. P.Oxy. 4499 is that Revelation papyrus. Both figures have been tied to Nero. Neither tie is a proof.",
    manuscript: {
      tradition: "Greek Revelation. 666 is χξϛ in P47, Sinaiticus, Alexandrinus, and the mass of manuscripts. 616 is χιϛ in Codex Ephraemi. P.Oxy. 4499 was published as 616; the line is damaged and must be cited from Chapa's edition.",
      witnesses: [
        w("Majority numeral", "grc", "ltr", "χξϛ", "666"),
        w("Minority numeral", "grc", "ltr", "χιϛ", "616")
      ]
    },
    kjv: "Here is wisdom. Let him that hath understanding count the number of the beast: for it is the number of a man; and his number is Six hundred threescore and six.",
    modern: {
      nasb: "NASB prints 666 and footnotes manuscripts that read 616.",
      niv: "NIV prints 666 and footnotes 616. The footnote is the track.",
      esv: "ESV prints 666 with a textual note on 616."
    },
    forensic: {
      sigla: [
        "P115 — P.Oxy. 4499, Ashmolean; ed. Juan Chapa, Oxyrhynchus Papyri LXVI",
        "Codex Ephraemi Rescriptus (C), Bibliothèque nationale de France",
        "Irenaeus, Against Heresies 5.30, who knows 616 and rejects it"
      ],
      critical: "616 is ancient. It is still the minority figure. This papyrus is Revelation, which is why it belongs on this file and not on John 8.",
      body: "Hebrew counting for Neron Caesar versus Nero Caesar explains both numbers and demonstrates neither. Irenaeus already preferred 666."
    }
  },
  28: {
    verse: "Matthew 27:9–10",
    department: "Scribal Revisions",
    serialLabel: "NA28 διὰ Ἰερεμίου",
    keywords: "jeremiah zechariah thirty pieces attribution",
    summary: "Matthew names Jeremiah. The thirty pieces of silver are Zechariah 11. A potter and a field also echo Jeremiah. A merged echo is not an accurate citation.",
    manuscript: {
      tradition: "Greek Matthew. Zechariah 11:12–13 supplies the silver. Jeremiah 19 and 32 supply potter and field motifs.",
      witnesses: [w("Matthew's attribution", "grc", "ltr", "διὰ Ἰερεμίου τοῦ προφήτου", "through Jeremiah the prophet")]
    },
    kjv: "Then was fulfilled that which was spoken by Jeremy the prophet, saying, And they took the thirty pieces of silver, the price of him that was valued, whom they of the children of Israel did value.",
    modern: {
      nasb: "NASB keeps the name Jeremiah. Some editions footnote Zechariah. If the note is missing, the track is a silent attribution.",
      niv: "NIV keeps Jeremiah in the main text. Check for a Zechariah footnote.",
      esv: "ESV keeps Jeremiah. Record whether a Zechariah note sits in the biblical footer or only in a commentary."
    },
    forensic: {
      sigla: ["NA28 Matthew 27:9", "BHS Zechariah 11:12–13", "BHS Jeremiah 19 and 32"],
      critical: "The spoken name is Jeremiah. The thirty pieces of silver are a Zechariah text. The citation as written does not match the book it names.",
      body: "Changing Matthew's Jeremiah into Zechariah is itself a late revision. The file cites the Gospel's word and the two prophetic passages."
    }
  },
  29: {
    verse: "Genesis 5:27",
    department: "Primitive Science",
    serialLabel: "Ashmolean WB 444",
    keywords: "methuselah 969 sumerian king list weld-blundell",
    summary: "Methuselah's 969 years are the Masoretic figure. The Sumerian King List on the Weld-Blundell Prism gives antediluvian reigns that are also not biological ages.",
    manuscript: {
      tradition: "Masoretic Genesis 5. The number in the King James text matches the Masoretic total. Bind the Leningrad folio for a diplomatic line.",
      witnesses: [w("Name clause", "he", "rtl", "ויהיו כל ימי מתושלח", "and all the days of Methuselah were")]
    },
    kjv: "And all the days of Methuselah were nine hundred sixty and nine years: and he died.",
    modern: {
      nasb: "NASB prints 969. There is no textual track that turns the figure into a modern lifespan.",
      niv: "NIV prints 969. Footnotes, if any, are interpretive.",
      esv: "ESV prints 969. The figure is stable."
    },
    forensic: {
      sigla: ["BHS Genesis 5:27 — 969 years", "Weld-Blundell Prism, Sumerian King List — Ashmolean WB 444"],
      critical: "969 is a textual number. The prism's reigns are textual numbers. Neither object is a skeleton.",
      body: "Do not cite a reign from WB 444 without the line in the edition. Septuagint and Samaritan shifts of other Genesis 5 totals belong in their own files."
    }
  },
  30: {
    verse: "Acts 18:12–16",
    department: "Roman Politics",
    serialLabel: "Delphi, Gallio inscription",
    keywords: "gallio proconsul achaia delphi claudius",
    summary: "Acts places Paul before Gallio, proconsul of Achaia. A letter of Claudius at Delphi names Gallio and puts that office in the early 50s. The stone dates the office. It does not script the dialogue.",
    manuscript: {
      tradition: "Greek Acts. Bind the exact SIG or Fouilles de Delphes number from the epigraphic edition before print citation.",
      witnesses: [w("Acts 18:12", "grc", "ltr", "Γαλλίωνος δὲ ἀνθυπάτου ὄντος τῆς Ἀχαΐας", "while Gallio was proconsul of Achaia")]
    },
    kjv: "And when Gallio was the deputy of Achaia, the Jews made insurrection with one accord against Paul, and brought him to the judgment seat.",
    modern: {
      nasb: "NASB uses proconsul, matching ἀνθύπατος, where the King James said deputy. The date still comes from the inscription.",
      niv: "NIV uses proconsul. Same lexical update.",
      esv: "ESV uses proconsul. A study note that mentions Delphi should be checked against the Greek of the stone."
    },
    forensic: {
      sigla: ["Gallio inscription, Delphi — letter of Claudius; bind SIG³ / FD from the edition", "NA28 Acts 18:12"],
      critical: "The stone dates Gallio's proconsulship to about 51–52 CE. It does not prove the speech in Acts 18.",
      body: "This file is an anchor, with the limit written on it. Receipts that fix an office are kept as carefully as receipts that collide with a narrative."
    }
  },
  31: {
    verse: "Numbers 6:24–26",
    department: "Archaeology",
    serialLabel: "Ketef Hinnom I–II",
    keywords: "silver scrolls priestly blessing barkay",
    summary: "Two silver amulets from a Jerusalem tomb carry the priestly blessing. They show the blessing was worn in the late monarchic period. They do not show a finished Pentateuch.",
    manuscript: {
      tradition: "Masoretic Numbers 6 beside the Ketef Hinnom plaques excavated by Gabriel Barkay. Conventionally late seventh or early sixth century BCE; bind the locus before tightening the decade.",
      witnesses: [w("Numbers 6:24", "he", "rtl", "יברכך יהוה וישמרך", "May YHWH bless you and keep you")]
    },
    kjv: "The LORD bless thee, and keep thee: The LORD make his face shine upon thee, and be gracious unto thee: The LORD lift up his countenance upon thee, and give thee peace.",
    modern: {
      nasb: "NASB's English blessing is stable. The amulets are not inside the translation.",
      niv: "NIV prints the blessing without the silver. The archaeological receipt is this panel.",
      esv: "ESV likewise prints the blessing without the objects."
    },
    forensic: {
      sigla: ["Ketef Hinnom I–II — Israel Museum; excavator Gabriel Barkay", "BHS Numbers 6:24–26"],
      critical: "The amulets quote the blessing. They are the oldest objects that do. They are not a bound copy of the Pentateuch.",
      body: "Over-claiming them into a complete Torah, or dismissing them because they are amulets, both ignore the object."
    }
  },
  33: {
    verse: "2 Kings 3:4–5",
    department: "Archaeology",
    serialLabel: "Louvre AO 5066",
    keywords: "mesha moabite stone KAI 181 chemosh",
    summary: "The Mesha Stele names Mesha, Omri, and Israel, and claims a victory 2 Kings 3 does not give him. Louvre AO 5066 is that stele. It is not a Babylonian map.",
    manuscript: {
      tradition: "Masoretic Kings beside the Moabite inscription, KAI 181. Cite lines from a squeeze or from KAI, not from memory.",
      witnesses: [w("2 Kings 3:4", "he", "rtl", "מישע מלך מואב", "Mesha king of Moab")]
    },
    kjv: "And Mesha king of Moab was a sheepmaster, and rendered unto the king of Israel an hundred thousand lambs, and an hundred thousand rams, with the wool. But it came to pass, when Ahab was dead, that the king of Moab rebelled against the king of Israel.",
    modern: {
      nasb: "NASB keeps Mesha, the tribute, and the rebellion. It does not summarize the stele.",
      niv: "NIV matches that narrative. The stele is not in the footnote.",
      esv: "ESV matches the Kings account. Comparison belongs here."
    },
    forensic: {
      sigla: [
        "Louvre AO 5066 — also MNB 752; catalogue KAI 181",
        "Findspot Dhiban. Related pieces AO 2142, AO 5060; squeezes AO 5019, AO 5020"
      ],
      critical: "Mesha says he threw Israel off. 2 Kings 3 does not award him that victory. AO 5066 is this stele. Genesis 1 does not get to borrow the number.",
      body: "The stone has a 19th-century restoration history. Cite the Louvre record and a modern drawing together. Custody disputes do not decide the reading."
    }
  },
  34: {
    verse: "Genesis 6:1–4",
    department: "Archaeology",
    serialLabel: "BHS בני האלהים",
    keywords: "nephilim sons of god enoch qumran",
    summary: "The Hebrew calls the fathers sons of God and the offspring Nephilim. Later Enoch literature builds on the paragraph. Qumran preserves Aramaic Enoch; a fragment number still has to be bound from DJD.",
    manuscript: {
      tradition: "Masoretic Genesis 6. 1 Enoch is not a biblical manuscript.",
      witnesses: [w("Genesis 6:2", "he", "rtl", "בני האלהים … בנות האדם", "the sons of God … the daughters of humankind")]
    },
    kjv: "The sons of God saw the daughters of men that they were fair; and they took them wives of all which they chose. There were giants in the earth in those days.",
    modern: {
      nasb: "NASB prints sons of God and Nephilim, with notes. The divine-sons phrase is the track.",
      niv: "NIV often prints sons of God and footnotes a human-line alternative. Nephilim is usually kept rather than the King James giants.",
      esv: "ESV prints sons of God and Nephilim, and footnotes attempts to humanize the phrase."
    },
    forensic: {
      sigla: ["BHS Genesis 6:1–4", "Qumran Aramaic Enoch — bind the DJD plate before naming a 4Q number"],
      critical: "The paragraph says sons of God took daughters of humankind. A human-only reading is a later interpretation and should be labeled as one.",
      body: "Deuteronomy 32:8 is the companion file: the same sons-of-God wording has a Qumran receipt there. The Enoch expansion is later literature, not this verse."
    }
  },
  35: {
    verse: "1 Corinthians 14:34–35",
    department: "Scribal Revisions",
    serialLabel: "NA28 displacement",
    keywords: "women silent western text paul interpolation",
    summary: "In a set of Western witnesses these two verses stand after 14:40 instead of after 14:33. The paragraph moved. That forces the interpolation hypothesis onto the table. It does not, alone, prove it.",
    manuscript: {
      tradition: "Greek 1 Corinthians. Bind the individual sigla from NA28 before copying an apparatus into this file.",
      witnesses: [w("1 Corinthians 14:34", "grc", "ltr", "Αἱ γυναῖκες ἐν ταῖς ἐκκλησίαις σιγάτωσαν", "Let the women keep silent in the churches")]
    },
    kjv: "Let your women keep silence in the churches: for it is not permitted unto them to speak; but they are commanded to be under obedience, as also saith the law. And if they will learn any thing, let them ask their husbands at home: for it is a shame for women to speak in the church.",
    modern: {
      nasb: "NASB prints the silence command in the traditional place. A footnote, when present, should mention copies that locate the verses after 14:40.",
      niv: "NIV prints the command in place. If the printing has no displacement note, the seam is invisible.",
      esv: "ESV prints the verses in the traditional location. Separate a biblical footnote from a study note."
    },
    forensic: {
      sigla: ["NA28 at 1 Corinthians 14:34–35 and 14:40", "Western sigla: unbound until the apparatus is attached"],
      critical: "Some copies place the silence command after 14:40. The paragraph traveled. Travel is evidence of a seam, not yet a verdict of forgery.",
      body: "A file that calls the verses a proven interpolation without the sigla is ahead of its receipt. A file that hides the displacement is behind it."
    }
  }
};

const state = {
  dept: "all",
  sort: "id",
  dir: "asc",
  query: "",
  boundOnly: false
};

let archive = [];
const byId = new Map();
let searchTimer = 0;

function parallelSpec(verse, book, kjv, sanskrit, framework) {
  return {
    department: "Scribal Revisions",
    verse,
    book,
    keywords: `sanskrit upanishad parallel conceptual evolution shared internal mystical framework ${sanskrit} ${verse}`,
    summary: `${verse} is filed beside ${sanskrit} as advanced parallel conceptual evolution inside a shared internal mystical framework. The archive keeps the two compositions apart. It does not treat them as a copied line.`,
    lens: framework,
    witnessLanguage: "Greek and Sanskrit",
    edition: "NA28; Sanskrit cited by work and section",
    kjv,
    critical: `${verse} and ${sanskrit} are framed as advanced parallel conceptual evolution inside a shared internal mystical framework. No museum receipt links the pair.`,
    body: `Advanced parallel conceptual evolution inside a shared internal mystical framework. ${framework}`
  };
}

/* Compliance overlays. These IDs stay status "scaffold". They do not join the 24 bound dossiers. */
const COMPLIANCE = {
  61: {
    department: "Scribal Revisions",
    verse: "Matthew 28:19",
    book: "Matthew",
    keywords: "matthew 28:19 threefold name father son holy spirit sinaiticus vaticanus early variant eusebius",
    summary: "The threefold trinitarian name in Matthew 28:19 — Father, Son, and Holy Spirit — is the actual reading of the earliest surviving Greek manuscripts of this verse, including Codex Sinaiticus and Codex Vaticanus. It is not a post-Nicene addition. Eusebius's shorter 'in my name' wording is tracked as an early textual citation variant, not as a Greek manuscript of Matthew that lacks the threefold name.",
    lens: "baptismal formula: manuscript threefold name beside the shorter form quoted by Eusebius",
    witnessLanguage: "Greek",
    edition: "NA28",
    kjv: "Go ye therefore, and teach all nations, baptizing them in the name of the Father, and of the Son, and of the Holy Ghost:",
    critical: "The threefold trinitarian name is the reading of the earliest surviving Greek manuscripts of Matthew 28:19, including Sinaiticus and Vaticanus. It is not a post-Nicene addition. Eusebius's shorter 'in my name' wording is tracked as an early textual citation variant.",
    body: "Codex Sinaiticus (Add MS 43725) and Codex Vaticanus (Vat.gr.1209) both read the baptismal charge in the name of the Father and of the Son and of the Holy Spirit. No Greek manuscript of this verse has been produced that ends with 'in my name' alone. Eusebius of Caesarea does quote a shorter charge in some pre-Nicene passages. His quotation is evidence of how one church writer cited the line. It is not a license to relabel the manuscript text as a late insertion. This file stays unbound: naming those codices here does not mint a second receipt beside the dossiers that already carry their sigla."
  },
  199: {
    department: "Scribal Revisions",
    verse: "Numbers 11:24–25",
    book: "Numbers",
    keywords: "numbers 11 seventy elders prophetic spirit moses tabernacle not a slaughter",
    summary: "Numbers 11:24–25 records the prophetic spirit resting on the seventy elders so that they prophesied. The mass-slaughter description is rejected for this card. The Kibroth-Hattaavah deaths occur later in the chapter, at Numbers 11:33.",
    lens: "the spirit taken from Moses and placed on the seventy elders",
    witnessLanguage: "Hebrew",
    edition: "BHS",
    kjv: "And Moses went out, and told the people the words of the LORD, and gathered the seventy men of the elders of the people, and set them round about the tabernacle. And the LORD came down in a cloud, and spake unto him, and took of the spirit that was upon him, and gave it unto the seventy elders: and it came to pass, that, when the spirit rested upon them, they prophesied, and did not cease.",
    critical: "Numbers 11:24–25 is the prophetic spirit resting on the seventy elders. The mass-slaughter description is rejected here. The Kibroth-Hattaavah deaths are a later sentence, Numbers 11:33.",
    body: "Verse 24 places the elders around the tent. Verse 25 says the spirit rested on them and they prophesied. Eldad and Medad prophesy in the camp in the next verses, and Moses refuses to stop them. The Kibroth-Hattaavah deaths, the graves of craving, are told later at Numbers 11:33 and do not belong on this card. No museum receipt is linked, so the file stays a scaffold excluded from peer review."
  },
  333: parallelSpec("Matthew 15:14", "Matthew", "Let them alone: they be blind leaders of the blind. And if the blind lead the blind, both shall fall into the ditch.", "Katha Upanishad 1.2.5", "A blind guide leading the blind is a shared image for confident ignorance. Matthew uses it against a teaching class. Katha uses it for people puffed up with learning. Advanced parallel conceptual evolution: the same figure, two internal mystical frameworks, no copied sentence."),
  334: parallelSpec("John 4:14", "John", "But whosoever drinketh of the water that I shall give him shall never thirst; but the water that I shall give him shall be in him a well of water springing up into everlasting life.", "Brihadaranyaka Upanishad, Purnam invocation", "An inner source that is not used up is the shared figure. John names that source as the water he gives. The fullness mantra speaks of infinity taken from infinity with infinity remaining. The parallel is conceptual evolution inside a mystical framework, not a shared manuscript line."),
  335: parallelSpec("Matthew 10:28", "Matthew", "And fear not them which kill the body, but are not able to kill the soul: but rather fear him which is able to destroy both soul and body in hell.", "Katha Upanishad 1.2.18", "Both texts separate the killing of the body from the fate of the conscious self. Katha says the knowing self is not slain when the body is slain. Matthew still warns of one who can destroy soul and body. The frameworks share an anthropology and do not share a sentence."),
  336: parallelSpec("Luke 11:34", "Luke", "The light of the body is the eye: therefore when thine eye is single, thy whole body also is full of light; but when thine eye is evil, thy body also is full of darkness.", "Brihadaranyaka Upanishad 4.4.2", "Luke's haplous is a single, undivided eye, and the body is full of light or darkness with it. Brihadaranyaka speaks of attention gathered until seeing is no longer outward. Shared internal mystical framework of unified sight. The Greek clause is not a translation of the Sanskrit paragraph."),
  337: parallelSpec("Matthew 7:14", "Matthew", "Because strait is the gate, and narrow is the way, which leadeth unto life, and few there be that find it.", "Katha Upanishad 1.3.14", "A path so narrow that few cross it is the shared image. Katha compares the way to a razor's edge. Matthew uses a strait gate and a narrow way that leads to life. Advanced parallel conceptual evolution of a difficult inward road."),
  338: parallelSpec("Hebrews 10:4", "Hebrews", "For it is not possible that the blood of bulls and of goats should take away sins.", "Mundaka Upanishad 1.2.7", "Both passages rank interior reality above the blood of sacrificial animals. Mundaka calls the sacrificial rites frail boats. Hebrews says the blood of bulls and goats cannot take away sins. The critique of rite is a shared framework. The sentences were not copied from one book into the other."),
  339: parallelSpec("Galatians 3:28", "Galatians", "There is neither Jew nor Greek, there is neither bond nor free, there is neither male nor female: for ye are all one in Christ Jesus.", "Chandogya Upanishad 6.10.1", "Rivers losing their names in the ocean, and social names losing their force inside one body, are parallel figures of undivided belonging. Chandogya's merger and Paul's unity in Christ are not the same doctrine. The file records the conceptual parallel only."),
  340: parallelSpec("Galatians 5:17", "Galatians", "For the flesh lusteth against the Spirit, and the Spirit against the flesh: and these are contrary the one to the other: so that ye cannot do the things that ye would.", "Svetasvatara Upanishad 4.6", "An inner pair at odds is the shared picture. Svetasvatara's two birds share one tree: one eats, one watches. Paul sets flesh against Spirit. Advanced parallel conceptual evolution of a divided inner life, inside different mystical frameworks."),
  341: parallelSpec("Philippians 4:7", "Philippians", "And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.", "Taittiriya Upanishad 2.9.1", "Peace or bliss that speech and analysis cannot reach is the shared claim. Taittiriya says words and mind turn back from that bliss. Philippians says the peace of God passes understanding and guards the heart. Conceptual parallel, not a borrowed sentence."),
  342: parallelSpec("1 John 3:9", "1 John", "Whosoever is born of God doth not commit sin; for his seed remaineth in him: and he cannot sin, because he is born of God.", "Katha Upanishad 1.2.18", "A core that corruption does not own is the shared intuition. John ties it to a remaining seed and to birth from God. Katha ties the unborn self to survival of the body's destruction. The frameworks meet. The clauses do not match."),
  343: parallelSpec("John 11:26", "John", "And whosoever liveth and believeth in me shall never die. Believest thou this?", "Isha Upanishad 14", "Both lines speak of a life that death does not finish. John ties that life to believing. Isha speaks of crossing death by realization of the unmanifest. Shared mystical language of death overcome, with different mechanisms."),
  344: parallelSpec("2 Corinthians 4:18", "2 Corinthians", "While we look not at the things which are seen, but at the things which are not seen: for the things which are seen are temporal; but the things which are not seen are eternal.", "Kena Upanishad 1.7", "The unseen set above the seen is the shared framework. Paul contrasts temporal sight with an eternal unseen. Kena points to that by which the eye sees, rather than to an object the eye looks at. Parallel conceptual evolution of attention."),
  345: parallelSpec("Matthew 13:44", "Matthew", "Again, the kingdom of heaven is like unto treasure hid in a field; the which when a man hath found, he hideth, and for joy thereof goeth and selleth all that he hath, and buyeth that field.", "Chandogya Upanishad 8.3.2", "Treasure underfoot, walked over by people who do not know it, is the shared parable shape. Chandogya places the treasure in the self that sleepers miss. Matthew places it in a field the finder buys. The image evolved in parallel. It is not a transcribed paragraph."),
  346: parallelSpec("1 Corinthians 1:19", "1 Corinthians", "For it is written, I will destroy the wisdom of the wise, and will bring to nothing the understanding of the prudent.", "Chandogya Upanishad 7.1.1–3", "Mastered learning that still misses the self is the shared internal theme. Narada lists the Vedas and calls himself a knower of words who is still in sorrow. Paul quotes a scriptural line against the wisdom of the wise. The file keeps the conceptual parallel and does not identify Paul's quotation with the Upanishad."),
  347: parallelSpec("Ephesians 5:14", "Ephesians", "Wherefore he saith, Awake thou that sleepest, and arise from the dead, and Christ shall give thee light.", "Mandukya Upanishad, on waking and turiya", "Waking sleepers is the shared summons. Mandukya maps ordinary awareness against a further luminous state. Ephesians quotes a call to rise from the dead into light. Advanced parallel conceptual evolution of awakening, not a common source paragraph."),
  348: parallelSpec("2 Timothy 1:7", "2 Timothy", "For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.", "Taittiriya Upanishad 2.7.1", "Fear as something a realized life leaves behind is the shared framework. Taittiriya derives fear from the slightest sense of separation. Timothy names power, love, and a sound mind in place of a spirit of fear. The psychologies are parallel and not interchangeable."),
  349: parallelSpec("James 1:23–24", "James", "For if any be a hearer of the word, and not a doer, he is like unto a man beholding his natural face in a glass: for he beholdeth himself, and goeth his way, and straightway forgetteth what manner of man he was.", "Svetasvatara Upanishad 2.14", "A mirror used for self-knowledge is the shared figure. James's hearer looks away and forgets his face. Svetasvatara's mirror shines once the dust is cleared. Shared internal mystical framework. Different application."),
  350: parallelSpec("1 Corinthians 15:54", "1 Corinthians", "So when this corruptible shall have put on incorruption, and this mortal shall have put on immortality, then shall be brought to pass the saying that is written, Death is swallowed up in victory.", "Katha Upanishad 1.2.25", "Death outranked by a greater life is the shared image. Paul says death is swallowed up in victory, quoting Israel's scripture. Katha pictures Death itself as a condiment before the Self. The triumph language is advanced parallel conceptual evolution. The quotations have different sources.")
};

function complianceFile(n, spec) {
  const base = makeScaffold(n, {
    ref: spec.verse,
    lens: spec.lens,
    dept: spec.department,
    book: spec.book
  });
  return {
    ...base,
    keywords: spec.keywords,
    summary: spec.summary,
    witnessLanguage: spec.witnessLanguage,
    edition: spec.edition,
    kjv: spec.kjv,
    forensic: {
      sigla: [UNBOUND_SIGLUM],
      critical: `This file has no catalog serial. It is excluded from peer review. ${spec.critical}`,
      body: spec.body
    }
  };
}

function expandPool() {
  const pool = [];
  RANGES.forEach(([book, chapter, start, end, dept]) => {
    const lens = CHAPTER_LENS[`${book} ${chapter}`];
    if (!lens) throw new Error(`Missing lens for ${book} ${chapter}`);
    for (let verse = start; verse <= end; verse += 1) {
      pool.push({ ref: `${book} ${chapter}:${verse}`, lens, dept, book });
    }
  });
  return pool;
}

function makeScaffold(n, slot) {
  const greek = GREEK_BOOKS.has(slot.book);
  const edition = greek ? "NA28" : "BHS";
  const language = greek ? "Greek" : "Hebrew";
  return {
    tier: "standard",
    status: "scaffold",
    department: slot.dept,
    verse: slot.ref,
    serialLabel: "Receipt unbound",
    keywords: `${slot.lens} ${language} ${edition} unbound scaffold`,
    summary: `${slot.ref} under ${slot.dept}. Locus: ${slot.lens}. Working edition named for intake: ${edition}. Sigla unbound. Excluded from peer-review tracking until a museum receipt is linked.`,
    witnessLanguage: language,
    edition,
    lens: slot.lens,
    manuscript: null,
    kjv: "",
    modern: null,
    forensic: {
      sigla: [UNBOUND_SIGLUM],
      critical: "This file has no catalog serial. It is excluded from peer review.",
      body: `Promote AUDIT-${String(n).padStart(3, "0")} by binding a diplomatic transcription, the public-domain King James clause, a NASB/NIV/ESV footnote track, and a real receipt. Inventing a museum number is a protocol breach.`
    }
  };
}

function stamp(partial, n) {
  const id = `AUDIT-${String(n).padStart(3, "0")}`;
  const status = partial.status;
  const sigla = (partial.forensic && partial.forensic.sigla) || [];
  const modern = partial.modern || {};
  const witnesses = partial.manuscript && partial.manuscript.witnesses
    ? partial.manuscript.witnesses.map((item) => `${item.label} ${item.text} ${item.literal}`).join(" ")
    : "";
  const blob = [
    id,
    partial.department,
    partial.verse,
    partial.summary,
    partial.keywords,
    partial.serialLabel,
    partial.tier,
    status,
    partial.kjv,
    partial.lens,
    partial.edition,
    modern.nasb,
    modern.niv,
    modern.esv,
    partial.manuscript && partial.manuscript.tradition,
    witnesses,
    partial.forensic && partial.forensic.critical,
    partial.forensic && partial.forensic.body,
    sigla.join(" ")
  ].filter(Boolean).join("\n").toLowerCase();
  return { ...partial, n, id, blob, dept: partial.department };
}

function assertBound(file, n) {
  if (!file.verse || !file.department || !file.manuscript || !file.kjv || !file.modern || !file.forensic) {
    throw new Error(`Incomplete dossier at ${n}: ${file.verse || ""}`);
  }
  if (!DEPARTMENTS.includes(file.department)) throw new Error(`Bad department at ${n}`);
  if (!file.forensic.sigla || !file.forensic.sigla.length) throw new Error(`Missing sigla at ${n}`);
}

function buildArchive() {
  const pool = expandPool();
  const reserved = new Set([...Object.keys(NUCLEAR), ...Object.keys(BOUND)].map(Number));
  if (reserved.size !== 24) throw new Error(`Bound set is ${reserved.size}, expected 24`);
  const files = [];
  let scaffoldIndex = 0;
  for (let n = 1; n <= ARCHIVE_MILESTONE; n += 1) {
    if (NUCLEAR[n]) {
      const file = { ...NUCLEAR[n], tier: "nuclear", status: "forensic" };
      assertBound(file, n);
      files.push(stamp(file, n));
    } else if (BOUND[n]) {
      const file = { ...BOUND[n], tier: "standard", status: "bound" };
      assertBound(file, n);
      files.push(stamp(file, n));
    } else {
      const slot = pool[scaffoldIndex % pool.length];
      scaffoldIndex += 1;
      const overlay = COMPLIANCE[n];
      files.push(stamp(overlay ? complianceFile(n, overlay) : makeScaffold(n, slot), n));
    }
  }
  if (files.length !== ARCHIVE_MILESTONE) throw new Error(`Length ${files.length}`);
  const boundCount = files.filter((file) => file.status === "forensic" || file.status === "bound").length;
  if (boundCount !== 24) throw new Error(`Bound count ${boundCount}`);
  if (files.filter((file) => file.tier === "nuclear").length !== 8) throw new Error("Nuclear count");
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

function siglaList(sigla) {
  return `<ul class="serials">${sigla.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>`;
}

function renderCuratedDetail(file, uid) {
  const witnesses = file.manuscript.witnesses.map((witness) => {
    const dir = witness.dir === "rtl" ? "rtl" : "ltr";
    return `<div class="witness-block"><p class="witness-label">${esc(witness.label)}</p><p class="witness" lang="${esc(witness.lang)}" dir="${dir}">${esc(witness.text)}</p><p class="literal"><strong>Literal.</strong> ${esc(witness.literal)}</p></div>`;
  }).join("");
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
      html: `<h4>NASB track</h4><p>${esc(file.modern.nasb)}</p><h4>NIV track</h4><p>${esc(file.modern.niv)}</p><h4>ESV track</h4><p>${esc(file.modern.esv)}</p><p class="fine">${esc(MODERN_NOTE)}</p>`
    },
    {
      id: "forensic",
      html: `<p class="panel-kicker">Sigla</p>${siglaList(file.forensic.sigla)}<p class="fact-critical"><span>Critical fact.</span> ${esc(file.forensic.critical)}</p>${paragraphs(file.forensic.body)}`
    }
  ]);
}

function renderScaffoldDetail(file, uid) {
  return tabShell(uid, [
    {
      id: "manuscript",
      html: `<p class="panel-kicker">Witness</p><p>Expected language for ${esc(file.verse)}: ${esc(file.witnessLanguage)}. Locus: ${esc(file.lens)}.</p><p>${esc(UNBOUND_SIGLUM)} No glyphs are fabricated in an unbound file.</p>`
    },
    {
      id: "kjv",
      html: file.kjv
        ? `<p class="panel-kicker">King James Version (1611)</p><blockquote class="kjv">${esc(file.kjv)}</blockquote><p class="fine">${esc(KJV_NOTE)}</p><p>${esc(UNBOUND_SIGLUM)}</p>`
        : `<p class="panel-kicker">King James Version (1611)</p><p>Public-domain text for ${esc(file.verse)} attaches when the file is promoted. ${esc(UNBOUND_SIGLUM)}</p><p class="fine">${esc(KJV_NOTE)}</p>`
    },
    {
      id: "modern",
      html: `<h4>NASB / NIV / ESV</h4><p>Not written. On promotion, name the reading, the footnote, and the base text (${esc(file.edition)} or a stated versional departure). Full modern lines are not stored.</p><p>${esc(UNBOUND_SIGLUM)}</p><p class="fine">${esc(MODERN_NOTE)}</p>`
    },
    {
      id: "forensic",
      html: `<p class="panel-kicker">Sigla</p>${siglaList(file.forensic.sigla)}<p class="fact-critical"><span>Critical fact.</span> ${esc(file.forensic.critical)}</p>${paragraphs(file.forensic.body)}`
    }
  ]);
}

function bookOf(verse) {
  const match = String(verse).match(/^(?:[1-3]\s+)?[A-Za-z]+/);
  return match ? match[0].toLowerCase() : "";
}

function relatedFiles(file) {
  const book = bookOf(file.verse);
  const words = new Set(String(file.keywords || "").toLowerCase().split(/[^a-z0-9]+/).filter((word) => word.length > 3));
  const ranked = archive
    .filter((other) => other.id !== file.id)
    .map((other) => {
      let score = 0;
      if (other.department === file.department) score += 4;
      if (book && bookOf(other.verse) === book) score += 5;
      if (other.status !== "scaffold") score += 8;
      if (other.tier === "nuclear") score += 3;
      let overlap = 0;
      String(other.keywords || "").toLowerCase().split(/[^a-z0-9]+/).forEach((word) => {
        if (words.has(word)) overlap += 1;
      });
      score += Math.min(overlap, 3);
      return { other, score };
    })
    .sort((a, b) => b.score - a.score || a.other.n - b.other.n);
  const picks = [];
  const take = (list, start) => {
    if (!list.length || picks.length >= 2) return;
    const offset = start % list.length;
    const ring = list.slice(offset).concat(list.slice(0, offset));
    ring.forEach((item) => {
      if (picks.length >= 2) return;
      if (!picks.some((chosen) => chosen.id === item.other.id)) picks.push(item.other);
    });
  };
  take(ranked.filter((item) => item.other.status !== "scaffold").slice(0, 8), file.n);
  take(ranked.filter((item) => book && bookOf(item.other.verse) === book).slice(0, 8), file.n + 1);
  take(ranked, file.n);
  return picks.slice(0, 2);
}

function threadFooter(file) {
  const hooks = relatedFiles(file).map((hook) => {
    return `<button class="thread-card" type="button" data-thread="${esc(hook.id)}">
      <span class="file-id">${esc(hook.id)}</span>
      <strong>${esc(hook.verse)}</strong>
      <span>${esc(hook.department)}</span>
    </button>`;
  }).join("");
  return `<aside class="thread"><p class="thread-kicker">Quantum thread</p><div class="thread-row">${hooks}</div></aside>`;
}

function renderDetail(file, uid) {
  const layers = file.status === "scaffold" ? renderScaffoldDetail(file, uid) : renderCuratedDetail(file, uid);
  return layers + threadFooter(file);
}

function statusMeta(file) {
  if (file.status === "forensic") return ["status-tag--forensic", "Forensic"];
  if (file.status === "bound") return ["status-tag--bound", "Bound"];
  return ["status-tag--unbound", "Unbound"];
}

function renderCard(file, region) {
  const article = document.createElement("article");
  article.className = `file-card${file.tier === "nuclear" ? " file-card--nuclear" : ""}`;
  article.dataset.id = file.id;
  article.dataset.department = file.department;
  const uid = `${region}-${file.id}`;
  const detailId = `${uid}-detail`;
  const tier = file.tier === "nuclear" ? `<span class="tier-tag">Nuclear tier</span>` : "";
  const [statusClass, statusLabel] = statusMeta(file);
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

function isBoundStatus(file) {
  return file.status === "forensic" || file.status === "bound";
}

function compareFiles(a, b) {
  let n = a.n - b.n;
  if (state.sort === "department") n = a.department.localeCompare(b.department) || a.n - b.n;
  else if (state.sort === "verse") n = a.verse.localeCompare(b.verse) || a.n - b.n;
  else n = a.id.localeCompare(b.id);
  return state.dir === "desc" ? -n : n;
}

/* Case-insensitive match on id, verse, summary, and department.
   Bound dossiers are status "forensic" (the 8 nuclear files) or "bound" (the other 16).
   Filtering to forensic alone would hide those 16. */
function executeClientFilters() {
  const searchVal = document.getElementById("q").value.trim().toLowerCase();
  const sectorFilter = state.dept === "all" ? "ALL" : state.dept;
  const isBoundChecked = document.getElementById("bound-only").checked;
  const sortKey = document.getElementById("sort").value;
  const sortDir = document.getElementById("dir").value;
  state.query = searchVal;
  state.boundOnly = isBoundChecked;
  state.sort = sortKey;
  state.dir = sortDir;
  const sortBy = sortKey === "id" && sortDir === "desc" ? "ID_DESC" : sortKey === "id" ? "ID_ASC" : "";

  let filtered = archive.filter((file) => {
    const dept = String(file.dept || file.department).toLowerCase();
    const matchesQuery = file.id.toLowerCase().includes(searchVal)
      || file.verse.toLowerCase().includes(searchVal)
      || file.summary.toLowerCase().includes(searchVal)
      || dept.includes(searchVal)
      || file.blob.includes(searchVal);
    const matchesSector = sectorFilter === "ALL" || file.department === sectorFilter;
    const matchesBound = !isBoundChecked || isBoundStatus(file);
    return matchesQuery && matchesSector && matchesBound;
  });

  if (sortBy === "ID_ASC") filtered.sort((a, b) => a.id.localeCompare(b.id));
  else if (sortBy === "ID_DESC") filtered.sort((a, b) => b.id.localeCompare(a.id));
  else filtered.sort(compareFiles);

  renderArchiveGrid(filtered);
}

function renderArchiveGrid(filtered) {
  const order = new Map(filtered.map((file, index) => [file.id, index]));
  const place = (container) => {
    const cards = [...container.querySelectorAll(".file-card")];
    const visible = [];
    const hidden = [];
    cards.forEach((card) => {
      const shown = order.has(card.dataset.id);
      card.classList.toggle("is-hidden", !shown);
      (shown ? visible : hidden).push(card);
    });
    visible.sort((a, b) => order.get(a.dataset.id) - order.get(b.dataset.id));
    const fragment = document.createDocumentFragment();
    visible.forEach((card) => fragment.appendChild(card));
    hidden.forEach((card) => fragment.appendChild(card));
    container.appendChild(fragment);
  };
  place(document.getElementById("feed-grid"));
  place(document.getElementById("nuclear-grid"));
  const nuclearShown = [...document.querySelectorAll("#nuclear-grid .file-card")]
    .some((card) => !card.classList.contains("is-hidden"));
  document.getElementById("nuclear").hidden = !nuclearShown;
  document.getElementById("empty-state").hidden = filtered.length !== 0;
  document.getElementById("result-count").textContent = `${filtered.length} shown · ${ARCHIVE_MILESTONE} indexed`;
}

function renderChips() {
  const host = document.getElementById("dept-filters");
  host.replaceChildren(...["All", ...DEPARTMENTS].map((name) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "chip";
    button.textContent = name === "All" ? "All" : name;
    button.dataset.dept = name === "All" ? "all" : name;
    button.setAttribute("aria-pressed", name === "All" ? "true" : "false");
    return button;
  }));
}

function renderArchive(files) {
  const feed = document.createDocumentFragment();
  const nuclear = document.createDocumentFragment();
  const ordered = [...files].sort(compareFiles);
  ordered.forEach((file) => {
    feed.appendChild(renderCard(file, "feed"));
    if (file.tier === "nuclear") nuclear.appendChild(renderCard(file, "nuclear"));
  });
  document.getElementById("feed-grid").replaceChildren(feed);
  document.getElementById("nuclear-grid").replaceChildren(nuclear);
  executeClientFilters();
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
    detail.innerHTML = renderDetail(byId.get(card.dataset.id), detail.id.replace(/-detail$/, ""));
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

function sizeBar() {
  const bar = document.getElementById("control-bar");
  if (!bar) return;
  document.documentElement.style.setProperty("--bar-h", `${bar.offsetHeight}px`);
}

function closeCard(button) {
  if (!button || button.getAttribute("aria-expanded") !== "true") return;
  button.setAttribute("aria-expanded", "false");
  button.textContent = "Open dossier";
  const detail = button.closest(".file-card").querySelector(".detail");
  if (detail) detail.hidden = true;
}

function openThread(id) {
  const card = document.querySelector(`#feed-grid .file-card[data-id="${id}"]`);
  if (!card) return;
  document.querySelectorAll("#feed-grid .expand").forEach((button) => {
    if (button.closest(".file-card") !== card) closeCard(button);
  });
  card.classList.remove("is-hidden");
  const button = card.querySelector(".expand");
  if (button.getAttribute("aria-expanded") !== "true") toggleCard(button);
  card.classList.remove("is-arriving");
  void card.offsetWidth;
  card.classList.add("is-arriving");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  card.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  history.replaceState(null, "", `#${id}`);
}

function openFromHash() {
  const id = decodeURIComponent(location.hash.replace("#", "")).toUpperCase();
  if (!/^AUDIT-\d{3}$/.test(id) || !byId.has(id)) return;
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
    executeClientFilters();
  });

  document.getElementById("q").addEventListener("input", () => {
    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(executeClientFilters, 60);
  });

  document.getElementById("sort").addEventListener("change", executeClientFilters);
  document.getElementById("dir").addEventListener("change", executeClientFilters);
  document.getElementById("bound-only").addEventListener("change", executeClientFilters);

  document.getElementById("archive").addEventListener("click", (event) => {
    const thread = event.target.closest("[data-thread]");
    if (thread) {
      openThread(thread.dataset.thread);
      return;
    }
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

  window.addEventListener("resize", sizeBar);
}

function init() {
  const footer = document.getElementById("footer-meta");
  try {
    archive = buildArchive();
    byId.clear();
    archive.forEach((file) => byId.set(file.id, file));
    const milestone = document.getElementById("milestone-count");
    if (milestone) milestone.textContent = String(ARCHIVE_MILESTONE);
    const bound = archive.filter(isBoundStatus).length;
    const nuclear = archive.filter((file) => file.tier === "nuclear").length;
    if (footer) {
      footer.textContent = `${archive.length} files indexed · ${bound} bound · ${nuclear} nuclear · schema ${SCHEMA_VERSION}`;
    }
    renderChips();
    renderArchive(archive);
    bind();
    sizeBar();
    openFromHash();
  } catch (error) {
    const feed = document.getElementById("feed-grid");
    if (feed) feed.textContent = `Archive failed to build: ${error.message}`;
    if (footer) footer.textContent = "Catalog failed.";
  }
}

if (typeof document === "undefined") {
  const built = buildArchive();
  const ids = ["AUDIT-001", "AUDIT-032", "AUDIT-043", "AUDIT-044", "AUDIT-052", "AUDIT-062", "AUDIT-098", "AUDIT-130"];
  const nuclear = ids.map((id) => built.find((file) => file.id === id));
  const mark = built.find((file) => file.id === "AUDIT-130");
  const numbers = built.find((file) => file.id === "AUDIT-199");
  const matthew = built.find((file) => file.id === "AUDIT-061");
  const parallels = built.filter((file) => file.n >= 333 && file.n <= 350);
  const banned = built.some((file) => file.blob.includes("word-for-word plagiarized text") || file.blob.includes("late medieval insertion is"));
  console.log(JSON.stringify({
    ok: built.length === 350
      && nuclear.every((file) => file && file.tier === "nuclear" && file.status === "forensic")
      && mark.serialLabel === "Add MS 43725 (Codex Sinaiticus)"
      && mark.blob.includes("late 2nd century ce")
      && mark.blob.includes("against heresies")
      && mark.blob.includes("3.10.5")
      && mark.blob.includes("not a late medieval insertion")
      && !/\b2nd century bce\b|\bsecond-century bce text is\b/.test(mark.summary)
      && numbers.verse.startsWith("Numbers 11:24")
      && numbers.status === "scaffold"
      && numbers.department === "Scribal Revisions"
      && numbers.blob.includes("prophetic spirit")
      && numbers.blob.includes("kibroth-hattaavah")
      && numbers.blob.includes("numbers 11:33")
      && matthew.verse === "Matthew 28:19"
      && matthew.status === "scaffold"
      && matthew.blob.includes("not a post-nicene addition")
      && matthew.blob.includes("early textual citation variant")
      && parallels.length === 18
      && parallels.every((file) => file.status === "scaffold" && file.blob.includes("advanced parallel conceptual evolution inside a shared internal mystical framework") && file.forensic.sigla[0].startsWith("Unbound."))
      && !banned,
    length: built.length,
    bound: built.filter(isBoundStatus).length,
    scaffold: built.filter((file) => file.status === "scaffold").length,
    nuclear: nuclear.map((file) => `${file.id} ${file.verse} ${file.serialLabel}`)
  }));
} else {
  init();
}
