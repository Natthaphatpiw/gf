import type {
  LText,
  PackageCareDetails,
  PackageMeal,
  WellnessPackage,
} from "@/lib/types";

/* ============================================================
 * Goodfill Care — Samui Wellness · Curated package catalog
 * 15 signature journeys across three tiers, hosted by the
 * island's most trusted wellness houses, kitchens and clinics.
 * ============================================================ */

export const PACKAGES: WellnessPackage[] = [
  /* ---------------------------------------------------------
   * TIER · BASIC — single-day island experiences
   * ------------------------------------------------------- */
  {
    id: "basic-island-reset",
    tier: "basic",
    name: {
      th: "รีเซ็ตเกาะหนึ่งวัน",
      en: "Island Reset",
    },
    tagline: {
      th: "หนึ่งวันคืนสมดุลให้ร่างกายด้วยน้ำมันสมุนไพรอุ่น ๆ และอาหารกลางวันที่เบาสบาย",
      en: "A single unhurried day where warm herbal oils and a clean, bright lunch coax your nervous system back to stillness.",
    },
    days: 1,
    nights: 0,
    price: 3400,
    image: "/previews/pre4.jpg",
    partners: ["Eranda Herbal Spa", "Vikasa Life Café"],
    highlights: [
      {
        th: "ทรีตเมนต์ขัดผิวสมุนไพรและนวดน้ำมันอุ่น 90 นาทีท่ามกลางสวนเขียวขจี",
        en: "A 90-minute herbal body polish and warm-oil massage in Eranda's open-air garden pavilions.",
      },
      {
        th: "อาหารกลางวันคลีนปรุงสดพร้อมน้ำสมุนไพรดีท็อกซ์",
        en: "A freshly pressed detox tonic and a clean, chef-built lunch overlooking the hills.",
      },
      {
        th: "ช่วงพักผ่อนเงียบสงบในมุมสวนเพื่อให้กายและใจได้หายใจ",
        en: "Quiet garden downtime built into the day so body and mind can fully exhale.",
      },
    ],
    itinerary: [
      {
        day: 1,
        title: {
          th: "วันรีเซ็ต",
          en: "The Reset Day",
        },
        items: [
          {
            time: "09:30",
            activity: {
              th: "เช็กอินและดื่มชาตะไคร้ใบเตยต้อนรับ พร้อมพูดคุยถึงความต้องการของร่างกาย",
              en: "Welcome check-in with lemongrass-and-pandan tea and a short intention chat.",
            },
            partner: "Eranda Herbal Spa",
          },
          {
            time: "10:00",
            activity: {
              th: "ขัดผิวด้วยสมุนไพรไทยตำสด ตามด้วยอบสมุนไพรในเรือนไอน้ำ",
              en: "Hand-pounded Thai herbal body scrub followed by a steam in the herbal sauna.",
            },
            partner: "Eranda Herbal Spa",
          },
          {
            time: "11:15",
            activity: {
              th: "นวดน้ำมันอโรมาอุ่นแบบเอรันดา ซิกเนเจอร์ 90 นาที",
              en: "Eranda signature warm-aroma oil massage, ninety slow minutes.",
            },
            partner: "Eranda Herbal Spa",
          },
          {
            time: "13:00",
            activity: {
              th: "เดินทางสู่วิกาสะ ไลฟ์ คาเฟ่ บนเนินเขาลามาย",
              en: "Transfer up the Lamai hillside to Vikasa Life Café.",
            },
            partner: "",
          },
          {
            time: "13:30",
            activity: {
              th: "อาหารกลางวันคลีน: บุดดาโบวล์ควินัว เทมเป้ย่าง และน้ำปั่นกรีนดีท็อกซ์",
              en: "Clean lunch: quinoa Buddha bowl, grilled tempeh and a cold-pressed green detox juice.",
            },
            partner: "Vikasa Life Café",
          },
          {
            time: "15:00",
            activity: {
              th: "นั่งพักชมวิวทะเลพร้อมชาสมุนไพร ปิดท้ายวันอย่างผ่อนคลาย",
              en: "Ocean-view herbal tea and quiet time to close the day at ease.",
            },
            partner: "Vikasa Life Café",
          },
        ],
      },
    ],
    suitableFor: {
      th: "เหมาะกับคนทำงานที่เหนื่อยล้าและอยากได้หนึ่งวันเติมพลัง ฟื้นฟูการนอน โดยไม่ต้องค้างคืน",
      en: "Ideal for the time-pressed professional who wants one restorative day to ease fatigue and sleep better, with no overnight stay required.",
    },
    goals: ["burnout_recovery", "sleep_better"],
  },
  {
    id: "basic-sunrise-flow",
    tier: "basic",
    name: {
      th: "โฟลว์รับอรุณ",
      en: "Sunrise Flow",
    },
    tagline: {
      th: "เริ่มต้นวันด้วยโยคะริมหาดยามเช้า บรันช์เพื่อสุขภาพ และการเดินเล่นเลียบทะเลโบ๊ะผุด",
      en: "Greet first light with barefoot beach yoga, a sunlit brunch and a slow shoreline walk along Bophut.",
    },
    days: 1,
    nights: 0,
    price: 2900,
    image: "/previews/pre2.jpg",
    partners: ["Vikasa Yoga Retreat", "Sunny Side Up Café Samui"],
    highlights: [
      {
        th: "คลาสโยคะวินยาสะรับแสงแรกริมทะเล นำโดยครูผู้มากประสบการณ์",
        en: "A Vinyasa class on the sand at first light, guided by Vikasa's seasoned teachers.",
      },
      {
        th: "บรันช์เพื่อสุขภาพหลังคลาส อิ่มสดชื่นรับวันใหม่",
        en: "An energising post-practice brunch to carry you brightly into the day.",
      },
      {
        th: "เดินเล่นเลียบหาดโบ๊ะผุดและหมู่บ้านชาวประมง",
        en: "A gentle walk along Bophut beach into the lanes of Fisherman's Village.",
      },
    ],
    itinerary: [
      {
        day: 1,
        title: {
          th: "วันรับอรุณ",
          en: "The Sunrise Day",
        },
        items: [
          {
            time: "06:00",
            activity: {
              th: "พบกันริมหาดวิกาสะ ดื่มน้ำมะพร้าวสดเตรียมร่างกาย",
              en: "Meet at the Vikasa beachfront with fresh coconut water to prime the body.",
            },
            partner: "Vikasa Yoga Retreat",
          },
          {
            time: "06:30",
            activity: {
              th: "โยคะวินยาสะรับแสงแรก 75 นาที ปิดท้ายด้วยสมาธิหายใจ",
              en: "Seventy-five-minute sunrise Vinyasa flow closing with a guided breath meditation.",
            },
            partner: "Vikasa Yoga Retreat",
          },
          {
            time: "08:15",
            activity: {
              th: "เดินทางลงสู่หมู่บ้านชาวประมงโบ๊ะผุด",
              en: "Transfer down to Fisherman's Village in Bophut.",
            },
            partner: "",
          },
          {
            time: "08:45",
            activity: {
              th: "บรันช์เพื่อสุขภาพ: โบวล์อาซาอิ ไข่ลวกอโวคาโด และสมูทตี้ผลไม้เกาะ",
              en: "Wholesome brunch: an acai bowl, soft eggs with avocado and an island-fruit smoothie.",
            },
            partner: "Sunny Side Up Café Samui",
          },
          {
            time: "10:00",
            activity: {
              th: "เดินเล่นเลียบหาดโบ๊ะผุดอย่างผ่อนคลาย ชมเรือประมงและทะเลยามเช้า",
              en: "An unhurried beach walk along Bophut, watching the morning fishing boats.",
            },
            partner: "",
          },
          {
            time: "11:00",
            activity: {
              th: "ปิดท้ายด้วยกาแฟหรือชาเย็นและช่วงผ่อนคลายส่วนตัว",
              en: "A closing iced coffee or tea and a moment of personal calm.",
            },
            partner: "Sunny Side Up Café Samui",
          },
        ],
      },
    ],
    suitableFor: {
      th: "เหมาะกับผู้ที่รักการเคลื่อนไหวยามเช้าและอยากเริ่มต้นวันอย่างมีพลังพร้อมการนอนที่ดีขึ้น",
      en: "Perfect for early risers who love to move and want an energising start to the day that supports better sleep.",
    },
    goals: ["active_fitness", "sleep_better"],
  },
  {
    id: "basic-plant-discovery",
    tier: "basic",
    name: {
      th: "ค้นพบโลกแพลนต์เบส",
      en: "Plant Discovery",
    },
    tagline: {
      th: "ตามรอยอาหารจากพืชทั่วเกาะ ปิดท้ายด้วยคลาสทำอาหารวีแกนไทยด้วยมือคุณเอง",
      en: "A guided plant-based food trail across the island, finishing with a hands-on Thai vegan cooking class.",
    },
    days: 1,
    nights: 0,
    price: 3900,
    image: "/previews/pre7.webp",
    partners: [
      "Pure Vegan Heaven",
      "Vegan Khunnay",
      "Penne",
      "Lamai Thai Cooking School",
    ],
    highlights: [
      {
        th: "ชิมอาหารจากพืชหลากสไตล์ใน 3 ร้านเด่นของเกาะ",
        en: "A curated tasting trail through three of Samui's standout plant-based kitchens.",
      },
      {
        th: "คลาสทำอาหารวีแกนไทยแท้ เรียนรู้การตำพริกแกงและผัดด้วยตัวเอง",
        en: "An authentic Thai vegan cooking class, pounding your own curry paste from scratch.",
      },
      {
        th: "เคล็ดลับการกินจากพืชแบบยั่งยืนเพื่อนำกลับไปใช้ที่บ้าน",
        en: "Practical, sustainable plant-based eating tips to take home.",
      },
    ],
    itinerary: [
      {
        day: 1,
        title: {
          th: "วันค้นพบรสจากพืช",
          en: "The Plant Trail Day",
        },
        items: [
          {
            time: "10:00",
            activity: {
              th: "เริ่มต้นที่ Pure Vegan Heaven ชิมโบวล์เมดิเตอร์เรเนียนและแฟลตเบรดโฮมเมด",
              en: "Begin at Pure Vegan Heaven with a Mediterranean bowl and house-baked flatbread.",
            },
            partner: "Pure Vegan Heaven",
          },
          {
            time: "11:30",
            activity: {
              th: "แวะ Vegan Khunnay ลิ้มรสผัดไทยวีแกนและแกงเขียวหวานเต้าหู้",
              en: "On to Vegan Khunnay for vegan pad thai and a tofu green curry.",
            },
            partner: "Vegan Khunnay",
          },
          {
            time: "13:00",
            activity: {
              th: "อาหารกลางวันสไตล์อิตาเลียนจากพืชที่ Penne ในย่านลามาย",
              en: "A plant-forward Italian lunch at Penne in the heart of Lamai.",
            },
            partner: "Penne",
          },
          {
            time: "14:30",
            activity: {
              th: "เดินทางสู่โรงเรียนสอนทำอาหารไทยลามาย",
              en: "Transfer to Lamai Thai Cooking School.",
            },
            partner: "",
          },
          {
            time: "15:00",
            activity: {
              th: "คลาสทำอาหารวีแกนไทย: ตำพริกแกง ผัดเต้าหู้สมุนไพร และต้มข่ามะพร้าว",
              en: "Thai vegan cooking class: pound a curry paste, stir-fry herbed tofu and simmer a coconut tom kha.",
            },
            partner: "Lamai Thai Cooking School",
          },
          {
            time: "17:00",
            activity: {
              th: "อิ่มอร่อยกับเมนูที่ปรุงเอง พร้อมรับสูตรกลับบ้าน",
              en: "Sit down to the dishes you cooked and take the recipes home.",
            },
            partner: "Lamai Thai Cooking School",
          },
        ],
      },
    ],
    suitableFor: {
      th: "เหมาะกับผู้ที่อยากลองวิถีกินจากพืชและรักการเรียนรู้รสชาติอาหารไทยอย่างลึกซึ้ง",
      en: "Made for the curious eater who wants to explore plant-based living and learn Thai flavours hands-on.",
    },
    goals: ["plant_based_week", "detox"],
  },
  {
    id: "basic-forest-calm",
    tier: "basic",
    name: {
      th: "ป่าสงบครึ่งวัน",
      en: "Forest Calm",
    },
    tagline: {
      th: "ครึ่งวันในสปากลางป่า พร้อมการฝึกหายใจที่ปลดปล่อยความตึงเครียดทีละลมหายใจ",
      en: "A half-day among the canopy where forest-spa rituals and guided breathwork release tension one breath at a time.",
    },
    days: 1,
    nights: 0,
    price: 3600,
    image: "/previews/pre6.webp",
    partners: ["Tamarind Springs Forest Spa", "Samahita Retreat", "Horizon Café"],
    highlights: [
      {
        th: "ทรีตเมนต์สปากลางป่าทามารินด์ สปริงส์ ในเรือนหินธรรมชาติ",
        en: "A forest-spa ritual at Tamarind Springs within its natural rock chambers.",
      },
      {
        th: "เซสชันฝึกหายใจนำโดยครูจากสมาหิตา รีทรีต",
        en: "A guided breathwork session led by a Samahita Retreat facilitator.",
      },
      {
        th: "ปิดท้ายด้วยเครื่องดื่มเพื่อสุขภาพชมวิวธรรมชาติ",
        en: "A nourishing closing drink with a sweep of forest and sea.",
      },
    ],
    itinerary: [
      {
        day: 1,
        title: {
          th: "ครึ่งวันแห่งความสงบ",
          en: "The Forest Half-Day",
        },
        items: [
          {
            time: "13:00",
            activity: {
              th: "เดินทางขึ้นสู่ทามารินด์ สปริงส์ ฟอเรสต์ สปา เหนือหาดลามาย",
              en: "Wind up to Tamarind Springs Forest Spa above Lamai beach.",
            },
            partner: "Tamarind Springs Forest Spa",
          },
          {
            time: "13:30",
            activity: {
              th: "เริ่มด้วยพิธีอบไอน้ำสมุนไพรในถ้ำหินและแช่อ่างน้ำร้อนกลางป่า",
              en: "Open with the herbal steam cave and a soak in the forest hot bath.",
            },
            partner: "Tamarind Springs Forest Spa",
          },
          {
            time: "14:30",
            activity: {
              th: "นวดน้ำมันสมุนไพรซิกเนเจอร์ใต้ร่มเงาไม้ใหญ่",
              en: "Signature herbal-oil massage beneath the old shade trees.",
            },
            partner: "Tamarind Springs Forest Spa",
          },
          {
            time: "16:00",
            activity: {
              th: "เซสชันฝึกหายใจปราณายามะเพื่อปลดปล่อยความเครียดสะสม",
              en: "A pranayama breathwork session to unwind accumulated stress.",
            },
            partner: "Samahita Retreat",
          },
          {
            time: "17:00",
            activity: {
              th: "ปิดท้ายด้วยชาดอกไม้และเครื่องดื่มเพื่อสุขภาพที่ฮอไรซอน คาเฟ่",
              en: "Close with blossom tea and a wellness drink at Horizon Café.",
            },
            partner: "Horizon Café",
          },
        ],
      },
    ],
    suitableFor: {
      th: "เหมาะกับผู้ที่นอนหลับยากและต้องการคลายความเครียดในบรรยากาศธรรมชาติเงียบสงบ",
      en: "Suited to anyone who struggles to switch off and wants to ease stress and sleep in a quiet natural setting.",
    },
    goals: ["sleep_better", "burnout_recovery"],
  },
  {
    id: "basic-sweat-sea",
    tier: "basic",
    name: {
      th: "เหงื่อและทะเล",
      en: "Sweat & Sea",
    },
    tagline: {
      th: "วันแห่งพลังงาน: ฝึกเต็มที่ในยิม ฟื้นฟูด้วยนวด และเติมพลังด้วยมื้อเที่ยงจากพืช",
      en: "A high-energy day of training, restorative massage and a vibrant veggie lunch by the sea.",
    },
    days: 1,
    nights: 0,
    price: 3200,
    image: "/previews/pre1.webp",
    partners: ["KohFit Thailand", "Cyan Spa Samui", "Lamai Veggie"],
    highlights: [
      {
        th: "คลาสฝึกแบบฟังก์ชันนัลและคาร์ดิโอที่โคห์ฟิต พร้อมเทรนเนอร์ส่วนตัว",
        en: "A functional-strength and cardio session at KohFit with a dedicated coach.",
      },
      {
        th: "นวดฟื้นฟูกล้ามเนื้อหลังออกกำลังกายที่ไซแอน สปา",
        en: "A post-workout recovery massage at Cyan Spa to soothe worked muscles.",
      },
      {
        th: "มื้อเที่ยงจากพืชโปรตีนสูงเพื่อฟื้นฟูร่างกาย",
        en: "A protein-rich plant-based lunch to refuel and rebuild.",
      },
    ],
    itinerary: [
      {
        day: 1,
        title: {
          th: "วันแห่งพลัง",
          en: "The Sweat Day",
        },
        items: [
          {
            time: "08:00",
            activity: {
              th: "วอร์มอัพและประเมินความฟิตเบื้องต้นที่โคห์ฟิต",
              en: "Warm-up and a quick fitness baseline at KohFit Thailand.",
            },
            partner: "KohFit Thailand",
          },
          {
            time: "08:30",
            activity: {
              th: "คลาสฝึกฟังก์ชันนัลและคาร์ดิโอเข้มข้น 60 นาที",
              en: "Sixty minutes of functional strength and cardio conditioning.",
            },
            partner: "KohFit Thailand",
          },
          {
            time: "10:00",
            activity: {
              th: "เดินทางสู่ไซแอน สปา เพื่อฟื้นฟูร่างกาย",
              en: "Transfer to Cyan Spa Samui for recovery.",
            },
            partner: "",
          },
          {
            time: "10:30",
            activity: {
              th: "นวดกีฬาฟื้นฟูกล้ามเนื้อด้วยน้ำมันเย็นสมุนไพร 75 นาที",
              en: "Seventy-five-minute deep-tissue sports recovery massage with cooling herbal oil.",
            },
            partner: "Cyan Spa Samui",
          },
          {
            time: "12:30",
            activity: {
              th: "มื้อเที่ยงจากพืชที่ลามาย เวจจี้: เบอร์เกอร์ถั่วและสลัดเมล็ดธัญพืช",
              en: "Plant-based lunch at Lamai Veggie: a bean burger and a hearty seed salad.",
            },
            partner: "Lamai Veggie",
          },
          {
            time: "14:00",
            activity: {
              th: "ดื่มสมูทตี้โปรตีนและพักผ่อนปิดท้ายวัน",
              en: "A protein smoothie and easy downtime to close the day.",
            },
            partner: "Lamai Veggie",
          },
        ],
      },
    ],
    suitableFor: {
      th: "เหมาะกับผู้ที่รักการออกกำลังกายและอยากได้วันฝึกหนักพร้อมการฟื้นฟูที่สมดุล",
      en: "For active people who love to train and want one full day of effort balanced by proper recovery.",
    },
    goals: ["active_fitness", "detox"],
  },

  /* ---------------------------------------------------------
   * TIER · PREMIUM — three days, two nights
   * ------------------------------------------------------- */
  {
    id: "premium-burnout-reset",
    tier: "premium",
    name: {
      th: "ฟื้นฟูจากภาวะหมดไฟ",
      en: "Burnout Reset",
    },
    tagline: {
      th: "สามวันที่ออกแบบมาเพื่อพาคุณกลับมาจากภาวะหมดไฟ ทีละขั้น ทีละลมหายใจ",
      en: "Three carefully structured days to lead you back from burnout, one steadying breath at a time.",
    },
    days: 3,
    nights: 2,
    price: 24900,
    image: "/previews/pre3.jpg",
    partners: ["Absolute Sanctuary", "Eranda Herbal Spa"],
    highlights: [
      {
        th: "โปรแกรมฟื้นฟูพลังงานเฉพาะบุคคลที่แอ็บโซลูท แซงชัวรี",
        en: "A personalised energy-restoration programme at Absolute Sanctuary.",
      },
      {
        th: "ทรีตเมนต์สมุนไพรอุ่นและพิธีคลายเครียดที่เอรันดา",
        en: "Warm herbal rituals and a dedicated de-stress treatment at Eranda Herbal Spa.",
      },
      {
        th: "เซสชันฟื้นพลังด้วยอินฟราเรดซาวน่าและการฝึกหายใจ",
        en: "Infrared sauna and breathwork sessions to rebuild your reserves.",
      },
      {
        th: "อาหารบำรุงระบบประสาทออกแบบโดยทีมโภชนาการ",
        en: "Nervous-system-nourishing cuisine designed by the in-house nutrition team.",
      },
    ],
    itinerary: [
      {
        day: 1,
        title: {
          th: "วางมือ ปล่อยวาง",
          en: "Arrive & Unwind",
        },
        items: [
          {
            time: "14:00",
            activity: {
              th: "เช็กอินที่แอ็บโซลูท แซงชัวรี ย่านเฉวงน้อย พร้อมประเมินระดับความเครียด",
              en: "Check in at Absolute Sanctuary in Chaweng Noi with a stress-level assessment.",
            },
            partner: "Absolute Sanctuary",
          },
          {
            time: "16:00",
            activity: {
              th: "เซสชันอินฟราเรดซาวน่าและแช่น้ำแร่เพื่อเริ่มกระบวนการคลายเครียด",
              en: "Infrared sauna and mineral soak to begin letting go.",
            },
            partner: "Absolute Sanctuary",
          },
          {
            time: "18:30",
            activity: {
              th: "อาหารเย็นเบาสบายที่ลัฟวิงฮัท บำรุงระบบประสาท",
              en: "A light, nervous-system-friendly dinner at the Love Kitchen.",
            },
            partner: "Absolute Sanctuary",
          },
          {
            time: "20:00",
            activity: {
              th: "โยคะนิทราก่อนนอนเพื่อเตรียมร่างกายสู่การพักผ่อนลึก",
              en: "An evening yoga nidra to prepare the body for deep rest.",
            },
            partner: "Absolute Sanctuary",
          },
        ],
      },
      {
        day: 2,
        title: {
          th: "เติมพลังที่หายไป",
          en: "Refill the Reserves",
        },
        items: [
          {
            time: "07:30",
            activity: {
              th: "ฝึกหายใจปราณายามะและสมาธิยามเช้า",
              en: "Morning pranayama and meditation practice.",
            },
            partner: "Absolute Sanctuary",
          },
          {
            time: "09:00",
            activity: {
              th: "อาหารเช้าเพื่อสมดุลฮอร์โมนและพลังงาน",
              en: "A balancing breakfast tuned to energy and hormones.",
            },
            partner: "Absolute Sanctuary",
          },
          {
            time: "11:00",
            activity: {
              th: "เดินทางสู่เอรันดา เฮอร์บัล สปา เพื่อพิธีคลายเครียด",
              en: "Transfer to Eranda Herbal Spa for a de-stress ritual.",
            },
            partner: "",
          },
          {
            time: "11:30",
            activity: {
              th: "พิธีนวดศีรษะ ไหล่ และหลังด้วยลูกประคบสมุนไพรอุ่น 2 ชั่วโมง",
              en: "A two-hour head, shoulder and back ritual with warm herbal compresses.",
            },
            partner: "Eranda Herbal Spa",
          },
          {
            time: "17:00",
            activity: {
              th: "คลาสคืนสมดุลร่างกายและช่วงพักผ่อนส่วนตัว",
              en: "A restorative class and personal rest time back at the sanctuary.",
            },
            partner: "Absolute Sanctuary",
          },
        ],
      },
      {
        day: 3,
        title: {
          th: "พร้อมกลับไปอย่างมีพลัง",
          en: "Return Renewed",
        },
        items: [
          {
            time: "08:00",
            activity: {
              th: "โยคะฟื้นฟูเบา ๆ และสมาธิตั้งเป้าหมายชีวิต",
              en: "Gentle restorative yoga and an intention-setting meditation.",
            },
            partner: "Absolute Sanctuary",
          },
          {
            time: "09:30",
            activity: {
              th: "อาหารเช้าและปรึกษาแผนดูแลตัวเองต่อเนื่องกับที่ปรึกษาสุขภาพ",
              en: "Breakfast and a wellness consult on your ongoing self-care plan.",
            },
            partner: "Absolute Sanctuary",
          },
          {
            time: "11:30",
            activity: {
              th: "เช็กเอาท์พร้อมชุดสมุนไพรและคู่มือฟื้นฟูพลังงานกลับบ้าน",
              en: "Check out with a take-home herbal kit and an energy-recovery guide.",
            },
            partner: "Absolute Sanctuary",
          },
        ],
      },
    ],
    suitableFor: {
      th: "เหมาะกับผู้ที่เผชิญภาวะหมดไฟจากการทำงานและต้องการโปรแกรมฟื้นฟูที่มีโครงสร้างชัดเจน",
      en: "Designed for those carrying work burnout who need a clearly structured programme to rebuild energy and rest.",
    },
    goals: ["burnout_recovery", "sleep_better"],
  },
  {
    id: "premium-deep-sleep",
    tier: "premium",
    name: {
      th: "การนอนหลับที่ลึกล้ำ",
      en: "Deep Sleep",
    },
    tagline: {
      th: "สามวันแห่งการฟื้นฟูการนอน ด้วยโยคะนิทรา การฝึกหายใจ และสปากลางป่า",
      en: "Three days of sleep restoration woven from yoga nidra, breathwork and the hush of the forest spa.",
    },
    days: 3,
    nights: 2,
    price: 23900,
    image: "/previews/pre6.webp",
    partners: ["Samahita Retreat", "Tamarind Springs Forest Spa"],
    highlights: [
      {
        th: "โปรแกรมฟื้นฟูการนอนเฉพาะบุคคลที่สมาหิตา รีทรีต ริมหาดแหลมเส็ด",
        en: "A personalised sleep-restoration programme at Samahita Retreat on Laem Set beach.",
      },
      {
        th: "เซสชันโยคะนิทราและฝึกหายใจเพื่อปรับระบบประสาทอัตโนมัติ",
        en: "Yoga nidra and breath-training sessions to recalibrate the nervous system.",
      },
      {
        th: "พิธีสปากลางป่าทามารินด์เพื่อคลายความตึงสะสม",
        en: "A forest-spa ritual at Tamarind Springs to release held tension.",
      },
      {
        th: "อาหารเย็นเบาและชาก่อนนอนสูตรช่วยการหลับลึก",
        en: "Light evening meals and a bedtime tea blended to deepen sleep.",
      },
    ],
    itinerary: [
      {
        day: 1,
        title: {
          th: "ปรับจังหวะร่างกาย",
          en: "Reset the Rhythm",
        },
        items: [
          {
            time: "13:30",
            activity: {
              th: "เช็กอินที่สมาหิตา รีทรีต และประเมินคุณภาพการนอน",
              en: "Check in at Samahita Retreat with a sleep-quality assessment.",
            },
            partner: "Samahita Retreat",
          },
          {
            time: "16:00",
            activity: {
              th: "เวิร์กช็อปสุขอนามัยการนอนและการตั้งจังหวะชีวิตรายวัน",
              en: "A sleep-hygiene and circadian-rhythm workshop.",
            },
            partner: "Samahita Retreat",
          },
          {
            time: "18:00",
            activity: {
              th: "อาหารเย็นเบา ๆ ริมทะเล หลีกเลี่ยงคาเฟอีนและน้ำตาล",
              en: "A light seaside dinner, free of caffeine and refined sugar.",
            },
            partner: "Samahita Retreat",
          },
          {
            time: "20:00",
            activity: {
              th: "โยคะนิทราคืนแรกเพื่อนำเข้าสู่การหลับลึก",
              en: "A first-night yoga nidra to draw you into deep sleep.",
            },
            partner: "Samahita Retreat",
          },
        ],
      },
      {
        day: 2,
        title: {
          th: "ความเงียบของผืนป่า",
          en: "The Quiet of the Forest",
        },
        items: [
          {
            time: "07:00",
            activity: {
              th: "ฝึกหายใจและโยคะเบา ๆ รับแสงเช้าริมทะเล",
              en: "Morning breathwork and gentle yoga in the early seaside light.",
            },
            partner: "Samahita Retreat",
          },
          {
            time: "08:30",
            activity: {
              th: "อาหารเช้าบำรุงและสมูทตี้แมกนีเซียมสูง",
              en: "A nourishing breakfast and a magnesium-rich smoothie.",
            },
            partner: "Samahita Retreat",
          },
          {
            time: "11:00",
            activity: {
              th: "เดินทางสู่ทามารินด์ สปริงส์ ฟอเรสต์ สปา",
              en: "Transfer to Tamarind Springs Forest Spa.",
            },
            partner: "",
          },
          {
            time: "11:30",
            activity: {
              th: "พิธีอบไอน้ำสมุนไพรในถ้ำหินและนวดน้ำมันอุ่นเพื่อการหลับลึก",
              en: "The herbal steam cave followed by a warm-oil sleep ritual massage.",
            },
            partner: "Tamarind Springs Forest Spa",
          },
          {
            time: "20:00",
            activity: {
              th: "ดื่มชาสมุนไพรก่อนนอนและสมาธิสแกนร่างกาย",
              en: "Bedtime herbal tea and a body-scan meditation.",
            },
            partner: "Samahita Retreat",
          },
        ],
      },
      {
        day: 3,
        title: {
          th: "ตื่นมาอย่างสดใหม่",
          en: "Wake Restored",
        },
        items: [
          {
            time: "07:00",
            activity: {
              th: "สมาธิรับอรุณและโยคะยืดเหยียดเบา ๆ",
              en: "A sunrise meditation and a gentle stretch practice.",
            },
            partner: "Samahita Retreat",
          },
          {
            time: "09:00",
            activity: {
              th: "อาหารเช้าและปรึกษาแผนการนอนต่อเนื่องเมื่อกลับบ้าน",
              en: "Breakfast and a consult on sustaining your sleep routine at home.",
            },
            partner: "Samahita Retreat",
          },
          {
            time: "11:00",
            activity: {
              th: "เช็กเอาท์พร้อมชุดชาก่อนนอนและคู่มือฟื้นฟูการนอน",
              en: "Check out with a bedtime-tea kit and a personal sleep-recovery guide.",
            },
            partner: "Samahita Retreat",
          },
        ],
      },
    ],
    suitableFor: {
      th: "เหมาะกับผู้ที่นอนไม่หลับเรื้อรังหรือพักผ่อนไม่เพียงพอ และต้องการฟื้นฟูคุณภาพการนอนอย่างจริงจัง",
      en: "For those with chronic poor sleep or restless nights who want to restore deep, reliable rest.",
    },
    goals: ["sleep_better", "burnout_recovery"],
  },
  {
    id: "premium-detox-renew",
    tier: "premium",
    name: {
      th: "ดีท็อกซ์และคืนความสดใส",
      en: "Detox & Renew",
    },
    tagline: {
      th: "สามวันดีท็อกซ์อย่างอ่อนโยน ด้วยไฮโดรเทอราพีและอาหารจากพืชที่เต็มไปด้วยชีวิต",
      en: "Three days of gentle detoxification through hydrotherapy and plant-based food that brims with life.",
    },
    days: 3,
    nights: 2,
    price: 22900,
    image: "/previews/pre8.jpg",
    partners: ["Absolute Sanctuary", "Vikasa Life Café", "Pure Vegan Heaven"],
    highlights: [
      {
        th: "โปรแกรมดีท็อกซ์อ่อนโยนพร้อมไฮโดรเทอราพีที่แอ็บโซลูท แซงชัวรี",
        en: "A gentle detox programme with hydrotherapy at Absolute Sanctuary.",
      },
      {
        th: "อาหารจากพืชสดใหม่และน้ำผักผลไม้สกัดเย็นตลอดโปรแกรม",
        en: "Fresh plant-based meals and cold-pressed juices throughout.",
      },
      {
        th: "เซสชันคอลอนไฮโดรเทอราพีและซาวน่าเพื่อฟื้นฟูระบบขับถ่าย",
        en: "Colon hydrotherapy and sauna sessions to support natural cleansing.",
      },
      {
        th: "เวิร์กช็อปโภชนาการจากพืชเพื่อต่อยอดที่บ้าน",
        en: "A plant-based nutrition workshop to continue the reset at home.",
      },
    ],
    itinerary: [
      {
        day: 1,
        title: {
          th: "เริ่มต้นการคลีน",
          en: "Begin the Cleanse",
        },
        items: [
          {
            time: "14:00",
            activity: {
              th: "เช็กอินและปรึกษาแพทย์แผนทางเลือกเพื่อออกแบบดีท็อกซ์เฉพาะตัว",
              en: "Check in and meet the wellness team to tailor your cleanse.",
            },
            partner: "Absolute Sanctuary",
          },
          {
            time: "16:00",
            activity: {
              th: "เซสชันซาวน่าและแช่น้ำแร่เพื่อเปิดกระบวนการขับสารพิษ",
              en: "Sauna and mineral soak to open the detox process.",
            },
            partner: "Absolute Sanctuary",
          },
          {
            time: "18:00",
            activity: {
              th: "อาหารเย็นจากพืชแบบดีท็อกซ์: ซุปผักรสอ่อนและสลัดเอนไซม์",
              en: "A detox plant-based dinner: a mild vegetable broth and an enzyme salad.",
            },
            partner: "Absolute Sanctuary",
          },
        ],
      },
      {
        day: 2,
        title: {
          th: "คืนความสดใสจากภายใน",
          en: "Renew from Within",
        },
        items: [
          {
            time: "07:30",
            activity: {
              th: "โยคะดีท็อกซ์และการบิดตัวเพื่อกระตุ้นระบบย่อย",
              en: "A detox yoga flow with twists to stimulate digestion.",
            },
            partner: "Absolute Sanctuary",
          },
          {
            time: "09:00",
            activity: {
              th: "อาหารเช้าน้ำสกัดเย็นและโบวล์ผลไม้เอนไซม์",
              en: "Cold-pressed juices and an enzyme fruit bowl for breakfast.",
            },
            partner: "Absolute Sanctuary",
          },
          {
            time: "11:00",
            activity: {
              th: "เซสชันคอลอนไฮโดรเทอราพีและพักฟื้น",
              en: "A colon hydrotherapy session and quiet recovery time.",
            },
            partner: "Absolute Sanctuary",
          },
          {
            time: "13:00",
            activity: {
              th: "อาหารกลางวันที่วิกาสะ ไลฟ์ คาเฟ่: โบวล์เทมเป้และน้ำกรีนดีท็อกซ์",
              en: "Lunch at Vikasa Life Café: a tempeh bowl and a green detox juice.",
            },
            partner: "Vikasa Life Café",
          },
          {
            time: "17:00",
            activity: {
              th: "เวิร์กช็อปโภชนาการจากพืชและการอ่านฉลากอาหาร",
              en: "A plant-based nutrition and label-reading workshop.",
            },
            partner: "Absolute Sanctuary",
          },
        ],
      },
      {
        day: 3,
        title: {
          th: "เบาสบายและเปล่งประกาย",
          en: "Light & Luminous",
        },
        items: [
          {
            time: "08:00",
            activity: {
              th: "โยคะเบา ๆ และฝึกหายใจปิดท้ายการคลีน",
              en: "Gentle yoga and breathwork to close the cleanse.",
            },
            partner: "Absolute Sanctuary",
          },
          {
            time: "10:00",
            activity: {
              th: "เช็กเอาท์และเดินทางสู่ Pure Vegan Heaven",
              en: "Check out and transfer to Pure Vegan Heaven.",
            },
            partner: "",
          },
          {
            time: "11:00",
            activity: {
              th: "มื้อปิดโปรแกรมจากพืช: โบวล์เมดิเตอร์เรเนียนและขนมรอว์",
              en: "A celebratory plant-based meal: a Mediterranean bowl and a raw dessert.",
            },
            partner: "Pure Vegan Heaven",
          },
        ],
      },
    ],
    suitableFor: {
      th: "เหมาะกับผู้ที่รู้สึกอืดหนักและต้องการรีเซ็ตระบบย่อยอาหารด้วยการดีท็อกซ์อย่างอ่อนโยน",
      en: "Best for those feeling sluggish who want to reset digestion through a gentle, supported cleanse.",
    },
    goals: ["detox", "plant_based_week"],
  },
  {
    id: "premium-island-strong",
    tier: "premium",
    name: {
      th: "แข็งแกร่งกลางเกาะ",
      en: "Island Strong",
    },
    tagline: {
      th: "สามวันแคมป์ฟิตเนสเข้มข้น พร้อมมวยไทยเบื้องต้นและการฟื้นฟูด้วยสปา",
      en: "Three days of focused fitness camp, a Muay Thai taster and deep spa recovery.",
    },
    days: 3,
    nights: 2,
    price: 21900,
    image: "/previews/pre1.webp",
    partners: ["KohFit Thailand", "Cyan Spa Samui", "Vegan Khunnay"],
    highlights: [
      {
        th: "แคมป์ฝึกความแข็งแรงและคาร์ดิโอที่โคห์ฟิต ไทยแลนด์",
        en: "A strength-and-conditioning camp at KohFit Thailand.",
      },
      {
        th: "คลาสมวยไทยเบื้องต้นกับเทรนเนอร์มืออาชีพ",
        en: "An introductory Muay Thai class with professional trainers.",
      },
      {
        th: "นวดกีฬาฟื้นฟูกล้ามเนื้อที่ไซแอน สปา",
        en: "Sports recovery massage at Cyan Spa Samui.",
      },
      {
        th: "อาหารจากพืชโปรตีนสูงเพื่อสร้างกล้ามเนื้อ",
        en: "High-protein plant-based meals to fuel and rebuild muscle.",
      },
    ],
    itinerary: [
      {
        day: 1,
        title: {
          th: "เริ่มต้นด้วยพลัง",
          en: "Build the Base",
        },
        items: [
          {
            time: "14:00",
            activity: {
              th: "เช็กอินและประเมินสมรรถภาพร่างกายที่โคห์ฟิต",
              en: "Check in and a full fitness assessment at KohFit Thailand.",
            },
            partner: "KohFit Thailand",
          },
          {
            time: "16:00",
            activity: {
              th: "คลาสฝึกความแข็งแรงพื้นฐานและเทคนิคการเคลื่อนไหว",
              en: "A foundational strength and movement-technique session.",
            },
            partner: "KohFit Thailand",
          },
          {
            time: "18:30",
            activity: {
              th: "อาหารเย็นจากพืชที่ Vegan Khunnay: แกงมัสมั่นเต้าหู้และข้าวกล้อง",
              en: "A plant-based dinner at Vegan Khunnay: tofu massaman and brown rice.",
            },
            partner: "Vegan Khunnay",
          },
        ],
      },
      {
        day: 2,
        title: {
          th: "ปลุกนักสู้ในตัวคุณ",
          en: "Find Your Fighter",
        },
        items: [
          {
            time: "07:00",
            activity: {
              th: "คาร์ดิโอเช้าและฝึกอินเทอร์วาลริมทะเล",
              en: "Morning cardio and interval training by the sea.",
            },
            partner: "KohFit Thailand",
          },
          {
            time: "09:00",
            activity: {
              th: "อาหารเช้าโปรตีนสูงและสมูทตี้ฟื้นฟู",
              en: "A high-protein breakfast and a recovery smoothie.",
            },
            partner: "KohFit Thailand",
          },
          {
            time: "11:00",
            activity: {
              th: "คลาสมวยไทยเบื้องต้น: ท่าพื้นฐาน หมัด ศอก และเข่า",
              en: "Introductory Muay Thai: stance, jabs, elbows and knees.",
            },
            partner: "KohFit Thailand",
          },
          {
            time: "16:00",
            activity: {
              th: "นวดกีฬาฟื้นฟูกล้ามเนื้อ 90 นาทีที่ไซแอน สปา",
              en: "A ninety-minute sports recovery massage at Cyan Spa Samui.",
            },
            partner: "Cyan Spa Samui",
          },
          {
            time: "19:00",
            activity: {
              th: "อาหารเย็นจากพืช: ผัดไทยวีแกนและสลัดส้มตำเห็ด",
              en: "Plant-based dinner: vegan pad thai and a mushroom som tam.",
            },
            partner: "Vegan Khunnay",
          },
        ],
      },
      {
        day: 3,
        title: {
          th: "แข็งแกร่งและสมดุล",
          en: "Strong & Balanced",
        },
        items: [
          {
            time: "07:30",
            activity: {
              th: "เซอร์กิตเทรนนิงปิดท้ายและทดสอบความก้าวหน้า",
              en: "A final circuit session and a progress retest.",
            },
            partner: "KohFit Thailand",
          },
          {
            time: "09:30",
            activity: {
              th: "อาหารเช้าและปรึกษาแผนฝึกต่อเนื่องเมื่อกลับบ้าน",
              en: "Breakfast and a consult on a take-home training plan.",
            },
            partner: "KohFit Thailand",
          },
          {
            time: "11:30",
            activity: {
              th: "นวดยืดเหยียดเบา ๆ และเช็กเอาท์",
              en: "A gentle stretch massage and check-out.",
            },
            partner: "Cyan Spa Samui",
          },
        ],
      },
    ],
    suitableFor: {
      th: "เหมาะกับผู้ที่รักการออกกำลังกายและอยากท้าทายตัวเองพร้อมการฟื้นฟูที่เหมาะสม",
      en: "For fitness lovers who want to challenge themselves while recovering the smart way.",
    },
    goals: ["active_fitness", "detox"],
  },
  {
    id: "premium-mind-balance",
    tier: "premium",
    name: {
      th: "สมดุลของจิตใจ",
      en: "Mind Balance",
    },
    tagline: {
      th: "สามวันแห่งการเจริญสติและวิถีชีวิตจากพืช เพื่อความสงบที่ยั่งยืน",
      en: "Three days of mindfulness and plant-based living that settle into lasting calm.",
    },
    days: 3,
    nights: 2,
    price: 25900,
    image: "/previews/pre5.webp",
    partners: [
      "Kapuhala Koh Samui",
      "Halapua by Kapuhala",
      "Samahita Retreat",
    ],
    highlights: [
      {
        th: "รีทรีตเจริญสติที่กะปูฮาลา ท่ามกลางสวนเกษตรอินทรีย์",
        en: "A mindfulness retreat at Kapuhala set among its organic farm gardens.",
      },
      {
        th: "อาหารจากพืชจากฟาร์มสู่จานที่ฮาลาปัวบายกะปูฮาลา",
        en: "Farm-to-table plant-based cuisine at Halapua by Kapuhala.",
      },
      {
        th: "เซสชันสมาธิและฝึกหายใจกับครูจากสมาหิตา รีทรีต",
        en: "Meditation and breath sessions with a Samahita Retreat teacher.",
      },
      {
        th: "เวิร์กช็อปการใช้ชีวิตอย่างมีสติเพื่อนำกลับไปใช้จริง",
        en: "A practical mindful-living workshop to carry into daily life.",
      },
    ],
    itinerary: [
      {
        day: 1,
        title: {
          th: "หยุดและรับรู้",
          en: "Pause & Notice",
        },
        items: [
          {
            time: "14:00",
            activity: {
              th: "เช็กอินที่กะปูฮาลา ย่านลามาย และเดินชมสวนเกษตรอินทรีย์",
              en: "Check in at Kapuhala in Lamai and a walk through the organic farm.",
            },
            partner: "Kapuhala Koh Samui",
          },
          {
            time: "16:30",
            activity: {
              th: "เซสชันสมาธิเจริญสติแบบเบื้องต้น",
              en: "An introductory mindfulness meditation session.",
            },
            partner: "Samahita Retreat",
          },
          {
            time: "18:30",
            activity: {
              th: "อาหารเย็นจากฟาร์มสู่จานที่ฮาลาปัว: สลัดผักฟาร์มและซุปฟักทอง",
              en: "A farm-to-table dinner at Halapua: a farm-greens salad and pumpkin soup.",
            },
            partner: "Halapua by Kapuhala",
          },
        ],
      },
      {
        day: 2,
        title: {
          th: "อยู่กับปัจจุบัน",
          en: "Be Here Now",
        },
        items: [
          {
            time: "07:00",
            activity: {
              th: "โยคะและฝึกหายใจรับอรุณท่ามกลางสวน",
              en: "Sunrise yoga and breathwork among the garden beds.",
            },
            partner: "Kapuhala Koh Samui",
          },
          {
            time: "08:30",
            activity: {
              th: "อาหารเช้าจากพืชและสมูทตี้โบวล์ผลไม้เกาะ",
              en: "A plant-based breakfast and an island-fruit smoothie bowl.",
            },
            partner: "Halapua by Kapuhala",
          },
          {
            time: "10:30",
            activity: {
              th: "เวิร์กช็อปการกินอย่างมีสติและการเก็บผักจากสวน",
              en: "A mindful-eating workshop and a harvest from the garden.",
            },
            partner: "Kapuhala Koh Samui",
          },
          {
            time: "15:00",
            activity: {
              th: "เซสชันเดินสมาธิและสมาธิสแกนร่างกายกับครูสมาหิตา",
              en: "A walking meditation and body-scan session with a Samahita teacher.",
            },
            partner: "Samahita Retreat",
          },
          {
            time: "18:30",
            activity: {
              th: "อาหารเย็นเงียบสงบเพื่อฝึกการอยู่กับปัจจุบัน",
              en: "A silent dinner to practise presence.",
            },
            partner: "Halapua by Kapuhala",
          },
        ],
      },
      {
        day: 3,
        title: {
          th: "นำความสงบกลับบ้าน",
          en: "Carry the Calm Home",
        },
        items: [
          {
            time: "07:30",
            activity: {
              th: "สมาธิรับอรุณและการตั้งใจปฏิบัติประจำวัน",
              en: "A sunrise meditation and a daily-practice intention.",
            },
            partner: "Samahita Retreat",
          },
          {
            time: "09:00",
            activity: {
              th: "อาหารเช้าและปรึกษาการสร้างกิจวัตรเจริญสติที่บ้าน",
              en: "Breakfast and a consult on building a mindful routine at home.",
            },
            partner: "Halapua by Kapuhala",
          },
          {
            time: "11:00",
            activity: {
              th: "เช็กเอาท์พร้อมคู่มือสมาธิและสูตรอาหารจากพืช",
              en: "Check out with a meditation guide and plant-based recipes.",
            },
            partner: "Kapuhala Koh Samui",
          },
        ],
      },
    ],
    suitableFor: {
      th: "เหมาะกับผู้ที่จิตใจฟุ้งซ่านและอยากเรียนรู้การใช้ชีวิตอย่างมีสติควบคู่อาหารจากพืช",
      en: "For busy minds seeking to learn mindful living alongside a nourishing plant-based week.",
    },
    goals: ["burnout_recovery", "plant_based_week"],
  },

  /* ---------------------------------------------------------
   * TIER · DELUXE — signature multi-day retreats
   * ------------------------------------------------------- */
  {
    id: "deluxe-kamalaya-healing",
    tier: "deluxe",
    name: {
      th: "การเยียวยาแห่งกมลายา",
      en: "Kamalaya Healing",
    },
    tagline: {
      th: "ห้าวันแห่งการเยียวยาความเครียดและภาวะหมดไฟ ณ สถานบำบัดอันเลื่องชื่อของเกาะสมุย",
      en: "Five signature days of stress and burnout healing at Samui's most renowned sanctuary.",
    },
    days: 5,
    nights: 4,
    price: 128000,
    image: "/previews/pre9.webp",
    partners: ["Kamalaya Koh Samui"],
    highlights: [
      {
        th: "โปรแกรมฟื้นฟูความเครียดและภาวะหมดไฟซิกเนเจอร์ของกมลายา",
        en: "Kamalaya's signature Relax and Renew programme for stress and burnout.",
      },
      {
        th: "การปรึกษาแพทย์แผนจีนและการตรวจชีพจรเฉพาะบุคคล",
        en: "A traditional Chinese medicine consultation and personalised pulse reading.",
      },
      {
        th: "ที่ปรึกษาด้านสุขภาพส่วนตัวดูแลตลอดการเดินทาง",
        en: "A dedicated personal wellness mentor for the length of your stay.",
      },
      {
        th: "ทรีตเมนต์ในถ้ำพระอันศักดิ์สิทธิ์และอาหารบำบัดจากครัวสุขภาพ",
        en: "Treatments by the sacred Monk's Cave and healing cuisine from the wellness kitchen.",
      },
    ],
    itinerary: [
      {
        day: 1,
        title: {
          th: "มาถึงและตั้งต้น",
          en: "Arrival & Intention",
        },
        items: [
          {
            time: "14:00",
            activity: {
              th: "เช็กอินสู่วิลล่าริมเขาเหนืออ่าวหน้าทอน พร้อมพิธีต้อนรับ",
              en: "Check in to a hillside villa above Laem Set bay with a welcome ceremony.",
            },
            partner: "Kamalaya Koh Samui",
          },
          {
            time: "16:00",
            activity: {
              th: "ปรึกษาที่ปรึกษาสุขภาพส่วนตัวเพื่อออกแบบเส้นทางการเยียวยา",
              en: "Meet your personal wellness mentor to shape your healing path.",
            },
            partner: "Kamalaya Koh Samui",
          },
          {
            time: "18:30",
            activity: {
              th: "อาหารเย็นบำบัดริมทะเลที่ห้องอาหารโซมา",
              en: "A healing seaside dinner at Soma restaurant.",
            },
            partner: "Kamalaya Koh Samui",
          },
        ],
      },
      {
        day: 2,
        title: {
          th: "เปิดประตูสู่การเยียวยา",
          en: "Open the Healing",
        },
        items: [
          {
            time: "07:00",
            activity: {
              th: "ชี่กงและสมาธิยามเช้าริมทะเล",
              en: "Morning qigong and meditation by the sea.",
            },
            partner: "Kamalaya Koh Samui",
          },
          {
            time: "09:30",
            activity: {
              th: "ปรึกษาแพทย์แผนจีนและการตรวจชีพจร",
              en: "Traditional Chinese medicine consultation and pulse diagnosis.",
            },
            partner: "Kamalaya Koh Samui",
          },
          {
            time: "11:30",
            activity: {
              th: "ทรีตเมนต์นวดบำบัดความเครียดด้วยน้ำมันอายุรเวท",
              en: "A stress-relief Ayurvedic oil therapy treatment.",
            },
            partner: "Kamalaya Koh Samui",
          },
          {
            time: "16:00",
            activity: {
              th: "เซสชันฝึกหายใจและบำบัดในถ้ำพระ",
              en: "A breathwork and meditation session at the Monk's Cave.",
            },
            partner: "Kamalaya Koh Samui",
          },
        ],
      },
      {
        day: 3,
        title: {
          th: "คืนสมดุลพลังงาน",
          en: "Rebalance Energy",
        },
        items: [
          {
            time: "07:30",
            activity: {
              th: "โยคะและฝึกหายใจปราณายามะ",
              en: "Yoga and pranayama breath practice.",
            },
            partner: "Kamalaya Koh Samui",
          },
          {
            time: "10:00",
            activity: {
              th: "บำบัดฝังเข็มและครอบแก้วตามศาสตร์แผนจีน",
              en: "Acupuncture and cupping therapy in the Chinese medicine tradition.",
            },
            partner: "Kamalaya Koh Samui",
          },
          {
            time: "14:00",
            activity: {
              th: "ฟลอตเทอราพีและบำบัดในห้องเกลือเพื่อผ่อนคลายลึก",
              en: "Float therapy and a salt-room session for deep release.",
            },
            partner: "Kamalaya Koh Samui",
          },
          {
            time: "18:30",
            activity: {
              th: "อาหารเย็นบำบัดและปรึกษาความก้าวหน้ากับที่ปรึกษา",
              en: "A healing dinner and a progress review with your mentor.",
            },
            partner: "Kamalaya Koh Samui",
          },
        ],
      },
      {
        day: 4,
        title: {
          th: "หยั่งรากความสงบ",
          en: "Root the Calm",
        },
        items: [
          {
            time: "07:00",
            activity: {
              th: "เดินสมาธิรับอรุณบนเส้นทางสวนเขา",
              en: "A sunrise walking meditation along the hillside garden trail.",
            },
            partner: "Kamalaya Koh Samui",
          },
          {
            time: "10:00",
            activity: {
              th: "ทรีตเมนต์ฟื้นฟูต่อมหมวกไตและบำบัดความล้าเรื้อรัง",
              en: "An adrenal-restoration treatment for chronic fatigue.",
            },
            partner: "Kamalaya Koh Samui",
          },
          {
            time: "15:00",
            activity: {
              th: "เวิร์กช็อปการจัดการพลังงานชีวิตและการดูแลตัวเอง",
              en: "A life-energy management and self-care workshop.",
            },
            partner: "Kamalaya Koh Samui",
          },
          {
            time: "18:30",
            activity: {
              th: "อาหารเย็นเฉลิมฉลองริมทะเลใต้แสงเทียน",
              en: "A celebratory candlelit seaside dinner.",
            },
            partner: "Kamalaya Koh Samui",
          },
        ],
      },
      {
        day: 5,
        title: {
          th: "กลับไปอย่างเต็มเปี่ยม",
          en: "Depart Whole",
        },
        items: [
          {
            time: "07:30",
            activity: {
              th: "สมาธิและโยคะปิดโปรแกรมรับแสงเช้า",
              en: "A closing meditation and yoga in the morning light.",
            },
            partner: "Kamalaya Koh Samui",
          },
          {
            time: "09:30",
            activity: {
              th: "ปรึกษาสรุปผลและรับแผนดูแลตัวเองระยะยาว",
              en: "A summary consultation and a long-term self-care plan.",
            },
            partner: "Kamalaya Koh Samui",
          },
          {
            time: "11:30",
            activity: {
              th: "เช็กเอาท์พร้อมชุดสมุนไพรและคู่มือการเยียวยากลับบ้าน",
              en: "Check out with a herbal kit and a personal healing guide.",
            },
            partner: "Kamalaya Koh Samui",
          },
        ],
      },
    ],
    suitableFor: {
      th: "เหมาะกับผู้บริหารและผู้ที่เผชิญความเครียดสะสมหนักและต้องการการเยียวยาเชิงลึกระดับสถานบำบัด",
      en: "For executives and those carrying deep, accumulated stress who seek profound, clinic-grade healing.",
    },
    goals: ["burnout_recovery", "sleep_better"],
  },
  {
    id: "deluxe-ocean-longevity",
    tier: "deluxe",
    name: {
      th: "อายุยืนแห่งท้องทะเล",
      en: "Ocean Longevity",
    },
    tagline: {
      th: "ห้าวันแห่งความหรูหราเพื่อชะลอวัย ด้วยพิธีสปาในวิลล่าและการตรวจสุขภาพเชิงลึก",
      en: "Five luxurious days devoted to longevity, pairing private-villa spa rituals with advanced anti-aging diagnostics.",
    },
    days: 5,
    nights: 4,
    price: 165000,
    image: "/previews/pre5.webp",
    partners: ["Six Senses Samui", "Bangkok Hospital Samui", "SFS Clinic"],
    highlights: [
      {
        th: "พักวิลล่าส่วนตัวพร้อมพิธีสปาซิกเนเจอร์ที่ซิกเซนส์ สมุย",
        en: "A private pool villa with signature spa rituals at Six Senses Samui.",
      },
      {
        th: "การตรวจสุขภาพชะลอวัยเชิงลึกที่โรงพยาบาลกรุงเทพสมุย",
        en: "An advanced anti-aging health screening at Bangkok Hospital Samui.",
      },
      {
        th: "ทรีตเมนต์ฟื้นฟูผิวและความงามขั้นสูงที่เอสเอฟเอส คลินิก",
        en: "Advanced skin and aesthetic rejuvenation treatments at SFS Clinic.",
      },
      {
        th: "อาหารเพื่ออายุยืนออกแบบตามผลตรวจเฉพาะบุคคล",
        en: "Longevity cuisine designed around your personal diagnostics.",
      },
    ],
    itinerary: [
      {
        day: 1,
        title: {
          th: "สู่อ้อมกอดท้องทะเล",
          en: "Into the Ocean's Arms",
        },
        items: [
          {
            time: "14:00",
            activity: {
              th: "เช็กอินวิลล่าส่วนตัวเหนืออ่าวเชิงมน พร้อมพิธีต้อนรับ",
              en: "Check in to a private villa above Choeng Mon bay with a welcome ritual.",
            },
            partner: "Six Senses Samui",
          },
          {
            time: "16:30",
            activity: {
              th: "ปรึกษาผู้เชี่ยวชาญด้านสุขภาพเพื่อวางแผนการเดินทาง",
              en: "A wellness consultation to map your longevity journey.",
            },
            partner: "Six Senses Samui",
          },
          {
            time: "19:00",
            activity: {
              th: "อาหารเย็นออร์แกนิกริมหน้าผาที่ห้องอาหารดายนิ่งออนเดอะร็อกส์",
              en: "An organic clifftop dinner at Dining on the Rocks.",
            },
            partner: "Six Senses Samui",
          },
        ],
      },
      {
        day: 2,
        title: {
          th: "วัดผลจากภายใน",
          en: "Measure from Within",
        },
        items: [
          {
            time: "08:00",
            activity: {
              th: "เดินทางสู่โรงพยาบาลกรุงเทพสมุยเพื่อตรวจสุขภาพชะลอวัย",
              en: "Transfer to Bangkok Hospital Samui for the anti-aging screening.",
            },
            partner: "",
          },
          {
            time: "08:30",
            activity: {
              th: "ตรวจสุขภาพเชิงลึก: เลือด ฮอร์โมน องค์ประกอบร่างกาย และอายุชีวภาพ",
              en: "An in-depth panel: bloods, hormones, body composition and biological age.",
            },
            partner: "Bangkok Hospital Samui",
          },
          {
            time: "13:00",
            activity: {
              th: "กลับสู่วิลล่าและพิธีนวดน้ำมันซิกเนเจอร์ฟื้นฟูพลังงาน",
              en: "Return to the villa for a signature energy-restoring oil ritual.",
            },
            partner: "Six Senses Samui",
          },
          {
            time: "18:30",
            activity: {
              th: "อาหารเย็นเพื่ออายุยืนปรับตามผลตรวจเบื้องต้น",
              en: "A longevity dinner tuned to preliminary results.",
            },
            partner: "Six Senses Samui",
          },
        ],
      },
      {
        day: 3,
        title: {
          th: "ฟื้นคืนความเปล่งปลั่ง",
          en: "Restore the Glow",
        },
        items: [
          {
            time: "07:30",
            activity: {
              th: "โยคะและสมาธิรับอรุณริมทะเล",
              en: "Sunrise yoga and meditation by the sea.",
            },
            partner: "Six Senses Samui",
          },
          {
            time: "10:00",
            activity: {
              th: "เดินทางสู่เอสเอฟเอส คลินิก เพื่อทรีตเมนต์ฟื้นฟูผิวขั้นสูง",
              en: "Transfer to SFS Clinic for advanced skin rejuvenation.",
            },
            partner: "SFS Clinic",
          },
          {
            time: "10:30",
            activity: {
              th: "ทรีตเมนต์เลเซอร์ฟื้นฟูคอลลาเจนและบำรุงผิวเชิงลึก",
              en: "A collagen-stimulating laser and deep skin-nourishing treatment.",
            },
            partner: "SFS Clinic",
          },
          {
            time: "15:00",
            activity: {
              th: "พิธีอาบน้ำแร่และทรีตเมนต์ลดอักเสบในวิลล่า",
              en: "A mineral bathing ritual and anti-inflammatory treatment at the villa.",
            },
            partner: "Six Senses Samui",
          },
          {
            time: "19:00",
            activity: {
              th: "อาหารเย็นออร์แกนิกใต้แสงดาว",
              en: "An organic dinner beneath the stars.",
            },
            partner: "Six Senses Samui",
          },
        ],
      },
      {
        day: 4,
        title: {
          th: "ปรับสมดุลเพื่ออายุยืน",
          en: "Tune for Longevity",
        },
        items: [
          {
            time: "08:00",
            activity: {
              th: "ปรึกษาผลตรวจกับแพทย์และวางแผนชะลอวัยเฉพาะบุคคล",
              en: "Review your results with the physician and build a personal longevity plan.",
            },
            partner: "Bangkok Hospital Samui",
          },
          {
            time: "11:00",
            activity: {
              th: "พิธีสปาดีท็อกซ์และนวดน้ำเหลืองที่วิลล่า",
              en: "A detox spa ritual and lymphatic massage at the villa.",
            },
            partner: "Six Senses Samui",
          },
          {
            time: "15:00",
            activity: {
              th: "เวิร์กช็อปโภชนาการเพื่ออายุยืนและการนอนที่ดี",
              en: "A workshop on longevity nutrition and restorative sleep.",
            },
            partner: "Six Senses Samui",
          },
          {
            time: "19:00",
            activity: {
              th: "อาหารเย็นเฉลิมฉลองริมหน้าผา",
              en: "A celebratory clifftop dinner.",
            },
            partner: "Six Senses Samui",
          },
        ],
      },
      {
        day: 5,
        title: {
          th: "เปล่งประกายสู่วันใหม่",
          en: "Depart Radiant",
        },
        items: [
          {
            time: "08:00",
            activity: {
              th: "โยคะและสมาธิปิดโปรแกรมรับแสงเช้า",
              en: "A closing yoga and meditation in the morning light.",
            },
            partner: "Six Senses Samui",
          },
          {
            time: "10:00",
            activity: {
              th: "รับสรุปผลตรวจและแผนชะลอวัยฉบับสมบูรณ์",
              en: "Receive your full diagnostic report and longevity blueprint.",
            },
            partner: "Bangkok Hospital Samui",
          },
          {
            time: "12:00",
            activity: {
              th: "เช็กเอาท์พร้อมชุดบำรุงผิวและคู่มืออายุยืนเฉพาะบุคคล",
              en: "Check out with a skincare set and a personalised longevity guide.",
            },
            partner: "Six Senses Samui",
          },
        ],
      },
    ],
    suitableFor: {
      th: "เหมาะกับผู้ที่ใส่ใจการชะลอวัยและอยากผสานความหรูหรากับการตรวจสุขภาพเชิงป้องกันอย่างจริงจัง",
      en: "For the discerning guest who wants to merge true luxury with serious preventive, anti-aging diagnostics.",
    },
    goals: ["anti_aging_checkup", "sleep_better"],
  },
  {
    id: "deluxe-sanctuary-sleep",
    tier: "deluxe",
    name: {
      th: "วิหารแห่งการหลับใหล",
      en: "Sanctuary Sleep",
    },
    tagline: {
      th: "สี่วันในวิหารแห่งความเป็นอยู่ที่ดี พร้อมพิธีก่อนนอนและวงจรสปาเพื่อการหลับที่ลึกซึ้ง",
      en: "Four days in a wellbeing sanctuary, where nightly rituals and a full spa circuit deliver truly deep sleep.",
    },
    days: 4,
    nights: 3,
    price: 98000,
    image: "/previews/pre7.webp",
    partners: ["Banyan Tree Samui", "W Koh Samui - AWAY Spa"],
    highlights: [
      {
        th: "พักวิลล่าพร้อมสระส่วนตัวเหนืออ่าวละไมที่บันยันทรี สมุย",
        en: "A private pool villa above Lamai bay at Banyan Tree Samui.",
      },
      {
        th: "พิธีก่อนนอนและทรีตเมนต์เพื่อการหลับลึกซิกเนเจอร์",
        en: "Signature bedtime rituals and sleep-focused treatments.",
      },
      {
        th: "วงจรสปาไฮโดรเทอราพีและทรีตเมนต์ที่ดับเบิลยู อะเวย์ สปา",
        en: "A hydrotherapy spa circuit and treatments at W Koh Samui's AWAY Spa.",
      },
      {
        th: "อาหารเย็นเบาเพื่อการนอนและชาสมุนไพรก่อนนอน",
        en: "Light sleep-supporting dinners and a nightly herbal tea.",
      },
    ],
    itinerary: [
      {
        day: 1,
        title: {
          th: "เข้าสู่วิหารแห่งความสงบ",
          en: "Enter the Sanctuary",
        },
        items: [
          {
            time: "14:00",
            activity: {
              th: "เช็กอินวิลล่าสระส่วนตัวเหนืออ่าวละไมที่บันยันทรี",
              en: "Check in to a private pool villa above Lamai bay at Banyan Tree.",
            },
            partner: "Banyan Tree Samui",
          },
          {
            time: "16:00",
            activity: {
              th: "ประเมินคุณภาพการนอนและออกแบบพิธีก่อนนอนเฉพาะตัว",
              en: "A sleep-quality assessment and a tailored bedtime ritual.",
            },
            partner: "Banyan Tree Samui",
          },
          {
            time: "18:30",
            activity: {
              th: "อาหารเย็นเบาเพื่อการนอนที่ห้องอาหารเซฟฟรอน",
              en: "A light sleep-friendly dinner at Saffron restaurant.",
            },
            partner: "Banyan Tree Samui",
          },
          {
            time: "20:30",
            activity: {
              th: "พิธีอาบน้ำดอกไม้และนวดศีรษะเพื่อการหลับลึก",
              en: "A flower bath and a head massage to invite deep sleep.",
            },
            partner: "Banyan Tree Samui",
          },
        ],
      },
      {
        day: 2,
        title: {
          th: "วงจรแห่งการฟื้นฟู",
          en: "The Restoration Circuit",
        },
        items: [
          {
            time: "07:30",
            activity: {
              th: "โยคะนิทราและฝึกหายใจรับอรุณริมทะเล",
              en: "Sunrise yoga nidra and breathwork by the sea.",
            },
            partner: "Banyan Tree Samui",
          },
          {
            time: "10:00",
            activity: {
              th: "เดินทางสู่ดับเบิลยู เกาะสมุย เพื่อวงจรสปาไฮโดรเทอราพี",
              en: "Transfer to W Koh Samui for the hydrotherapy spa circuit.",
            },
            partner: "",
          },
          {
            time: "10:30",
            activity: {
              th: "วงจรไฮโดรเทอราพี ซาวน่า และอ่างวารีบำบัดที่อะเวย์ สปา",
              en: "Hydrotherapy pools, sauna and vitality baths at AWAY Spa.",
            },
            partner: "W Koh Samui - AWAY Spa",
          },
          {
            time: "13:00",
            activity: {
              th: "นวดน้ำมันอุ่นเพื่อคลายความตึงและเตรียมการหลับลึก",
              en: "A warm-oil massage to release tension and prime deep sleep.",
            },
            partner: "W Koh Samui - AWAY Spa",
          },
          {
            time: "20:30",
            activity: {
              th: "ชาสมุนไพรก่อนนอนและสมาธิสแกนร่างกายในวิลล่า",
              en: "Bedtime herbal tea and a body-scan meditation in the villa.",
            },
            partner: "Banyan Tree Samui",
          },
        ],
      },
      {
        day: 3,
        title: {
          th: "หลับลึกอย่างแท้จริง",
          en: "Sleep Deeply",
        },
        items: [
          {
            time: "08:00",
            activity: {
              th: "โยคะฟื้นฟูเบาและสมาธิยามเช้า",
              en: "Gentle restorative yoga and a morning meditation.",
            },
            partner: "Banyan Tree Samui",
          },
          {
            time: "11:00",
            activity: {
              th: "ทรีตเมนต์เรนฟอเรสต์และพิธีฟื้นฟูระบบประสาท",
              en: "A Rainforest experience and a nervous-system-restoring ritual.",
            },
            partner: "W Koh Samui - AWAY Spa",
          },
          {
            time: "16:00",
            activity: {
              th: "เวิร์กช็อปสุขอนามัยการนอนและการสร้างห้องนอนที่ดี",
              en: "A sleep-hygiene and sleep-environment workshop.",
            },
            partner: "Banyan Tree Samui",
          },
          {
            time: "20:30",
            activity: {
              th: "พิธีก่อนนอนด้วยน้ำมันลาเวนเดอร์และเสียงบำบัด",
              en: "A lavender-oil and sound-healing bedtime ritual.",
            },
            partner: "Banyan Tree Samui",
          },
        ],
      },
      {
        day: 4,
        title: {
          th: "ตื่นมาเต็มอิ่ม",
          en: "Wake Fully Rested",
        },
        items: [
          {
            time: "08:00",
            activity: {
              th: "สมาธิรับอรุณและโยคะยืดเหยียดปิดโปรแกรม",
              en: "A sunrise meditation and a closing stretch practice.",
            },
            partner: "Banyan Tree Samui",
          },
          {
            time: "10:00",
            activity: {
              th: "ปรึกษาแผนการนอนต่อเนื่องและรับชุดอุปกรณ์การนอน",
              en: "A consult on sustaining your sleep routine and a take-home sleep kit.",
            },
            partner: "Banyan Tree Samui",
          },
          {
            time: "12:00",
            activity: {
              th: "เช็กเอาท์พร้อมชาก่อนนอนและคู่มือฟื้นฟูการนอน",
              en: "Check out with a bedtime tea and a sleep-recovery guide.",
            },
            partner: "Banyan Tree Samui",
          },
        ],
      },
    ],
    suitableFor: {
      th: "เหมาะกับผู้ที่ต้องการฟื้นฟูการนอนในบรรยากาศหรูหราและเป็นส่วนตัวอย่างแท้จริง",
      en: "For those who want to restore their sleep within a setting of genuine luxury and privacy.",
    },
    goals: ["sleep_better", "burnout_recovery"],
  },
  {
    id: "deluxe-family-shore",
    tier: "deluxe",
    name: {
      th: "ชายฝั่งของครอบครัว",
      en: "Family Shore",
    },
    tagline: {
      th: "ห้าวันแห่งความเป็นอยู่ที่ดีของทั้งครอบครัว ตั้งแต่การเคลื่อนไหวสำหรับเด็กถึงสปาคู่รัก",
      en: "Five days of wellbeing for the whole family, from playful movement for children to a couples' spa for two.",
    },
    days: 5,
    nights: 4,
    price: 145000,
    image: "/previews/pre2.jpg",
    partners: [
      "Four Seasons Resort Koh Samui",
      "Lamai Thai Cooking School",
      "Cyan Spa Samui",
    ],
    highlights: [
      {
        th: "พักวิลล่าสำหรับครอบครัวเหนืออ่าวอ่างทองที่โฟร์ซีซันส์ เกาะสมุย",
        en: "A family villa above Angthong bay at Four Seasons Resort Koh Samui.",
      },
      {
        th: "กิจกรรมการเคลื่อนไหวที่เป็นมิตรกับเด็กและกีฬาทางน้ำ",
        en: "Kids-friendly movement sessions and gentle watersports.",
      },
      {
        th: "คลาสทำอาหารไทยสำหรับครอบครัวที่โรงเรียนสอนทำอาหารลามาย",
        en: "A family Thai cooking class at Lamai Thai Cooking School.",
      },
      {
        th: "สปาคู่รักสำหรับพ่อแม่ที่ไซแอน สปา",
        en: "A couples' spa for the parents at Cyan Spa Samui.",
      },
    ],
    itinerary: [
      {
        day: 1,
        title: {
          th: "ครอบครัวมาถึง",
          en: "The Family Arrives",
        },
        items: [
          {
            time: "14:00",
            activity: {
              th: "เช็กอินวิลล่าครอบครัวเหนืออ่าวอ่างทองที่โฟร์ซีซันส์",
              en: "Check in to a family villa above Angthong bay at Four Seasons.",
            },
            partner: "Four Seasons Resort Koh Samui",
          },
          {
            time: "16:00",
            activity: {
              th: "กิจกรรมต้อนรับครอบครัวและทัวร์รีสอร์ทสำหรับเด็ก",
              en: "A family welcome activity and a kids' resort tour.",
            },
            partner: "Four Seasons Resort Koh Samui",
          },
          {
            time: "18:30",
            activity: {
              th: "อาหารเย็นริมหาดเพื่อสุขภาพสำหรับทั้งครอบครัว",
              en: "A wholesome beachfront family dinner.",
            },
            partner: "Four Seasons Resort Koh Samui",
          },
        ],
      },
      {
        day: 2,
        title: {
          th: "ขยับร่างกายไปด้วยกัน",
          en: "Move Together",
        },
        items: [
          {
            time: "08:00",
            activity: {
              th: "โยคะครอบครัวและเกมการเคลื่อนไหวสำหรับเด็กริมหาด",
              en: "Family yoga and movement games for children on the beach.",
            },
            partner: "Four Seasons Resort Koh Samui",
          },
          {
            time: "10:00",
            activity: {
              th: "กิจกรรมพายเรือคายัคและว่ายน้ำสำหรับครอบครัว",
              en: "Family kayaking and swimming in the calm bay.",
            },
            partner: "Four Seasons Resort Koh Samui",
          },
          {
            time: "15:00",
            activity: {
              th: "เวิร์กช็อปทำสมูทตี้ผลไม้เพื่อสุขภาพสำหรับเด็ก",
              en: "A healthy fruit-smoothie workshop for the kids.",
            },
            partner: "Four Seasons Resort Koh Samui",
          },
          {
            time: "18:30",
            activity: {
              th: "อาหารเย็นบาร์บีคิวเพื่อสุขภาพริมทะเล",
              en: "A wholesome seaside barbecue dinner.",
            },
            partner: "Four Seasons Resort Koh Samui",
          },
        ],
      },
      {
        day: 3,
        title: {
          th: "ครัวของครอบครัว",
          en: "The Family Kitchen",
        },
        items: [
          {
            time: "09:00",
            activity: {
              th: "เดินทางสู่โรงเรียนสอนทำอาหารลามายและเลือกวัตถุดิบที่ตลาด",
              en: "Transfer to Lamai Thai Cooking School and a local market shop.",
            },
            partner: "Lamai Thai Cooking School",
          },
          {
            time: "10:00",
            activity: {
              th: "คลาสทำอาหารไทยสำหรับครอบครัว: ผัดไทย แกงเขียวหวาน และทับทิมกรอบ",
              en: "A family Thai cooking class: pad thai, green curry and tap tim krob.",
            },
            partner: "Lamai Thai Cooking School",
          },
          {
            time: "13:00",
            activity: {
              th: "อิ่มอร่อยกับมื้อที่ทำเองทั้งครอบครัว",
              en: "Enjoy the family-cooked feast together.",
            },
            partner: "Lamai Thai Cooking School",
          },
          {
            time: "17:00",
            activity: {
              th: "พักผ่อนและว่ายน้ำที่สระวิลล่าส่วนตัว",
              en: "Rest and swim at the private villa pool.",
            },
            partner: "Four Seasons Resort Koh Samui",
          },
        ],
      },
      {
        day: 4,
        title: {
          th: "เวลาของพ่อแม่",
          en: "Time for Two",
        },
        items: [
          {
            time: "08:30",
            activity: {
              th: "กิจกรรมผจญภัยสำหรับเด็กกับทีมคิดส์คลับ",
              en: "A kids' adventure programme with the children's club team.",
            },
            partner: "Four Seasons Resort Koh Samui",
          },
          {
            time: "11:00",
            activity: {
              th: "สปาคู่รักสำหรับพ่อแม่ที่ไซแอน สปา: นวดน้ำมันและอบสมุนไพร",
              en: "A couples' spa for the parents at Cyan Spa Samui: oil massage and herbal steam.",
            },
            partner: "Cyan Spa Samui",
          },
          {
            time: "16:00",
            activity: {
              th: "กิจกรรมชายหาดและพระอาทิตย์ตกร่วมกันทั้งครอบครัว",
              en: "Beach time and a shared family sunset.",
            },
            partner: "Four Seasons Resort Koh Samui",
          },
          {
            time: "18:30",
            activity: {
              th: "อาหารเย็นเฉลิมฉลองครอบครัวริมทะเล",
              en: "A celebratory seaside family dinner.",
            },
            partner: "Four Seasons Resort Koh Samui",
          },
        ],
      },
      {
        day: 5,
        title: {
          th: "ความทรงจำกลับบ้าน",
          en: "Memories Home",
        },
        items: [
          {
            time: "08:00",
            activity: {
              th: "โยคะครอบครัวปิดโปรแกรมและเก็บภาพความทรงจำ",
              en: "A closing family yoga and a photo to remember.",
            },
            partner: "Four Seasons Resort Koh Samui",
          },
          {
            time: "10:00",
            activity: {
              th: "อาหารเช้าและช่วงเวลาสุดท้ายริมหาด",
              en: "Breakfast and last moments by the shore.",
            },
            partner: "Four Seasons Resort Koh Samui",
          },
          {
            time: "12:00",
            activity: {
              th: "เช็กเอาท์พร้อมสมุดสูตรอาหารครอบครัวและของที่ระลึก",
              en: "Check out with a family recipe book and keepsakes.",
            },
            partner: "Four Seasons Resort Koh Samui",
          },
        ],
      },
    ],
    suitableFor: {
      th: "เหมาะกับครอบครัวที่อยากใช้เวลาร่วมกันอย่างมีคุณภาพควบคู่กับการดูแลสุขภาพและการกินที่ดี",
      en: "For families who want quality time together woven with shared wellness, movement and good food.",
    },
    goals: ["active_fitness", "plant_based_week"],
  },
  {
    id: "deluxe-longevity-medical",
    tier: "deluxe",
    name: {
      th: "อายุยืนเชิงการแพทย์",
      en: "Medical Longevity",
    },
    tagline: {
      th: "ห้าวันแห่งการดูแลสุขภาพเชิงป้องกัน ผสานการตรวจเชิงลึก กายภาพบำบัด และการพักผ่อนระดับรีสอร์ท",
      en: "Five days of preventive medicine uniting a full health screening, physiotherapy and resort-grade rest.",
    },
    days: 5,
    nights: 4,
    price: 112000,
    image: "/previews/pre8.jpg",
    partners: [
      "Anantara Bophut Koh Samui Resort",
      "Bangkok Hospital Samui",
      "Napapai Physiotherapy Clinic",
    ],
    highlights: [
      {
        th: "พักรีสอร์ทริมหาดโบ๊ะผุดที่อนันตรา บ่อผุด เกาะสมุย",
        en: "A beachfront stay at Anantara Bophut Koh Samui Resort.",
      },
      {
        th: "การตรวจสุขภาพเชิงป้องกันแบบครบวงจรที่โรงพยาบาลกรุงเทพสมุย",
        en: "A comprehensive preventive health screening at Bangkok Hospital Samui.",
      },
      {
        th: "โปรแกรมกายภาพบำบัดเฉพาะบุคคลที่ณภาภัช ฟิสิโอเทอราพี คลินิก",
        en: "A personalised physiotherapy programme at Napapai Physiotherapy Clinic.",
      },
      {
        th: "แผนโภชนาการเฉพาะบุคคลออกแบบตามผลตรวจ",
        en: "A personalised nutrition plan built around your results.",
      },
    ],
    itinerary: [
      {
        day: 1,
        title: {
          th: "เริ่มต้นการดูแล",
          en: "Begin the Care",
        },
        items: [
          {
            time: "14:00",
            activity: {
              th: "เช็กอินรีสอร์ทริมหาดโบ๊ะผุดที่อนันตรา บ่อผุด",
              en: "Check in to the beachfront resort at Anantara Bophut.",
            },
            partner: "Anantara Bophut Koh Samui Resort",
          },
          {
            time: "16:00",
            activity: {
              th: "ปรึกษาแพทย์เพื่อวางแผนการตรวจและการดูแลเฉพาะบุคคล",
              en: "A physician consult to plan your screening and personalised care.",
            },
            partner: "Bangkok Hospital Samui",
          },
          {
            time: "18:30",
            activity: {
              th: "อาหารเย็นเพื่อสุขภาพริมทะเลที่ห้องอาหารฟูลมูน",
              en: "A wholesome seaside dinner at the Full Moon restaurant.",
            },
            partner: "Anantara Bophut Koh Samui Resort",
          },
        ],
      },
      {
        day: 2,
        title: {
          th: "ตรวจสุขภาพเชิงลึก",
          en: "The Full Screening",
        },
        items: [
          {
            time: "07:30",
            activity: {
              th: "เดินทางสู่โรงพยาบาลกรุงเทพสมุยเพื่อการตรวจสุขภาพ",
              en: "Transfer to Bangkok Hospital Samui for the health screening.",
            },
            partner: "",
          },
          {
            time: "08:00",
            activity: {
              th: "ตรวจสุขภาพเชิงป้องกันครบวงจร: หัวใจ ปอด เลือด และการคัดกรองมะเร็ง",
              en: "A full preventive screening: heart, lungs, bloods and cancer markers.",
            },
            partner: "Bangkok Hospital Samui",
          },
          {
            time: "13:00",
            activity: {
              th: "กลับสู่รีสอร์ทและพักผ่อนริมทะเล",
              en: "Return to the resort and rest by the sea.",
            },
            partner: "Anantara Bophut Koh Samui Resort",
          },
          {
            time: "17:00",
            activity: {
              th: "พิธีนวดอนันตราซิกเนเจอร์เพื่อผ่อนคลาย",
              en: "An Anantara signature massage to unwind.",
            },
            partner: "Anantara Bophut Koh Samui Resort",
          },
        ],
      },
      {
        day: 3,
        title: {
          th: "ฟื้นฟูการเคลื่อนไหว",
          en: "Restore Movement",
        },
        items: [
          {
            time: "08:00",
            activity: {
              th: "โยคะและการยืดเหยียดเบา ๆ ริมหาด",
              en: "Yoga and gentle stretching on the beach.",
            },
            partner: "Anantara Bophut Koh Samui Resort",
          },
          {
            time: "10:00",
            activity: {
              th: "ประเมินท่าทางและการเคลื่อนไหวที่ณภาภัช ฟิสิโอเทอราพี คลินิก",
              en: "A posture and movement assessment at Napapai Physiotherapy Clinic.",
            },
            partner: "Napapai Physiotherapy Clinic",
          },
          {
            time: "11:00",
            activity: {
              th: "เซสชันกายภาพบำบัดเฉพาะบุคคลและการฝึกแก้ไขท่าทาง",
              en: "A personalised physiotherapy session and corrective-movement training.",
            },
            partner: "Napapai Physiotherapy Clinic",
          },
          {
            time: "18:30",
            activity: {
              th: "อาหารเย็นปรับตามแผนโภชนาการเบื้องต้น",
              en: "A dinner adjusted to your preliminary nutrition plan.",
            },
            partner: "Anantara Bophut Koh Samui Resort",
          },
        ],
      },
      {
        day: 4,
        title: {
          th: "วางแผนเพื่ออนาคต",
          en: "Plan for the Future",
        },
        items: [
          {
            time: "09:00",
            activity: {
              th: "ปรึกษาผลตรวจกับแพทย์และวางแผนสุขภาพเชิงป้องกัน",
              en: "Review results with the physician and set a preventive-health plan.",
            },
            partner: "Bangkok Hospital Samui",
          },
          {
            time: "11:00",
            activity: {
              th: "เซสชันกายภาพบำบัดต่อเนื่องและการสอนท่าออกกำลังกายที่บ้าน",
              en: "A follow-up physiotherapy session and home-exercise coaching.",
            },
            partner: "Napapai Physiotherapy Clinic",
          },
          {
            time: "15:00",
            activity: {
              th: "เวิร์กช็อปโภชนาการเฉพาะบุคคลและการวางแผนมื้ออาหาร",
              en: "A personalised nutrition and meal-planning workshop.",
            },
            partner: "Anantara Bophut Koh Samui Resort",
          },
          {
            time: "18:30",
            activity: {
              th: "อาหารเย็นเฉลิมฉลองริมหาดใต้แสงจันทร์",
              en: "A celebratory beachfront dinner under the moon.",
            },
            partner: "Anantara Bophut Koh Samui Resort",
          },
        ],
      },
      {
        day: 5,
        title: {
          th: "กลับไปอย่างมั่นใจ",
          en: "Depart Assured",
        },
        items: [
          {
            time: "08:00",
            activity: {
              th: "โยคะและสมาธิปิดโปรแกรมริมทะเล",
              en: "A closing yoga and meditation by the sea.",
            },
            partner: "Anantara Bophut Koh Samui Resort",
          },
          {
            time: "10:00",
            activity: {
              th: "รับสรุปผลตรวจ แผนโภชนาการ และโปรแกรมกายภาพฉบับสมบูรณ์",
              en: "Receive your full report, nutrition plan and physiotherapy programme.",
            },
            partner: "Bangkok Hospital Samui",
          },
          {
            time: "12:00",
            activity: {
              th: "เช็กเอาท์พร้อมคู่มือสุขภาพเชิงป้องกันส่วนบุคคล",
              en: "Check out with a personal preventive-health guide.",
            },
            partner: "Anantara Bophut Koh Samui Resort",
          },
        ],
      },
    ],
    suitableFor: {
      th: "เหมาะกับผู้ที่ใส่ใจสุขภาพระยะยาวและต้องการการตรวจเชิงป้องกันพร้อมการฟื้นฟูร่างกายอย่างครบวงจร",
      en: "For the health-conscious guest who wants thorough preventive screening paired with full physical restoration.",
    },
    goals: ["anti_aging_checkup", "detox"],
  },
];

