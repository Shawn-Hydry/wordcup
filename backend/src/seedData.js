/**
 * 种子数据 - 2026世界杯小组赛示例数据
 * 提供16场比赛的完整数据集（12场已完赛 + 4场即将开始）
 */

const seedMatches = [
  // ============ 已完赛比赛 A1-F2 ============
  {
    id: 'A1',
    homeTeam: {
      id: 'mex', name: '墨西哥', flag: '🇲🇽', fifaRank: 15,
      formation: '4-3-3',
      style: '攻守平衡，强调中场控制与边路突破',
      starPlayer: '基尼奥内斯',
      coach: '海梅·洛萨诺',
      coachStyle: '攻守平衡，强调中场控制与边路突破'
    },
    awayTeam: {
      id: 'rsa', name: '南非', flag: '🇿🇦', fifaRank: 60,
      formation: '4-4-2',
      style: '防守反击，注重身体对抗与快速推进',
      starPlayer: '福斯特',
      coach: '乌戈·布罗斯',
      coachStyle: '防守反击，注重身体对抗与快速推进'
    },
    matchDate: '2026-06-12',
    kickoffTime: '20:00',
    venue: '阿兹特克体育场（墨西哥城）',
    stage: '小组赛 A组',
    status: 'finished',
    result: {
      homeScore: 2, awayScore: 0,
      homeScorers: ['基尼奥内斯', '希门尼斯'],
      awayScorers: [],
      timeline: [
        { minute: 9, isExtraTime: false, player: '基尼奥内斯', team: 'home', type: 'goal' },
        { minute: 67, isExtraTime: false, player: '希门尼斯', team: 'home', type: 'goal' }
      ]
    }
  },
  {
    id: 'A2',
    homeTeam: {
      id: 'kor', name: '韩国', flag: '🇰🇷', fifaRank: 25,
      formation: '4-2-3-1',
      style: '高位压迫，快速转换，边路突破犀利',
      starPlayer: '黄仁范',
      coach: '洪明甫',
      coachStyle: '高位压迫，快速转换，边路突破犀利'
    },
    awayTeam: {
      id: 'cze', name: '捷克', flag: '🇨🇿', fifaRank: 35,
      formation: '4-2-3-1',
      style: '务实防守，定位球威胁大',
      starPlayer: '克雷伊奇',
      coach: '伊万·哈谢克',
      coachStyle: '务实防守，定位球威胁大'
    },
    matchDate: '2026-06-12',
    kickoffTime: '22:00',
    venue: '阿兹特克体育场（墨西哥城）',
    stage: '小组赛 A组',
    status: 'finished',
    result: {
      homeScore: 2, awayScore: 1,
      homeScorers: ['黄仁范', '吴贤揆'],
      awayScorers: ['克雷伊奇'],
      timeline: [
        { minute: 59, isExtraTime: false, player: '克雷伊奇', team: 'away', type: 'goal' },
        { minute: 67, isExtraTime: false, player: '黄仁范', team: 'home', type: 'goal' },
        { minute: 80, isExtraTime: false, player: '吴贤揆', team: 'home', type: 'goal' }
      ]
    }
  },
  {
    id: 'B1',
    homeTeam: {
      id: 'can', name: '加拿大', flag: '🇨🇦', fifaRank: 45,
      formation: '4-3-3',
      style: '高位逼抢，快速转换',
      starPlayer: '拉林',
      coach: '杰西·马什',
      coachStyle: '高位逼抢，快速转换'
    },
    awayTeam: {
      id: 'bih', name: '波黑', flag: '🇧🇦', fifaRank: 55,
      formation: '4-2-3-1',
      style: '攻守平衡，依靠技术型中场组织进攻',
      starPlayer: '卢基奇',
      coach: '谢尔盖·巴尔巴雷兹',
      coachStyle: '攻守平衡，依靠技术型中场组织进攻'
    },
    matchDate: '2026-06-13',
    kickoffTime: '19:00',
    venue: 'BMO球场（多伦多）',
    stage: '小组赛 B组',
    status: 'finished',
    result: {
      homeScore: 1, awayScore: 1,
      homeScorers: ['拉林'],
      awayScorers: ['卢基奇'],
      timeline: [
        { minute: 35, isExtraTime: false, player: '卢基奇', team: 'away', type: 'goal' },
        { minute: 78, isExtraTime: false, player: '拉林', team: 'home', type: 'goal' }
      ]
    }
  },
  {
    id: 'B2',
    homeTeam: {
      id: 'qat', name: '卡塔尔', flag: '🇶🇦', fifaRank: 40,
      formation: '4-2-3-1',
      style: '控球推进，短传渗透',
      starPlayer: '胡希',
      coach: '廷廷·马克斯',
      coachStyle: '控球推进，短传渗透'
    },
    awayTeam: {
      id: 'sui', name: '瑞士', flag: '🇨🇭', fifaRank: 12,
      formation: '3-4-2-1',
      style: '稳健防守，快速反击',
      starPlayer: '恩博洛',
      coach: '穆拉特·雅金',
      coachStyle: '稳健防守，快速反击'
    },
    matchDate: '2026-06-13',
    kickoffTime: '21:00',
    venue: 'BMO球场（多伦多）',
    stage: '小组赛 B组',
    status: 'finished',
    result: {
      homeScore: 1, awayScore: 1,
      homeScorers: ['胡希'],
      awayScorers: ['恩博洛'],
      timeline: [
        { minute: 55, isExtraTime: false, player: '恩博洛', team: 'away', type: 'goal' },
        { minute: 90, isExtraTime: true, player: '胡希', team: 'home', type: 'goal' }
      ]
    }
  },
  {
    id: 'C1',
    homeTeam: {
      id: 'bra', name: '巴西', flag: '🇧🇷', fifaRank: 3,
      formation: '4-2-3-1',
      style: '攻势足球，强调控球与高位压迫，边路突破是核心',
      defenseStyle: '双后腰增强拦截能力',
      attackStyle: '维尼修斯和罗德里戈的边路突破',
      starPlayer: '维尼修斯',
      coach: '费尔南多·迪尼兹',
      coachStyle: '关系主义足球理念'
    },
    awayTeam: {
      id: 'mar', name: '摩洛哥', flag: '🇲🇦', fifaRank: 13,
      formation: '4-3-3',
      style: '稳健反击，防守组织严密，边路速度突出',
      starPlayer: '萨伊瓦里',
      coach: '瓦利德·雷格拉吉',
      coachStyle: '稳健反击，防守组织严密，边路速度突出'
    },
    matchDate: '2026-06-13',
    kickoffTime: '20:00',
    venue: '玫瑰碗球场（洛杉矶）',
    stage: '小组赛 C组',
    status: 'finished',
    result: {
      homeScore: 1, awayScore: 1,
      homeScorers: ['维尼修斯'],
      awayScorers: ['萨伊瓦里'],
      timeline: [
        { minute: 25, isExtraTime: false, player: '维尼修斯', team: 'home', type: 'goal' },
        { minute: 60, isExtraTime: false, player: '萨伊瓦里', team: 'away', type: 'goal' }
      ]
    }
  },
  {
    id: 'C2',
    homeTeam: {
      id: 'hai', name: '海地', flag: '🇭🇹', fifaRank: 70,
      formation: '5-3-2',
      style: '防守反击，密集防守',
      starPlayer: '纳宗',
      coach: '加布里埃尔·卡尔德隆',
      coachStyle: '防守反击，密集防守'
    },
    awayTeam: {
      id: 'sco', name: '苏格兰', flag: '🏴', fifaRank: 30,
      formation: '5-4-1',
      style: '组织防守，定位球战术',
      starPlayer: '麦金',
      coach: '史蒂夫·克拉克',
      coachStyle: '组织防守，定位球战术'
    },
    matchDate: '2026-06-13',
    kickoffTime: '22:00',
    venue: '玫瑰碗球场（洛杉矶）',
    stage: '小组赛 C组',
    status: 'finished',
    result: {
      homeScore: 0, awayScore: 1,
      homeScorers: [],
      awayScorers: ['麦金'],
      timeline: [
        { minute: 42, isExtraTime: false, player: '麦金', team: 'away', type: 'goal' }
      ]
    }
  },
  {
    id: 'D1',
    homeTeam: {
      id: 'usa', name: '美国', flag: '🇺🇸', fifaRank: 16,
      formation: '4-3-3',
      style: '攻守平衡，高位逼抢，边路冲击力强',
      starPlayer: '巴洛贡',
      coach: '格雷格·贝尔哈特',
      coachStyle: '攻守平衡，高位逼抢，边路冲击力强'
    },
    awayTeam: {
      id: 'par', name: '巴拉圭', flag: '🇵🇾', fifaRank: 50,
      formation: '4-4-2',
      style: '防守反击，身体对抗强硬',
      starPlayer: '阿尔米隆',
      coach: '古斯塔沃·阿尔法罗',
      coachStyle: '防守反击，身体对抗强硬'
    },
    matchDate: '2026-06-14',
    kickoffTime: '19:00',
    venue: 'AT&T体育场（达拉斯）',
    stage: '小组赛 D组',
    status: 'finished',
    result: {
      homeScore: 4, awayScore: 1,
      homeScorers: ['博巴迪利亚(乌龙)', '巴洛贡x2', '雷纳'],
      awayScorers: ['阿尔米隆'],
      timeline: [
        { minute: 7, isExtraTime: false, player: '博巴迪利亚', team: 'home', type: 'own_goal' },
        { minute: 31, isExtraTime: false, player: '巴洛贡', team: 'home', type: 'goal' },
        { minute: 45, isExtraTime: true, player: '巴洛贡', team: 'home', type: 'goal' },
        { minute: 73, isExtraTime: false, player: '阿尔米隆', team: 'away', type: 'goal' },
        { minute: 90, isExtraTime: true, player: '雷纳', team: 'home', type: 'goal' }
      ]
    }
  },
  {
    id: 'D2',
    homeTeam: {
      id: 'aus', name: '澳大利亚', flag: '🇦🇺', fifaRank: 28,
      formation: '4-2-3-1',
      style: '高位逼抢，快速转换',
      starPlayer: '伊兰昆达',
      coach: '格拉汉姆·阿诺德',
      coachStyle: '高位逼抢，快速转换'
    },
    awayTeam: {
      id: 'tur', name: '土耳其', flag: '🇹🇷', fifaRank: 38,
      formation: '4-3-3',
      style: '攻势足球，技术流中场',
      starPlayer: '恰尔汗奥卢',
      coach: '温琴佐·蒙特拉',
      coachStyle: '攻势足球，技术流中场'
    },
    matchDate: '2026-06-14',
    kickoffTime: '21:00',
    venue: 'AT&T体育场（达拉斯）',
    stage: '小组赛 D组',
    status: 'finished',
    result: {
      homeScore: 2, awayScore: 0,
      homeScorers: ['伊兰昆达', '梅特卡夫'],
      awayScorers: [],
      timeline: [
        { minute: 38, isExtraTime: false, player: '伊兰昆达', team: 'home', type: 'goal' },
        { minute: 65, isExtraTime: false, player: '梅特卡夫', team: 'home', type: 'goal' }
      ]
    }
  },
  {
    id: 'E1',
    homeTeam: {
      id: 'ger', name: '德国', flag: '🇩🇪', fifaRank: 6,
      formation: '4-2-3-1',
      style: '高位压迫，传控结合快速转换',
      starPlayer: '穆西亚拉',
      coach: '纳格尔斯曼',
      coachStyle: '战术革新者'
    },
    awayTeam: {
      id: 'cuw', name: '库拉索', flag: '🇨🇼', fifaRank: 80,
      formation: '5-4-1',
      style: '防守反击，密集防守',
      starPlayer: '巴伊恩',
      coach: '雷姆科·比森蒂尼',
      coachStyle: '防守反击，密集防守'
    },
    matchDate: '2026-06-14',
    kickoffTime: '20:00',
    venue: '李维斯体育场（圣克拉拉）',
    stage: '小组赛 E组',
    status: 'finished',
    result: {
      homeScore: 7, awayScore: 1,
      homeScorers: ['恩梅查', '科梅嫩夏', '施洛特贝克', '哈弗茨x2', '穆西亚拉', '翁达夫'],
      awayScorers: ['布朗'],
      timeline: [
        { minute: 8, isExtraTime: false, player: '恩梅查', team: 'home', type: 'goal' },
        { minute: 15, isExtraTime: false, player: '科梅嫩夏', team: 'home', type: 'goal' },
        { minute: 22, isExtraTime: false, player: '施洛特贝克', team: 'home', type: 'goal' },
        { minute: 35, isExtraTime: false, player: '哈弗茨', team: 'home', type: 'penalty' },
        { minute: 52, isExtraTime: false, player: '穆西亚拉', team: 'home', type: 'goal' },
        { minute: 68, isExtraTime: false, player: '布朗', team: 'away', type: 'goal' },
        { minute: 78, isExtraTime: false, player: '翁达夫', team: 'home', type: 'goal' },
        { minute: 88, isExtraTime: false, player: '哈弗茨', team: 'home', type: 'goal' }
      ]
    }
  },
  {
    id: 'E2',
    homeTeam: {
      id: 'civ', name: '科特迪瓦', flag: '🇨🇮', fifaRank: 38,
      formation: '4-3-3',
      style: '攻守平衡，技术型中场',
      starPlayer: '阿马德·迪亚洛',
      coach: '埃默斯·法埃',
      coachStyle: '攻守平衡，技术型中场'
    },
    awayTeam: {
      id: 'ecu', name: '厄瓜多尔', flag: '🇪🇨', fifaRank: 32,
      formation: '4-2-3-1',
      style: '高位逼抢，快速转换',
      starPlayer: '瓦伦西亚',
      coach: '塞巴斯蒂安·贝卡塞切',
      coachStyle: '高位逼抢，快速转换'
    },
    matchDate: '2026-06-14',
    kickoffTime: '22:00',
    venue: '李维斯体育场（圣克拉拉）',
    stage: '小组赛 E组',
    status: 'finished',
    result: {
      homeScore: 1, awayScore: 0,
      homeScorers: ['阿马德·迪亚洛'],
      awayScorers: [],
      timeline: [
        { minute: 90, isExtraTime: true, player: '阿马德·迪亚洛', team: 'home', type: 'goal' }
      ]
    }
  },
  {
    id: 'F1',
    homeTeam: {
      id: 'ned', name: '荷兰', flag: '🇳🇱', fifaRank: 5,
      formation: '3-4-3',
      style: '全攻全守现代版，边翼卫战术',
      starPlayer: '范戴克',
      coach: '罗纳德·科曼',
      coachStyle: '荷兰传统体系'
    },
    awayTeam: {
      id: 'jpn', name: '日本', flag: '🇯🇵', fifaRank: 18,
      formation: '4-2-3-1',
      style: '攻守平衡，快速反击，团队纪律性强',
      starPlayer: '中村敬斗',
      coach: '森保一',
      coachStyle: '攻守平衡，快速反击，团队纪律性强'
    },
    matchDate: '2026-06-15',
    kickoffTime: '19:00',
    venue: 'SoFi体育场（洛杉矶）',
    stage: '小组赛 F组',
    status: 'finished',
    result: {
      homeScore: 2, awayScore: 2,
      homeScorers: ['范戴克', '萨默维尔'],
      awayScorers: ['中村敬斗', '镰田大地'],
      timeline: [
        { minute: 55, isExtraTime: false, player: '范戴克', team: 'home', type: 'goal' },
        { minute: 62, isExtraTime: false, player: '中村敬斗', team: 'away', type: 'goal' },
        { minute: 75, isExtraTime: false, player: '萨默维尔', team: 'home', type: 'goal' },
        { minute: 88, isExtraTime: false, player: '镰田大地', team: 'away', type: 'goal' }
      ]
    }
  },
  {
    id: 'F2',
    homeTeam: {
      id: 'swe', name: '瑞典', flag: '🇸🇪', fifaRank: 22,
      formation: '4-3-3',
      style: '攻守转换快速，高位逼抢',
      starPlayer: '伊萨克',
      coach: '容·达尔·托马森',
      coachStyle: '攻守转换快速，高位逼抢'
    },
    awayTeam: {
      id: 'tun', name: '突尼斯', flag: '🇹🇳', fifaRank: 35,
      formation: '4-3-3',
      style: '防守反击，中场拦截能力强',
      starPlayer: '哈兹里',
      coach: '福齐·本扎尔蒂',
      coachStyle: '防守反击，中场拦截能力强'
    },
    matchDate: '2026-06-15',
    kickoffTime: '21:00',
    venue: 'SoFi体育场（洛杉矶）',
    stage: '小组赛 F组',
    status: 'finished',
    result: {
      homeScore: 5, awayScore: 1,
      homeScorers: ['伊萨克', '哲凯赖什', '阿亚里x2', '斯万贝里'],
      awayScorers: ['哈兹里'],
      timeline: [
        { minute: 18, isExtraTime: false, player: '伊萨克', team: 'home', type: 'goal' },
        { minute: 30, isExtraTime: false, player: '哲凯赖什', team: 'home', type: 'goal' },
        { minute: 45, isExtraTime: false, player: '哈兹里', team: 'away', type: 'penalty' },
        { minute: 60, isExtraTime: false, player: '阿亚里', team: 'home', type: 'goal' },
        { minute: 72, isExtraTime: false, player: '阿亚里', team: 'home', type: 'goal' },
        { minute: 85, isExtraTime: false, player: '斯万贝里', team: 'home', type: 'goal' }
      ]
    }
  },
  // ============ 即将开始的比赛 ============
  {
    id: 'match-001',
    homeTeam: {
      id: 'bra', name: '巴西', flag: '🇧🇷', fifaRank: 3,
      formation: '4-2-3-1',
      style: '攻势足球，强调控球与高位压迫，边路突破是核心',
      defenseStyle: '双后腰增强拦截能力',
      attackStyle: '维尼修斯和罗德里戈的边路突破',
      starPlayer: '维尼修斯',
      coach: '费尔南多·迪尼兹',
      coachStyle: '关系主义足球理念'
    },
    awayTeam: {
      id: 'arg', name: '阿根廷', flag: '🇦🇷', fifaRank: 1,
      formation: '4-4-2',
      style: '务实主义，防守反击为主，围绕梅西构建进攻体系',
      defenseStyle: '团队纪律性强，防守组织严密',
      attackStyle: '梅西的回撤组织和中场绞杀',
      starPlayer: '梅西',
      coach: '斯卡洛尼',
      coachStyle: '战术纪律严明，大赛经验丰富'
    },
    matchDate: '2026-06-16',
    kickoffTime: '21:00',
    venue: '大都会人寿体育场（纽约）',
    stage: '小组赛 G组',
    status: 'upcoming'
  },
  {
    id: 'match-002',
    homeTeam: {
      id: 'fra', name: '法国', flag: '🇫🇷', fifaRank: 2,
      formation: '4-3-3',
      style: '攻守均衡，姆巴佩的速度是最大武器',
      starPlayer: '姆巴佩',
      coach: '德尚',
      coachStyle: '务实主义者，擅长淘汰赛'
    },
    awayTeam: {
      id: 'eng', name: '英格兰', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', fifaRank: 4,
      formation: '4-2-3-1',
      style: '年轻化阵容，边路冲击力强',
      starPlayer: '贝林厄姆',
      coach: '索斯盖特',
      coachStyle: '保守务实，重视防守'
    },
    matchDate: '2026-06-16',
    kickoffTime: '18:00',
    venue: 'AT&T体育场（达拉斯）',
    stage: '小组赛 D组',
    status: 'upcoming'
  },
  {
    id: 'match-003',
    homeTeam: {
      id: 'ger', name: '德国', flag: '🇩🇪', fifaRank: 6,
      formation: '4-2-3-1',
      style: '高位压迫，传控结合快速转换',
      starPlayer: '穆西亚拉',
      coach: '纳格尔斯曼',
      coachStyle: '战术革新者'
    },
    awayTeam: {
      id: 'esp', name: '西班牙', flag: '🇪🇸', fifaRank: 8,
      formation: '4-3-3',
      style: 'Tiki-Taka进化版，控球+快速渗透',
      starPlayer: '佩德里',
      coach: '路易斯·德拉富恩特',
      coachStyle: '传统西班牙传控'
    },
    matchDate: '2026-06-17',
    kickoffTime: '21:00',
    venue: '李维斯体育场（圣克拉拉）',
    stage: '小组赛 E组',
    status: 'upcoming'
  },
  {
    id: 'match-004',
    homeTeam: {
      id: 'por', name: '葡萄牙', flag: '🇵🇹', fifaRank: 7,
      formation: '4-3-3',
      style: 'C罗领衔，快速反击+定位球威胁',
      starPlayer: 'C罗',
      coach: '罗伯托·马丁内斯',
      coachStyle: '进攻足球倡导者'
    },
    awayTeam: {
      id: 'ned', name: '荷兰', flag: '🇳🇱', fifaRank: 5,
      formation: '3-4-3',
      style: '全攻全守现代版，边翼卫战术',
      starPlayer: '范戴克',
      coach: '罗纳德·科曼',
      coachStyle: '荷兰传统体系'
    },
    matchDate: '2026-06-17',
    kickoffTime: '18:00',
    venue: 'SoFi体育场（洛杉矶）',
    stage: '小组赛 F组',
    status: 'upcoming'
  }
]

