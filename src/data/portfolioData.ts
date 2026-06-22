export interface Project {
  slug: string
  client: string; clientEn: string
  title: string;  titleEn: string
  type: string
  category: string
  color: string
  budget?: string
  tags: string[]
  img?: string
  desc?: string;  descEn?: string
  features?: string[]; featuresEn?: string[]
  year?: string
  gallery?: string[]   // screenshots / proof images for the project
  categories?: string[] // Mapping to the 6 software development sub-topics
}

export const projects: Project[] = [
  {
    slug: 'dol-lis',
    client: 'กรมที่ดิน', clientEn: 'Department of Lands',
    title: 'โครงการพัฒนาระบบสารสนเทศที่ดิน (ระยะที่ 1–2)',
    titleEn: 'Land Information System Development Project (Phase 1–2)',
    type: 'Web App', category: 'webapp', color: '#2e7d32',
    budget: '3,507 ล้านบาท',
    tags: ['Web Application', 'E-Service', 'GIS'],
    img: '/port_dol_webapp.webp',
    desc: 'ระบบสารสนเทศที่ดินแห่งชาติที่รวมการให้บริการออนไลน์ครบวงจร ตั้งแต่การจดทะเบียนสิทธิ์ การค้นหาข้อมูล ไปจนถึงการออกเอกสารสิทธิ์แบบดิจิทัล รองรับผู้ใช้งานกว่า 2 ล้านรายต่อปีจากทุกสำนักงานที่ดินทั่วประเทศ',
    descEn: 'National land information system integrating comprehensive online services — from rights registration and data search to digital title documents. Serving over 2 million users annually across all provincial land offices nationwide.',
    features: ['E-Service portal สำหรับประชาชน', 'ระบบ Queue Management ลดเวลารอ', 'GIS แผนที่ที่ดินออนไลน์', 'API integration กับหน่วยงานรัฐ'],
    featuresEn: ['E-Service portal for citizens', 'Queue Management system reducing wait times', 'Online GIS land mapping', 'API integration with government agencies'],
    year: '2562–2566',
    gallery: ['/port_dol_webapp.webp', '/port_dol_edoc.webp', '/scale-geotech.jpg', '/page-banner.png', '/port_treasury_gis.webp', '/port_sso.webp', '/port_dpt.webp'],
    categories: ['eservice', 'gis']
  },
  {
    slug: 'dol-ndic',
    client: 'กรมที่ดิน', clientEn: 'Department of Lands',
    title: 'โครงการศูนย์ข้อมูลที่ดินและแผนที่แห่งชาติ (ระยะที่ 1–2)',
    titleEn: 'National Land Data and Mapping Center Project (Phase 1–2)',
    type: 'E-Document', category: 'edoc', color: '#316395',
    budget: '1,934 ล้านบาท',
    tags: ['E-Document', 'Data Import', 'Digitizing'],
    img: '/port_dol_edoc.webp',
    desc: 'โครงการแปลงเอกสารที่ดินทั่วประเทศสู่รูปแบบดิจิทัล ด้วยเทคโนโลยี OCR และ Digital Signature มาตรฐาน PKI รองรับเอกสารกว่า 120 ล้านแผ่นทั่วประเทศ ช่วยลดพื้นที่จัดเก็บเอกสารและเพิ่มความปลอดภัยของข้อมูล',
    descEn: 'Nationwide project digitizing land documents using OCR and PKI-standard Digital Signatures — processing over 120 million document sheets, reducing storage space and enhancing data security.',
    features: ['OCR สแกนเอกสาร 120 ล้านแผ่น', 'Digital Signature มาตรฐาน PKI', 'ระบบจัดเก็บและสืบค้นเอกสาร', 'Data Migration จากระบบเดิม'],
    featuresEn: ['OCR scanning of 120 million documents', 'PKI-standard Digital Signatures', 'Document storage and retrieval system', 'Data migration from legacy systems'],
    year: '2560–2565',
    gallery: ['/port_dol_edoc.webp', '/page-banner.png', '/scale-geotech.jpg', '/about-chart1.png', '/about-chart2.png'],
    categories: ['spatial', 'workflow']
  },
  {
    slug: 'trd-gis',
    client: 'กรมธนารักษ์', clientEn: 'Treasury Department',
    title: 'โครงการจัดทำฐานข้อมูลแผนที่และคำนวณราคาประเมินที่ดินรายแปลง 32 ล้านแปลง',
    titleEn: 'GIS Database and Land Appraisal Price Calculation for 32 Million Plots',
    type: 'GIS', category: 'gis', color: '#2a7d4f',
    budget: '248 ล้านบาท',
    tags: ['GIS', 'Spatial Data', 'Price Evaluation'],
    img: '/port_treasury_gis.webp',
    desc: 'แพลตฟอร์ม GIS ระดับประเทศสำหรับการประเมินราคาที่ดิน 32 ล้านแปลงทั่วประเทศ บูรณาการข้อมูลสภาพแวดล้อม สาธารณูปโภค และเศรษฐกิจเพื่อคำนวณมูลค่าที่ดินอย่างแม่นยำ รองรับการปรับปรุงราคาประเมินทุก 4 ปี',
    descEn: 'National GIS platform for land appraisal of 32 million plots — integrating environmental, infrastructure, and economic data for accurate land valuation with 4-year update cycles.',
    features: ['GIS Platform ครอบคลุม 77 จังหวัด', 'Algorithm ประเมินราคา Multi-factor', 'Spatial Data Storage 32 ล้านแปลง', 'Dashboard วิเคราะห์แนวโน้มราคา'],
    featuresEn: ['GIS Platform covering 77 provinces', 'Multi-factor price evaluation algorithm', 'Spatial Data Storage for 32 million plots', 'Price trend analysis dashboard'],
    year: '2563–2566',
    gallery: ['/port_treasury_gis.webp', '/scale-geotech.jpg', '/about-chart1.png', '/page-banner.png'],
    categories: ['gis', 'spatial']
  },
  {
    slug: 'sso-platform',
    client: 'สำนักงานประกันสังคม', clientEn: 'Social Security Office',
    title: 'โครงการพัฒนาแพลตฟอร์มดิจิทัลเพื่อรวมศูนย์การบริการ กองทุนเงินทดแทน',
    titleEn: 'Digital Platform for Workmen Compensation Fund Centralization',
    type: 'Web App', category: 'webapp', color: '#8b3a8f',
    budget: '130 ล้านบาท',
    tags: ['Digital Platform', 'E-Service', 'Workflow'],
    img: '/port_sso.webp',
    desc: 'แพลตฟอร์มดิจิทัลที่รวมการให้บริการกองทุนเงินทดแทนทั้งหมดไว้ในที่เดียว ลดขั้นตอนการยื่นเรื่องจาก 14 วันเหลือ 3 วัน เพิ่มความสะดวกให้นายจ้างและลูกจ้างทั่วประเทศ',
    descEn: 'Unified digital platform consolidating all Workmen Compensation Fund services — reducing case processing from 14 days to 3 days, benefiting employers and employees nationwide.',
    features: ['One-stop Service Portal', 'Workflow Automation', 'ติดตามสถานะ Real-time', 'Integration กับระบบประกันสังคมหลัก'],
    featuresEn: ['One-stop Service Portal', 'Workflow Automation', 'Real-time status tracking', 'Integration with main Social Security systems'],
    year: '2564–2566',
    gallery: ['/port_sso.webp', '/page-banner.png', '/port_treasury_integrate.webp', '/about-chart2.png', '/pic-h7.webp'],
    categories: ['workflow', 'eservice']
  },
  {
    slug: 'trd-integrate',
    client: 'กรมธนารักษ์', clientEn: 'Treasury Department',
    title: 'โครงการบูรณาการทะเบียนทรัพย์สิน',
    titleEn: 'State Asset Registry Integration Project',
    type: 'Web App', category: 'webapp', color: '#e67e22',
    budget: '55.8 ล้านบาท',
    tags: ['API Service', 'Data Integration', 'AI'],
    img: '/port_treasury_integrate.webp',
    desc: 'ระบบบูรณาการข้อมูลทรัพย์สินของรัฐจากหลายหน่วยงาน ด้วย API Service และ AI สำหรับตรวจสอบความถูกต้องของข้อมูลอัตโนมัติ รองรับการเชื่อมต่อข้อมูลจาก 12 หน่วยงานในแบบ Real-time',
    descEn: 'System integrating state asset data from multiple agencies via API Service and AI for automated data validation — supporting real-time connections from 12 government agencies.',
    features: ['API Hub เชื่อม 12 หน่วยงาน', 'AI Data Validation อัตโนมัติ', 'Real-time Data Sync', 'Dashboard บริหารทรัพย์สินภาครัฐ'],
    featuresEn: ['API Hub connecting 12 agencies', 'Automated AI Data Validation', 'Real-time Data Sync', 'State asset management dashboard'],
    year: '2565–2567',
    gallery: ['/port_treasury_integrate.webp', '/about-chart1.png', '/page-banner.png', '/scale-geotech.jpg'],
    categories: ['webservice', 'apiservice']
  },
  {
    slug: 'dpt-building',
    client: 'กรมโยธาธิการและผังเมือง', clientEn: 'Dept. of Public Works & Town Planning',
    title: 'โครงการพัฒนาระบบบริหารจัดการฐานข้อมูลอาคารประเภทโรงมหรสพ',
    titleEn: 'Entertainment Venue Building Database Management System',
    type: 'Web App', category: 'webapp', color: '#b03a2e',
    budget: '37.5 ล้านบาท',
    tags: ['Web Application', 'Database', 'E-Service'],
    img: '/port_dpt.webp',
    desc: 'ระบบบริหารจัดการฐานข้อมูลและใบอนุญาตอาคารประเภทโรงมหรสพทั่วประเทศ รองรับการยื่นขอใบอนุญาตออนไลน์และการตรวจสอบอาคารแบบดิจิทัล ลดภาระเจ้าหน้าที่และเวลาดำเนินการ',
    descEn: 'Management system for entertainment venue building databases and permits nationwide — enabling online permit applications and digital inspections, reducing staff workload and processing time.',
    features: ['ระบบยื่นขอใบอนุญาตออนไลน์', 'ฐานข้อมูลอาคารทั่วประเทศ', 'E-Service สำหรับเจ้าของอาคาร', 'ระบบรายงานและสถิติ'],
    featuresEn: ['Online permit application system', 'National building database', 'E-Service for building owners', 'Reporting and statistics system'],
    year: '2565–2566',
    gallery: ['/port_dpt.webp', '/page-banner.png', '/scale-geotech.jpg', '/about-chart2.png', '/port_dol_webapp.webp'],
    categories: ['eservice', 'spatial']
  },
  {
    slug: 'dol-import',
    client: 'กรมที่ดิน', clientEn: 'Department of Lands',
    title: 'โครงการจ้างนำเข้าข้อมูลที่ดินเพื่อการจดทะเบียนออนไลน์ทั่วประเทศ',
    titleEn: 'Land Data Import for Nationwide Online Registration',
    type: 'E-Document', category: 'edoc', color: '#316395',
    budget: '143 ล้านบาท',
    tags: ['E-Document', 'OCR', 'Digital Signature'],
    img: '/port_dol_import.png',
    desc: 'การนำเข้าข้อมูลที่ดินขนาดใหญ่จากทุกสำนักงานที่ดินทั่วประเทศ เพื่อรองรับการจดทะเบียนออนไลน์และเพิ่มประสิทธิภาพการให้บริการ',
    descEn: 'Large-scale land data import from all provincial land offices nationwide to support online registration and improve service efficiency.',
    features: ['Data Migration ทั่วประเทศ', 'OCR Process Automation', 'Quality Control System', 'Batch Import Processing'],
    featuresEn: ['Nationwide Data Migration', 'OCR Process Automation', 'Quality Control System', 'Batch Import Processing'],
    year: '2561–2563',
    gallery: ['/port_dol_import.png', '/port_sys_architecture.png', '/port_database_schema.png', '/port_server_status.png'],
    categories: ['spatial', 'webservice']
  },
  {
    slug: 'dol-survey',
    client: 'กรมที่ดิน', clientEn: 'Department of Lands',
    title: 'โครงการพัฒนาระบบบริหารจัดการงานรังวัดเอกชน',
    titleEn: 'Private Land Survey Management System',
    type: 'Web App', category: 'webapp', color: '#316395',
    img: '/port_dol_survey.png',
    tags: ['Workflow', 'E-Service', 'API'],
    desc: 'ระบบบริหารจัดการงานรังวัดที่ดินเอกชน ตั้งแต่การรับคำขอ การจัดสรรช่างรังวัด ไปจนถึงการส่งมอบผลงาน พร้อม Mobile App สำหรับช่างรังวัดภาคสนาม',
    descEn: 'End-to-end private land survey management — from request intake and surveyor allocation to result delivery, with a Mobile App for field surveyors.',
    features: ['Workflow จัดการงานรังวัด', 'Mobile App สำหรับช่างรังวัด', 'GPS Tracking ภาคสนาม', 'E-Report ระบบรายงานผล'],
    featuresEn: ['Survey workflow management', 'Mobile App for field surveyors', 'GPS field tracking', 'E-Report result reporting'],
    year: '2562–2564',
    gallery: ['/port_dol_survey.png', '/port_sys_architecture.png', '/port_analytics_chart.png', '/port_server_status.png'],
    categories: ['workflow', 'gis']
  },
  {
    slug: 'dla-integrate',
    client: 'กรมส่งเสริมการปกครองท้องถิ่น', clientEn: 'Department of Local Administration',
    title: 'โครงการพัฒนาระบบเชื่อมโยงฐานข้อมูลการคลังท้องถิ่นอิเล็กทรอนิกส์',
    titleEn: 'Local Government Electronic Finance Database Integration Project',
    type: 'Web Service', category: 'webapp', color: '#0284c7',
    budget: '48 ล้านบาท',
    tags: ['Web Service', 'Database Integration', 'API Gateway'],
    img: '/port_dla_integrate.png',
    desc: 'ระบบเชื่อมโยงและบูรณาการข้อมูลการคลังขององค์กรปกครองส่วนท้องถิ่นทั่วประเทศ เพื่อการรายงานและวิเคราะห์ข้อมูลการเงินแบบศูนย์กลาง',
    descEn: 'Integrated database system linking financial records of all local government units nationwide for centralized reporting and analysis.',
    features: ['ระบบเชื่อมต่อ API ความปลอดภัยสูง', 'การตรวจสอบความเข้ากันได้ของข้อมูล', 'รายงานวิเคราะห์การเงินระบบรวม'],
    featuresEn: ['Secure high-throughput API gateway', 'Automated financial schema validation', 'Consolidated financial reports dashboard'],
    year: '2566–2567',
    gallery: ['/port_dla_integrate.png', '/port_sys_architecture.png', '/port_analytics_chart.png', '/port_server_status.png'],
    categories: ['webservice', 'apiservice']
  },
  {
    slug: 'dede-workflow',
    client: 'กรมพัฒนาพลังงานทดแทนและอนุรักษ์พลังงาน', clientEn: 'Dept. of Alternative Energy Development and Efficiency',
    title: 'ระบบอนุมัติอนุญาตการทำงานของเครื่องจักรพลังงานทดแทนอัจฉริยะ',
    titleEn: 'Smart Alternative Energy Machinery Permit Workflow System',
    type: 'Workflow', category: 'webapp', color: '#eab308',
    budget: '28 ล้านบาท',
    tags: ['Workflow Management', 'E-Service', 'Digital Signature'],
    img: '/port_dede_workflow.png',
    desc: 'ระบบรับคำขอและอนุมัติการรับรองเครื่องจักรพลังงานทดแทนทางอิเล็กทรอนิกส์ ช่วยลดระยะเวลาและขั้นตอนการดำเนินงานได้อย่างมีประสิทธิภาพ',
    descEn: 'Electronic approval and certification workflow system for renewable energy machinery, significantly reducing processing times and paperwork.',
    features: ['ระบบยื่นคำขอ E-Form', 'ระบบจัดการสถานะ Workflow อัจฉริยะ', 'การลงนามดิจิทัลมาตรฐาน PKI'],
    featuresEn: ['Interactive digital E-Form submission', 'Dynamic workflow status state machine', 'PKI-standard Digital Signatures integration'],
    year: '2565–2566',
    gallery: ['/port_dede_workflow.png', '/port_sys_architecture.png', '/port_analytics_chart.png', '/port_database_schema.png'],
    categories: ['workflow', 'eservice']
  },
  {
    slug: 'aerothai-api',
    client: 'บริษัท วิทยุการบินแห่งประเทศไทย จำกัด', clientEn: 'Aeronautical Radio of Thailand',
    title: 'ระบบศูนย์กลางแลกเปลี่ยนข้อมูลการบินผ่าน RESTful API Gateway',
    titleEn: 'Aeronautical Data Exchange Hub via RESTful API Gateway',
    type: 'API Gateway', category: 'webapp', color: '#3b82f6',
    budget: '65 ล้านบาท',
    tags: ['API Service', 'RESTful API', 'Real-time Data'],
    img: '/port_aerothai_api.png',
    desc: 'การพัฒนาช่องทางการแลกเปลี่ยนข้อมูลจราจรทางอากาศและข้อมูลการบินเชิงพาณิชย์ ความเสถียรและความปลอดภัยระดับสากล',
    descEn: 'Developing high-availability integration gateway for exchanging real-time air traffic and commercial aviation data securely.',
    features: ['RESTful API มาตรฐานความปลอดภัยสูง', 'ระบบเก็บ Log และ Monitoring แบบเรียลไทม์', 'ระบบแปลงฟอร์แมตข้อมูลจราจรทางอากาศ'],
    featuresEn: ['Secure RESTful API web services', 'Real-time system health and traffic monitoring', 'Aviation format data conversion engine'],
    year: '2569–2570',
    gallery: ['/port_aerothai_api.png', '/port_sys_architecture.png', '/port_server_status.png', '/port_database_schema.png'],
    categories: ['apiservice', 'webservice']
  },
  {
    slug: 'dpt-gis-storage',
    client: 'กรมโยธาธิการและผังเมือง', clientEn: 'Dept. of Public Works & Town Planning',
    title: 'โครงการคลังข้อมูลเชิงพื้นที่ผังเมืองสามมิติอัจฉริยะ',
    titleEn: 'Smart 3D Urban Planning Spatial Data Storage Platform',
    type: 'GIS', category: 'gis', color: '#10b981',
    budget: '112 ล้านบาท',
    tags: ['GIS Platform', 'Spatial Data Storage', '3D Mapping'],
    img: '/port_dpt_gis_storage.png',
    desc: 'ระบบคลังข้อมูลจัดเก็บแผนผังเชิงพื้นที่และโมเดลสามมิติสำหรับการวิเคราะห์ผังเมืองและการวางโครงสร้างพื้นฐานระดับจังหวัด',
    descEn: 'Centralized spatial database platform storing 3D urban models and maps for provincial planning and infrastructure analysis.',
    features: ['ฐานข้อมูลจัดเก็บภาพถ่ายดาวเทียมและข้อมูล Spatial', 'ระบบเรนเดอร์โมเดล 3D แบบเว็บอินเทอร์แอคทีฟ', 'ระบบวิเคราะห์พื้นที่น้ำท่วมขังเชิงจำลอง'],
    featuresEn: ['High-performance spatial relational database', 'Interactive 3D web-based rendering engine', 'Simulation tools for terrain and flood hazard analysis'],
    year: '2565–2567',
    gallery: ['/port_dpt_gis_storage.png', '/port_database_schema.png', '/port_analytics_chart.png', '/port_sys_architecture.png'],
    categories: ['gis', 'spatial']
  }
]

export const featuredProjects: Project[] = projects

// Budget is stored in Thai ("3,507 ล้านบาท"). Swap the unit for EN.
export function formatBudget(budget: string | undefined, isEN: boolean): string {
  if (!budget) return ''
  return isEN ? budget.replace('ล้านบาท', 'Million Baht') : budget
}