function txt(th: string, en: string): LText {
  return { th, en };
}

function meal(
  id: string,
  name: LText,
  partner: string,
  portion: LText,
  nutrition: PackageMeal["nutrition"],
  wellnessNote: LText,
): PackageMeal {
  return { id, name, partner, portion, nutrition, wellnessNote };
}

export const PACKAGE_CARE_DETAILS: Record<string, PackageCareDetails> = {
  "basic-island-reset": {
    meals: [
      meal(
        "vikasa-buddha-bowl",
        txt("บุดดาโบวล์ควินัว เทมเป้ย่าง และผักย่าง", "Quinoa Buddha bowl with grilled tempeh and roasted vegetables"),
        "Vikasa Life Café",
        txt("โบวล์หลัก 1 ที่ ประมาณ 380-450 g พร้อมน้ำสลัดแยก", "One main bowl, about 380-450 g, dressing served on the side"),
        {
          calories: "480-620 kcal",
          protein: "20-30 g",
          sugar: "8-14 g",
          fiber: "9-14 g",
          sodium: "520-780 mg",
        },
        txt("ให้คาร์โบไฮเดรตเชิงซ้อนและโปรตีนจากพืช ช่วยเติมพลังหลังสปาโดยไม่หนักท้อง", "Complex carbohydrates and plant protein help refuel after spa therapy without feeling heavy."),
      ),
      meal(
        "vikasa-green-detox",
        txt("น้ำกรีนดีท็อกซ์แตงกวา เซเลอรี มะนาว และขิง", "Green detox juice with cucumber, celery, lime and ginger"),
        "Vikasa Life Café",
        txt("แก้ว 250-300 ml ไม่เติมน้ำเชื่อม", "One 250-300 ml glass, no added syrup"),
        {
          calories: "60-110 kcal",
          protein: "1-3 g",
          sugar: "7-13 g",
          fiber: "1-3 g",
          sodium: "70-150 mg",
        },
        txt("ช่วยเพิ่มความสดชื่นและน้ำในร่างกาย โดยคุมน้ำตาลให้เหมาะกับวันพักฟื้น", "Hydrates and refreshes while keeping sugar moderate for a recovery day."),
      ),
    ],
    notes: [
      txt("สามารถขอปรับซอสและน้ำสลัดเป็นแบบแยกเสิร์ฟ เพื่อลดโซเดียมและน้ำตาลได้", "Sauces and dressings can be served separately to reduce sodium and sugar."),
      txt("เหมาะกับวันรีเซ็ตสั้น ๆ เพราะอาหารเน้นย่อยง่าย ไม่กระตุ้นคาเฟอีนช่วงบ่าย", "Best for a short reset because the meal is easy to digest and avoids afternoon caffeine."),
    ],
  },
  "basic-sunrise-flow": {
    meals: [
      meal(
        "sunny-acai-bowl",
        txt("อาซาอิโบวล์ผลไม้เกาะ กราโนลา และเมล็ดเจีย", "Acai bowl with island fruit, granola and chia"),
        "Sunny Side Up Café Samui",
        txt("โบวล์ 300-380 g ขอกราโนลาแยกได้", "One 300-380 g bowl, granola can be served separately"),
        {
          calories: "360-520 kcal",
          protein: "7-13 g",
          sugar: "26-42 g",
          fiber: "8-13 g",
          sodium: "80-180 mg",
        },
        txt("เหมาะหลังโยคะเช้า เติมไกลโคเจนและใยอาหาร แต่ยังคุมความหวานด้วยการแยกท็อปปิงได้", "Good after morning yoga for glycogen and fiber, with sweetness controlled by separating toppings."),
      ),
      meal(
        "sunny-eggs-avocado",
        txt("ไข่ลวก อะโวคาโด และขนมปังโฮลเกรน", "Soft eggs with avocado and whole-grain toast"),
        "Sunny Side Up Café Samui",
        txt("ไข่ 2 ฟอง อะโวคาโด 1/2 ผล ขนมปัง 1-2 แผ่น", "Two eggs, half an avocado, one to two slices of toast"),
        {
          calories: "420-560 kcal",
          protein: "18-26 g",
          sugar: "3-7 g",
          fiber: "7-11 g",
          sodium: "360-620 mg",
        },
        txt("โปรตีนและไขมันดีช่วยให้อิ่มนาน ลดการแกว่งของพลังงานช่วงสาย", "Protein and healthy fats support satiety and steadier late-morning energy."),
      ),
    ],
    notes: [
      txt("เหมาะกับคนที่ออกกำลังกายตอนเช้าและต้องการพลังงานแบบค่อย ๆ ปล่อย", "Designed for morning movers who need slow-release energy."),
      txt("หากไวต่อน้ำตาล สามารถลดผลไม้หวานและเพิ่มโปรตีนจากโยเกิร์ตไม่หวานได้", "If sugar-sensitive, sweet fruit can be reduced and unsweetened yogurt protein added."),
    ],
  },
  "basic-plant-discovery": {
    meals: [
      meal(
        "pure-mediterranean-bowl",
        txt("โบวล์เมดิเตอร์เรเนียน ฮัมมุส ถั่วลูกไก่ และผักสด", "Mediterranean bowl with hummus, chickpeas and fresh vegetables"),
        "Pure Vegan Heaven",
        txt("โบวล์ 400-480 g พร้อมแฟลตเบรด 1 ชิ้นเล็ก", "One 400-480 g bowl with one small flatbread"),
        {
          calories: "520-700 kcal",
          protein: "18-28 g",
          sugar: "8-16 g",
          fiber: "12-18 g",
          sodium: "560-900 mg",
        },
        txt("ให้ใยอาหารสูงและไขมันดีจากงา เหมาะกับการเริ่มทดลองอาหารจากพืชแบบอิ่มจริง", "High fiber and sesame-based healthy fats make plant-based eating feel satisfying."),
      ),
      meal(
        "khunnay-green-curry",
        txt("แกงเขียวหวานเต้าหู้กับข้าวกล้อง", "Tofu green curry with brown rice"),
        "Vegan Khunnay",
        txt("แกง 1 ถ้วย 250-320 ml ข้าวกล้อง 120-160 g", "One 250-320 ml curry bowl with 120-160 g brown rice"),
        {
          calories: "480-650 kcal",
          protein: "16-24 g",
          sugar: "7-13 g",
          fiber: "6-10 g",
          sodium: "680-980 mg",
        },
        txt("ปรับกะทิและความเค็มได้ เพื่อให้ได้รสไทยแต่ยังเหมาะกับเป้าหมายดีท็อกซ์", "Coconut milk and salt can be moderated so Thai flavour still fits a detox goal."),
      ),
    ],
    notes: [
      txt("คลาสทำอาหารจะเน้นวิธีคุมปริมาณน้ำมัน กะทิ และน้ำตาลในเมนูไทย", "The cooking class focuses on managing oil, coconut milk and sugar in Thai dishes."),
      txt("เหมาะกับผู้ที่อยากเริ่มกินจากพืชโดยไม่รู้สึกว่าถูกจำกัดมากเกินไป", "Useful for guests beginning plant-based eating without feeling overly restricted."),
    ],
  },
  "basic-forest-calm": {
    meals: [
      meal(
        "horizon-blossom-tea",
        txt("ชาดอกไม้และสมุนไพรคลายเครียด", "Calming blossom and herbal tea"),
        "Horizon Café",
        txt("ชา 300-350 ml ไม่เติมน้ำผึ้งหรือไซรัป", "One 300-350 ml tea, no honey or syrup added"),
        {
          calories: "5-40 kcal",
          protein: "0-1 g",
          sugar: "0-6 g",
          fiber: "0-1 g",
          sodium: "0-40 mg",
        },
        txt("ช่วยปิดวันแบบไม่กระตุ้นระบบประสาท เหมาะกับผู้ที่นอนหลับยาก", "Closes the day without stimulating the nervous system, helpful for poor sleep."),
      ),
      meal(
        "horizon-tropical-bowl",
        txt("โบวล์ผลไม้เขตร้อน โยเกิร์ตไม่หวาน และเมล็ดฟักทอง", "Tropical fruit bowl with unsweetened yogurt and pumpkin seeds"),
        "Horizon Café",
        txt("โบวล์ 250-330 g เลือกโยเกิร์ตนมวัวหรือจากพืชได้", "One 250-330 g bowl with dairy or plant yogurt"),
        {
          calories: "240-380 kcal",
          protein: "8-16 g",
          sugar: "18-30 g",
          fiber: "5-9 g",
          sodium: "60-160 mg",
        },
        txt("เป็นมื้อเบาหลังสปา ช่วยเติมจุลินทรีย์และแร่ธาตุโดยไม่หนักระบบย่อย", "A light post-spa meal that supports gut flora and minerals without overloading digestion."),
      ),
    ],
    notes: [
      txt("เหมาะกับช่วงบ่ายถึงเย็น เพราะเมนูเลี่ยงคาเฟอีนและน้ำตาลสูง", "Suited to afternoon-evening care because menus avoid caffeine and high sugar."),
      txt("หากมีแนวโน้มไมเกรน สามารถลดกลิ่นสมุนไพรแรงและเลือกชาอ่อนลงได้", "For migraine tendency, strong aromatic herbs can be softened and milder tea selected."),
    ],
  },
  "basic-sweat-sea": {
    meals: [
      meal(
        "lamai-bean-burger",
        txt("เบอร์เกอร์ถั่ว สลัดเมล็ดธัญพืช และซอสโยเกิร์ตจากพืช", "Bean burger, seed salad and plant-yogurt sauce"),
        "Lamai Veggie",
        txt("เบอร์เกอร์ 1 ชิ้น สลัด 180-240 g ซอสแยก", "One burger, 180-240 g salad, sauce on the side"),
        {
          calories: "560-760 kcal",
          protein: "24-36 g",
          sugar: "8-16 g",
          fiber: "12-18 g",
          sodium: "650-980 mg",
        },
        txt("เติมโปรตีนและใยอาหารหลังการฝึก ช่วยฟื้นกล้ามเนื้อโดยไม่พึ่งเนื้อสัตว์", "Adds protein and fiber after training to support muscle recovery without animal protein."),
      ),
      meal(
        "lamai-protein-smoothie",
        txt("สมูทตี้โปรตีนกล้วย โกโก้ และเมล็ดแฟลกซ์", "Banana, cacao and flax protein smoothie"),
        "Lamai Veggie",
        txt("แก้ว 300-400 ml เลือกโปรตีนจากพืช 1 สกูป", "One 300-400 ml glass with one scoop of plant protein"),
        {
          calories: "300-460 kcal",
          protein: "18-28 g",
          sugar: "16-28 g",
          fiber: "5-9 g",
          sodium: "180-340 mg",
        },
        txt("ช่วยเติมพลังหลังคาร์ดิโอ คุมความหวานด้วยกล้วยสุกระดับกลางและไม่เติมไซรัป", "Refuels after cardio while controlling sweetness with medium-ripe banana and no syrup."),
      ),
    ],
    notes: [
      txt("มื้อหลังฝึกเน้นโปรตีนและคาร์โบไฮเดรตพอเหมาะ เพื่อช่วยฟื้นตัวภายในวันเดียว", "Post-training meals balance protein and carbohydrates for same-day recovery."),
      txt("สามารถปรับโซเดียมในซอสและเครื่องปรุงสำหรับผู้ที่บวมน้ำง่าย", "Sodium in sauces and seasoning can be adjusted for guests prone to water retention."),
    ],
  },
  "premium-burnout-reset": {
    meals: [
      meal(
        "absolute-nervous-system-dinner",
        txt("ซุปฟักทอง ข้าวกล้องสมุนไพร และปลา/เต้าหู้ย่าง", "Pumpkin soup, herb brown rice and grilled fish or tofu"),
        "Absolute Sanctuary",
        txt("ซุป 250-300 ml ข้าว 120-150 g โปรตีน 120-160 g", "250-300 ml soup, 120-150 g rice, 120-160 g protein"),
        {
          calories: "520-720 kcal",
          protein: "28-42 g",
          sugar: "8-16 g",
          fiber: "7-12 g",
          sodium: "520-820 mg",
        },
        txt("เน้นแมกนีเซียม คาร์โบไฮเดรตเชิงซ้อน และโปรตีนพอเหมาะ เพื่อช่วยระบบประสาทผ่อนลง", "Magnesium, complex carbohydrates and moderate protein help the nervous system settle."),
      ),
      meal(
        "absolute-hormone-breakfast",
        txt("โจ๊กควินัว ไข่/เต้าหู้ และผักใบเขียว", "Quinoa porridge with egg or tofu and leafy greens"),
        "Absolute Sanctuary",
        txt("ชาม 350-430 g เพิ่มโปรตีนได้ตามผลประเมิน", "One 350-430 g bowl, protein adjustable to the assessment"),
        {
          calories: "380-540 kcal",
          protein: "18-30 g",
          sugar: "4-10 g",
          fiber: "6-10 g",
          sodium: "380-640 mg",
        },
        txt("ช่วยให้พลังงานช่วงเช้านิ่งขึ้น ลดการพึ่งกาแฟทันทีหลังตื่น", "Supports steadier morning energy and reduces the need for immediate coffee."),
      ),
    ],
    notes: [
      txt("ทีมโภชนาการสามารถปรับมื้อเย็นให้เบาลงหากผลประเมินชี้ว่าการนอนถูกรบกวนง่าย", "Nutritionists can lighten dinner if the assessment suggests fragile sleep."),
      txt("โปรแกรมหลีกเลี่ยงน้ำตาลสูงช่วงเย็นเพื่อช่วยให้ระดับพลังงานค่อย ๆ ลง", "The plan avoids high evening sugar so energy can taper naturally."),
    ],
  },
  "premium-deep-sleep": {
    meals: [
      meal(
        "samahita-light-dinner",
        txt("ซุปผักรากย่าง ข้าวกล้องเล็กน้อย และเต้าหู้อบสมุนไพร", "Roasted root vegetable soup, a small brown-rice portion and herb-baked tofu"),
        "Samahita Retreat",
        txt("ซุป 300 ml ข้าว 80-120 g เต้าหู้ 100-140 g", "300 ml soup, 80-120 g rice, 100-140 g tofu"),
        {
          calories: "360-520 kcal",
          protein: "16-26 g",
          sugar: "7-14 g",
          fiber: "7-12 g",
          sodium: "420-700 mg",
        },
        txt("มื้อเย็นเบา ลดภาระระบบย่อยก่อนนอนและช่วยให้ร่างกายเข้าสู่โหมดพัก", "A light dinner reduces digestive load before bed and supports rest mode."),
      ),
      meal(
        "samahita-magnesium-smoothie",
        txt("สมูทตี้กล้วย ผักโขม เมล็ดฟักทอง และโกโก้ดิบ", "Banana, spinach, pumpkin seed and raw cacao smoothie"),
        "Samahita Retreat",
        txt("แก้ว 280-350 ml ไม่เติมน้ำตาล", "One 280-350 ml glass, no added sugar"),
        {
          calories: "220-360 kcal",
          protein: "8-16 g",
          sugar: "14-24 g",
          fiber: "5-9 g",
          sodium: "80-180 mg",
        },
        txt("เพิ่มแมกนีเซียมจากอาหารจริง ช่วยสนับสนุนการคลายกล้ามเนื้อและการนอน", "Food-based magnesium supports muscle relaxation and sleep quality."),
      ),
    ],
    notes: [
      txt("ตัดคาเฟอีนหลังเที่ยงและคุมน้ำตาลช่วงเย็นเพื่อช่วยจังหวะหลับ", "Caffeine is avoided after midday and evening sugar is moderated for sleep rhythm."),
      txt("ชาก่อนนอนเลือกสูตรกลิ่นอ่อนสำหรับผู้ที่ไวต่อกลิ่น", "Bedtime tea can be made mild for scent-sensitive guests."),
    ],
  },
  "premium-detox-renew": {
    meals: [
      meal(
        "absolute-detox-broth",
        txt("ซุปผักรสอ่อน สลัดเอนไซม์ และน้ำสกัดเย็น", "Mild vegetable broth, enzyme salad and cold-pressed juice"),
        "Absolute Sanctuary",
        txt("ซุป 250-300 ml สลัด 220-280 g น้ำสกัด 200-250 ml", "250-300 ml broth, 220-280 g salad, 200-250 ml juice"),
        {
          calories: "280-440 kcal",
          protein: "8-16 g",
          sugar: "18-32 g",
          fiber: "8-13 g",
          sodium: "360-620 mg",
        },
        txt("ให้มื้อเบาในวันเปิดดีท็อกซ์ ช่วยลดภาระระบบย่อยโดยยังมีแร่ธาตุ", "A light cleanse-opening meal reduces digestive load while keeping minerals present."),
      ),
      meal(
        "vikasa-tempeh-green",
        txt("โบวล์เทมเป้ ผักใบเขียว และน้ำกรีนดีท็อกซ์", "Tempeh green bowl with leafy vegetables and green detox juice"),
        "Vikasa Life Café",
        txt("โบวล์ 380-460 g น้ำกรีน 200-250 ml", "One 380-460 g bowl and 200-250 ml green juice"),
        {
          calories: "500-680 kcal",
          protein: "24-34 g",
          sugar: "10-20 g",
          fiber: "10-16 g",
          sodium: "560-860 mg",
        },
        txt("เติมโปรตีนจากถั่วหมักเพื่อให้ดีท็อกซ์ไม่อ่อนแรงเกินไป", "Fermented soy protein keeps the detox from feeling under-fuelled."),
      ),
    ],
    notes: [
      txt("ตัวเลขน้ำตาลของน้ำผักผลไม้จะคุมด้วยสัดส่วนผักมากกว่าผลไม้", "Juice sugar is managed by using more vegetables than fruit."),
      txt("หากมีประวัติหน้ามืดง่าย สามารถเพิ่มโปรตีนและคาร์โบไฮเดรตเชิงซ้อนในมื้อกลางวันได้", "If lightheadedness is common, lunch protein and complex carbohydrates can be increased."),
    ],
  },
  "premium-island-strong": {
    meals: [
      meal(
        "khunnay-massaman-tofu",
        txt("แกงมัสมั่นเต้าหู้ ข้าวกล้อง และแตงกวาสด", "Tofu massaman curry with brown rice and cucumber"),
        "Vegan Khunnay",
        txt("แกง 280-340 ml ข้าว 140-180 g", "280-340 ml curry and 140-180 g rice"),
        {
          calories: "620-820 kcal",
          protein: "22-34 g",
          sugar: "8-16 g",
          fiber: "7-12 g",
          sodium: "720-1080 mg",
        },
        txt("เหมาะกับวันฝึกหนักเพราะมีพลังงานพอ แต่ปรับกะทิและเกลือได้ตามเป้าหมาย", "Suited to hard training days, with coconut milk and salt adjustable to goals."),
      ),
      meal(
        "khunnay-vegan-padthai",
        txt("ผัดไทยวีแกนและส้มตำเห็ด", "Vegan pad thai with mushroom som tam"),
        "Vegan Khunnay",
        txt("ผัดไทย 1 จาน 320-420 g ส้มตำ 150-220 g", "One 320-420 g pad thai plate and 150-220 g som tam"),
        {
          calories: "560-760 kcal",
          protein: "18-30 g",
          sugar: "14-26 g",
          fiber: "7-12 g",
          sodium: "780-1180 mg",
        },
        txt("ให้คาร์บหลังซ้อมและรสไทยชัด แต่สามารถลดน้ำตาลและน้ำปลาเจในซอสได้", "Provides post-training carbohydrates and Thai flavour while sauce sugar and vegan fish sauce can be reduced."),
      ),
    ],
    notes: [
      txt("มื้อหลักวางให้มีโปรตีนพอสำหรับการฟื้นกล้ามเนื้อหลังเวทและมวยไทย", "Main meals provide enough protein for recovery after strength work and Muay Thai."),
      txt("หากเหงื่อออกมาก สามารถเพิ่มเกลือแร่จากอาหารแทนเครื่องดื่มหวาน", "For heavy sweating, electrolytes can be added through food rather than sweet drinks."),
    ],
  },
  "premium-mind-balance": {
    meals: [
      meal(
        "halapua-farm-salad",
        txt("สลัดผักฟาร์ม ซุปฟักทอง และเมล็ดธัญพืช", "Farm-greens salad, pumpkin soup and mixed seeds"),
        "Halapua by Kapuhala",
        txt("สลัด 240-320 g ซุป 250-300 ml เมล็ดธัญพืช 15-25 g", "240-320 g salad, 250-300 ml soup, 15-25 g seeds"),
        {
          calories: "380-560 kcal",
          protein: "12-22 g",
          sugar: "10-18 g",
          fiber: "10-16 g",
          sodium: "360-640 mg",
        },
        txt("เน้นผักสดและไขมันดี ช่วยให้มื้อเย็นเบาเหมาะกับการฝึกเจริญสติ", "Fresh vegetables and healthy fats keep dinner light for mindfulness practice."),
      ),
      meal(
        "halapua-smoothie-bowl",
        txt("สมูทตี้โบวล์ผลไม้เกาะ เมล็ดเจีย และโยเกิร์ตจากพืช", "Island-fruit smoothie bowl with chia and plant yogurt"),
        "Halapua by Kapuhala",
        txt("โบวล์ 300-380 g เลือกผลไม้หวานน้อยได้", "One 300-380 g bowl with lower-sugar fruit options"),
        {
          calories: "320-500 kcal",
          protein: "8-18 g",
          sugar: "20-36 g",
          fiber: "8-14 g",
          sodium: "80-180 mg",
        },
        txt("ช่วยเริ่มวันด้วยใยอาหารและความสดชื่น โดยปรับผลไม้สำหรับคนไวต่อน้ำตาลได้", "Starts the day with fiber and freshness, with fruit adjusted for sugar sensitivity."),
      ),
    ],
    notes: [
      txt("เวิร์กช็อป mindful eating จะใช้เมนูจริงเพื่อฝึกสังเกตความอิ่มและจังหวะการกิน", "The mindful-eating workshop uses real meals to practise satiety awareness and eating rhythm."),
      txt("มื้อเย็นเงียบสงบจะเลี่ยงอาหารหนักและกลิ่นแรงเพื่อช่วยให้ใจนิ่งขึ้น", "Silent dinners avoid heavy dishes and strong aromas to support mental stillness."),
    ],
  },
  "deluxe-kamalaya-healing": {
    meals: [
      meal(
        "kamalaya-soma-healing-dinner",
        txt("ปลาทะเลนึ่งสมุนไพร ข้าวไรซ์เบอร์รี และผักนึ่ง", "Steamed local fish with herbs, riceberry rice and steamed vegetables"),
        "Kamalaya Koh Samui",
        txt("ปลา 140-180 g ข้าว 100-140 g ผัก 220-300 g", "140-180 g fish, 100-140 g rice, 220-300 g vegetables"),
        {
          calories: "480-680 kcal",
          protein: "32-46 g",
          sugar: "5-11 g",
          fiber: "7-12 g",
          sodium: "480-760 mg",
        },
        txt("โปรตีนย่อยง่ายและสมุนไพรอ่อนช่วยให้ร่างกายฟื้นตัวโดยไม่กระตุ้นระบบประสาทมากเกินไป", "Easy-digesting protein and gentle herbs support recovery without overstimulating the nervous system."),
      ),
      meal(
        "kamalaya-monk-cave-tea",
        txt("ชาสมุนไพรหลังบำบัดและของว่างถั่วเมล็ดพืช", "Post-therapy herbal tea with nut and seed snack"),
        "Kamalaya Koh Samui",
        txt("ชา 300 ml ของว่าง 25-40 g", "300 ml tea and 25-40 g snack"),
        {
          calories: "160-280 kcal",
          protein: "5-10 g",
          sugar: "2-8 g",
          fiber: "3-6 g",
          sodium: "40-120 mg",
        },
        txt("ช่วยประคองพลังระหว่างทรีตเมนต์ยาวโดยไม่เพิ่มน้ำตาลเร็วเกินไป", "Supports energy between longer treatments without a fast sugar spike."),
      ),
    ],
    notes: [
      txt("เมนูปรับตามคำปรึกษาแพทย์แผนจีนและความไวต่ออาหารของผู้เข้าพัก", "Menus adjust to the Chinese medicine consult and personal food sensitivities."),
      txt("เน้นสมุนไพรกลิ่นอ่อนสำหรับผู้ที่มีแนวโน้มไมเกรนหรือไวต่อกลิ่น", "Gentle aromatics are prioritised for migraine or scent-sensitive guests."),
    ],
  },
  "deluxe-ocean-longevity": {
    meals: [
      meal(
        "sixsenses-longevity-dinner",
        txt("ปลา/เต้าหู้ย่าง ผักทะเล และสลัดออร์แกนิก", "Grilled fish or tofu with sea vegetables and organic salad"),
        "Six Senses Samui",
        txt("โปรตีน 140-180 g ผัก 250-340 g ไขมันดีจากน้ำมันมะกอก", "140-180 g protein, 250-340 g vegetables, olive-oil healthy fats"),
        {
          calories: "520-760 kcal",
          protein: "30-46 g",
          sugar: "6-14 g",
          fiber: "8-14 g",
          sodium: "480-820 mg",
        },
        txt("เน้นโปรตีนคุณภาพ ผักหลากสี และไขมันดีเพื่อสนับสนุนเป้าหมายชะลอวัย", "Quality protein, colourful vegetables and healthy fats support longevity goals."),
      ),
      meal(
        "sixsenses-diagnostic-breakfast",
        txt("อาหารเช้าปรับตามผลตรวจ: ไข่/เต้าหู้ ผักใบเขียว และผลไม้หวานน้อย", "Diagnostic-informed breakfast with egg or tofu, greens and lower-sugar fruit"),
        "Six Senses Samui",
        txt("โปรตีน 120-160 g ผัก 150-220 g ผลไม้ 100-150 g", "120-160 g protein, 150-220 g greens, 100-150 g fruit"),
        {
          calories: "380-560 kcal",
          protein: "24-38 g",
          sugar: "9-18 g",
          fiber: "6-11 g",
          sodium: "320-620 mg",
        },
        txt("ช่วยคุมพลังงานเช้าให้เสถียรและปรับตามข้อมูลสุขภาพรายบุคคล", "Keeps morning energy stable and adapts to personal health data."),
      ),
    ],
    notes: [
      txt("หลังได้ผลตรวจ ทีมดูแลสามารถลดน้ำตาล เพิ่มโปรตีน หรือปรับไขมันตามแผนแพทย์", "After diagnostics, the team can reduce sugar, increase protein or adjust fats to the physician plan."),
      txt("อาหารค่ำเน้นเวลารับประทานที่ไม่ดึกเกินไปเพื่อช่วยคุณภาพการนอน", "Dinner timing is kept earlier where possible to support sleep quality."),
    ],
  },
  "deluxe-sanctuary-sleep": {
    meals: [
      meal(
        "banyan-saffron-sleep-dinner",
        txt("ปลานึ่ง/เต้าหู้สมุนไพร ข้าวหอมมะลิกล้อง และผักลวก", "Steamed fish or herbal tofu with brown jasmine rice and blanched vegetables"),
        "Banyan Tree Samui",
        txt("โปรตีน 130-170 g ข้าว 90-130 g ผัก 220-300 g", "130-170 g protein, 90-130 g rice, 220-300 g vegetables"),
        {
          calories: "440-640 kcal",
          protein: "26-42 g",
          sugar: "5-12 g",
          fiber: "7-12 g",
          sodium: "420-720 mg",
        },
        txt("มื้อค่ำเน้นย่อยง่ายและคาร์บพอเหมาะ เพื่อช่วยให้เข้าสู่พิธีก่อนนอนได้สบาย", "Easy digestion and moderate carbohydrates help the bedtime ritual feel comfortable."),
      ),
      meal(
        "banyan-bedtime-tea",
        txt("ชาสมุนไพรก่อนนอนและผลไม้อบชิ้นเล็ก", "Bedtime herbal tea with a small dried-fruit bite"),
        "Banyan Tree Samui",
        txt("ชา 300 ml ของว่าง 15-25 g", "300 ml tea and 15-25 g snack"),
        {
          calories: "40-120 kcal",
          protein: "0-2 g",
          sugar: "6-16 g",
          fiber: "1-3 g",
          sodium: "0-50 mg",
        },
        txt("ช่วยสร้างสัญญาณก่อนนอนแบบอ่อนโยน โดยคุมของหวานให้ไม่รบกวนการหลับ", "Creates a gentle bedtime cue while keeping sweetness low enough for sleep."),
      ),
    ],
    notes: [
      txt("ทุกมื้อเย็นสามารถลดเครื่องเทศและกลิ่นแรงเพื่อเหมาะกับผู้ที่ไวต่อสิ่งกระตุ้น", "Evening meals can reduce spices and strong aromas for trigger-sensitive guests."),
      txt("ชาก่อนนอนจะหลีกเลี่ยงคาเฟอีนและเลือกสมุนไพรกลิ่นนุ่ม", "Bedtime tea avoids caffeine and uses softer herbal notes."),
    ],
  },
  "deluxe-family-shore": {
    meals: [
      meal(
        "four-seasons-family-bbq",
        txt("บาร์บีคิวทะเลเพื่อสุขภาพ ผักย่าง และข้าวกล้อง", "Wholesome seafood barbecue with grilled vegetables and brown rice"),
        "Four Seasons Resort Koh Samui",
        txt("โปรตีน 120-180 g ผัก 220-320 g ข้าว 80-140 g ต่อผู้ใหญ่", "120-180 g protein, 220-320 g vegetables, 80-140 g rice per adult"),
        {
          calories: "520-780 kcal",
          protein: "32-50 g",
          sugar: "6-14 g",
          fiber: "6-12 g",
          sodium: "520-900 mg",
        },
        txt("ปรับปริมาณตามวัยได้ เด็กได้รับรสชาติสนุก ส่วนผู้ใหญ่ยังคุมสมดุลพลังงาน", "Portions adapt by age, keeping meals fun for kids and balanced for adults."),
      ),
      meal(
        "lamai-family-cooking",
        txt("ผัดไทย แกงเขียวหวาน และทับทิมกรอบสูตรปรับน้ำตาล", "Pad thai, green curry and lower-sugar tub tim krob"),
        "Lamai Thai Cooking School",
        txt("ชุดชิม 3 เมนู รวมประมาณ 450-650 g ต่อผู้ใหญ่", "Three-dish tasting set, about 450-650 g per adult"),
        {
          calories: "680-980 kcal",
          protein: "22-38 g",
          sugar: "22-42 g",
          fiber: "6-12 g",
          sodium: "780-1280 mg",
        },
        txt("คลาสสอนให้ลดหวาน มัน เค็มในอาหารไทย โดยยังรักษาความสนุกของมื้อครอบครัว", "The class teaches lower sweet, fat and salt levels while keeping the family meal joyful."),
      ),
    ],
    notes: [
      txt("เมนูเด็กสามารถลดเผ็ด แยกซอส และปรับขนาดจานตามอายุ", "Children's dishes can be less spicy, served with sauces aside and portioned by age."),
      txt("ครอบครัวที่มีหลายเป้าหมายสามารถแยกโปรตีนหรือคาร์บในจานเดียวกันได้", "Families with mixed goals can separate protein or carbohydrate portions within the same meal."),
    ],
  },
  "deluxe-longevity-medical": {
    meals: [
      meal(
        "anantara-fullmoon-dinner",
        txt("อาหารเย็นริมทะเล: ปลา/ไก่ย่าง ผักย่าง และมันหวาน", "Seaside dinner with grilled fish or chicken, roasted vegetables and sweet potato"),
        "Anantara Bophut Koh Samui Resort",
        txt("โปรตีน 140-190 g ผัก 220-320 g มันหวาน 100-160 g", "140-190 g protein, 220-320 g vegetables, 100-160 g sweet potato"),
        {
          calories: "540-780 kcal",
          protein: "34-52 g",
          sugar: "8-18 g",
          fiber: "7-13 g",
          sodium: "480-820 mg",
        },
        txt("เหมาะกับการดูแลเชิงป้องกัน เพราะคุมโปรตีน คาร์บ และโซเดียมได้ชัดเจน", "Supports preventive care by making protein, carbohydrates and sodium easier to manage."),
      ),
      meal(
        "anantara-personal-nutrition",
        txt("มื้อปรับตามผลตรวจ: ธัญพืชเต็มเมล็ด โปรตีนไม่ติดมัน และผักสีเข้ม", "Screening-informed meal with whole grains, lean protein and dark greens"),
        "Anantara Bophut Koh Samui Resort",
        txt("จานหลัก 420-560 g ปรับตามคำแนะนำแพทย์", "One 420-560 g main plate adjusted to physician guidance"),
        {
          calories: "480-700 kcal",
          protein: "30-48 g",
          sugar: "5-14 g",
          fiber: "8-14 g",
          sodium: "420-760 mg",
        },
        txt("ใช้ผลตรวจช่วยกำหนดสัดส่วนอาหาร เพื่อให้คำแนะนำต่อหลังทริปทำได้จริง", "Diagnostics guide meal ratios so post-trip recommendations are realistic."),
      ),
    ],
    notes: [
      txt("หลังตรวจสุขภาพ ทีมแพทย์และโภชนาการจะปรับมื้อต่อไปตามผลเลือดและเป้าหมาย", "After screening, medical and nutrition teams adjust meals to blood results and goals."),
      txt("เมนูออกแบบให้ส่งต่อข้อมูลจริงกับร้านอาหารได้ โดยใช้ช่วงปริมาณแทนค่าตายตัว", "Menus are designed for real restaurant handoff using practical ranges rather than fixed numbers."),
    ],
  },
};

export function getPackageCareDetails(
  id: string,
): PackageCareDetails | undefined {
  return PACKAGE_CARE_DETAILS[id];
}

export function getPackage(id: string): WellnessPackage | undefined {
  return PACKAGES.find((p) => p.id === id);
}

/** Compact catalog for LLM system prompts (keeps context small). */
export function catalogForLlm(): string {
  const compact = PACKAGES.map((p) => ({
    id: p.id,
    tier: p.tier,
    name: p.name.en,
    tagline: p.tagline.en,
    days: p.days,
    nights: p.nights,
    price: p.price,
    partners: p.partners,
    goals: p.goals,
    suitableFor: p.suitableFor.en,
    highlights: p.highlights.map((h) => h.en).join("; "),
  }));
  return JSON.stringify(compact);
}