const seedPlayerData = {
  'A1': {
    homePlayers: [
      { name: '基尼奥内斯', number: 11, position: 'FW', recentForm: 8.8, recentGoals: 3, recentAssists: 2, isStarPlayer: true, injury: null },
      { name: '希门尼斯', number: 9, position: 'FW', recentForm: 8.2, recentGoals: 2, recentAssists: 1, isStarPlayer: true, injury: null },
      { name: '埃雷拉', number: 8, position: 'MF', recentForm: 7.5, recentGoals: 0, recentAssists: 2, isStarPlayer: false, injury: null },
      { name: '奥乔亚', number: 13, position: 'GK', recentForm: 7.8, recentGoals: 0, recentAssists: 0, isStarPlayer: false, injury: null }
    ],
    awayPlayers: [
      { name: '福斯特', number: 9, position: 'FW', recentForm: 6.5, recentGoals: 1, recentAssists: 0, isStarPlayer: true, injury: null },
      { name: '莫迪巴', number: 10, position: 'MF', recentForm: 6.2, recentGoals: 0, recentAssists: 1, isStarPlayer: false, injury: null },
      { name: '威廉姆斯', number: 7, position: 'MF', recentForm: 6, recentGoals: 0, recentAssists: 1, isStarPlayer: false, injury: null },
      { name: '罗恩·威廉姆斯', number: 1, position: 'GK', recentForm: 6.5, recentGoals: 0, recentAssists: 0, isStarPlayer: false, injury: null }
    ]
  },
  'A2': {
    homePlayers: [
      { name: '黄仁范', number: 6, position: 'MF', recentForm: 8.5, recentGoals: 2, recentAssists: 2, isStarPlayer: true, injury: null },
      { name: '吴贤揆', number: 9, position: 'FW', recentForm: 8, recentGoals: 3, recentAssists: 1, isStarPlayer: true, injury: null },
      { name: '孙兴慜', number: 7, position: 'FW', recentForm: 8.8, recentGoals: 4, recentAssists: 2, isStarPlayer: true, injury: null },
      { name: '金承奎', number: 1, position: 'GK', recentForm: 7.2, recentGoals: 0, recentAssists: 0, isStarPlayer: false, injury: null }
    ],
    awayPlayers: [
      { name: '克雷伊奇', number: 5, position: 'DF', recentForm: 7.5, recentGoals: 1, recentAssists: 0, isStarPlayer: true, injury: null },
      { name: '希克', number: 10, position: 'FW', recentForm: 7.8, recentGoals: 3, recentAssists: 1, isStarPlayer: true, injury: null },
      { name: '绍切克', number: 8, position: 'MF', recentForm: 7.5, recentGoals: 1, recentAssists: 2, isStarPlayer: false, injury: null },
      { name: '瓦茨利克', number: 1, position: 'GK', recentForm: 7, recentGoals: 0, recentAssists: 0, isStarPlayer: false, injury: null }
    ]
  },
  'B1': {
    homePlayers: [
      { name: '拉林', number: 9, position: 'FW', recentForm: 8, recentGoals: 2, recentAssists: 1, isStarPlayer: true, injury: null },
      { name: '戴维斯', number: 10, position: 'MF', recentForm: 7.8, recentGoals: 1, recentAssists: 2, isStarPlayer: true, injury: null },
      { name: '欧斯塔基奥', number: 8, position: 'MF', recentForm: 7, recentGoals: 0, recentAssists: 1, isStarPlayer: false, injury: null },
      { name: '博扬', number: 1, position: 'GK', recentForm: 7.2, recentGoals: 0, recentAssists: 0, isStarPlayer: false, injury: null }
    ],
    awayPlayers: [
      { name: '卢基奇', number: 10, position: 'MF', recentForm: 7.8, recentGoals: 1, recentAssists: 2, isStarPlayer: true, injury: null },
      { name: '德米罗维奇', number: 9, position: 'FW', recentForm: 7.5, recentGoals: 2, recentAssists: 1, isStarPlayer: true, injury: null },
      { name: '皮亚尼奇', number: 8, position: 'MF', recentForm: 7, recentGoals: 0, recentAssists: 2, isStarPlayer: false, injury: null },
      { name: '谢希奇', number: 1, position: 'GK', recentForm: 7, recentGoals: 0, recentAssists: 0, isStarPlayer: false, injury: null }
    ]
  },
  'B2': {
    homePlayers: [
      { name: '胡希', number: 9, position: 'FW', recentForm: 7.5, recentGoals: 2, recentAssists: 1, isStarPlayer: true, injury: null },
      { name: '阿菲夫', number: 10, position: 'MF', recentForm: 7.8, recentGoals: 1, recentAssists: 3, isStarPlayer: true, injury: null },
      { name: '海多斯', number: 7, position: 'MF', recentForm: 6.8, recentGoals: 0, recentAssists: 1, isStarPlayer: false, injury: null },
      { name: '巴里', number: 1, position: 'GK', recentForm: 6.5, recentGoals: 0, recentAssists: 0, isStarPlayer: false, injury: null }
    ],
    awayPlayers: [
      { name: '恩博洛', number: 7, position: 'FW', recentForm: 8.2, recentGoals: 3, recentAssists: 1, isStarPlayer: true, injury: null },
      { name: '扎卡', number: 10, position: 'MF', recentForm: 8.2, recentGoals: 1, recentAssists: 3, isStarPlayer: true, injury: null },
      { name: '沙奇里', number: 23, position: 'MF', recentForm: 7, recentGoals: 1, recentAssists: 2, isStarPlayer: false, injury: null },
      { name: '索默', number: 1, position: 'GK', recentForm: 8, recentGoals: 0, recentAssists: 0, isStarPlayer: false, injury: null }
    ]
  },
  'C1': {
    homePlayers: [
      { name: '维尼修斯', number: 7, position: 'FW', recentForm: 9.2, recentGoals: 5, recentAssists: 3, isStarPlayer: true, injury: null },
      { name: '罗德里戈', number: 10, position: 'FW', recentForm: 8.5, recentGoals: 4, recentAssists: 2, isStarPlayer: true, injury: null },
      { name: '帕奎塔', number: 8, position: 'MF', recentForm: 7.8, recentGoals: 1, recentAssists: 4, isStarPlayer: false, injury: null },
      { name: '阿利松', number: 1, position: 'GK', recentForm: 8.3, recentGoals: 0, recentAssists: 0, isStarPlayer: false, injury: null }
    ],
    awayPlayers: [
      { name: '萨伊瓦里', number: 7, position: 'MF', recentForm: 8, recentGoals: 2, recentAssists: 2, isStarPlayer: true, injury: null },
      { name: '阿什拉夫', number: 2, position: 'DF', recentForm: 8, recentGoals: 1, recentAssists: 3, isStarPlayer: true, injury: null },
      { name: '齐耶赫', number: 10, position: 'MF', recentForm: 7.2, recentGoals: 1, recentAssists: 2, isStarPlayer: false, injury: null },
      { name: '布努', number: 1, position: 'GK', recentForm: 7.8, recentGoals: 0, recentAssists: 0, isStarPlayer: false, injury: null }
    ]
  },
  'C2': {
    homePlayers: [
      { name: '纳宗', number: 10, position: 'FW', recentForm: 6.5, recentGoals: 1, recentAssists: 0, isStarPlayer: true, injury: null },
      { name: '皮埃尔', number: 7, position: 'MF', recentForm: 6.2, recentGoals: 0, recentAssists: 1, isStarPlayer: false, injury: null },
      { name: '让-巴蒂斯特', number: 5, position: 'DF', recentForm: 6, recentGoals: 0, recentAssists: 0, isStarPlayer: false, injury: null },
      { name: '约瑟夫', number: 1, position: 'GK', recentForm: 5.8, recentGoals: 0, recentAssists: 0, isStarPlayer: false, injury: null }
    ],
    awayPlayers: [
      { name: '麦金', number: 8, position: 'MF', recentForm: 8.2, recentGoals: 2, recentAssists: 2, isStarPlayer: true, injury: null },
      { name: '罗伯逊', number: 3, position: 'DF', recentForm: 7.5, recentGoals: 0, recentAssists: 3, isStarPlayer: true, injury: null },
      { name: '蒂尔尼', number: 5, position: 'DF', recentForm: 7, recentGoals: 0, recentAssists: 0, isStarPlayer: false, injury: null },
      { name: '冈恩', number: 1, position: 'GK', recentForm: 7, recentGoals: 0, recentAssists: 0, isStarPlayer: false, injury: null }
    ]
  },
  'D1': {
    homePlayers: [
      { name: '巴洛贡', number: 9, position: 'FW', recentForm: 9, recentGoals: 5, recentAssists: 1, isStarPlayer: true, injury: null },
      { name: '普利西奇', number: 10, position: 'FW', recentForm: 8.5, recentGoals: 3, recentAssists: 2, isStarPlayer: true, injury: null },
      { name: '雷纳', number: 7, position: 'MF', recentForm: 8.2, recentGoals: 1, recentAssists: 3, isStarPlayer: true, injury: null },
      { name: '特纳', number: 1, position: 'GK', recentForm: 7.5, recentGoals: 0, recentAssists: 0, isStarPlayer: false, injury: null }
    ],
    awayPlayers: [
      { name: '阿尔米隆', number: 10, position: 'FW', recentForm: 7.8, recentGoals: 2, recentAssists: 1, isStarPlayer: true, injury: null },
      { name: '罗梅罗', number: 9, position: 'FW', recentForm: 7, recentGoals: 2, recentAssists: 0, isStarPlayer: true, injury: null },
      { name: '戈麦斯', number: 8, position: 'MF', recentForm: 6.8, recentGoals: 0, recentAssists: 1, isStarPlayer: false, injury: null },
      { name: '费尔南德斯', number: 1, position: 'GK', recentForm: 6.5, recentGoals: 0, recentAssists: 0, isStarPlayer: false, injury: null }
    ]
  },
  'D2': {
    homePlayers: [
      { name: '伊兰昆达', number: 9, position: 'FW', recentForm: 8.2, recentGoals: 3, recentAssists: 1, isStarPlayer: true, injury: null },
      { name: '梅特卡夫', number: 8, position: 'MF', recentForm: 7.8, recentGoals: 2, recentAssists: 2, isStarPlayer: true, injury: null },
      { name: '欧文', number: 7, position: 'MF', recentForm: 7, recentGoals: 0, recentAssists: 1, isStarPlayer: false, injury: null },
      { name: '瑞安', number: 1, position: 'GK', recentForm: 7.2, recentGoals: 0, recentAssists: 0, isStarPlayer: false, injury: null }
    ],
    awayPlayers: [
      { name: '恰尔汗奥卢', number: 10, position: 'MF', recentForm: 8, recentGoals: 2, recentAssists: 3, isStarPlayer: true, injury: null },
      { name: '伊尔马兹', number: 9, position: 'FW', recentForm: 7.5, recentGoals: 3, recentAssists: 1, isStarPlayer: true, injury: null },
      { name: '科克库', number: 8, position: 'MF', recentForm: 7.2, recentGoals: 1, recentAssists: 2, isStarPlayer: false, injury: null },
      { name: '恰基尔', number: 1, position: 'GK', recentForm: 7, recentGoals: 0, recentAssists: 0, isStarPlayer: false, injury: null }
    ]
  },
  'E1': {
    homePlayers: [
      { name: '穆西亚拉', number: 10, position: 'MF', recentForm: 9.5, recentGoals: 5, recentAssists: 3, isStarPlayer: true, injury: null },
      { name: '哈弗茨', number: 7, position: 'FW', recentForm: 9.2, recentGoals: 5, recentAssists: 1, isStarPlayer: true, injury: null },
      { name: '维尔茨', number: 17, position: 'MF', recentForm: 8.8, recentGoals: 3, recentAssists: 3, isStarPlayer: true, injury: null },
      { name: '诺伊尔', number: 1, position: 'GK', recentForm: 7.5, recentGoals: 0, recentAssists: 0, isStarPlayer: false, injury: null }
    ],
    awayPlayers: [
      { name: '巴伊恩', number: 9, position: 'FW', recentForm: 6.2, recentGoals: 1, recentAssists: 0, isStarPlayer: true, injury: null },
      { name: '马丁努斯', number: 10, position: 'MF', recentForm: 6, recentGoals: 0, recentAssists: 1, isStarPlayer: false, injury: null },
      { name: '霍夫', number: 5, position: 'DF', recentForm: 5.8, recentGoals: 0, recentAssists: 0, isStarPlayer: false, injury: null },
      { name: '罗德尼', number: 1, position: 'GK', recentForm: 5.5, recentGoals: 0, recentAssists: 0, isStarPlayer: false, injury: null }
    ]
  },
  'E2': {
    homePlayers: [
      { name: '阿马德·迪亚洛', number: 10, position: 'FW', recentForm: 8.5, recentGoals: 3, recentAssists: 2, isStarPlayer: true, injury: null },
      { name: '凯西', number: 8, position: 'MF', recentForm: 7.5, recentGoals: 1, recentAssists: 2, isStarPlayer: true, injury: null },
      { name: '佩佩', number: 9, position: 'FW', recentForm: 7.2, recentGoals: 2, recentAssists: 1, isStarPlayer: false, injury: null },
      { name: '西尔维', number: 1, position: 'GK', recentForm: 7.2, recentGoals: 0, recentAssists: 0, isStarPlayer: false, injury: null }
    ],
    awayPlayers: [
      { name: '瓦伦西亚', number: 10, position: 'FW', recentForm: 7.5, recentGoals: 2, recentAssists: 1, isStarPlayer: true, injury: null },
      { name: '凯塞多', number: 8, position: 'MF', recentForm: 7.8, recentGoals: 1, recentAssists: 3, isStarPlayer: true, injury: null },
      { name: '埃斯图皮尼安', number: 3, position: 'DF', recentForm: 7.2, recentGoals: 0, recentAssists: 2, isStarPlayer: false, injury: null },
      { name: '多明戈斯', number: 1, position: 'GK', recentForm: 7, recentGoals: 0, recentAssists: 0, isStarPlayer: false, injury: null }
    ]
  },
  'F1': {
    homePlayers: [
      { name: '范戴克', number: 4, position: 'DF', recentForm: 8.5, recentGoals: 2, recentAssists: 0, isStarPlayer: true, injury: null },
      { name: '萨默维尔', number: 11, position: 'FW', recentForm: 8.2, recentGoals: 3, recentAssists: 2, isStarPlayer: true, injury: null },
      { name: '加克波', number: 8, position: 'FW', recentForm: 8.3, recentGoals: 4, recentAssists: 2, isStarPlayer: true, injury: null },
      { name: '费布鲁亨', number: 1, position: 'GK', recentForm: 7.6, recentGoals: 0, recentAssists: 0, isStarPlayer: false, injury: null }
    ],
    awayPlayers: [
      { name: '中村敬斗', number: 11, position: 'FW', recentForm: 8.2, recentGoals: 3, recentAssists: 1, isStarPlayer: true, injury: null },
      { name: '镰田大地', number: 10, position: 'MF', recentForm: 8, recentGoals: 2, recentAssists: 3, isStarPlayer: true, injury: null },
      { name: '孙兴慜', number: 7, position: 'FW', recentForm: 8.5, recentGoals: 3, recentAssists: 2, isStarPlayer: true, injury: null },
      { name: '权田修一', number: 1, position: 'GK', recentForm: 7, recentGoals: 0, recentAssists: 0, isStarPlayer: false, injury: null }
    ]
  },
  'F2': {
    homePlayers: [
      { name: '伊萨克', number: 9, position: 'FW', recentForm: 9, recentGoals: 5, recentAssists: 2, isStarPlayer: true, injury: null },
      { name: '哲凯赖什', number: 10, position: 'FW', recentForm: 8.8, recentGoals: 4, recentAssists: 1, isStarPlayer: true, injury: null },
      { name: '阿亚里', number: 8, position: 'MF', recentForm: 8.5, recentGoals: 3, recentAssists: 2, isStarPlayer: true, injury: null },
      { name: '奥尔森', number: 1, position: 'GK', recentForm: 7.5, recentGoals: 0, recentAssists: 0, isStarPlayer: false, injury: null }
    ],
    awayPlayers: [
      { name: '哈兹里', number: 10, position: 'FW', recentForm: 7.5, recentGoals: 2, recentAssists: 1, isStarPlayer: true, injury: null },
      { name: '斯希里', number: 8, position: 'MF', recentForm: 6.8, recentGoals: 1, recentAssists: 1, isStarPlayer: false, injury: null },
      { name: '布龙', number: 5, position: 'DF', recentForm: 6.5, recentGoals: 0, recentAssists: 0, isStarPlayer: false, injury: null },
      { name: '达门', number: 1, position: 'GK', recentForm: 6.5, recentGoals: 0, recentAssists: 0, isStarPlayer: false, injury: null }
    ]
  },
  'match-001': {
    homePlayers: [
      { name: '维尼修斯', number: 7, position: 'FW', recentForm: 9.2, recentGoals: 5, recentAssists: 3, isStarPlayer: true, injury: null },
      { name: '罗德里戈', number: 10, position: 'FW', recentForm: 8.5, recentGoals: 4, recentAssists: 2, isStarPlayer: true, injury: null },
      { name: '帕奎塔', number: 8, position: 'MF', recentForm: 7.8, recentGoals: 1, recentAssists: 4, isStarPlayer: false, injury: null },
      { name: '吉马良斯', number: 5, position: 'MF', recentForm: 8.0, recentGoals: 0, recentAssists: 1, isStarPlayer: false, injury: null },
      { name: '马尔基尼奥斯', number: 4, position: 'DF', recentForm: 7.5, recentGoals: 0, recentAssists: 0, isStarPlayer: false, injury: { status: 'doubtful', description: '轻微肌肉拉伤，出战成疑' } },
      { name: '阿利松', number: 1, position: 'GK', recentForm: 8.3, recentGoals: 0, recentAssists: 0, isStarPlayer: false, injury: null }
    ],
    awayPlayers: [
      { name: '梅西', number: 10, position: 'FW', recentForm: 8.8, recentGoals: 3, recentAssists: 4, isStarPlayer: true, injury: null },
      { name: '阿尔瓦雷斯', number: 9, position: 'FW', recentForm: 8.2, recentGoals: 4, recentAssists: 1, isStarPlayer: true, injury: null },
      { name: '恩佐·费尔南德斯', number: 8, position: 'MF', recentForm: 7.6, recentGoals: 0, recentAssists: 2, isStarPlayer: false, injury: null },
      { name: '德保罗', number: 7, position: 'MF', recentForm: 8.0, recentGoals: 1, recentAssists: 1, isStarPlayer: false, injury: null },
      { name: '罗梅罗', number: 13, position: 'DF', recentForm: 8.4, recentGoals: 0, recentAssists: 0, isStarPlayer: false, injury: null },
      { name: '马丁内斯', number: 23, position: 'GK', recentForm: 8.5, recentGoals: 0, recentAssists: 0, isStarPlayer: false, injury: null }
    ]
  },
  'match-002': {
    homePlayers: [
      { name: '姆巴佩', number: 10, position: 'FW', recentForm: 9.5, recentGoals: 6, recentAssists: 2, isStarPlayer: true, injury: null },
      { name: '格列兹曼', number: 7, position: 'FW', recentForm: 8.0, recentGoals: 2, recentAssists: 5, isStarPlayer: true, injury: null },
      { name: '楚阿梅尼', number: 8, position: 'MF', recentForm: 7.8, recentGoals: 1, recentAssists: 1, isStarPlayer: false, injury: null },
      { name: '坎特', number: 13, position: 'MF', recentForm: 7.5, recentGoals: 0, recentAssists: 2, isStarPlayer: false, injury: null },
      { name: '萨利巴', number: 4, position: 'DF', recentForm: 8.2, recentGoals: 0, recentAssists: 0, isStarPlayer: false, injury: null },
      { name: '迈尼昂', number: 1, position: 'GK', recentForm: 8.0, recentGoals: 0, recentAssists: 0, isStarPlayer: false, injury: null }
    ],
    awayPlayers: [
      { name: '凯恩', number: 9, position: 'FW', recentForm: 8.8, recentGoals: 5, recentAssists: 2, isStarPlayer: true, injury: null },
      { name: '贝林厄姆', number: 22, position: 'MF', recentForm: 9.0, recentGoals: 4, recentAssists: 3, isStarPlayer: true, injury: null },
      { name: '福登', number: 11, position: 'FW', recentForm: 8.3, recentGoals: 3, recentAssists: 3, isStarPlayer: false, injury: null },
      { name: '赖斯', number: 41, position: 'MF', recentForm: 7.8, recentGoals: 0, recentAssists: 1, isStarPlayer: false, injury: null },
      { name: '斯通斯', number: 5, position: 'DF', recentForm: 7.5, recentGoals: 0, recentAssists: 0, isStarPlayer: false, injury: { status: 'doubtful', description: '小腿伤势，出战成疑' } },
      { name: '皮克福德', number: 1, position: 'GK', recentForm: 7.6, recentGoals: 0, recentAssists: 0, isStarPlayer: false, injury: null }
    ]
  },
  'match-003': {
    homePlayers: [
      { name: '穆西亚拉', number: 10, position: 'MF', recentForm: 8.8, recentGoals: 3, recentAssists: 4, isStarPlayer: true, injury: null },
      { name: '维尔茨', number: 17, position: 'MF', recentForm: 8.5, recentGoals: 4, recentAssists: 3, isStarPlayer: true, injury: null },
      { name: '克罗斯', number: 8, position: 'MF', recentForm: 8.0, recentGoals: 0, recentAssists: 3, isStarPlayer: false, injury: null },
      { name: '基米希', number: 6, position: 'DF', recentForm: 7.8, recentGoals: 1, recentAssists: 2, isStarPlayer: false, injury: null },
      { name: '吕迪格', number: 2, position: 'DF', recentForm: 7.6, recentGoals: 0, recentAssists: 0, isStarPlayer: false, injury: null },
      { name: '诺伊尔', number: 1, position: 'GK', recentForm: 7.5, recentGoals: 0, recentAssists: 0, isStarPlayer: false, injury: null }
    ],
    awayPlayers: [
      { name: '佩德里', number: 8, position: 'MF', recentForm: 8.6, recentGoals: 2, recentAssists: 5, isStarPlayer: true, injury: null },
      { name: '亚马尔', number: 19, position: 'FW', recentForm: 8.9, recentGoals: 4, recentAssists: 4, isStarPlayer: true, injury: null },
      { name: '加维', number: 9, position: 'MF', recentForm: 7.8, recentGoals: 1, recentAssists: 3, isStarPlayer: false, injury: { status: 'doubtful', description: '膝盖伤势恢复中，可能替补' } },
      { name: '罗德里', number: 16, position: 'MF', recentForm: 8.2, recentGoals: 1, recentAssists: 2, isStarPlayer: false, injury: null },
      { name: '拉波尔特', number: 4, position: 'DF', recentForm: 7.5, recentGoals: 0, recentAssists: 0, isStarPlayer: false, injury: null },
      { name: '乌奈·西蒙', number: 1, position: 'GK', recentForm: 7.8, recentGoals: 0, recentAssists: 0, isStarPlayer: false, injury: null }
    ]
  },
  'match-004': {
    homePlayers: [
      { name: 'C罗', number: 7, position: 'FW', recentForm: 7.8, recentGoals: 3, recentAssists: 1, isStarPlayer: true, injury: null },
      { name: 'B费', number: 8, position: 'MF', recentForm: 8.5, recentGoals: 2, recentAssists: 5, isStarPlayer: true, injury: null },
      { name: '莱奥', number: 17, position: 'FW', recentForm: 8.2, recentGoals: 3, recentAssists: 2, isStarPlayer: false, injury: null },
      { name: '鲁本·迪亚斯', number: 3, position: 'DF', recentForm: 8.0, recentGoals: 0, recentAssists: 0, isStarPlayer: false, injury: null },
      { name: '坎塞洛', number: 2, position: 'DF', recentForm: 7.6, recentGoals: 1, recentAssists: 2, isStarPlayer: false, injury: null },
      { name: '科斯塔', number: 1, position: 'GK', recentForm: 7.5, recentGoals: 0, recentAssists: 0, isStarPlayer: false, injury: null }
    ],
    awayPlayers: [
      { name: '范戴克', number: 4, position: 'DF', recentForm: 8.5, recentGoals: 1, recentAssists: 0, isStarPlayer: true, injury: null },
      { name: '加克波', number: 8, position: 'FW', recentForm: 8.3, recentGoals: 4, recentAssists: 2, isStarPlayer: true, injury: null },
      { name: '德容', number: 21, position: 'MF', recentForm: 8.0, recentGoals: 1, recentAssists: 3, isStarPlayer: false, injury: null },
      { name: '西蒙斯', number: 7, position: 'MF', recentForm: 8.2, recentGoals: 3, recentAssists: 3, isStarPlayer: false, injury: null },
      { name: '阿克', number: 5, position: 'DF', recentForm: 7.5, recentGoals: 0, recentAssists: 0, isStarPlayer: false, injury: { status: 'doubtful', description: '脚踝伤势，可能缺阵' } },
      { name: '费布鲁亨', number: 1, position: 'GK', recentForm: 7.6, recentGoals: 0, recentAssists: 0, isStarPlayer: false, injury: null }
    ]
  }
}

