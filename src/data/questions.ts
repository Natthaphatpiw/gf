import type { LText } from "@/lib/types";

/* ============================================================
 * "Island Journey" — the gamified assessment.
 *
 * Design intent: nothing here reads like a clinical questionnaire.
 * The guest plays through one imagined day on Koh Samui; every
 * playful choice doubles as a signal the LLM converts into:
 *   stress level, migraine tendency, mental wellness,
 *   personal habits, and a Samui Wellness Archetype.
 *
 * `measures` is internal metadata passed to the LLM so it knows
 * what each answer hints at — the guest never sees it.
 * ============================================================ */

export type QuestionKind = "choice" | "slider" | "mbti" | "text";

export interface QuizOption {
  key: string;
  label: LText;
  /** lucide-react icon name rendered next to the option. */
  icon: string;
  /** Optional local image path rendered when the file exists. */
  image?: string;
}

export interface QuizQuestion {
  id: string;
  kind: QuestionKind;
  /** Small scene label above the question, e.g. "Scene 01 - First light". */
  scene: LText;
  prompt: LText;
  hint?: LText;
  options?: QuizOption[];
  slider?: {
    min: number;
    max: number;
    step: number;
    minLabel: LText;
    maxLabel: LText;
  };
  /** What this answer signals — for the LLM only. */
  measures: string;
  optional?: boolean;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "first_drink",
    kind: "choice",
    scene: { th: "ฉากที่ 1 — แก้วแรกของวัน", en: "Scene 01 — The first glass" },
    prompt: {
      th: "เช้านี้ร่างกายของคุณอยากเริ่มต้นด้วยเครื่องดื่มแบบไหน",
      en: "This morning, what kind of first drink does your body ask for?",
    },
    measures:
      "morning regulation, caffeine reliance, hydration, diet preference, migraine and sleep signal",
    options: [
      {
        key: "herbal_tea",
        label: { th: "ชาสมุนไพรอุ่น ๆ ให้ร่างกายค่อย ๆ ตื่น", en: "Warm herbal tea, letting the body wake gently" },
        icon: "Leaf",
      },
      {
        key: "double_espresso",
        label: { th: "กาแฟเข้มหนึ่งแก้ว ไม่อย่างนั้นเครื่องไม่ติด", en: "A strong coffee — otherwise the engine will not start" },
        icon: "Coffee",
      },
      {
        key: "green_smoothie",
        label: { th: "สมูทตี้ผักผลไม้สด อยากเติมสารอาหารก่อน", en: "A fresh green smoothie — nutrients first" },
        icon: "Sprout",
      },
      {
        key: "coconut",
        label: { th: "มะพร้าวน้ำหอมเย็น ๆ ขอเติมน้ำให้สดชื่น", en: "A chilled young coconut for easy hydration" },
        icon: "GlassWater",
      },
    ],
  },
  {
    id: "sea_mind",
    kind: "choice",
    scene: { th: "ฉากที่ 2 — ทะเลในใจ", en: "Scene 02 — The sea inside" },
    prompt: {
      th: "ถ้าช่วงนี้ใจของคุณเป็นทะเล มันคือทะเลแบบไหน",
      en: "If your mind lately were the sea, what kind of sea would it be?",
    },
    measures:
      "current perceived stress, emotional load, nervous-system arousal, recovery urgency",
    options: [
      {
        key: "glassy",
        label: { th: "เรียบใสเหมือนกระจก สงบและมองเห็นตัวเองชัด", en: "Glassy and clear — calm enough to see yourself" },
        icon: "Waves",
      },
      {
        key: "gentle_waves",
        label: { th: "มีคลื่นเบา ๆ ยังรับมือได้ แต่รู้ว่าต้องพัก", en: "Gentle waves — manageable, yet asking for rest" },
        icon: "Wind",
      },
      {
        key: "choppy",
        label: { th: "คลื่นแรงเป็นช่วง ๆ เดาทางยากและเหนื่อยง่าย", en: "Choppy swells — unpredictable and tiring" },
        icon: "CloudRain",
      },
      {
        key: "storm",
        label: { th: "พายุเต็มรูปแบบ อยากขึ้นฝั่งแล้ววางทุกอย่างลง", en: "A full storm — ready to come ashore and set things down" },
        icon: "CloudLightning",
      },
    ],
  },
  {
    id: "body_signal",
    kind: "choice",
    scene: { th: "ฉากที่ 3 — ภาษากาย", en: "Scene 03 — Body language" },
    prompt: {
      th: "ช่วงนี้ร่างกายส่งสัญญาณอะไรถึงคุณบ่อยที่สุด",
      en: "Which signal has your body been sending most often lately?",
    },
    measures:
      "somatic stress, muscle tension, headache pattern, eye strain, sleep disruption, migraine indicators",
    options: [
      {
        key: "tight_shoulders",
        label: { th: "บ่า คอ และไหล่ตึง เหมือนเก็บความเครียดไว้ทั้งวัน", en: "Neck and shoulders tight, as if holding the whole day" },
        icon: "Anchor",
      },
      {
        key: "throbbing_head",
        label: { th: "ขมับตุบ ๆ หรือปวดหัวข้างเดียวเป็นบางช่วง", en: "Pulsing temples or one-sided headaches at times" },
        icon: "Activity",
      },
      {
        key: "heavy_eyes",
        label: { th: "ตาล้า หนักหัว โดยเฉพาะหลังใช้หน้าจอนาน", en: "Tired eyes and a heavy head, especially after screens" },
        icon: "EyeOff",
      },
      {
        key: "restless_sleep",
        label: { th: "หลับไม่ต่อเนื่อง ตื่นกลางดึก หรือเหมือนพักไม่เต็มที่", en: "Broken sleep, night waking, or never quite rested" },
        icon: "Moon",
      },
      {
        key: "all_quiet",
        label: { th: "ร่างกายค่อนข้างสงบ แทบไม่มีสัญญาณรบกวน", en: "Mostly quiet — very few disruptive signals" },
        icon: "Smile",
      },
    ],
  },
  {
    id: "sensitivity",
    kind: "slider",
    scene: { th: "ฉากที่ 4 — เซนเซอร์ของคุณ", en: "Scene 04 — Your sensors" },
    prompt: {
      th: "แสงจ้า เสียงดัง กลิ่นแรง หรือคนเยอะ ทำให้คุณล้าเร็วแค่ไหน",
      en: "How quickly do bright light, loud sound, strong scent, or crowds drain you?",
    },
    hint: {
      th: "ลากเพื่อบอกระดับความไวของระบบประสาทในช่วงนี้",
      en: "Drag to set how sensitive your nervous system feels lately",
    },
    measures:
      "sensory sensitivity, migraine trigger tendency, crowd tolerance, nervous-system threshold",
    slider: {
      min: 0,
      max: 10,
      step: 1,
      minLabel: { th: "ไม่ค่อยสะเทือน อยู่ได้สบาย", en: "Barely affected — I stay comfortable" },
      maxLabel: { th: "ไวมาก รับสิ่งเร้าได้ไม่นาน", en: "Very sensitive — stimulation drains me fast" },
    },
  },
  {
    id: "last_laugh",
    kind: "choice",
    scene: { th: "ฉากที่ 5 — เสียงหัวเราะล่าสุด", en: "Scene 05 — The last real laugh" },
    prompt: {
      th: "ครั้งล่าสุดที่คุณหัวเราะแบบปล่อยใจจริง ๆ อยู่ไกลแค่ไหน",
      en: "How far away does your last genuine, unguarded laugh feel?",
    },
    measures:
      "positive affect, joy access, emotional recovery, mental wellness signal",
    options: [
      {
        key: "today",
        label: { th: "วันนี้เอง ยังรู้สึกถึงความเบานั้นอยู่", en: "Today — I can still feel that lightness" },
        icon: "Laugh",
      },
      {
        key: "this_week",
        label: { th: "ภายในสัปดาห์นี้ ยังพอมีโมเมนต์ดี ๆ", en: "This week — there have been good moments" },
        icon: "CalendarDays",
      },
      {
        key: "cant_recall",
        label: { th: "นึกไม่ค่อยออก เหมือนช่วงนี้ใจตึงกว่าปกติ", en: "Hard to remember — my heart has felt tight lately" },
        icon: "CloudFog",
      },
      {
        key: "right_now",
        label: { th: "ตอนนี้ก็เริ่มยิ้มแล้ว อย่างน้อยยังมีพื้นที่ให้เบาขึ้น", en: "Right now, a little — there is still room to soften" },
        icon: "Sparkles",
      },
    ],
  },
  {
    id: "battery",
    kind: "slider",
    scene: { th: "ฉากที่ 6 — แบตพลังใจ", en: "Scene 06 — Inner battery" },
    prompt: {
      th: "ถ้าพลังใจและพลังร่างกายรวมกันเป็นแบตเตอรี่ ตอนนี้เหลือกี่เปอร์เซ็นต์",
      en: "If your emotional and physical energy were one battery, what percentage is left?",
    },
    hint: {
      th: "ตอบจากความรู้สึกตอนนี้ ไม่ต้องพยายามให้ดูดี",
      en: "Answer by feel — no need to make it sound better than it is",
    },
    measures:
      "energy reserve, burnout tendency, mental wellness, recovery capacity, fatigue severity",
    slider: {
      min: 0,
      max: 100,
      step: 5,
      minLabel: { th: "ใกล้หมด ต้องชาร์จจริงจัง", en: "Nearly flat — I need a real recharge" },
      maxLabel: { th: "เต็มและมั่นคง พร้อมใช้ชีวิต", en: "Full and steady — ready for life" },
    },
  },
  {
    id: "last_night",
    kind: "choice",
    scene: { th: "ฉากที่ 7 — คืนที่ผ่านมา", en: "Scene 07 — Last night" },
    prompt: {
      th: "การนอนของคุณช่วงนี้เหมือนสัตว์ตัวไหนที่สุด",
      en: "Which creature has your sleep resembled most lately?",
    },
    measures:
      "sleep quality, circadian rhythm, restoration depth, stress and migraine risk",
    options: [
      {
        key: "log",
        label: { th: "หมีจำศีล หลับลึกยาวและตื่นมาค่อนข้างเต็ม", en: "A hibernating bear — deep, long, and fairly restored" },
        icon: "Mountain",
        image: "/assessment/animals/sleep-bear.jpg",
      },
      {
        key: "cat_nap",
        label: { th: "แมวงีบ หลับ ๆ ตื่น ๆ แต่ยังพอประคองวันได้", en: "A napping cat — waking often, but managing the day" },
        icon: "Cat",
        image: "/assessment/animals/sleep-cat.jpg",
      },
      {
        key: "owl",
        label: { th: "นกฮูก กว่าจะหลับก็ดึก สมองไม่ค่อยยอมปิด", en: "An owl — sleep comes late because the mind stays on" },
        icon: "Telescope",
        image: "/assessment/animals/sleep-owl.jpg",
      },
      {
        key: "jellyfish",
        label: { th: "แมงกะพรุน ล่องลอยทั้งคืน ตื่นมาก็ยังเพลีย", en: "A jellyfish — drifting all night and still tired by morning" },
        icon: "Droplets",
        image: "/assessment/animals/sleep-jellyfish.jpg",
      },
    ],
  },
  {
    id: "company",
    kind: "choice",
    scene: { th: "ฉากที่ 8 — เพื่อนร่วมทาง", en: "Scene 08 — Travel company" },
    prompt: {
      th: "ถ้าทริปนี้ตั้งใจให้คุณฟื้นพลังจริง ๆ คุณอยากมีใครอยู่ข้าง ๆ",
      en: "If this trip were truly for your recovery, who would you want beside you?",
    },
    measures:
      "social recharge style, attachment comfort, support preference, Social vs Solitary axis",
    options: [
      {
        key: "solo",
        label: { th: "ตัวคนเดียว ได้ยินเสียงตัวเองชัดที่สุด", en: "Just me — I hear myself best alone" },
        icon: "User",
      },
      {
        key: "one_person",
        label: { th: "คนสำคัญหนึ่งคน อยู่ใกล้แต่ไม่ต้องพูดเยอะ", en: "One close person, near me without too much talking" },
        icon: "HeartHandshake",
      },
      {
        key: "small_circle",
        label: { th: "กลุ่มเล็กที่ไว้ใจ คุยง่ายและไม่ต้องฝืน", en: "A small trusted circle where nothing feels forced" },
        icon: "Users",
      },
      {
        key: "whole_family",
        label: { th: "ครอบครัวหรือคนรักครบทีม ฟื้นพลังไปด้วยกัน", en: "Family or loved ones together, restoring as a group" },
        icon: "Home",
      },
    ],
  },
  {
    id: "crossroads",
    kind: "choice",
    scene: { th: "ฉากที่ 9 — ทางแยกไร้ป้าย", en: "Scene 09 — The unmarked fork" },
    prompt: {
      th: "เมื่อแผนไม่ชัดและต้องตัดสินใจต่อ คุณมักเลือกวิธีไหน",
      en: "When the plan is unclear and you must decide, what do you usually do?",
    },
    measures:
      "structure preference, uncertainty tolerance, planning style, Planned vs Flowing axis",
    options: [
      {
        key: "open_map",
        label: { th: "หยุดดูแผนที่ เช็กข้อมูลก่อนค่อยไปต่อ", en: "Pause, check the map, then move with clarity" },
        icon: "Map",
      },
      {
        key: "prettier_path",
        label: { th: "เลือกทางที่รู้สึกใช่ วิวสวยกว่าก็ไปทางนั้น", en: "Choose the road that feels right, especially if it is beautiful" },
        icon: "Flower2",
      },
      {
        key: "ask_local",
        label: { th: "ถามคนแถวนั้น ชอบได้คำแนะนำพร้อมเรื่องเล่า", en: "Ask someone nearby — advice with a story is even better" },
        icon: "MessageCircle",
      },
      {
        key: "flip_coin",
        label: { th: "ปล่อยให้จังหวะพาไป ไม่อยากคิดเยอะเกินจำเป็น", en: "Let the moment choose — I do not want to overthink it" },
        icon: "CircleDot",
      },
    ],
  },
  {
    id: "recharge",
    kind: "choice",
    scene: { th: "ฉากที่ 10 — สถานีชาร์จพลัง", en: "Scene 10 — The charging station" },
    prompt: {
      th: "กิจกรรมแบบไหนเรียกคุณกลับมาเป็นตัวเองได้เร็วที่สุด",
      en: "Which activity brings you back to yourself fastest?",
    },
    measures:
      "restoration mode, pace preference, Body vs Mind axis, Active vs Tranquil axis, package fit",
    options: [
      {
        key: "sweat",
        label: { th: "ออกแรงให้เหงื่อออก แล้วรู้สึกโล่งเหมือนรีเซ็ต", en: "A proper sweat, then the relief of a reset" },
        icon: "Flame",
      },
      {
        key: "float",
        label: { th: "ลอยตัวนิ่ง ๆ ในน้ำ ให้ร่างกายค่อย ๆ คลาย", en: "Floating still in water while the body slowly releases" },
        icon: "Waves",
      },
      {
        key: "quiet_read",
        label: { th: "มุมเงียบ หนังสือ สมุดบันทึก หรือเวลาอยู่กับความคิด", en: "A quiet corner with a book, journal, or your own thoughts" },
        icon: "BookOpen",
      },
      {
        key: "long_talk",
        label: { th: "บทสนทนาลึก ๆ กับคนที่รับฟังกันจริง", en: "A deep conversation with someone who truly listens" },
        icon: "MessagesSquare",
      },
    ],
  },
];

export const MBTI_TYPES = [
  "INTJ", "INTP", "ENTJ", "ENTP",
  "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISFJ", "ESTJ", "ESFJ",
  "ISTP", "ISFP", "ESTP", "ESFP",
];
