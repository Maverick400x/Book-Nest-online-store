export let products = [

  {
  id: 1,
  title: "The Alchemist",
  author: "Paulo Coelho",
  price: 399,
  tag: "fiction",               // for related books, category filtering
  limitedEdition: true,        // optional, for badge/highlight
  hotSale: false,              // optional, for special promotion
  image: "https://m.media-amazon.com/images/I/617lxveUjYL.jpg", // custom image path (or placeholder)
  description: "A novel that blends mysticism and self-discovery through a shepherd’s journey to find treasure." // optional
},
  {
  id: 2,
  title: "Rich Dad Poor Dad",
  author: "Robert Kiyosaki",
  price: 499,
  tag: "finance",
  limitedEdition: false,
  hotSale: true,
  image: "https://cdn.kobo.com/book-images/c81ea4de-cfb7-415d-8634-314aad041fdb/1200/1200/False/rich-dad-poor-dad-9.jpg",
  description: "A powerful personal finance book that challenges traditional beliefs about money and investing. Learn the mindset of the wealthy and how to make money work for you."
},
  {
  id: 3,
  title: "Atomic Habits",
  author: "James Clear",
  price: 450,
  tag: "self-help",
  limitedEdition: false,
  hotSale: true,
  image: "https://upload.wikimedia.org/wikipedia/commons/0/06/Atomic_habits.jpg",
  description: "Atomic Habits is a transformative guide on how small changes lead to remarkable results. Learn to break bad habits, build good ones, and master the science of habit formation."
},
{
  id: 4,
  title: "The Power of Your Subconscious Mind",
  author: "Joseph Murphy",
  price: 299,
  tag: "self-help",
  limitedEdition: true,
  hotSale: false,
  image: "https://m.media-amazon.com/images/I/81gTwYAhU7L.jpg",
  description: "A life-changing classic that teaches how to harness the hidden powers of your subconscious mind to achieve success, happiness, and prosperity in all areas of life."
},
  {
  id: 5,
  title: "Ikigai",
  author: "Héctor García",
  price: 350,
  tag: "self-help",
  limitedEdition: true,
  hotSale: false,
  image: "/src/books/ikigai.jpg",
  description: "Discover the Japanese secret to a long and happy life. Ikigai explores the intersection of passion, mission, profession, and vocation to help you find your purpose."
},
  {
  id: 6,
  title: "The Psychology of Money",
  author: "Morgan Housel",
  price: 500,
  tag: "finance",
  limitedEdition: false,
  hotSale: true,
  image: "/src/books/psychology-of-money.jpg",
  description: "In 'The Psychology of Money', Morgan Housel explains how your behavior matters more than your knowledge when it comes to wealth, greed, and happiness. A must-read for understanding money from a human perspective."
},
  {
  id: 7,
  title: "Think and Grow Rich",
  author: "Napoleon Hill",
  price: 550,
  tag: "self-help",
  limitedEdition: false,
  hotSale: true,
  image: "/src/books/think-and-grow-rich.jpg",
  description: "One of the most influential books of all time, 'Think and Grow Rich' outlines the philosophy of success and wealth building through the power of thought and goal setting. Napoleon Hill draws on stories of successful individuals to inspire personal achievement."
},
  {
  id: 8,
  title: "Deep Work",
  author: "Cal Newport",
  price: 420,
  tag: "productivity",
  limitedEdition: true,
  hotSale: false,
  image: "/src/books/deep-work.jpg",
  description: "In 'Deep Work', Cal Newport makes the case for intense focus and distraction-free concentration as the key to productivity and success in the digital age. A practical guide to mastering hard things quickly and producing high-value work in less time."
},
  {
  id: 9,
  title: "The Monk Who Sold His Ferrari",
  author: "Robin Sharma",
  price: 480,
  tag: "self-help",
  limitedEdition: false,
  hotSale: true,
  image: "/src/books/monk-who-sold-ferrari.jpg",
  description: "A life-changing fable that combines spiritual wisdom with practical life strategies. Robin Sharma narrates the story of a high-powered lawyer whose journey to the Himalayas leads him to discover the secrets of a more fulfilling and balanced life."
},
  {
  id: 10,
  title: "Can't Hurt Me",
  author: "David Goggins",
  price: 600,
  tag: "biography",
  limitedEdition: true,
  hotSale: true,
  image: "/src/books/cant-hurt-me.jpg",
  description: "In this powerful memoir, Navy SEAL and endurance athlete David Goggins shares how he overcame a troubled past, physical limitations, and mental barriers to become a symbol of extreme perseverance. 'Can't Hurt Me' teaches the power of self-discipline, grit, and the mindset of no excuses."
},
  {
  id: 11,
  title: "Start With Why",
  author: "Simon Sinek",
  price: 530,
  tag: "leadership",
  limitedEdition: false,
  hotSale: false,
  image: "/src/books/start-with-why.jpg",
  description: "Simon Sinek explores how great leaders inspire action by starting with a clear sense of 'why.' This bestseller guides readers on how to create deeper impact, build stronger organizations, and lead with purpose and clarity."
},
  {
  id: 12,
  title: "Zero to One",
  author: "Peter Thiel",
  price: 499,
  tag: "startup",
  limitedEdition: false,
  hotSale: true,
  image: "/src/books/zero-to-one.jpg",
  description: "In 'Zero to One,' billionaire entrepreneur and investor Peter Thiel shares bold ideas on innovation, competition, and building the future. A must-read for startup founders and anyone who wants to create something truly new and valuable."
},
  {
  id: 13,
  title: "The Lean Startup",
  author: "Eric Ries",
  price: 550,
  tag: "startup",
  limitedEdition: false,
  hotSale: false,
  image: "/src/books/the-lean-startup.jpg",
  description: "Eric Ries presents a revolutionary approach to launching businesses by applying lean principles to startups. This modern classic helps entrepreneurs build sustainable startups through rapid experimentation, validated learning, and agile development."
},
  {
  id: 14,
  title: "Rework",
  author: "Jason Fried",
  price: 470,
  tag: "business",
  limitedEdition: false,
  hotSale: false,
  image: "/src/books/rework.jpg",
  description: "Rework is a bold manifesto that turns traditional business wisdom on its head. Jason Fried shares practical, no-nonsense advice on productivity, planning, growth, and why less is more in business."
},
  {
  id: 15,
  title: "The Subtle Art of Not Giving a F*ck",
  author: "Mark Manson",
  price: 420,
  tag: "self-help",
  limitedEdition: false,
  hotSale: false,
  image: "/src/books/subtle-art.jpg",
  description: "Mark Manson cuts through the clichés of the self-help genre with this refreshing, honest guide to living a better life by caring less about the things that don’t matter and focusing more on what truly does."
},
  {
  id: 16,
  title: "You Can Win",
  author: "Shiv Khera",
  price: 490,
  tag: "self-help",
  limitedEdition: false,
  hotSale: false,
  image: "/src/books/you-can-win.jpg",
  description: "A timeless classic by Shiv Khera, *You Can Win* offers practical insights and inspirational strategies for personal growth, success, and leadership, guiding readers to develop a positive attitude and achieve excellence."
},
  {
  id: 17,
  title: "The Secret",
  author: "Rhonda Byrne",
  price: 530,
  tag: "spiritual",
  limitedEdition: false,
  hotSale: false,
  image: "/src/books/the-secret.jpg",
  description: "Rhonda Byrne's *The Secret* reveals the power of positive thinking and the law of attraction, encouraging readers to harness their thoughts to manifest happiness, health, and success in all areas of life."
},
  {
  id: 18,
  title: "Sapiens",
  author: "Yuval Noah Harari",
  price: 700,
  tag: "history",
  limitedEdition: false,
  hotSale: false,
  image: "/src/books/sapiens.jpg",
  description: "*Sapiens* explores the history of humankind — from the evolution of archaic human species to the modern age — offering profound insights into our societies, cultures, and future as a species."
},
  {
  id: 19,
  title: "Homo Deus",
  author: "Yuval Noah Harari",
  price: 750,
  tag: "future",
  limitedEdition: false,
  hotSale: false,
  image: "/src/books/homo-deus.jpg",
  description: "*Homo Deus* explores the future of humankind — diving into advancements in artificial intelligence, biotechnology, and the pursuit of immortality. A visionary look at where humanity might be heading next."
},
  {
  id: 20,
  title: "21 Lessons for the 21st Century",
  author: "Yuval Noah Harari",
  price: 680,
  tag: "society",
  limitedEdition: false,
  hotSale: false,
  image: "/src/books/21-lessons.jpg",
  description: "In *21 Lessons for the 21st Century*, Yuval Noah Harari examines today’s most urgent issues—from fake news to AI and from terrorism to climate change—offering a clear and accessible framework for navigating our complex world."
},
  {
  id: 21,
  title: "The 5 AM Club",
  author: "Robin Sharma",
  price: 620,
  tag: "self-help",
  limitedEdition: true,
  hotSale: true,
  image: "/src/books/the-5am-club.jpg",
  description: "In *The 5 AM Club*, Robin Sharma reveals the transformative power of starting your day early. Through a fictional story, he introduces a revolutionary morning routine used by the world's most successful people to boost productivity, enhance health, and nurture serenity."
},
  {
  id: 22,
  title: "The Magic of Thinking Big",
  author: "David J. Schwartz",
  price: 540,
  tag: "self-help",
  limitedEdition: false,
  hotSale: true,
  image: "/src/books/the-magic-of-thinking-big.jpg",
  description: "In *The Magic of Thinking Big*, David J. Schwartz offers powerful techniques for achieving success through the sheer force of belief. This classic self-help book teaches readers to think positively, set high goals, and act with confidence to unlock their full potential."
},
  {
  id: 23,
  title: "Tools of Titans",
  author: "Tim Ferriss",
  price: 800,
  tag: "productivity",
  limitedEdition: true,
  hotSale: true,
  image: "/src/books/tools-of-titans.jpg",
  description: "In *Tools of Titans*, Tim Ferriss distills insights and strategies from world-class performers—including billionaires, athletes, and artists. This actionable guide spans health, wealth, and wisdom, offering practical tactics to optimize your day, focus, and long-term growth."
},
  {
  id: 24,
  title: "The 4-Hour Workweek",
  author: "Tim Ferriss",
  price: 750,
  tag: "lifestyle",
  limitedEdition: false,
  hotSale: true,
  image: "/src/books/4-hour-workweek.jpg",
  description: "*The 4-Hour Workweek* offers a blueprint for escaping the 9–5 grind. Tim Ferriss challenges conventional work culture and shows how to design a life of freedom, automation, and passive income through smart time management and remote entrepreneurship."
},
  {
  id: 25,
  title: "Grit",
  author: "Angela Duckworth",
  price: 600,
  tag: "psychology",
  limitedEdition: false,
  hotSale: false,
  image: "/src/books/grit.jpg",
  description: "*Grit* by Angela Duckworth explores the power of passion and perseverance in achieving success. Backed by extensive research and real-life stories, the book emphasizes that talent matters, but grit matters more when it comes to long-term goals."
},
  {
  id: 26,
  title: "Mindset",
  author: "Carol S. Dweck",
  price: 590,
  tag: "psychology",
  limitedEdition: false,
  hotSale: false,
  image: "/src/books/mindset.jpg",
  description: "*Mindset* by Carol S. Dweck reveals how our beliefs about our abilities shape our success. By distinguishing between a fixed mindset and a growth mindset, the book empowers readers to unlock their potential through learning, resilience, and effort."
},
  {
  id: 27,
  title: "Dare to Lead",
  author: "Brené Brown",
  price: 650,
  tag: "leadership",
  limitedEdition: false,
  hotSale: false,
  image: "/src/books/dare-to-lead.jpg",
  description: "*Dare to Lead* explores the power of vulnerability in leadership. Brené Brown offers practical guidance on cultivating courage, building trust, and leading with heart in today's complex and fast-changing world."
},
  {
  id: 28,
  title: "How to Win Friends and Influence People",
  author: "Dale Carnegie",
  price: 580,
  tag: "self-help",
  limitedEdition: false,
  hotSale: false,
  image: "/src/books/how-to-win-friends.jpg",
  description: "Dale Carnegie's timeless classic teaches you how to connect with people, gain their trust, and become more persuasive. A must-read for professionals, leaders, and anyone aiming to improve their communication skills."
},
  {
  id: 29,
  title: "The Art of War",
  author: "Sun Tzu",
  price: 500,
  tag: "strategy",
  limitedEdition: false,
  hotSale: false,
  image: "/src/books/art-of-war.jpg",
  description: "A timeless guide to strategy, leadership, and warfare, *The Art of War* by Sun Tzu offers insights that have been applied not only in battle but in business, politics, and personal growth."
},
  {
  id: 30,
  title: "The One Thing",
  author: "Gary Keller",
  price: 570,
  tag: "productivity",
  image: "/src/books/the-one-thing.jpg",
  limitedEdition: false,
  hotSale: false,
  description: "Discover how focusing on just one thing can lead to extraordinary results. Gary Keller reveals the surprising power of narrowing your focus and eliminating distractions in both personal and professional life."
},
  {
  id: 31,
  title: "The 10X Rule",
  author: "Grant Cardone",
  price: 690,
  tag: "motivation",
  image: "/src/books/the-10x-rule.jpg",
  limitedEdition: false,
  hotSale: false,
  description: "In *The 10X Rule*, Grant Cardone teaches you to set massive goals and take massive action—10 times more than what you think is necessary—to achieve extraordinary success in business and life."
},
  {
  id: 32,
  title: "Purple Cow",
  author: "Seth Godin",
  price: 520,
  tag: "marketing",
  image: "/src/books/purple-cow.jpg",
  limitedEdition: false,
  hotSale: false,
  description: "In *Purple Cow*, Seth Godin urges marketers to put a Purple Cow into everything they build and do—meaning something remarkable, something worth noticing. Because in today’s crowded market, being invisible is worse than being bad."
},
  {
  id: 33,
  title: "Hooked",
  author: "Nir Eyal",
  price: 550,
  tag: "product",
  image: "/src/books/hooked.jpg",
  limitedEdition: false,
  hotSale: false,
  description: "In *Hooked: How to Build Habit-Forming Products*, Nir Eyal explains how successful companies create products people can’t put down, using the Hook Model—a four-step process to build customer habits."
},
  {
  id: 34,
  title: "Made to Stick",
  author: "Chip Heath & Dan Heath",
  price: 600,
  tag: "communication",
  image: "/src/books/made-to-stick.jpg",
  limitedEdition: false,
  hotSale: false,
  description: "*Made to Stick* explores why some ideas thrive while others fade, revealing six principles (S.U.C.C.E.S) that make ideas memorable—Simple, Unexpected, Concrete, Credible, Emotional, and Stories."
},
  {
  id: 35,
  title: "The Hard Thing About Hard Things",
  author: "Ben Horowitz",
  price: 680,
  tag: "startup",
  image: "/src/books/hard-thing.jpg",
  limitedEdition: false,
  hotSale: false,
  description: "In *The Hard Thing About Hard Things*, Ben Horowitz draws on his experience as a tech entrepreneur to offer essential advice on building and running a startup—especially the tough stuff they don’t teach in business school."
},
  {
  id: 36,
  title: "Measure What Matters",
  author: "John Doerr",
  price: 640,
  tag: "business",
  image: "/src/books/measure-what-matters.jpg",
  limitedEdition: false,
  hotSale: false,
  description: "*Measure What Matters* is a landmark book by venture capitalist John Doerr that shows how the goal-setting system of Objectives and Key Results (OKRs) has helped giants like Google and Intel achieve explosive growth and innovation."
},
  {
  id: 37,
  title: "The Ride of a Lifetime",
  author: "Robert Iger",
  price: 590,
  tag: "biography",
  image: "/src/books/ride-of-a-lifetime.jpg",
  limitedEdition: false,
  hotSale: false,
  description: "*The Ride of a Lifetime* is Robert Iger’s inspiring memoir about his journey from a humble studio hand to the CEO of The Walt Disney Company. He shares leadership lessons, bold decisions, and values that helped him transform Disney into a global powerhouse."
},
  {
  id: 38,
  title: "Shoe Dog",
  author: "Phil Knight",
  price: 720,
  tag: "biography",
  image: "/src/books/shoe-dog.jpg",
  limitedEdition: false,
  hotSale: false,
  description: "*Shoe Dog* is the candid and compelling memoir by Nike’s co-founder Phil Knight. It recounts the early days of the brand and the risks, struggles, and sacrifices that built one of the world’s most iconic companies."
},
  {
  id: 39,
  title: "Good to Great",
  author: "Jim Collins",
  price: 750,
  tag: "business",
  image: "/src/books/good-to-great.jpg",
  limitedEdition: false,
  hotSale: false,
  description: "*Good to Great* explores what it takes for companies to transition from being merely good to truly great. Jim Collins outlines key principles and research-backed strategies used by exceptional companies to outperform their peers over the long term."
},
  {
  id: 40,
  title: "The Innovator's Dilemma",
  author: "Clayton Christensen",
  price: 700,
  tag: "innovation",
  image: "/src/books/innovators-dilemma.jpg",
  limitedEdition: false,
  hotSale: false,
  description: "*The Innovator's Dilemma* explains why even the most successful companies can fail if they ignore disruptive innovations. Clayton Christensen outlines the risks of sticking with traditional business models and how embracing change can lead to long-term growth."
  },
  {
  id: 41,
  title: "Blue Ocean Strategy",
  author: "W. Chan Kim",
  price: 670,
  tag: "strategy",
  image: "/src/books/blue-ocean-strategy.jpg",
  limitedEdition: false,
  hotSale: false,
  description: "*Blue Ocean Strategy* presents a groundbreaking approach to business strategy—how to break away from the competition and create uncontested market space, or 'blue oceans,' filled with innovation and opportunity."
},
  {
  id: 42,
  title: "The Design of Everyday Things",
  author: "Don Norman",
  price: 650,
  tag: "design",
  image: "/src/books/design-of-everyday-things.jpg",
  limitedEdition: false,
  hotSale: false,
  description: "*The Design of Everyday Things* is a classic in design thinking and usability, showing how good design makes things understandable and usable—and how bad design can frustrate users and cause failure."
},
  {
  id: 43,
  title: "The Elements of User Experience",
  author: "Jesse James Garrett",
  price: 590,
  tag: "design",
  image: "/src/books/elements-of-user-experience.jpg",
  limitedEdition: false,
  hotSale: false,
  description: "This foundational book outlines the essential elements that make up successful user experiences, from strategy to structure and surface, bridging the gap between design and user expectations."
},
  {
  id: 44,
  title: "Steal Like an Artist",
  author: "Austin Kleon",
  price: 450,
  tag: "creativity",
  image: "/src/books/steal-like-an-artist.jpg",
  limitedEdition: false,
  hotSale: false,
  description: "A compelling guide to unlocking your creativity by embracing influence and remixing ideas, 'Steal Like an Artist' encourages readers to be authentic while learning from the greats."
},
  {
  id: 45,
  title: "Show Your Work!",
  author: "Austin Kleon",
  price: 480,
  tag: "creativity",
  image: "/src/books/show-your-work.jpg",
  limitedEdition: false,
  hotSale: false,
  description: "In 'Show Your Work!', Austin Kleon reveals how sharing your process and ideas can help you build an audience, gain recognition, and establish your creative career through openness and generosity."
},
  {
  id: 46,
  title: "The War of Art",
  author: "Steven Pressfield",
  price: 530,
  tag: "creativity",
  image: "/src/books/war-of-art.jpg",
  limitedEdition: false,
  hotSale: false,
  description: "In *The War of Art*, Steven Pressfield explores the internal obstacles to creativity and success—what he calls 'Resistance'—and offers practical insights for overcoming it to unleash your full creative potential."
},
{
  id: 47,
  title: "So Good They Can't Ignore You",
  author: "Cal Newport",
  price: 510,
  tag: "career",
  image: "/src/books/so-good-they-cant-ignore-you.jpg",
  limitedEdition: false,
  hotSale: false,
  description: "In *So Good They Can't Ignore You*, Cal Newport argues that 'follow your passion' is bad advice. Instead, he shows that developing rare and valuable skills is the key to creating a meaningful and successful career."
},
  {
  id: 48,
  title: "Drive",
  author: "Daniel H. Pink",
  price: 550,
  tag: "motivation",
  image: "/src/books/drive.jpg", // Make sure this image exists in your public folder
  limitedEdition: false,
  hotSale: false,
  description: "In *Drive*, Daniel H. Pink examines the three elements of true motivation—autonomy, mastery, and purpose—and offers smart and surprising techniques for putting these into action to achieve better performance and personal satisfaction."
},
  {
  id: 49,
  title: "The Dip",
  author: "Seth Godin",
  price: 460,
  tag: "decision-making",
  image: "/src/books/the-dip.jpg", // Make sure this image exists or is uploaded
  limitedEdition: false,
  hotSale: false,
  description: "In *The Dip*, Seth Godin explores the concept of strategic quitting and shows when sticking with something is smart—and when quitting is even smarter. It's a short guide to mastering the art of knowing when to push through and when to move on."
},
  {
  id: 50,
  title: "Linchpin",
  author: "Seth Godin",
  price: 580,
  tag: "career",
  image: "/src/books/linchpin.jpg", // Ensure this image file is available
  limitedEdition: false,
  hotSale: false,
  description: "In *Linchpin*, Seth Godin urges readers to become indispensable in their work by standing out, taking initiative, and embracing creativity. The book challenges conventional ideas of labor and inspires professionals to bring their best, most authentic selves to what they do."
},
  {
  id: 51,
  title: "The Everything Store",
  author: "Brad Stone",
  price: 600,
  tag: "biography",
  image: "/src/books/the-everything-store.jpg", // Ensure this image is in the correct path
  limitedEdition: false,
  hotSale: false,
  description: "In *The Everything Store*, Brad Stone tells the fascinating story of Jeff Bezos and the rise of Amazon. This biography dives deep into the company’s relentless ambition and its founder's bold, often controversial, leadership style that reshaped global commerce."
},
  {
  id: 52,
  title: "The Bezos Letters",
  author: "Steve Anderson",
  price: 620,
  tag: "biography",
  image: "/src/books/the-bezos-letters.jpg", // Make sure the image exists in this path
  limitedEdition: false,
  hotSale: false,
  description: "*The Bezos Letters* reveals the 14 principles that Jeff Bezos used to grow Amazon, drawn from actual shareholder letters. Steve Anderson decodes these principles and shows how they can be applied to grow and protect any business."
},
  {
  id: 53,
  title: "The Lean UX",
  author: "Jeff Gothelf",
  price: 540,
  tag: "design",
  image: "/src/books/the-lean-ux.jpg", // Make sure the image file is present
  limitedEdition: false,
  hotSale: false,
  description: "*The Lean UX* introduces agile principles to user experience design, focusing on rapid iteration, collaboration, and validated learning. It empowers teams to deliver better products faster by integrating UX into agile workflows."
},
  {
  id: 54,
  title: "Deep Learning",
  author: "Ian Goodfellow",
  price: 950,
  tag: "technology",
  image: "/src/books/deep-learning.jpg", // Ensure the image is available here
  limitedEdition: false,
  hotSale: false,
  description: "Authored by Ian Goodfellow and others, *Deep Learning* is a definitive textbook that covers a broad range of topics in artificial intelligence and machine learning, making it an essential resource for researchers, engineers, and students in the field."
},
  {
  id: 55,
  title: "Artificial Intelligence",
  author: "Stuart Russell , Peter Norvig",
  price: 890,
  tag: "technology",
  image: "/src/books/artificial-intelligence.jpg", // Make sure this image exists in your public folder
  limitedEdition: false,
  hotSale: false,
  description: "*Artificial Intelligence: A Modern Approach* by Stuart Russell and Peter Norvig is the globally renowned textbook that provides a comprehensive foundation in AI, covering theory, algorithms, and practical implementations."
},
  {
  id: 56,
  title: "The Algorithm Design Manual",
  author: "Steven S. Skiena",
  price: 990,
  tag: "technology",
  image: "/src/books/algorithm-design-manual.jpg", // Make sure this file exists
  limitedEdition: false,
  hotSale: false,
  description: "A classic reference by Steven S. Skiena that offers both theoretical foundations and practical strategies for designing and analyzing algorithms, widely used by students, engineers, and interviewees."
},
  {
  id: 57,
  title: "Designing Data-Intensive Applications",
  author: "Martin Kleppmann",
  price: 1050,
  tag: "technology",
  image: "/src/books/designing-data-intensive-apps.jpg", // Ensure this image exists in the directory
  limitedEdition: false,
  hotSale: false,
  description: "Martin Kleppmann explores the architecture, scalability, and reliability of modern data systems, offering deep insights into distributed databases, stream processing, and data modeling for building robust applications."
},
  {
  id: 58,
  title: "Computer Networking",
  author: "James F. Kurose",
  price: 880,
  tag: "technology",
  image: "/src/books/computer-networking.jpg", // Make sure this image exists in your public/src/books folder
  limitedEdition: false,
  hotSale: false,
  description: "This foundational text by James F. Kurose and Keith W. Ross provides a comprehensive introduction to the field of computer networking, from protocols and layered architecture to performance analysis and real-world applications."
},
  {
  id: 59,
  title: "Cracking the Coding Interview",
  author: "Gayle Laakmann McDowell",
  price: 750,
  tag: "coding",
  image: "/src/books/cracking-the-coding-interview.jpg", // Ensure this image exists in your public/src/books folder
  limitedEdition: false,
  hotSale: false,
  description: "A must-read for anyone preparing for technical interviews, this book offers 189 programming questions and solutions, along with practical tips and insights into what interviewers are looking for."
},
  {
  id: 60,
  title: "Eloquent JavaScript",
  author: "Marijn Haverbeke",
  price: 500,
  tag: "coding",
  image: "/src/books/eloquent-javascript.jpg", // Ensure this image file is placed in the correct directory
  limitedEdition: false,
  hotSale: false,
  description: "A thorough and thoughtful introduction to JavaScript, focusing on fundamental programming concepts and best practices. Ideal for beginners and experienced developers alike."
},
  // Already tagged:
  {
  id: 61,
  title: "Sherlock Holmes - Collector's Edition",
  author: "Arthur Conan Doyle",
  price: 1299,
  tag: "classic",
  limitedEdition: true,
  hotSale: false,
  image: "/src/books/sherlock-holmes-collectors.jpg", // Update the path as per your folder structure
  description: "A beautifully bound collector’s edition of Sherlock Holmes’ most famous adventures. A must-have for fans of mystery and classic literature."
},
  {
  id: 62,
  title: "Harry Potter - 20th Anniversary Edition",
  author: "J.K. Rowling",
  price: 1999,
  tag: "fantasy",
  limitedEdition: true,
  hotSale: false,
  image: "/src/books/harry-potter-20th.jpg", // Adjust based on your project structure
  description: "Celebrate two decades of magic with this exclusive 20th Anniversary Edition of Harry Potter. A deluxe, collectible edition perfect for fans and collectors alike."
},
  {
  id: 63,
  title: "The Hobbit - Illustrated Edition",
  author: "J.R.R. Tolkien",
  price: 1599,
  tag: "fantasy",
  limitedEdition: true,
  hotSale: false,
  image: "/src/books/the-hobbit-illustrated.jpg", // Replace with actual path in your public folder
  description: "A beautifully illustrated edition of J.R.R. Tolkien’s timeless adventure, bringing the journey of Bilbo Baggins to life like never before. A must-have for collectors and fantasy lovers."
},
  {
  id: 64,
  title: "Game of Thrones - Leather Bound Set",
  author: "George R.R. Martin",
  price: 2999,
  tag: "fantasy",
  limitedEdition: true,
  hotSale: false,
  image: "/src/books/got-leather-bound.jpg", // Replace with actual local image path
  description: "An exquisite leather-bound collector's edition of George R.R. Martin’s epic fantasy series, A Song of Ice and Fire. Perfect for fans and collectors of high fantasy literature."
},
  {
  id: 65,
  title: "Lord of the Rings - Gold Embossed Edition",
  author: "J.R.R. Tolkien",
  price: 2499,
  tag: "fantasy",
  limitedEdition: true,
  hotSale: false,
  image: "/src/books/lotr-gold-embossed.jpg", // Replace with your actual image path
  description: "A premium gold-embossed collector’s edition of the timeless fantasy epic. A must-have for Tolkien fans and fantasy enthusiasts alike."
},
{
  id: 66,
  title: "Steve Jobs - Special Edition",
  author: "Walter Isaacson",
  price: 1799,
  tag: "biography",
  limitedEdition: true,
  hotSale: false,
  image: "/src/books/steve-jobs-special.jpg", // Update this with the correct image path if different
  description: "An exclusive special edition biography of Steve Jobs, offering a deep dive into the life and legacy of Apple's visionary co-founder."
},
  {
  id: 67,
  title: "Leonardo da Vinci - Deluxe Edition",
  author: "Walter Isaacson",
  price: 1999,
  limitedEdition: true,
  tag: "biography",
  image: "/src/books/leonardo-deluxe.jpg", // You can replace with actual path
  description: "A beautifully illustrated deluxe edition of Walter Isaacson's bestselling biography of Leonardo da Vinci, capturing the genius of the Renaissance master."
},
  {
  id: 68,
  title: "The Great Gatsby - Leather Bound",
  author: "F. Scott Fitzgerald",
  price: 999,
  limitedEdition: true,
  tag: "classic",
  image: "/src/books/gatsby-leather.jpg", // Replace with your actual image path
  description: "A luxurious leather-bound edition of F. Scott Fitzgerald's timeless classic, capturing the elegance and tragedy of the Roaring Twenties."
},
  {
  id: 69,
  title: "Pride and Prejudice - Collector’s Edition",
  author: "Jane Austen",
  price: 1099,
  limitedEdition: true,
  tag: "classic",
  image: "/src/books/pride-collector.jpg", // Ensure the image exists at this path
  description: "A beautiful collector’s edition of Jane Austen’s beloved romantic novel, bound in elegant hardcover."
},
  {
  id: 70,
  title: "To Kill a Mockingbird - Limited Run",
  author: "Harper Lee",
  price: 1199,
  limitedEdition: true,
  tag: "classic",
  image: "/src/books/mockingbird-limited.jpg", // Image path - ensure it's in your public folder
  description: "A rare limited edition of Harper Lee’s Pulitzer Prize-winning masterpiece, capturing the heart of justice and morality in the Deep South."
},
  // Tags are already added below:
  {
  id: 71,
  title: "Hideo Kojima: The Creative Gene",
  author: "Hideo Kojima",
  price: 1299,
  hotSale: true,
  tag: "biography",
  image: "/src/books/creative-gene.jpg",
  description: "A collection of essays from Hideo Kojima exploring the pop culture that shaped his creative vision, from video games to cinema."
},
  {
  id: 72,
  title: "Sid Meier’s Memoir!",
  author: "Sid Meier",
  price: 1099,
  hotSale: true,
  tag: "biography",
  image: "/src/books/sid-meier-memoir.jpg",
  description: "Legendary game designer Sid Meier shares his journey from coding classics like Civilization to shaping the modern gaming industry."
},
  {
  id: 73,
  title: "The Art of Naughty Dog",
  author: "Naughty Dog Studios",
  price: 1499,
  hotSale: true,
  tag: "art",
  image: "/src/books/art-of-naughty-dog.jpg",
  description: "A stunning visual journey through the creative evolution of one of the most iconic game studios in the industry."
},
{
  id: 74,
  title: "Miyamoto: The Man Behind Mario",
  author: "Jeff Ryan",
  price: 1399,
  hotSale: true,
  tag: "biography",
  image: "/src/books/miyamoto-man-behind-mario.jpg",
  description: "An inspiring look into the life and legacy of Shigeru Miyamoto, the legendary creator of Mario, Zelda, and more."
},
{
  id: 75,
  title: "John Romero: Doom Guy",
  author: "John Romero",
  price: 1599,
  hotSale: true,
  tag: "biography",
  image: "/src/books/doom-guy-john-romero.jpg",
  description: "The thrilling memoir of John Romero, co-creator of DOOM, sharing behind-the-scenes stories of the game that changed everything."
},
  {
  id: 76,
  title: "Carmack & Romero: The Masters of FPS",
  author: "David Kushner",
  price: 1699,
  hotSale: true,
  tag: "biography",
  image: "/src/books/carmack-romero.jpg",
  description: "A deep dive into the legendary partnership of John Carmack and John Romero, the creative forces behind DOOM and the rise of first-person shooters."
},
  {
  id: 77,
  title: "Ken Levine: The Mind In Revolt",
  author: "Joe Fielder",
  price: 1499,
  hotSale: true,
  tag: "biography",
  image: "/src/books/ken-levine.jpg",
  description: "An inside look at the creative genius behind the Bioshock series, exploring Ken Levine’s journey through storytelling and game design."
},
  {
  id: 78,
  title: "The Making of Final Fantasy",
  author: "Yoshitaka Amano",
  price: 1799,
  hotSale: true,
  tag: "gaming",
  image: "/src/books/final-fantasy-making.jpg",
  description: "Dive into the conceptual art, storytelling, and development journey behind the legendary Final Fantasy series by Yoshitaka Amano."
},
  {
  id: 79,
  title: "The Legend of Zelda: Creating a Classic",
  author: "Nintendo",
  price: 1999,
  hotSale: true,
  tag: "gaming",
  image: "/src/books/zelda-creating-classic.jpg",
  description: "Celebrate the history and art of one of Nintendo’s most iconic franchises. This book covers behind-the-scenes insights, concept art, and commentary from the creators of The Legend of Zelda series."
},
  {
  id: 80,
  title: "The Last of Us: Official Art & Story",
  author: "Neil Druckmann",
  price: 1899,
  hotSale: true,
  tag: "gaming",
  image: "/src/books/the-last-of-us-art-story.jpg",
  description: "Dive deep into the emotional and visual storytelling of The Last of Us. This collector's edition book features concept art, storyboards, and exclusive commentary from the creators."
},
{
  id: 81,
  title: "Metro 2033",
  author: "Dmitry Glukhovsky",
  price: 499,
  tag: "metro",
  image: "/src/books/metro-2033.jpg",
  description: "In the ruins of post-apocalyptic Moscow, survivors take refuge in the subway tunnels. Metro 2033 is a gripping, atmospheric tale of survival and hope in the darkness."
},
{
  id: 82,
  title: "Metro 2034",
  author: "Dmitry Glukhovsky",
  price: 520,
  tag: "metro",
  image: "/src/books/metro-2034.jpg",
  description: "A haunting sequel to Metro 2033, this novel follows a different journey through the tunnels of Moscow as survivors battle madness, scarcity, and the unknown horrors of the deep."
},
{
  id: 83,
  title: "Metro 2035",
  author: "Dmitry Glukhovsky",
  price: 540,
  tag: "metro",
  image: "/src/books/metro-2035.jpg",
  description: "The gripping conclusion to the Metro trilogy. Artyom searches for signs of life beyond the Moscow Metro, confronting conspiracies, hope, and the haunting truth about the surface."
},
{
  id: 84,
  title: "Marvel Encyclopedia",
  author: "DK Publishing",
  price: 1599,
  tag: "marvel",
  image: "/src/books/marvel-encyclopedia.jpg",
  description: "An authoritative and visually stunning guide to the Marvel Universe. Explore over 1,200 characters, story arcs, and the evolution of superheroes and villains across decades of comics."
},
  {
  id: 85,
  title: "Infinity Gauntlet",
  author: "Jim Starlin",
  price: 999,
  tag: "marvel",
  image: "/src/books/infinity-gauntlet.jpg",
  description: "A cosmic epic where Thanos wields the Infinity Gauntlet, threatening the fate of the entire universe. This Marvel classic delivers a powerful tale of ambition, loss, and heroism."
},
  {
  id: 86,
  title: "Civil War",
  author: "Mark Millar",
  price: 950,
  tag: "marvel",
  image: "/src/books/civil-war.jpg",
  description: "A monumental Marvel event that splits the superhero community in two—Captain America vs. Iron Man—as they clash over government oversight. A gripping story of loyalty, freedom, and conflict."
},
  {
  id: 87,
  title: "Spider-Man: Blue",
  author: "Jeph Loeb",
  price: 899,
  tag: "marvel",
  image: "/src/books/spiderman-blue.jpg",
  description: "A heartfelt and nostalgic look at Peter Parker’s love for Gwen Stacy. 'Spider-Man: Blue' explores the emotional core of the wall-crawler in a beautifully told and illustrated story."
},
  {
  id: 88,
  title: "X-Men: Days of Future Past",
  author: "Chris Claremont",
  price: 920,
  tag: "marvel",
  image: "/src/books/xmen-days-of-future-past.jpg",
  description: "A pivotal Marvel storyline that introduced dystopian futures and time travel into the X-Men universe. This gripping tale follows Kitty Pryde as she journeys through time to prevent a mutant apocalypse."
},
{
  id: 89,
  title: "Batman: The Killing Joke",
  author: "Alan Moore",
  price: 899,
  tag: "dc",
  image: "/src/books/batman-killing-joke.jpg",
  description: "A critically acclaimed graphic novel that delves into the origin of the Joker and explores the psychological battle between him and Batman. Known for its dark themes and iconic artwork by Brian Bolland."
},
  {
  id: 90,
  title: "Watchmen",
  author: "Alan Moore",
  price: 1099,
  tag: "dc",
  image: "/src/books/watchmen.jpg",
  description: "A groundbreaking graphic novel that deconstructs the concept of superheroes, presenting a dark, gritty alternate reality where masked vigilantes influence world events. Praised for its complex narrative and rich symbolism."
},
{
  id: 91,
  title: "Superman: Red Son",
  author: "Mark Millar",
  price: 940,
  tag: "dc",
  image: "/src/books/superman-red-son.jpg",
  description: "An alternate universe story where Superman lands in the Soviet Union instead of Kansas, reimagining the Man of Steel as a symbol of communism. A thought-provoking exploration of power, ideology, and identity."
},
{
  id: 92,
  title: "Justice League: Origin",
  author: "Geoff Johns",
  price: 880,
  tag: "dc",
  image: "/src/books/justice-league-origin.jpg",
  description: "The iconic reboot that brings together Batman, Superman, Wonder Woman, and others to face a global threat. A thrilling origin tale that kickstarts the New 52 era with explosive action and dynamic storytelling."
},
{
  id: 93,
  title: "The Flash: Rebirth",
  author: "Geoff Johns",
  price: 860,
  tag: "dc",
  image: "/src/books/flash-rebirth.jpg",
  description: "Barry Allen returns from the Speed Force to reclaim his mantle as the Fastest Man Alive. A pivotal story that redefines the legacy of the Flash with breathtaking speed and emotional depth."
},
{
  id: 94,
  title: "Naruto Vol. 1",
  author: "Masashi Kishimoto",
  price: 399,
  tag: "manga",
  image: "/src/books/naruto-vol1.jpg",
  description: "Meet Naruto Uzumaki, a young ninja with a big dream—to become the strongest ninja and earn the title of Hokage. Packed with action, humor, and heart, this first volume kicks off one of the most beloved manga adventures of all time."
},
{
  id: 95,
  title: "One Piece Vol. 1",
  author: "Eiichiro Oda",
  price: 420,
  tag: "manga",
  image: "/src/books/one-piece-vol1.jpg",
  description: "Set sail with Monkey D. Luffy as he begins his journey to become King of the Pirates. This first volume introduces the Straw Hat Pirates and launches the epic, high-seas adventure that’s captivated millions worldwide."
},
  {
  id: 96,
  title: "Attack on Titan Vol. 1",
  author: "Hajime Isayama",
  price: 430,
  tag: "manga",
  image: "/src/books/aot-vol1.jpg",
  description: "In a world devastated by man-eating Titans, humanity clings to life behind enormous walls. This gripping first volume introduces Eren Yeager and his fight for survival—and revenge—in a brutal, dystopian world."
},
  {
  id: 97,
  title: "Death Note Vol. 1",
  author: "Tsugumi Ohba",
  price: 440,
  tag: "manga",
  image: "/src/books/death-note-vol1.jpg",
  description: "When high school student Light Yagami finds a notebook with the power to kill anyone whose name is written in it, he decides to create a world free of criminals. But justice comes at a cost in this gripping psychological thriller."
},
{
  id: 98,
  title: "Demon Slayer Vol. 1",
  author: "Koyoharu Gotouge",
  price: 460,
  tag: "manga",
  image: "/src/books/demon-slayer-vol1.jpg",
  description: "Tanjiro Kamado’s peaceful life is shattered when his family is slaughtered by demons. With his sister turned into one of them, Tanjiro sets out on a perilous journey to become a Demon Slayer and find a cure for her."
},
  {
  id: 99,
  title: "My Hero Academia Vol. 1",
  author: "Kohei Horikoshi",
  price: 450,
  tag: "manga",
  image: "/src/books/my-hero-academia-vol1.jpg",
  description: "In a world where superpowers—known as 'Quirks'—are the norm, Izuku Midoriya is one of the few born powerless. But after a chance encounter with the legendary hero All Might, he begins his journey to become the greatest hero of all time."
},
{
  id: 100,
  title: "Tokyo Ghoul Vol. 1",
  author: "Sui Ishida",
  price: 470,
  tag: "manga",
  image: "/src/books/tokyo-ghoul-vol1.jpg",
  description: "In modern-day Tokyo, society lives in fear of Ghouls—mysterious creatures who look exactly like humans yet hunger for their flesh. When shy college student Ken Kaneki meets a girl who’s a ghoul, he gets pulled into their dark and brutal world."
},
  {
  id: 101,
  title: "Demo Book for Testing",
  author: "NOT APPLICABLE",
  price: 2,
  tag: "demo",
  limitedEdition: false,
  hotSale: false,
  image: "/src/books/default-book.png", // Replace with a real image path if needed
  description: "This is a sample book added for testing purposes. Not for actual sale."
}
];
