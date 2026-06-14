import type { LText } from "@/lib/types";

export type ExpertCategory =
  | "medical"
  | "nutrition"
  | "movement"
  | "mind"
  | "spa"
  | "sleep";

export interface ExpertTimelineItem {
  period: LText;
  title: LText;
  body: LText;
}

export interface ExpertProfile {
  id: string;
  category: ExpertCategory;
  name: LText;
  title: LText;
  image?: string;
  quote: LText;
  shortBio: LText;
  about: LText[];
  specialties: LText[];
  suitedFor: LText[];
  credentials: LText[];
  timeline: ExpertTimelineItem[];
  languages: LText[];
  serviceModes: LText[];
  location: LText;
  rating: number;
  yearsExperience: number;
  isVerified: boolean;
}

export const EXPERT_CATEGORY_ORDER: ExpertCategory[] = [
  "medical",
  "nutrition",
  "sleep",
  "movement",
  "mind",
  "spa",
];

export const EXPERTS: ExpertProfile[] = [
  {
    id: "sawanan-watcharawanich",
    category: "medical",
    name: {
      th: "พญ. สวนันท์ วัชราวนิช",
      en: "Dr. Sawanan Watcharawanich",
    },
    title: {
      th: "แพทย์และผู้บริหารระบบบริการสุขภาพ",
      en: "Physician and health service executive",
    },
    image: "/experts/sawanan-watcharawanich.jpg",
    quote: {
      th: "ช่วยให้แผนเวลเนสมีความรอบคอบ ปลอดภัย และเชื่อมกับคุณภาพการดูแลจริง",
      en: "Helping each wellness plan become thoughtful, safe and grounded in real care quality.",
    },
    shortBio: {
      th: "ประสบการณ์เด่นด้าน Medical Administration การพัฒนาคุณภาพบริการ และการเชื่อมระบบโรงพยาบาลกับการดูแลผู้เข้าพัก",
      en: "Known for medical administration, service quality development and connecting hospital systems with guest care.",
    },
    about: [
      {
        th: "แพทย์หญิง สวนันท์ วัชราวนิช เป็นแพทย์และผู้บริหารโรงพยาบาลที่มีประสบการณ์ทั้งในภาครัฐและเอกชน โดยมีข้อมูลยืนยันว่าเคยดำรงตำแหน่งผู้อำนวยการโรงพยาบาลจะนะ จังหวัดสงขลา ในช่วง พ.ศ. 2535-2536",
        en: "Dr. Sawanan Watcharawanich is a physician and hospital executive with experience across public and private healthcare. Public records confirm her past role as director of Chana Hospital in Songkhla during 1992-1993.",
      },
      {
        th: "ในช่วงหลัง ข้อมูลสาธารณะเชื่อมโยงท่านกับบทบาทผู้บริหารฝ่ายการแพทย์และงานพัฒนาคุณภาพบริการของโรงพยาบาลเอกชน ทำให้โปรไฟล์ของท่านเหมาะกับการช่วยตรวจมุมมองความปลอดภัย คุณภาพบริการ และการประสานงานด้านสุขภาพในแพ็กเกจเวลเนส",
        en: "More recent public information links her to medical executive and service quality roles in private hospitals, making her profile valuable for reviewing safety, care quality and healthcare coordination inside wellness journeys.",
      },
    ],
    specialties: [
      { th: "Medical administration", en: "Medical administration" },
      { th: "Hospital service quality", en: "Hospital service quality" },
      { th: "Preventive care review", en: "Preventive care review" },
      { th: "Guest safety planning", en: "Guest safety planning" },
    ],
    suitedFor: [
      {
        th: "ผู้เข้าพักที่ต้องการความมั่นใจด้านสุขภาพก่อนเลือกโปรแกรม",
        en: "Guests who want health confidence before choosing a programme.",
      },
      {
        th: "แพ็กเกจที่มี health screening หรือการดูแลเชิงป้องกัน",
        en: "Packages involving health screening or preventive care.",
      },
      {
        th: "ผู้ที่มีโรคประจำตัวหรือเงื่อนไขสุขภาพที่ควรมีผู้เชี่ยวชาญช่วยดู",
        en: "Guests with medical conditions that should be reviewed by an expert.",
      },
    ],
    credentials: [
      {
        th: "อดีตผู้อำนวยการโรงพยาบาลจะนะ จังหวัดสงขลา",
        en: "Former director of Chana Hospital, Songkhla.",
      },
      {
        th: "เคยมีชื่อในบัญชีผู้มีคุณสมบัติเข้ารับการสรรหาเป็นกรรมการเขตสุขภาพเพื่อประชาชน เขตพื้นที่ 13 กรุงเทพมหานคร",
        en: "Listed as a qualified candidate for a public health district committee in Bangkok Health Area 13.",
      },
      {
        th: "ประสบการณ์ผู้บริหารฝ่ายการแพทย์และงานพัฒนาคุณภาพบริการในโรงพยาบาลเอกชน",
        en: "Experience in medical executive work and service quality development in private hospitals.",
      },
    ],
    timeline: [
      {
        period: { th: "พ.ศ. 2535-2536", en: "1992-1993" },
        title: {
          th: "ผู้อำนวยการโรงพยาบาลจะนะ",
          en: "Director of Chana Hospital",
        },
        body: {
          th: "ข้อมูลจากทำเนียบผู้อำนวยการของโรงพยาบาลจะนะยืนยันบทบาทในภาครัฐระดับพื้นที่",
          en: "Chana Hospital's director roster confirms this public-sector leadership role.",
        },
      },
      {
        period: { th: "พ.ศ. 2560", en: "2017" },
        title: {
          th: "ผู้แทนสถานพยาบาลเอกชนในกระบวนการสรรหาระดับเขตสุขภาพ",
          en: "Private healthcare representative in a health-area selection process",
        },
        body: {
          th: "ปรากฏชื่อในเอกสารของสำนักงานคณะกรรมการสุขภาพแห่งชาติ",
          en: "Named in documentation from Thailand's National Health Commission Office.",
        },
      },
      {
        period: { th: "พ.ศ. 2566-2569", en: "2023-2026" },
        title: {
          th: "บทบาทผู้บริหารฝ่ายการแพทย์และคุณภาพบริการ",
          en: "Medical administration and service quality leadership",
        },
        body: {
          th: "ข้อมูลสาธารณะหลายแหล่งเชื่อมโยงกับงานบริหารการแพทย์และการเป็นตัวแทนองค์กรในเวทีคุณภาพบริการ",
          en: "Public sources connect her to medical administration and organisational representation in service quality forums.",
        },
      },
    ],
    languages: [
      { th: "ไทย", en: "Thai" },
      { th: "อังกฤษ", en: "English" },
    ],
    serviceModes: [
      { th: "Medical review", en: "Medical review" },
      { th: "Quality advisory", en: "Quality advisory" },
      { th: "Preventive care planning", en: "Preventive care planning" },
    ],
    location: { th: "กรุงเทพฯ / ออนไลน์", en: "Bangkok / online" },
    rating: 4.9,
    yearsExperience: 30,
    isVerified: true,
  },
  {
    id: "panrawee-praditsorn",
    category: "nutrition",
    name: {
      th: "ดร. ปานรวีร์ ประดิษฐ์ศร",
      en: "Dr. Panrawee Praditsorn",
    },
    title: {
      th: "นักกำหนดอาหารวิชาชีพและนักวิจัยโภชนาการ",
      en: "Registered dietitian and nutrition researcher",
    },
    image: "/experts/panrawee-praditsorn.jpg",
    quote: {
      th: "ออกแบบอาหารสุขภาพให้เชื่อมทั้งสารอาหาร พฤติกรรม และบริบทชีวิตจริง",
      en: "Designing healthy food guidance that connects nutrients, behaviour and real-life context.",
    },
    shortBio: {
      th: "ผู้เชี่ยวชาญด้านโภชนาการชุมชน ระบบอาหารในโรงเรียน และ food environment จากสถาบันโภชนาการ มหาวิทยาลัยมหิดล",
      en: "A community nutrition and food environment specialist from Mahidol University's Institute of Nutrition.",
    },
    about: [
      {
        th: "ดร. ปานรวีร์ ประดิษฐ์ศร เป็นนักกำหนดอาหารวิชาชีพและนักวิจัยด้านโภชนาการของสถาบันโภชนาการ มหาวิทยาลัยมหิดล มีพื้นฐานด้าน Nutrition and Dietetics และเส้นทางวิชาการที่เชื่อมงานวิจัยกับการใช้งานจริงในระบบอาหาร",
        en: "Dr. Panrawee Praditsorn is a registered dietitian and nutrition researcher at the Institute of Nutrition, Mahidol University, with a foundation in nutrition and dietetics and a research path connected to real-world food systems.",
      },
      {
        th: "ภาพรวมงานของเธอเน้น school food environment, โภชนาการเด็ก, โปรแกรมอาหารกลางวันโรงเรียน, food access และ nutrition education ซึ่งสามารถต่อยอดเป็นการออกแบบเมนูและคำแนะนำด้านอาหารในแพ็กเกจเวลเนสของ Goodfill Care",
        en: "Her work focuses on school food environments, child nutrition, school lunch programmes, food access and nutrition education. Those strengths translate well into menu planning and nutrition guidance for Goodfill Care packages.",
      },
    ],
    specialties: [
      { th: "Nutrition and dietetics", en: "Nutrition and dietetics" },
      { th: "Healthy menu planning", en: "Healthy menu planning" },
      { th: "Food environment research", en: "Food environment research" },
      { th: "Health promotion", en: "Health promotion" },
    ],
    suitedFor: [
      {
        th: "ผู้เข้าพักที่อยากให้เมนูในทริปสอดคล้องกับเป้าหมายสุขภาพ",
        en: "Guests who want trip menus aligned with their health goals.",
      },
      {
        th: "โปรแกรมลดน้ำตาล ฟื้นพลัง และ plant-based wellness",
        en: "Lower-sugar, recovery and plant-based wellness programmes.",
      },
      {
        th: "ครอบครัวที่ต้องการวางอาหารให้เหมาะกับวัยและพฤติกรรม",
        en: "Families that need age-aware and behaviour-aware food planning.",
      },
    ],
    credentials: [
      {
        th: "นักกำหนดอาหารวิชาชีพ สถาบันโภชนาการ มหาวิทยาลัยมหิดล",
        en: "Registered dietitian, Institute of Nutrition, Mahidol University.",
      },
      {
        th: "M.Sc. Nutrition and Dietetics",
        en: "M.Sc. in Nutrition and Dietetics.",
      },
      {
        th: "Doctoral research at the Center for Development Research, University of Bonn, Germany",
        en: "Doctoral research at the Center for Development Research, University of Bonn, Germany.",
      },
    ],
    timeline: [
      {
        period: { th: "พ.ศ. 2562", en: "2019" },
        title: {
          th: "Fellowship ด้าน food environment",
          en: "Food environment fellowship",
        },
        body: {
          th: "ได้รับ fellowship จาก National Institute of Health and Nutrition ประเทศญี่ปุ่น ในหัวข้อการป้องกันโรคอ้วนในเด็ก",
          en: "Received a fellowship from Japan's National Institute of Health and Nutrition on food environments and childhood obesity prevention.",
        },
      },
      {
        period: { th: "พ.ศ. 2565-2567", en: "2022-2024" },
        title: {
          th: "ผลงานวิจัยด้านระบบอาหารและโภชนาการโรงเรียน",
          en: "Research on school food systems and nutrition",
        },
        body: {
          th: "ร่วมบทความเกี่ยวกับ perceived food environments, Thai school lunch และ nutrient profiling",
          en: "Co-authored work on perceived food environments, Thai school lunch systems and nutrient profiling.",
        },
      },
      {
        period: { th: "พ.ศ. 2567", en: "2024" },
        title: {
          th: "นำเสนองานวิจัยด้าน sustainable food systems",
          en: "Presented sustainable food systems research",
        },
        body: {
          th: "นำเสนอ findings จาก PhD research เรื่องความร่วมมือระหว่าง School Lunch Program กับ local farms",
          en: "Presented PhD findings on collaboration between school lunch programmes and local farms.",
        },
      },
    ],
    languages: [
      { th: "ไทย", en: "Thai" },
      { th: "อังกฤษ", en: "English" },
    ],
    serviceModes: [
      { th: "Nutrition review", en: "Nutrition review" },
      { th: "Menu advisory", en: "Menu advisory" },
      { th: "Family food planning", en: "Family food planning" },
    ],
    location: { th: "กรุงเทพฯ / ออนไลน์", en: "Bangkok / online" },
    rating: 4.9,
    yearsExperience: 10,
    isVerified: true,
  },
  {
    id: "mira-sutham",
    category: "sleep",
    name: { th: "พญ. มีรา สุธรรม", en: "Dr. Mira Sutham" },
    title: {
      th: "แพทย์ที่ปรึกษาด้าน sleep recovery",
      en: "Sleep recovery physician",
    },
    quote: {
      th: "การนอนที่ดีเริ่มจากจังหวะชีวิตที่ร่างกายเชื่อใจ",
      en: "Better sleep begins with a rhythm the body can trust.",
    },
    shortBio: {
      th: "mock profile สำหรับออกแบบ flow การแนะนำผู้เชี่ยวชาญด้านการนอน",
      en: "A mock profile for shaping the sleep expert recommendation flow.",
    },
    about: [
      {
        th: "โปรไฟล์ตัวอย่างสำหรับ POC ด้าน sleep recovery ใช้ทดสอบการนำเสนอแพทย์ที่ช่วยดูจังหวะการนอน ความเครียด และการพักฟื้นในแพ็กเกจเวลเนส",
        en: "A POC profile for sleep recovery, used to test how a physician can review sleep rhythm, stress and restoration inside wellness packages.",
      },
    ],
    specialties: [
      { th: "Sleep hygiene", en: "Sleep hygiene" },
      { th: "Jet lag recovery", en: "Jet lag recovery" },
      { th: "Stress-linked sleep", en: "Stress-linked sleep" },
    ],
    suitedFor: [
      { th: "ผู้ที่นอนหลับยากหรือตื่นไม่สดชื่น", en: "Guests with poor sleep quality." },
      { th: "แพ็กเกจพักฟื้นจาก burnout", en: "Burnout recovery packages." },
    ],
    credentials: [
      { th: "Mock clinical sleep advisory profile", en: "Mock clinical sleep advisory profile." },
    ],
    timeline: [],
    languages: [
      { th: "ไทย", en: "Thai" },
      { th: "อังกฤษ", en: "English" },
    ],
    serviceModes: [
      { th: "Sleep plan review", en: "Sleep plan review" },
      { th: "Recovery pacing", en: "Recovery pacing" },
    ],
    location: { th: "ออนไลน์", en: "Online" },
    rating: 4.8,
    yearsExperience: 12,
    isVerified: true,
  },
  {
    id: "ratchanon-vela",
    category: "movement",
    name: { th: "รัชชานนท์ เวลา", en: "Ratchanon Vela" },
    title: {
      th: "นักกายภาพบำบัดและ movement coach",
      en: "Physiotherapist and movement coach",
    },
    quote: {
      th: "ฟื้นร่างกายให้กลับมาเคลื่อนไหวด้วยความมั่นใจ",
      en: "Restoring confident movement through practical body care.",
    },
    shortBio: {
      th: "mock profile สำหรับออกแบบคำแนะนำด้าน mobility, pain care และ active wellness",
      en: "A mock profile for mobility, pain care and active wellness guidance.",
    },
    about: [
      {
        th: "โปรไฟล์ตัวอย่างสำหรับ POC ด้าน movement recovery ช่วยให้เห็นการจับคู่ผู้เชี่ยวชาญกับแพ็กเกจที่มีโยคะ ฟิตเนส มวยไทย หรือการเคลื่อนไหวหลังอาการปวด",
        en: "A POC profile for movement recovery, showing how an expert can support packages involving yoga, fitness, Muay Thai or post-pain movement.",
      },
    ],
    specialties: [
      { th: "Mobility", en: "Mobility" },
      { th: "Pain-aware movement", en: "Pain-aware movement" },
      { th: "Active recovery", en: "Active recovery" },
    ],
    suitedFor: [
      { th: "ผู้ที่อยากเริ่มกลับมาออกกำลังกาย", en: "Guests returning to exercise." },
      { th: "โปรแกรม active fitness", en: "Active fitness programmes." },
    ],
    credentials: [
      { th: "Mock physiotherapy and movement profile", en: "Mock physiotherapy and movement profile." },
    ],
    timeline: [],
    languages: [
      { th: "ไทย", en: "Thai" },
      { th: "อังกฤษ", en: "English" },
    ],
    serviceModes: [
      { th: "Movement screen", en: "Movement screen" },
      { th: "Exercise adaptation", en: "Exercise adaptation" },
    ],
    location: { th: "Koh Samui / ออนไลน์", en: "Koh Samui / online" },
    rating: 4.8,
    yearsExperience: 9,
    isVerified: true,
  },
  {
    id: "arisa-mindwell",
    category: "mind",
    name: { th: "อริสา มายด์เวลล์", en: "Arisa Mindwell" },
    title: {
      th: "wellness counselor ด้านความเครียดและสมดุลใจ",
      en: "Stress and emotional balance wellness counselor",
    },
    quote: {
      th: "พื้นที่ปลอดภัยเล็ก ๆ ช่วยให้การดูแลตัวเองเริ่มง่ายขึ้น",
      en: "A small safe space can make self-care easier to begin.",
    },
    shortBio: {
      th: "mock profile สำหรับทดสอบการนำเสนอผู้เชี่ยวชาญด้านจิตใจในแพ็กเกจเวลเนส",
      en: "A mock profile for presenting mind-care experts inside wellness packages.",
    },
    about: [
      {
        th: "โปรไฟล์ตัวอย่างสำหรับ POC ด้าน mind care ใช้ทดสอบหน้า detail ที่อธิบายรูปแบบการดูแลใจ ความเครียด และ burnout แบบไม่ทำให้ผู้ใช้รู้สึกหนักเกินไป",
        en: "A POC profile for mind care, used to test a detail page that explains stress, burnout and emotional balance in a gentle, accessible tone.",
      },
    ],
    specialties: [
      { th: "Stress reset", en: "Stress reset" },
      { th: "Burnout support", en: "Burnout support" },
      { th: "Mindful routines", en: "Mindful routines" },
    ],
    suitedFor: [
      { th: "ผู้ที่อยากพักใจจากงานและความเครียดสะสม", en: "Guests needing rest from work and accumulated stress." },
    ],
    credentials: [
      { th: "Mock wellness counseling profile", en: "Mock wellness counseling profile." },
    ],
    timeline: [],
    languages: [
      { th: "ไทย", en: "Thai" },
      { th: "อังกฤษ", en: "English" },
    ],
    serviceModes: [
      { th: "Mind care session", en: "Mind care session" },
      { th: "Burnout pathway review", en: "Burnout pathway review" },
    ],
    location: { th: "ออนไลน์", en: "Online" },
    rating: 4.7,
    yearsExperience: 8,
    isVerified: true,
  },
  {
    id: "kanda-herb-studio",
    category: "spa",
    name: { th: "กานดา เฮิร์บ สตูดิโอ", en: "Kanda Herb Studio" },
    title: {
      th: "ผู้เชี่ยวชาญ Thai healing และสมุนไพร",
      en: "Thai healing and herbal care specialist",
    },
    quote: {
      th: "สัมผัสและสมุนไพรที่เหมาะกับร่างกาย ช่วยให้การพักลึกขึ้น",
      en: "The right touch and herbs can make rest feel deeper.",
    },
    shortBio: {
      th: "mock profile สำหรับเชื่อมศาสตร์สปาไทยกับการออกแบบแพ็กเกจ",
      en: "A mock profile connecting Thai spa wisdom with package design.",
    },
    about: [
      {
        th: "โปรไฟล์ตัวอย่างสำหรับ POC ด้าน Thai healing ช่วยให้ทีมเห็นวิธีอธิบายความเชี่ยวชาญของ therapist และการเลือกบริการสปาที่เหมาะกับผู้เข้าพักแต่ละแบบ",
        en: "A POC profile for Thai healing, showing how therapist expertise and spa service selection can be explained for different guest needs.",
      },
    ],
    specialties: [
      { th: "Thai herbal care", en: "Thai herbal care" },
      { th: "Gentle bodywork", en: "Gentle bodywork" },
      { th: "Spa journey fit", en: "Spa journey fit" },
    ],
    suitedFor: [
      { th: "ผู้ที่อยากเลือกสปาให้ตรงกับสภาพร่างกาย", en: "Guests who want spa choices aligned with their body condition." },
    ],
    credentials: [
      { th: "Mock Thai healing and spa advisory profile", en: "Mock Thai healing and spa advisory profile." },
    ],
    timeline: [],
    languages: [
      { th: "ไทย", en: "Thai" },
      { th: "อังกฤษ", en: "English" },
    ],
    serviceModes: [
      { th: "Spa pathway review", en: "Spa pathway review" },
      { th: "Herbal care guidance", en: "Herbal care guidance" },
    ],
    location: { th: "Koh Samui", en: "Koh Samui" },
    rating: 4.8,
    yearsExperience: 15,
    isVerified: true,
  },
  {
    id: "nalin-preventive-care",
    category: "medical",
    name: { th: "นลิน พรีเวนทีฟแคร์", en: "Nalin Preventivecare" },
    title: {
      th: "ที่ปรึกษา preventive wellness",
      en: "Preventive wellness advisor",
    },
    quote: {
      th: "ข้อมูลสุขภาพที่ดีทำให้การเดินทางรู้สึกเบาและมั่นใจขึ้น",
      en: "Good health context makes a journey feel lighter and more confident.",
    },
    shortBio: {
      th: "mock profile สำหรับ health screening และการประสานข้อมูลสุขภาพก่อนเดินทาง",
      en: "A mock profile for health screening and pre-trip health coordination.",
    },
    about: [
      {
        th: "โปรไฟล์ตัวอย่างสำหรับ POC ด้าน preventive wellness ใช้ทดสอบการนำเสนอผู้เชี่ยวชาญที่ช่วยจัดระเบียบข้อมูลสุขภาพก่อนการจอง",
        en: "A POC profile for preventive wellness, used to test how an expert can organise health context before booking.",
      },
    ],
    specialties: [
      { th: "Health screening", en: "Health screening" },
      { th: "Preventive wellness", en: "Preventive wellness" },
      { th: "Care coordination", en: "Care coordination" },
    ],
    suitedFor: [
      { th: "ผู้ที่อยากมีภาพรวมสุขภาพก่อนเริ่มโปรแกรม", en: "Guests who want a health overview before beginning a programme." },
    ],
    credentials: [
      { th: "Mock preventive wellness advisory profile", en: "Mock preventive wellness advisory profile." },
    ],
    timeline: [],
    languages: [
      { th: "ไทย", en: "Thai" },
      { th: "อังกฤษ", en: "English" },
    ],
    serviceModes: [
      { th: "Health readiness check", en: "Health readiness check" },
      { th: "Care coordination", en: "Care coordination" },
    ],
    location: { th: "Koh Samui / ออนไลน์", en: "Koh Samui / online" },
    rating: 4.7,
    yearsExperience: 11,
    isVerified: true,
  },
];

export function getExpert(id: string): ExpertProfile | undefined {
  return EXPERTS.find((expert) => expert.id === id);
}