// 统计数据（用于 AI 引擎）
const seedStats = {
  'A1': {
    homeRecent: ['W', 'W', 'D', 'W', 'L'],
    awayRecent: ['L', 'D', 'L', 'W', 'L'],
    homeInjuries: 0,
    awayInjuries: 0,
    homeGoalsAvg: 2.2,
    awayGoalsAvg: 0.8,
    h2hWins: { home: 2, away: 0, total: 3 },
    weatherImpact: '晴朗，22°C'
  },
  'A2': {
    homeRecent: ['W', 'D', 'W', 'L', 'W'],
    awayRecent: ['D', 'L', 'W', 'D', 'L'],
    homeInjuries: 0,
    awayInjuries: 0,
    homeGoalsAvg: 1.8,
    awayGoalsAvg: 1.2,
    h2hWins: { home: 1, away: 1, total: 3 },
    weatherImpact: '多云，24°C'
  },
  'B1': {
    homeRecent: ['D', 'W', 'L', 'W', 'D'],
    awayRecent: ['W', 'L', 'D', 'L', 'W'],
    homeInjuries: 0,
    awayInjuries: 1,
    homeGoalsAvg: 1.4,
    awayGoalsAvg: 1.2,
    h2hWins: { home: 1, away: 1, total: 3 },
    weatherImpact: '晴，18°C'
  },
  'B2': {
    homeRecent: ['L', 'D', 'W', 'L', 'D'],
    awayRecent: ['W', 'W', 'D', 'W', 'W'],
    homeInjuries: 0,
    awayInjuries: 0,
    homeGoalsAvg: 1.0,
    awayGoalsAvg: 1.8,
    h2hWins: { home: 0, away: 2, total: 3 },
    weatherImpact: '多云，20°C'
  },
  'C1': {
    homeRecent: ['W', 'W', 'D', 'W', 'L'],
    awayRecent: ['W', 'D', 'W', 'W', 'W'],
    homeInjuries: 1,
    awayInjuries: 0,
    homeGoalsAvg: 2.1,
    awayGoalsAvg: 1.8,
    h2hWins: { home: 3, away: 1, total: 5 },
    weatherImpact: '晴朗，24°C'
  },
  'C2': {
    homeRecent: ['L', 'L', 'D', 'L', 'L'],
    awayRecent: ['W', 'D', 'W', 'L', 'W'],
    homeInjuries: 0,
    awayInjuries: 0,
    homeGoalsAvg: 0.6,
    awayGoalsAvg: 1.4,
    h2hWins: { home: 0, away: 2, total: 3 },
    weatherImpact: '晴，26°C'
  },
  'D1': {
    homeRecent: ['W', 'W', 'W', 'D', 'W'],
    awayRecent: ['L', 'D', 'L', 'W', 'L'],
    homeInjuries: 0,
    awayInjuries: 0,
    homeGoalsAvg: 2.8,
    awayGoalsAvg: 0.8,
    h2hWins: { home: 3, away: 0, total: 4 },
    weatherImpact: '晴朗，30°C'
  },
  'D2': {
    homeRecent: ['W', 'D', 'W', 'L', 'W'],
    awayRecent: ['D', 'W', 'L', 'D', 'L'],
    homeInjuries: 0,
    awayInjuries: 1,
    homeGoalsAvg: 1.6,
    awayGoalsAvg: 1.2,
    h2hWins: { home: 1, away: 1, total: 3 },
    weatherImpact: '多云，28°C'
  },
  'E1': {
    homeRecent: ['W', 'W', 'D', 'W', 'W'],
    awayRecent: ['L', 'L', 'D', 'L', 'L'],
    homeInjuries: 0,
    awayInjuries: 0,
    homeGoalsAvg: 3.5,
    awayGoalsAvg: 0.4,
    h2hWins: { home: 1, away: 0, total: 1 },
    weatherImpact: '晴，22°C'
  },
  'E2': {
    homeRecent: ['W', 'D', 'W', 'L', 'W'],
    awayRecent: ['D', 'W', 'L', 'W', 'D'],
    homeInjuries: 0,
    awayInjuries: 0,
    homeGoalsAvg: 1.4,
    awayGoalsAvg: 1.2,
    h2hWins: { home: 1, away: 1, total: 3 },
    weatherImpact: '多云，24°C'
  },
  'F1': {
    homeRecent: ['W', 'W', 'D', 'W', 'L'],
    awayRecent: ['W', 'D', 'W', 'W', 'D'],
    homeInjuries: 0,
    awayInjuries: 0,
    homeGoalsAvg: 2.0,
    awayGoalsAvg: 1.8,
    h2hWins: { home: 2, away: 1, total: 4 },
    weatherImpact: '晴朗，20°C'
  },
  'F2': {
    homeRecent: ['W', 'W', 'W', 'D', 'W'],
    awayRecent: ['L', 'D', 'L', 'W', 'L'],
    homeInjuries: 0,
    awayInjuries: 0,
    homeGoalsAvg: 2.6,
    awayGoalsAvg: 0.8,
    h2hWins: { home: 2, away: 0, total: 3 },
    weatherImpact: '晴，22°C'
  },
  'match-001': {
    homeRecent: ['W', 'W', 'D', 'W', 'L'],
    awayRecent: ['W', 'D', 'W', 'W', 'W'],
    homeInjuries: 1,
    awayInjuries: 0,
    homeGoalsAvg: 2.1,
    awayGoalsAvg: 1.8,
    h2hWins: { home: 3, away: 1, total: 5 },
    weatherImpact: '晴朗，24°C'
  },
  'match-002': {
    homeRecent: ['W', 'W', 'W', 'D', 'W'],
    awayRecent: ['W', 'W', 'D', 'W', 'W'],
    homeInjuries: 0,
    awayInjuries: 1,
    homeGoalsAvg: 2.4,
    awayGoalsAvg: 1.9,
    h2hWins: { home: 2, away: 2, total: 5 },
    weatherImpact: '多云，28°C'
  },
  'match-003': {
    homeRecent: ['D', 'W', 'L', 'W', 'W'],
    awayRecent: ['W', 'D', 'W', 'W', 'D'],
    homeInjuries: 0,
    awayInjuries: 0,
    homeGoalsAvg: 1.8,
    awayGoalsAvg: 2.0,
    h2hWins: { home: 2, away: 1, total: 5 },
    weatherImpact: '晴，22°C'
  },
  'match-004': {
    homeRecent: ['W', 'W', 'D', 'W', 'W'],
    awayRecent: ['D', 'W', 'W', 'L', 'W'],
    homeInjuries: 0,
    awayInjuries: 0,
    homeGoalsAvg: 2.0,
    awayGoalsAvg: 1.7,
    h2hWins: { home: 1, away: 2, total: 5 },
    weatherImpact: '晴，26°C'
  }
}

module.exports = { seedMatches, seedPlayerData, seedStats }