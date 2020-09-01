export const manifestTableNames = [
  'DestinyPlaceDefinition',
  'DestinyActivityDefinition',
  'DestinyActivityTypeDefinition',
  'DestinyClassDefinition',
  'DestinyGenderDefinition',
  'DestinyInventoryBucketDefinition',
  'DestinyRaceDefinition',
  'DestinyTalentGridDefinition',
  'DestinySandboxPerkDefinition',
  'DestinyStatGroupDefinition',
  'DestinyFactionDefinition',
  'DestinyItemCategoryDefinition',
  'DestinyDamageTypeDefinition',
  'DestinyActivityModeDefinition',
  'DestinyCollectibleDefinition',
  'DestinyStatDefinition',
  'DestinyItemTierTypeDefinition',
  'DestinyMetricDefinition',
  'DestinyPlugSetDefinition',
  'DestinyPresentationNodeDefinition',
  'DestinyRecordDefinition',
  'DestinyDestinationDefinition',
  'DestinyEquipmentSlotDefinition',
  'DestinyInventoryItemDefinition',
  'DestinyLocationDefinition',
  'DestinyLoreDefinition',
  'DestinyObjectiveDefinition',
  'DestinyProgressionDefinition',
  'DestinySeasonDefinition',
  'DestinySeasonPassDefinition',
  'DestinySocketCategoryDefinition',
  'DestinySocketTypeDefinition',
  'DestinyTraitDefinition',
  'DestinyVendorDefinition',
  'DestinyMilestoneDefinition',
  'DestinyActivityModifierDefinition',
  'DestinyReportReasonCategoryDefinition',
  'DestinyArtifactDefinition',
  'DestinyBreakerTypeDefinition',
  'DestinyChecklistDefinition',
  'DestinyEnergyTypeDefinition',
  'DestinyPowerCapDefinition',
  'DestinyEnemyRaceDefinition',
];

export const DestinyScope = {
  Profile: 0,
  Character: 1,
};

export const PLATFORM_STRINGS = {
  1: 'xbox',
  2: 'playstation',
  3: 'steam',
  4: 'battlenet',
  5: 'stadia',
  6: 'nintendo',
};

export const DestinyGender = {
  Male: 0,
  Female: 1,
  Unknown: 2,
};

export const DestinyClass = {
  Titan: 0,
  Hunter: 1,
  Warlock: 2,
  Unknown: 3,
};

export const CLASS_STRINGS = {
  0: 'titan',
  1: 'hunter',
  2: 'warlock',
};

export const DestinyDamageType = {
  None: 0,
  Kinetic: 1,
  Arc: 2,
  Solar: 3,
  Void: 4,
};

export const DAMAGE_STRINGS = {
  2: 'arc',
  3: 'solar',
  4: 'void',
};

export const DestinyTierType = {
  Unknown: 0,
  Currency: 1,
  Basic: 2,
  Common: 3,
  Rare: 4,
  Superior: 5,
  Exotic: 6,
};

export const DestinyItemType = {
  None: 0,
  Currency: 1,
  Armor: 2,
  Weapon: 3,
  Message: 7,
  Engram: 8,
  Consumable: 9,
  ExchangeMaterial: 10,
  MissionReward: 11,
  QuestStep: 12,
  QuestStepComplete: 13,
  Emblem: 14,
  Quest: 15,
  Subclass: 16,
  ClanBanner: 17,
  Aura: 18,
  Mod: 19,
  Dummy: 20,
  Ship: 21,
  Vehicle: 22,
  Emote: 23,
  Ghost: 24,
  Package: 25,
  Bounty: 26,
  Wrapper: 27,
  SeasonArtifact: 28,
  Finisher: 29,
};

export const DestinyItemSubType = {
  None: 0,
  AutoRifle: 6,
  Shotgun: 7,
  Machinegun: 8,
  HandCannon: 9,
  RocketLauncher: 10,
  FusionRifle: 11,
  SniperRifle: 12,
  PulseRifle: 13,
  ScoutRifle: 14,
  Sidearm: 17,
  Sword: 18,
  Mask: 19,
  Shader: 20,
  Ornament: 21,
  FusionRifleLine: 22,
  GrenadeLauncher: 23,
  SubmachineGun: 24,
  TraceRifle: 25,
  HelmetArmor: 26,
  GauntletsArmor: 27,
  ChestArmor: 28,
  LegArmor: 29,
  ClassArmor: 30,
  Bow: 31,
};

export const DestinyInventoryBucket = {
  ChestArmor: 14239492,
  LegArmor: 20886954,
  General: 138197802,
  LostItems: 215593132,
  Ships: 284967655,
  Engrams: 375726501,
  PowerWeapons: 953998645,
  Auras: 1269569095,
  Quests: 1345459588,
  SpecialOrders: 1367666825,
  Consumables: 1469714392,
  KineticWeapons: 1498876634,
  SeasonalArtifact: 1506418338,
  ClassArmor: 1585787867,
  Vehicle: 2025709351,
  EnergyWeapons: 2465295065,
  UpgradePoint: 2689798304,
  StrangeCoin: 2689798305,
  Glimmer: 2689798308,
  LegendaryShards: 2689798309,
  Silver: 2689798310,
  BrightDust: 2689798311,
  Shaders: 2973005342,
  Emotes: 3054419239,
  Messages: 3161908920,
  Subclass: 3284755031,
  Modifications: 3313201758,
  WrappedItems: 3350918817,
  Helmet: 3448274439,
  Gauntlets: 3551918588,
  Finishers: 3683254069,
  Materials: 3865314626,
  Ghost: 4023194814,
  Emblems: 4274335291,
  ClanBanners: 4292445962,
};

export const DestinyActivityModeType = {
  None: 0,
  Story: 2,
  Strike: 3,
  Raid: 4,
  AllPvP: 5,
  Patrol: 6,
  AllPvE: 7,
  Reserved9: 9,
  Control: 10,
  Reserved11: 11,
  Clash: 12,
  Reserved13: 13,
  CrimsonDoubles: 15,
  Nightfall: 16,
  HeroicNightfall: 17,
  AllStrikes: 18,
  IronBanner: 19,
  Reserved20: 20,
  Reserved21: 21,
  Reserved22: 22,
  Reserved24: 24,
  AllMayhem: 25,
  Reserved26: 26,
  Reserved27: 27,
  Reserved28: 28,
  Reserved29: 29,
  Reserved30: 30,
  Supremacy: 31,
  PrivateMatchesAll: 32,
  Survival: 37,
  Countdown: 38,
  TrialsOfTheNine: 39,
  Social: 40,
  TrialsCountdown: 41,
  TrialsSurvival: 42,
  IronBannerControl: 43,
  IronBannerClash: 44,
  IronBannerSupremacy: 45,
  ScoredNightfall: 46,
  ScoredHeroicNightfall: 47,
  Rumble: 48,
  AllDoubles: 49,
  Doubles: 50,
  PrivateMatchesClash: 51,
  PrivateMatchesControl: 52,
  PrivateMatchesSupremacy: 53,
  PrivateMatchesCountdown: 54,
  PrivateMatchesSurvival: 55,
  PrivateMatchesMayhem: 56,
  PrivateMatchesRumble: 57,
  HeroicAdventure: 58,
  Showdown: 59,
  Lockdown: 60,
  Scorched: 61,
  ScorchedTeam: 62,
  Gambit: 63,
  AllPvECompetitive: 64,
  Breakthrough: 65,
  BlackArmoryRun: 66,
  Salvage: 67,
  IronBannerSalvage: 68,
  PvPCompetitive: 69,
  PvPQuickplay: 70,
  ClashQuickplay: 71,
  ClashCompetitive: 72,
  ControlQuickplay: 73,
  ControlCompetitive: 74,
  GambitPrime: 75,
  Reckoning: 76,
  Menagerie: 77,
  VexOffensive: 78,
  NightmareHunt: 79,
  Elimination: 80,
  Momentum: 81,
  Dungeon: 82,
  Sundial: 83,
  TrialsOfOsiris: 84,
};

export const DestinyHistoricalStatsUnitType = {
  None: 0,
  Count: 1, // Indicates the statistic is a simple count of something.
  PerGame: 2, // Indicates the statistic is a per game average.
  Seconds: 3, // Indicates the number of seconds
  Points: 4, // Indicates the number of points earned
  Team: 5, // Values represents a team ID
  Distance: 6, // Values represents a distance (units to-be-determined)
  Percent: 7, // Ratio represented as a whole value from 0 to 100.
  Ratio: 8, // Ratio of something, shown with decimal places
  Boolean: 9, // True or false
  WeaponType: 10, // The stat is actually a weapon type.
  Standing: 11, // Indicates victory, defeat, or something in between.
  Milliseconds: 12, // Number of milliseconds some event spanned. For example, race time, or lap time.
  CompletionReason: 13, // The value is a enumeration of the Completion Reason type.
};

const ENERGY_CAPACITY_SOLAR = 2018193158;
const ENERGY_CAPACITY_ARC = 3625423501;
const ENERGY_CAPACITY_VOID = 16120457;
const ENERGY_COST_SOLAR = 3344745325;
const ENERGY_COST_ARC = 3779394102;
const ENERGY_COST_VOID = 2399985800;
const ENERGY_COST_ANY = 3578062600;

export const energyCostsStatHashes = [ENERGY_COST_SOLAR, ENERGY_COST_ARC, ENERGY_COST_VOID, ENERGY_COST_ANY];

export const energyStats = {
  solar: [ENERGY_CAPACITY_SOLAR, ENERGY_COST_SOLAR],
  arc: [ENERGY_CAPACITY_ARC, ENERGY_COST_ARC],
  void: [ENERGY_CAPACITY_VOID, ENERGY_COST_VOID],
  any: [ENERGY_COST_ANY],
};

export const DestinySocketCategoryStyle = {
  Unknown: 0,
  Reusable: 1,
  Consumable: 2,
  Unlockable: 3,
  Intrinsic: 4,
  EnergyMeter: 5,
  LargePerk: 6,
};

export const DestinyStatAggregationType = {
  CharacterAverage: 0,
  Character: 1,
  Item: 2,
};

export const DestinyStatCategory = {
  Gameplay: 0,
  Weapon: 1,
  Defense: 2,
  Primary: 3,
};

const flagEnum = (state, value) => !!(state & value);

export const enumerateDestinyGameVersions = (state) => ({
  None: flagEnum(state, 0),
  Base: flagEnum(state, 1),
  Osiris: flagEnum(state, 2),
  Warmind: flagEnum(state, 4),
  Forsaken: flagEnum(state, 8),
  ForsakenAnnualPass: flagEnum(state, 16),
  Shadowkeep: flagEnum(state, 32),
});

export const enumeratePresentationNodeState = (state) => ({
  None: flagEnum(state, 0),
  Invisible: flagEnum(state, 1),
  Obscured: flagEnum(state, 2),
});

export const enumerateRecordState = (state) => ({
  None: flagEnum(state, 0),
  RecordRedeemed: flagEnum(state, 1),
  RewardUnavailable: flagEnum(state, 2),
  ObjectiveNotCompleted: flagEnum(state, 4),
  Obscured: flagEnum(state, 8),
  Invisible: flagEnum(state, 16),
  EntitlementUnowned: flagEnum(state, 32),
  CanEquipTitle: flagEnum(state, 64),
});

export const enumerateCollectibleState = (state) => ({
  None: flagEnum(state, 0),
  NotAcquired: flagEnum(state, 1),
  Obscured: flagEnum(state, 2),
  Invisible: flagEnum(state, 4),
  CannotAffordMaterialRequirements: flagEnum(state, 8),
  InventorySpaceUnavailable: flagEnum(state, 16),
  UniquenessViolation: flagEnum(state, 32),
  PurchaseDisabled: flagEnum(state, 64),
});

export const enumerateItemState = (state) => ({
  None: flagEnum(state, 0),
  Locked: flagEnum(state, 1),
  Tracked: flagEnum(state, 2),
  Masterworked: flagEnum(state, 4),
});

export const enumerateTransferStatus = (state) => ({
  CanTransfer: flagEnum(state, 0),
  ItemIsEquipped: flagEnum(state, 1),
  NotTransferrable: flagEnum(state, 2),
  NoRoomInDestination: flagEnum(state, 4),
});

export const enumeratePartyMemberState = (state) => ({
  None: flagEnum(state, 0),
  FireteamMember: flagEnum(state, 1),
  PosseMember: flagEnum(state, 2),
  GroupMember: flagEnum(state, 4),
  PartyLeader: flagEnum(state, 8),
});

export const DestinyGamePrivacySetting = {
  Open: 0,
  ClanAndFriendsOnly: 1,
  FriendsOnly: 2,
  InvitationOnly: 3,
  Closed: 4,
};

export const enumerateJoinClosedReasons = (state) => ({
  None: flagEnum(state, 0),
  InMatchmaking: flagEnum(state, 1),
  Loading: flagEnum(state, 2),
  SoloMode: flagEnum(state, 4),
  InternalReasons: flagEnum(state, 8),
  DisallowedByGameState: flagEnum(state, 16),
  Offline: flagEnum(state, 32768),
});

export const enumerateProgressionRewardItemState = (state) => ({
  None: flagEnum(state, 0),
  Invisible: flagEnum(state, 1),
  Earned: flagEnum(state, 2),
  Claimed: flagEnum(state, 4),
  ClaimAllowed: flagEnum(state, 8),
});

export const enumerateVendorItemStatus = (state) => ({
  Success: flagEnum(state, 0),
  NoInventorySpace: flagEnum(state, 1),
  NoFunds: flagEnum(state, 2),
  NoProgression: flagEnum(state, 4),
  NoUnlock: flagEnum(state, 8),
  NoQuantity: flagEnum(state, 16),
  OutsidePurchaseWindow: flagEnum(state, 32),
  NotAvailable: flagEnum(state, 64),
  UniquenessViolation: flagEnum(state, 128),
  UnknownError: flagEnum(state, 256),
  AlreadySelling: flagEnum(state, 512),
  Unsellable: flagEnum(state, 1024),
  SellingInhibited: flagEnum(state, 2048),
  AlreadyOwned: flagEnum(state, 4096),
  DisplayOnly: flagEnum(state, 8192),
});

export const enumerateUnlockValueUIStyle = (state) => ({
  Automatic: state === 0,
  Fraction: state === 1,
  Checkbox: state === 2,
  Percentage: state === 3,
  Datetime: state === 4,
  FractionFloat: state === 5,
  Integer: state === 6,
  TimeDuration: state === 7,
  Hidden: state === 8,
  Multiplier: state === 9,
  GreenPips: state === 10,
  RedPips: state === 11,
  ExplicitPercentage: state === 12,
  RawFloat: state === 13,
});

export const bookCovers = {
  2447807737: '037E-0000131E.png',
  396866327: '01A3-0000132F.png',
  1420597821: '037E-00001308.png',
  648415847: '037E-00001311.png',
  335014236: '037E-00001BE0.png',
  3472295814: '0560-000000D4.png',
  3239864233: '01A3-00001330.png',
  2541573665: '01A3-00001336.png',
  3305936921: '037E-0000130D.png',
  2077211754: '0560-000000C5.png',
  655926402: '01A3-000012F4.png',
  2026987060: '037E-00001328.png',
  2325462143: '037E-00001323.png',
  2203266100: '0560-000000CF.png',
  756584948: '0560-000000CA.png',
  3148269494: '0560-00001070.png',
  2741070862: '0560-00001065.png',
  3758802814: '0560-00001060.png',
  139066480: '0560-0000105C.png',
  3762408250: '0560-00001074.png',
  289742222: '0560-0000106A.png',
  1070500232: '0560-00006553.png',
  2721577348: '0560-00006558.png',
  2761772090: '0560-00006547.png',
  4285512244: '0597_02D2_00.png',
  1510571147: '0597_02DA_00.png',
  2399850548: '0597_02C4_00.png',
  628625882: '0597_02BD_00.png',
  2474271317: '0597_02CC_00.png',
  2341654316: '0597_02AF_00.png',
  1596399902: '0597_02B6_00.png',
  2487458163: '0709-00003972.png',
  2090388805: '0709-00003964.png',
  2454250131: '0912-0FBF.png',
  2410366478: '0912-0FC6.png',
  1460852227: '0966-10A1.png',
  1096842912: '0966-1099.png',
};

export const sealImages = {
  2588182977: '037E-00001367.png',
  3481101973: '037E-00001343.png',
  147928983: '037E-0000134A.png',
  2693736750: '037E-0000133C.png',
  2516503814: '037E-00001351.png',
  1162218545: '037E-00001358.png',
  2039028930: '0560-000000EB.png',
  991908404: '0560-0000107E.png',
  3170835069: '0560-00006583.png',
  1002334440: '0560-00007495.png', // Moments of Triumph: MMXIX
  3303651244: '0597_057C_00.png',
  4097789885: '0597_0573_00.png',
  2209950401: '0597_056A_00.png',
  3303651245: '0709-00003850.png',
  2699827343: '0912-0F5F.png',
  2418157809: '0912-0F4C.png', // Flawless
  1473677990: '0912-0CDD.png', // Conqueror
  1617497214: '0912-0F4C.png', // Flawless
  1673689807: '0912-0CDD.png', // Conqueror
  952001576: 'mmxx.png', // Moments of Triumph 2020
  2699827342: '0966-105D.png', // Arrivals
};

export const badgeImages = {
  3241617029: '01E3-00000278.png',
  1419883649: '01E3-00000280.png',
  3333531796: '01E3-0000027C.png',
  2904806741: '01E3-00000244.png',
  1331476689: '01E3-0000024C.png',
  2881240068: '01E3-00000248.png',
  3642989833: '01E3-00000266.png',
  2399267278: '037E-00001D4C.png',
  701100740: '01A3-0000189C.png',
  1420354007: '01E3-0000032C.png',
  1086048586: '01E3-00000377.png',
  2503214417: '0560-00000D7D.png',
  2759158924: '0560-00006562.png',
  2388540594: '0597_045D_00.png',
  3267852685: '0597_0464_00.png',
  223465203: '0597_048E_00.png',
  4257248973: '0709-00003436.png',
  564984975: '0912-0E95.png',
  3459575786: '0966-0FF6.png',
};

export const associationsCollectionsBadgesClasses = {
  5678666: 2271682572,
  7761993: 2271682572,
  24162924: 2271682572,
  51250598: 2271682572,
  272447096: 3655393761,
  278453589: 671679327,
  282080253: 2271682572,
  308119616: 671679327,
  397176300: 671679327,
  437406379: 2271682572,
  454888209: 3655393761,
  543101070: 671679327,
  555927954: 2271682572,
  558738844: 3655393761,
  582419680: 671679327,
  587677888: 2271682572,
  604768449: 3655393761,
  605410965: 3655393761,
  805054563: 671679327,
  811225638: 3655393761,
  907398217: 671679327,
  964388375: 671679327,
  1003644562: 3655393761,
  1040898483: 2271682572,
  1080375723: 671679327,
  1115203081: 3655393761,
  1127243461: 2271682572,
  1172293868: 2271682572,
  1187972104: 2271682572,
  1234074769: 671679327,
  1269917845: 2271682572,
  1367826044: 2271682572,
  1481732726: 671679327,
  1521772351: 671679327,
  1573256543: 2271682572,
  1584294968: 2271682572,
  1802049362: 3655393761,
  1813275880: 671679327,
  1840210717: 2271682572,
  1860141931: 2271682572,
  1875194813: 3655393761,
  1893032045: 3655393761,
  1996848060: 3655393761,
  2084683608: 2271682572,
  2180056767: 671679327,
  2283697615: 671679327,
  2314553307: 671679327,
  2516153921: 3655393761,
  2591952283: 2271682572,
  2598675734: 3655393761,
  2607543675: 671679327,
  2623445341: 671679327,
  2652561747: 3655393761,
  2721277575: 3655393761,
  2761465119: 3655393761,
  2765771634: 671679327,
  3029703837: 3655393761,
  3083337344: 2271682572,
  3149147086: 671679327,
  3233768126: 671679327,
  3252380766: 3655393761,
  3304578900: 3655393761,
  3566355363: 671679327,
  3632206043: 3655393761,
  3711698756: 2271682572,
  3745240322: 671679327,
  3784478466: 3655393761,
  3809174270: 2271682572,
  4107433557: 3655393761,
  4108787242: 3655393761,
};

export const associationsCollectionsBadges = [
  {
    recordHash: 3488769908, // Destinations: Red War
    badgeHash: 2904806741,
  },
  {
    recordHash: 3327085974, // Exotics: Red War (Warlock)
    badgeHash: 3241617029,
  },
  {
    recordHash: 1372723679, // Exotics: Red War (Titan)
    badgeHash: 3241617029,
  },
  {
    recordHash: 2109838578, // Exotics: Red War (Hunter)
    badgeHash: 3241617029,
  },
  {
    recordHash: 913036541, // Exotics: Curse of Osiris and Warmind (Warlock)
    badgeHash: 1419883649,
  },
  {
    recordHash: 2500732572, // Exotics: Curse of Osiris and Warmind (Titan)
    badgeHash: 1419883649,
  },
  {
    recordHash: 1247544128, // Exotics: Curse of Osiris and Warmind (Hunter)
    badgeHash: 1419883649,
  },
  {
    recordHash: 3016588454, // Exotics: Forsaken (Warlock)
    badgeHash: 3333531796,
  },
  {
    recordHash: 898220115, // Exotics: Forsaken (Titan)
    badgeHash: 3333531796,
  },
  {
    recordHash: 2904000913, // Exotics: Forsaken (Hunter)
    badgeHash: 3333531796,
  },
  {
    recordHash: 2676320666, // Destinations: Curse of Osiris and Warmind
    badgeHash: 1331476689,
  },
  {
    recordHash: 4269157841, // Destinations: Forsaken
    badgeHash: 2881240068,
  },
  {
    recordHash: 751035753, // Raid: Last Wish
    badgeHash: 1086048586,
  },
  {
    recordHash: 1522035006, // Destinations: Dreaming City
    badgeHash: 3642989833,
  },
  {
    recordHash: 1975718024, // Playing for Keeps
    badgeHash: 1420354007,
  },
  {
    recordHash: 4160670554, // Annual Pass: Black Armory
    badgeHash: 2399267278,
  },
  {
    recordHash: 2794426212, // Annual Pass: Jokers Wild
    badgeHash: 2503214417,
  },
  {
    recordHash: 52802522, // Mint in Box
    badgeHash: 2759158924,
  },
  {
    recordHash: 96478725, // Lunar Rover
    badgeHash: 2388540594,
  },
  {
    recordHash: 3737200951, // Sacred Duty (Raid)
    badgeHash: 223465203,
  },
  {
    recordHash: 697150349, // Season of the Undying
    badgeHash: 3267852685,
  },
  {
    recordHash: 1087859470, // Season of Dawn
    badgeHash: 4257248973,
  },
  {
    recordHash: 4214917806, // Flawless
    badgeHash: 564984975,
  },
];

export const nightfalls = {
  3145298904: {
    // Nightfall: The Arms Dealer
    sort: 1,
    records: [
      3340846443, // The Arms Dealer
      4267516859, // Trash the Thresher
    ],
    items: [],
    collectibles: [
      3036030066, // Tilt Fuse
      1463718189, // The Arms Dealer
      529107462, // Outlawed and Unsanctioned
      529107463, // No More Flame Turrets
      529107460, // A Flare for the Dramatic
    ],
    ordealHashes: [
      1358381368, // Nightfall: The Ordeal: Adept
      1358381370, // Nightfall: The Ordeal: Legend
      1358381371, // Nightfall: The Ordeal: Hero
      1358381372, // Nightfall: The Ordeal: Grandmaster
      1358381373, // Nightfall: The Ordeal: Master
    ],
    grandmasterHash: 3726640183,
    affectsSpeedEmblemObjective: true,
  },
  1391780798: {
    // Nightfall: Broodhold
    sort: 2,
    records: [
      3042714868, // Broodhold
      4156350130, // Broodhold
    ],
    items: [],
    collectibles: [],
    ordealHashes: [
      135872552, // Nightfall: The Ordeal: Legend
      135872553, // Nightfall: The Ordeal: Hero
      135872554, // Nightfall: The Ordeal: Adept
      135872558, // Nightfall: The Ordeal: Grandmaster
      135872559, // Nightfall: The Ordeal: Master
    ],
    grandmasterHash: 3879949581,
    affectsSpeedEmblemObjective: false,
  },
  3034843176: {
    // Nightfall: The Corrupted
    sort: 3,
    records: [
      3951275509, // The Corrupted
      3641166665, // Relic Rumble
    ],
    items: [],
    collectibles: [
      1099984904, // Horror's Least
      1194959231, // The Corrupted
      2471867868, // Sedia's Curse
    ],
    ordealHashes: [
      245243704, // Nightfall: The Ordeal: Legend
      245243705, // Nightfall: The Ordeal: Hero
      245243706, // Nightfall: The Ordeal: Adept
      245243710, // Nightfall: The Ordeal: Grandmaster
      245243711, // Nightfall: The Ordeal: Master
    ],
    grandmasterHash: 3354105309,
    affectsSpeedEmblemObjective: true,
  },
  1282886582: {
    // Nightfall: Exodus Crash
    sort: 4,
    records: [
      1526865549, // Exodus Crash
      2140068897, // Faster than Lightning
    ],
    items: [],
    collectibles: [
      3036030067, // Impact Velocity
      1463718187, // Exodus Crash
      3800348612, // Operation Piccolo
      3800348613, // Better Failsafe Than Sorry
      3800348614, // Operation… Oboe?
    ],
    ordealHashes: [
      68611392, // Nightfall: The Ordeal: Legend
      68611393, // Nightfall: The Ordeal: Hero
      68611394, // Nightfall: The Ordeal: Adept
      68611398, // Nightfall: The Ordeal: Grandmaster
      68611399, // Nightfall: The Ordeal: Master
    ],
    grandmasterHash: 54961125,
    affectsSpeedEmblemObjective: true,
  },
  629542775: {
    // Nightfall: The Festering Core
    sort: 5,
    records: [],
    items: [],
    collectibles: [],
    ordealHashes: [
      766116576, // Nightfall: The Ordeal: Grandmaster766116577, // Nightfall: The Ordeal: Master
      766116580, // Nightfall: The Ordeal: Adept
      766116582, // Nightfall: The Ordeal: Legend
      766116583, // Nightfall: The Ordeal: Hero
    ],
    grandmasterHash: 3455414851,
    affectsSpeedEmblemObjective: false,
  },
  936308438: {
    // Nightfall: A Garden World
    sort: 6,
    records: [
      2692332187, // A Garden World
      1398454187, // The Quickening
    ],
    items: [],
    collectibles: [
      2448009818, // Universal Wavefunction
      2206107773, // Master Gardener
      1463718183, // A Garden World
      2428465606, // Pulling Out the Roots
      2428465607, // Blast from the Past
      2428465604, // Odysseus's Offspring
    ],
    ordealHashes: [
      1002842615, // Nightfall: The Ordeal: A Garden World
      2533203704, // Nightfall: The Ordeal: Adept
      2533203706, // Nightfall: The Ordeal: Legend
      2533203707, // Nightfall: The Ordeal: Hero
      2533203708, // Nightfall: The Ordeal: Grandmaster
      2533203709, // Nightfall: The Ordeal: Master
    ],
    grandmasterHash: 1002842615,
    affectsSpeedEmblemObjective: true,
  },
  3701132453: {
    // Nightfall: The Hollowed Lair
    sort: 7,
    records: [
      3450793480, // The Hollowed Lair
      3847579126, // Arc Avoidance
    ],
    items: [],
    collectibles: [
      1074861258, // Mindbender's Ambition
      943388586, // The Hollowed Lair
      2624212091, // Another's Vengeance
    ],
    ordealHashes: [],
    grandmasterHash: false,
    affectsSpeedEmblemObjective: true,
  },
  1034003646: {
    // Nightfall: The Insight Terminus
    sort: 8,
    records: [
      3399168111, // The Insight Terminus
      599303591, // Capture Completionist
    ],
    items: [],
    collectibles: [
      1186314105, // The Long Goodbye
      2132755465, // Insight Terminus
      2527097458, // Technocrat's Doom
    ],
    ordealHashes: [
      3200108048, // Nightfall: The Ordeal: Grandmaster
      3200108049, // Nightfall: The Ordeal: Master
      3200108052, // Nightfall: The Ordeal: Adept
      3200108054, // Nightfall: The Ordeal: Legend
      3200108055, // Nightfall: The Ordeal: Hero
    ],
    grandmasterHash: 2694576755,
    affectsSpeedEmblemObjective: true,
  },
  4259769141: {
    // Nightfall: The Inverted Spire
    sort: 9,
    records: [
      3973165904, // The Inverted Spire
      1498229894, // The Floor Is Lava
    ],
    items: [],
    collectibles: [
      1718922261, // Trichromatica
      1463718185, // The Inverted Spire
      2089218579, // Unconventional Research
      2089218578, // A Mind Forever Changing
      2089218577, // Operation Radiolarian Cascade
    ],
    ordealHashes: [
      1801803624, // Nightfall: The Ordeal: Hero
      1801803625, // Nightfall: The Ordeal: Legend
      1801803627, // Nightfall: The Ordeal: Adept
      1801803630, // Nightfall: The Ordeal: Master
    ],
    grandmasterHash: false,
    affectsSpeedEmblemObjective: true,
  },
  3372160277: {
    // Nightfall: Lake of Shadows
    sort: 10,
    records: [
      1329556468, // Lake of Shadows
      413743786, // Tether Time
    ],
    items: [],
    collectibles: [
      1602518767, // The Militia's Birthright
      3046699982, // Lake of Shadows
      324144031, // Tainted Water
    ],
    ordealHashes: [
      1302909042, // Nightfall: The Ordeal: Master
      1302909043, // Nightfall: The Ordeal: Grandmaster
      1302909044, // Nightfall: The Ordeal: Hero
      1302909045, // Nightfall: The Ordeal: Legend
      1302909047, // Nightfall: The Ordeal: Adept
    ],
    grandmasterHash: 3919254032,
    affectsSpeedEmblemObjective: true,
  },
  3289589202: {
    // Nightfall: The Pyramidion
    sort: 11,
    records: [
      1060780635, // The Pyramidion
      1142177491, // Siege Engine
    ],
    items: [],
    collectibles: [
      1152758802, // Silicon Neuroma
      1463718182, // The Pyramidion
      3333524758, // Operation Intrepid
      3333524759, // Spiraling into the Infinite
      3333524756, // An Inscrutable Amygdaloid Eigenstate
    ],
    ordealHashes: [
      3265488360, // Nightfall: The Ordeal: Adept
      3265488362, // Nightfall: The Ordeal: Legend
      3265488363, // Nightfall: The Ordeal: Hero
      3265488365, // Nightfall: The Ordeal: Master
    ],
    grandmasterHash: false,
    affectsSpeedEmblemObjective: true,
  },
  3280234344: {
    // Nightfall: Savathûn's Song
    sort: 12,
    records: [
      2099501667, // Savathûn's Song
      1442950315, // The Best Defense
    ],
    items: [],
    collectibles: [
      1333654061, // Duty Bound
      1463718186, // Savathûn's Song
      1083244622, // Search and Rescue
      1083244623, // Watcher from Beyond
      1083244620, // Praxic Fire
    ],
    ordealHashes: [
      3849697856, // Nightfall: The Ordeal: Adept
      3849697858, // Nightfall: The Ordeal: Legend
      3849697859, // Nightfall: The Ordeal: Hero
      3849697860, // Nightfall: The Ordeal: Grandmaster
      3849697861, // Nightfall: The Ordeal: Master
    ],
    grandmasterHash: 2168858559,
    affectsSpeedEmblemObjective: true,
  },
  3856436847: {
    // Nightfall: The Scarlet Keep
    sort: 13,
    records: [],
    items: [],
    collectibles: [],
    ordealHashes: [
      887176537, // Nightfall: The Ordeal: Master
      887176540, // Nightfall: The Ordeal: Adept
      887176542, // Nightfall: The Ordeal: Legend
      887176543, // Nightfall: The Ordeal: Hero
    ],
    grandmasterHash: false,
    affectsSpeedEmblemObjective: false,
  },
  522318687: {
    // Nightfall: Strange Terrain
    sort: 14,
    records: [
      165166474, // Strange Terrain
      1871570556, // Don't Take Five
    ],
    items: [],
    collectibles: [
      1534387877, // BrayTech Osprey
      2256440525, // Strange Terrain
      1165552016, // Maleficarum Interrupted
      1165552017, // Purifying Light
      1165552018, // Bane of Nokris
    ],
    ordealHashes: [
      13813394, // Nightfall: The Ordeal: Strange Terrain
      3883876600, // Nightfall: The Ordeal: Master
      3883876601, // Nightfall: The Ordeal: Grandmaster
      3883876605, // Nightfall: The Ordeal: Adept
      3883876606, // Nightfall: The Ordeal: Hero
      3883876607, // Nightfall: The Ordeal: Legend
    ],
    grandmasterHash: 13813394,
    affectsSpeedEmblemObjective: true,
  },
  3718330161: {
    // Nightfall: Tree of Probabilities    sort: 15,
    records: [
      2282894388, // Tree of Probabilities
      3636866482, // Laser Dodger
    ],
    items: [],
    collectibles: [
      1279318110, // D.F.A.
      2222885351,
      1463718184, // Tree of Probabilities
      3810498719, // Valus Intrigue
      3810498718, // No More Lasers
      3810498717, // A Forest of Red
    ],
    ordealHashes: [
      2660931442, // Nightfall: The Ordeal: Master
      2660931443, // Nightfall: The Ordeal: Grandmaster
      2660931444, // Nightfall: The Ordeal: Hero
      2660931445, // Nightfall: The Ordeal: Legend
      2660931447, // Nightfall: The Ordeal: Adept
    ],
    grandmasterHash: 2023667984,
    affectsSpeedEmblemObjective: true,
  },
  3108813009: {
    // Nightfall: Warden of Nothing
    sort: 16,
    records: [
      2836924866, // Warden of Nothing
      1469598452, // Solar Dance
    ],
    items: [],
    collectibles: [
      1279318101, // Warden's Law
      3525223396, // Warden of Nothing
      2034160145, // Collapse of the Elders
    ],
    ordealHashes: [
      380956400, // Nightfall: The Ordeal: Master
      380956401, // Nightfall: The Ordeal: Grandmaster
      380956405, // Nightfall: The Ordeal: Adept
      380956406, // Nightfall: The Ordeal: Hero
      380956407, // Nightfall: The Ordeal: Legend
    ],
    grandmasterHash: 3597372938,
    affectsSpeedEmblemObjective: true,
  },
  272852450: {
    // Nightfall: Will of the Thousands
    sort: 17,
    records: [
      1039797865, // Will of the Thousands
      3013611925, // Three and Out
    ],
    items: [],
    collectibles: [
      2466440635, // Worm God Incarnation
      2256440524, // Will of the Thousands
      1489018579, // Giantfall
      1489018578, // Feast of Worms
      1489018577, // Death to the Deathless
    ],
    ordealHashes: [],
    grandmasterHash: false,
    affectsSpeedEmblemObjective: true,
  },
};

export const ordealHashes = Object.values(nightfalls).reduce((a, h) => {
  return [...a, ...h.ordealHashes];
}, []);

export const nightmareHunts = [
  {
    storyHash: 1060539534, // Despair
    activities: [2450170730, 2450170731, 2450170732, 2450170733],
    triumphs: [3541581269],
  },
  {
    storyHash: 2279262916, // Rage
    activities: [4098556690, 4098556691, 4098556692, 4098556693],
    triumphs: [3138467749],
  },
  {
    storyHash: 2508299477, // Servitude
    activities: [1188363426, 1188363427, 1188363428, 1188363429],
    triumphs: [819869942],
  },
  {
    storyHash: 2622431190, // Fear
    activities: [1342492674, 1342492675, 1342492676, 1342492677],
    triumphs: [1420663287],
  },
  {
    storyHash: 2918838311, // Anguish
    activities: [571058904, 571058905, 571058910, 571058911],
    triumphs: [382777394],
  },
  {
    storyHash: 3459379696, // Isolation
    activities: [3205253944, 3205253945, 3205253950, 3205253951],
    triumphs: [3755663441],
  },
  {
    storyHash: 3655015216, // Pride
    activities: [1907493624, 1907493625, 1907493630, 1907493631],
    triumphs: [2638892835],
  },
  {
    storyHash: 4003594394, // Insanity
    activities: [2639701096, 2639701097, 2639701102, 2639701103],
    triumphs: [1757149139],
  },
];

export const trialsPassages = [
  1600065451, // Passage of Mercy
  7665310, // Passage of Ferocity
  1181381245, // Passage of Confidence
  2001563200, // Passage of Wisdom
  2879309661, // Passage of Wealth
];

export const trialsPerkIcons = {
  989028955: '0912-0DF0.png',
  1909797390: '0912-0DE1.png',
  713209933: '0912-0DF7.png',
  628076592: '0912-0DFE.png',
  1551708877: '0912-0DE8.png',
};

export const chaliceRunes = {
  slot1: ['braytech_remove_rune', 2149082453, 2149082452, 2149082455, 2149082454, 2149082449, 2149082448, 2149082451, 2149082450, 2149082461, 2149082460, 4201087756, 4201087757],
  slot2: ['braytech_remove_rune', 3216785208, 3216785209, 3216785210, 3216785211, 3216785212, 3216785213, 3216785214, 3216785215, 3216785200, 3216785201, 240617099, 240617098],
  slot3: ['braytech_remove_rune', 3019704439, 3019704438, 3019704437, 3019704436, 3019704435, 3019704434, 3019704433, 3019704432, 3019704447, 3019704446, 3444855282, 3444855283],
  purple: [2149082453, 2149082452, 2149082455, 3216785208, 3216785209, 3216785210, 3019704439, 3019704438, 3019704437],
  red: [2149082454, 2149082449, 2149082448, 3216785211, 3216785212, 3216785213, 3019704436, 3019704435, 3019704434],
  green: [2149082451, 2149082450, 2149082461, 3216785214, 3216785215, 3216785200, 3019704433, 3019704432, 3019704447],
  blue: [2149082460, 4201087756, 4201087757, 3216785201, 240617099, 240617098, 3019704446, 3444855282, 3444855283],
};

export const simplifiedAcivityModes = [
  {
    name: 'crucible',
    modes: [69, 70, 71, 72, 74, 73, 81, 50, 15, 43, 44, 48, 60, 65, 59, 31, 37, 38, 37, 25, 51, 52, 53, 54, 55, 56, 57, 80],
  },
  {
    name: 'trials',
    modes: [84],
  },
  {
    name: 'gambit',
    modes: [
      63, // Gambit
      75, // Gambit Prime
    ],
  },
  {
    name: 'strikes',
    modes: [
      46, // scoredNightfalls
      79, // nightmare hunts
    ],
  },
];

export const levelAdvantagesEnabled = [3753505781, 1166905690];

export const adventures = [
  53954174,
  78673128,
  96442917,
  122988657,
  185515551,
  319240296,
  320680002,
  340004423,
  359488722,
  449926115,
  539897061,
  622895925,
  625165976,
  632790902,
  723733266,
  785871069,
  789332628,
  801458995,
  808931822,
  856342832,
  919252154,
  963938931,
  993905880,
  999972877,
  1018040791,
  1018385878,
  1063969232,
  1107208644,
  1159314159,
  1225970098,
  1228327586,
  1254990192,
  1265390366,
  1275562432,
  1279862229,
  1289867188,
  1294490226,
  1302437673,
  1333621919,
  1416597166,
  1418217191,
  1466550401,
  1491022087,
  1503376677,
  1570598249,
  1643069750,
  1651979106,
  1657356109,
  1671235700,
  1682036469,
  1725302079,
  1740310101,
  1773400654,
  1783922093,
  1800749202,
  1811228210,
  1823921651,
  1824067376,
  1829866365,
  1874578888,
  1956541147,
  1969800443,
  1971154629,
  1981289329,
  1987624188,
  2067233851,
  2069143995,
  2174556965,
  2219006909,
  2231840083,
  2245202378,
  2250935166,
  2258680077,
  2302677459,
  2307090074,
  2310677039,
  2340776707,
  2517540332,
  2574607799,
  2665134323,
  2675435236,
  2737739053,
  2752743635,
  2831644165,
  2949941834,
  2966841322,
  3002511278,
  3015346707,
  3033151437,
  3042112297,
  3069330044,
  3140524926,
  3148431353,
  3211568383,
  3248193378,
  3255524827,
  3277510674,
  3283790633,
  3289681664,
  3304835347,
  3370527053,
  3384410381,
  3485876484,
  3500791146,
  3601218952,
  3644215993,
  3645117987,
  3664729722,
  3664915501,
  3691789482,
  3700722865,
  3752039537,
  3780356141,
  3836086286,
  3872525353,
  3909841711,
  3920569453,
  4094398454,
  4238309598,
];

export const DestinyContentVault = [
  {
    season: 12,
    vault: [
      {
        name: 'Miscellaneous',
        slug: 'miscellaneous',
        buckets: {
          nodes: [],
          collectibles: [
            3967648329, // Quarantine Zone
            1840126886, // SCRAP CF-717-91
          ],
          records: [
            3758540824, // Expedited Exfiltration
          ],
        },
      },
      {
        name: 'Story',
        slug: 'story',
        buckets: {
          nodes: [],
          collectibles: [],
          records: [
            2478001043, // Heroic: Red War
            3367594762, // The Red War
            4062087976, // Ghaul: Heroic
            581089627, // The Frozen Horde
            1879702969, // Heroic: Curse of Osiris
            3957303142, // Heroic: Warmind
            3985356666, // Explorer of the Infinite
            3793243435, // Mission: Sacrilege
            1322754255, // Mission: Fury
            3765705655, // Mission: Hope
            4140553751, // Mission: Riptide
            3657886407, // Mission: Utopia
            3985356666, // Explorer of the Infinite
            1522954160, // Mission: The Gateway
            574761812, // Mission: A Deadly Trial
            1144140061, // Mission: Beyond Infinity
            4255945596, // Mission: Deep Storage
            614406941, // Mission: A Garden World
            2332658765, // Mission: Hijacked
            1518196036, // Mission: Tree of Probabilities
            2846658569, // Mission: Omega
            2927675329, // Panoptes: Heroic
            1879702969, // Heroic: Curse of Osiris
          ],
        },
      },
      {
        name: 'Lore',
        slug: 'lore',
        buckets: {
          nodes: [
            139066480, // Ecdysis
            3148269494, // Dust
          ],
          collectibles: [],
          records: [
            2104527481, // Ghost Community Theater Presents
            2104527482, // Difference of Opinion
            2104527483, // Protector of Ghosts
            242464659, // Gensym Scribe
            259242254, // Pilgrimage
            2121305062, // The Watchful Eye
            2104527484, // Into the Fray
            2121305063, // Confession of Hope | Part One
            242464658, // Exegesis
            2104527480, // From Fallen Ground
            242464656, // Emissary
            3431961942, // Fanatic | Part II
            2104527476, // Savin
            2104527477, // Pulled Pork
            3431961937, // Fanatic | Part I
          ],
        },
      },
      {
        name: 'Crucible',
        slug: 'crucible',
        buckets: {
          nodes: [],
          collectibles: [],
          records: [
            2356701558, // Breakthrough
            653350487, // Countdown
            1914666283, // Lockdown
            2417378659, // Supremacy
            3709742728, // Doubles
            4166658100, // A Crown of Crests
            3762058492, // Safe and Secured
            3762058493, // Steadfast Ally
            3762058494, // First Secure
            3778836048, // My Crest is My Own
            3778836051, // Crestfallen
            1290309452, // Bombs? What Bombs?
            1290309453, // Pyrotechnics
            1290309454, // Counter Attack
            1307087008, // The Gang's All Here
            1307087011, // Last Stand
            3664890052, // Perfect Game
            4150117620, // Slow and Steady
            395207948, // Territorial Instinct
            4150117621, // Nice Try
            4150117622, // We're Halfway There
            4166895176, // Last Line
            4166895179, // Still Counts!
            708283993, // Let's Plow the Road!
            708283995, // You're Breaking Up
            706112207, // Not. One. Inch.
            708283994, // Better Late than Never
            758616720, // The Line Must Be Drawn Here!
            758616723, // Steamroller
          ],
        },
      },
      {
        name: 'Forges',
        slug: 'forges',
        buckets: {
          nodes: [
            2077211754, // The Black Armory Papers
          ],
          collectibles: [
            3544133726, // The Spiteful Fang
            1181037746, // Blast Furnace
            1589426903, // The Ringing Nail
            1663762675, // Hammerhead
            3433736744, // Tatara Gaze
            3162294999, // Kindled Orchid
            222871486, // Stryker's Sure-Hand
            39133431, // The Platinum Starling
            1453679214, // Might of Volundr
            1453679213, // Steel of Bergusia
            1453679212, // Tear of Izanami
            1453679215, // Gofannon's Hammer
            2769022687, // Obsidian Dreams
            3689404793, // Hubris of Niobe
            2339248920, // New Age Black Armory
            2339248923, // House of Meyrin
            2339248922, // Rasmussen Clan
            2339248921, // Refurbished Black Armory
            2339248924, // Satou Tribe
            2339248925, // Bergusian Night
            4222686428, // Annealed Shaper Crown
            2743329589, // Annealed Shaper Boots
            4051858721, // Annealed Shaper Robes
            3401803999, // Annealed Shaper Gloves
            3017091086, // Annealed Shaper Bond
            3120678156, // Woven Firesmith Grips
            4239793204, // Woven Firesmith Vest
            626854170, // Woven Firesmith Boots
            3011708183, // Woven Firesmith Mask
            1485243211, // Woven Firesmith Cape
            1664725735, // Forged Machinist Mark
            2591241632, // Forged Machinist Gauntlets
            2699493144, // Forged Machinist Plate
            1279908542, // Forged Machinist Greaves
            2080377747, // Forged Machinist Helm
            2682678288, // Vengeance of Volundr
            2580783367, // Gofannon's Fire
            2684277474, // Blood of Izanami
            1098033987, // Rasmussen's Gift
            3785627593, // Blade of Bergusia
            1098033985, // Satou's Secret
            1098033986, // Meyrin's Vision
          ],
          records: [],
        },
      },
      {
        name: 'The Reckoning',
        slug: 'the-reckoning',
        buckets: {
          nodes: [
            139066480, // Ecdysis
            3148269494, // Dust
            4118198756, // The Haul
          ],
          collectibles: [
            3133090329, // Wheel of Fortune
            935717666, // The Invader
            935717665, // The Reaper
            935717664, // The Sentry
            2783803052, // Prime Palette
            697642018, // Notorious Collector Robes
            666334155, // Notorious Sentry Hood
            1064769400, // Notorious Sentry Boots
            2191440234, // Notorious Invader Gloves
            251503135, // Notorious Invader Bond
            3856291506, // Notorious Reaper Robes
            3713545424, // Notorious Reaper Boots
            120933507, // Notorious Reaper Hood
            941467106, // Notorious Invader Robes
            2317157479, // Notorious Sentry Bond
            2369829698, // Notorious Sentry Gloves
            2902457088, // Notorious Collector Boots
            3608920531, // Notorious Collector Hood
            2267048874, // Notorious Collector Gloves
            3919867743, // Notorious Collector Bond
            615059978, // Notorious Sentry Robes
            3574888595, // Notorious Invader Hood
            3292779456, // Notorious Invader Boots
            958853018, // Notorious Reaper Gloves
            3208007407, // Notorious Reaper Bond
            935717667, // The Collector
            3177017778, // Notorious Collector Vest
            2120057265, // Notorious Sentry Mask
            2123140606, // Notorious Sentry Strides
            230843230, // Notorious Invader Grips
            2264310427, // Notorious Invader Cloak
            2517054448, // Notorious Reaper Vest
            3451322522, // Notorious Reaper Strides
            3958426037, // Notorious Reaper Mask
            1054446150, // Notorious Invader Vest
            2050193037, // Notorious Sentry Cloak
            78994752, // Notorious Sentry Grips
            2699398608, // Notorious Collector Strides
            3401753987, // Notorious Collector Mask
            3153872001, // Notorious Reaper Cloak
            3031940156, // Notorious Reaper Grips
            3487058660, // Notorious Invader Strides
            3407110639, // Notorious Invader Mask
            1307744292, // Notorious Sentry Vest
            2528733679, // Notorious Collector Cloak
            4239673498, // Notorious Collector Grips
            2160860016, // Notorious Collector Plate
            1359951031, // Notorious Sentry Helm
            1541982764, // Notorious Sentry Greaves
            2438483824, // Notorious Invader Gauntlets
            1972784989, // Notorious Invader Mark
            2659007406, // Notorious Reaper Plate
            2963735964, // Notorious Reaper Greaves
            2361354695, // Notorious Reaper Helm
            2601581236, // Notorious Invader Plate
            1736919155, // Notorious Sentry Mark
            4289287942, // Notorious Sentry Gauntlets
            3530369818, // Notorious Collector Greaves
            4037473333, // Notorious Collector Helm
            1062695395, // Notorious Reaper Mark
            3100454806, // Notorious Reaper Gauntlets
            2839722126, // Notorious Invader Greaves
            1342418593, // Notorious Invader Helm
            450982398, // Notorious Sentry Plate
            2797677569, // Notorious Collector Mark
            3110987452, // Notorious Collector Gauntlets
          ],
          records: [
            3191146526, // Triumphant Invader
            452100546, // Triumphant Reaper
            2874049730, // Triumphant Sentry
            1599750028, // Triumphant Collector
            590872239, // Call Me… Sentry
            3601025763, // Call Me… Collector
            2690344985, // Call Me… Invader
            1466482627, // Call Me… Reaper
            2794426212, // Annual Pass: Jokers Wild
          ],
        },
      },
      {
        name: 'Explore: IO',
        slug: 'io',
        buckets: {
          nodes: [
            4139791846, // Gensym Knight Suit
            3476818387, // Gensym Knight Suit
            3952745167, // Gensym Knight Suit
            3457070432, // Io
          ],
          collectibles: [
            3647875337, // Mindbreaker Boots
            3858283821, // Mindbreaker Boots
            3946669544, // Mindbreaker Boots
            2239241196, // Io Shell
            2982198547, // Death Adder
            273762351, // Valakadyn
            2963869879, // Tarantula
            2963869878, // Man o' War
            1551165468, // Blue Shift
            2287445847, // Berenger's Memory
            1088431376, // Unspoken Promise
            2202434428, // The Rattler
            1058083666, // Baligant
            1169536399, // Widow's Bite
            1169536389, // Elegy-49
            259147460, // Echo Mesa
            3642181656, // Traveler's Departure
            3642181657, // Asher's Asylum
            3642181658, // Taken Resurgence
            3642181659, // Ignition Unsparked
            3773976314, // Traveler's Flight
            259147462, // Ballet Lover
            259147463, // Holy Ground
            1176046836, // Echoes of Io
            1176046837, // Flowers of Io
            2219212014, // Eulogy SI4
            2716100025, // Sonata-48
            3895764279, // Guseva-C
            3875807583, // Whisper of the Worm
          ],
          records: [
            1289798960, // The Tortured Scientist
            2104527481, // Ghost Community Theater Presents
            2104527482, // Difference of Opinion
            2104527483, // Protector of Ghosts
            242464659, // Gensym Scribe
            3793243435, // Mission: Sacrilege
            1322754255, // Mission: Fury
            773877428, // Whisper Catalyst
          ],
        },
      },
      {
        name: 'Explore: Titan',
        slug: 'titan',
        buckets: {
          nodes: [
            4139791844, // Lost Pacific Suit
            3476818385, // Lost Pacific Suit
            3952745165, // Lost Pacific Suit
            3252380766, // Titan
          ],
          collectibles: [
            1073998665, // Songbreaker Gauntlets
            942424421, // Songbreaker Grips
            2754601998, // Songbreaker Gloves
            1058083665, // First In, Last Out
            273762349, // Solemn Hymn
            1184968901, // Nox Echo III
            1551165466, // Hoosegow
            1088431381, // Crown-Splitter
            1169536385, // A Single Clap
            1088431379, // Negative Space
            1116762620, // Swift Ride
            2202434430, // Dead Man Walking
            3788698913, // Annual Skate
            2283993085, // Tone Patrol
            2982198549, // Foggy Notion
            2239241194, // Moon of Saturn Shell
            259147458, // New Pacific Arcology
            2532590120, // Utopia Lost
            2532590121, // Sloane's Watchtower
            2532590122, // Hive Infestation
            2532590123, // Golden Age Tarnished
            3773976304, // New Pacific Access
            3773976311, // Solarium Yellow
            3773976310, // Cargo Bay Cross
            1176046832, // New Pacific Rush
            1176046833, // New Pacific Sink
            564802918, // Rat King
            2500286745, // Outbreak Perfected
            1660030046, // Ace of Spades
            4009683574, // Thorn
          ],
          records: [
            2808299284, // The Titan on Titan
            2442138301, // Steadfast
            259242254, // Pilgrimage
            2121305062, // The Watchful Eye
            2104527484, // Into the Fray
            2121305063, // Confession of Hope | Part One
            3765705655, // Mission: Hope
            4140553751, // Mission: Riptide
            3657886407, // Mission: Utopia
          ],
        },
      },
      {
        name: 'Explore: Mercury',
        slug: 'mercury',
        buckets: {
          nodes: [
            4139791842, // Kairos Function Suit
            3476818391, // Kairos Function Suit
            3952745163, // Kairos Function Suit
            2904849017, // Mercury
          ],
          collectibles: [
            256984756, // Null Calamity 9
            1105208971, // Future Safe 10
            1041306084, // Perfect Paradox
            1116543653, // The Conqueror 2
            1279318109, // West of Sunfall 7
            1116762615, // Infinite Paths 8
            2606709043, // Garden Progeny 1
            3788698917, // Jack Queen King 3
            4257745796, // Machina Dei 4
            2998976136, // Sol Pariah 6
            2219212009, // Traveler's Judgment 5
            1718922262, // Sagira's Shell
            225592290, // Legend of Saint-14
            2034908838, // Prophetic Arsenal
            225592289, // Crossroads Emblem
            225592291, // Secrets of the Vex
            225592292, // Vex Destroyer
            225592293, // Vex Scholar
            259147459, // Fields of Glass
            4068960693, // Burning Silicon
            4068960695, // Vex Convergence
            4068960694, // Infinite Possibilities
            4068960692, // Vance's Temple
            1282368185, // Kairos Gold
            1282368187, // Kairos Black
            1282368186, // Mercury Prophetic
            1282368184, // Kairos Bronze
            1152758801, // Maestro-46
            1168191342, // Elatha FR4
            1200315410, // Vertical Orbit QSm
            1534387878, // Countess SA/2
            2653720568, // Hero of the Infinite
          ],
          records: [
            1590210414, // Cursed with Prophecy
            2765010546, // The Lighthouse Keeper
            242464658, // Exegesis
            2104527480, // From Fallen Ground
            3985356666, // Explorer of the Infinite
            1522954160, // Mission: The Gateway
            574761812, // Mission: A Deadly Trial
            1144140061, // Mission: Beyond Infinity
            4255945596, // Mission: Deep Storage
            614406941, // Mission: A Garden World
            2332658765, // Mission: Hijacked
            1518196036, // Mission: Tree of Probabilities
            2846658569, // Mission: Omega
            2927675329, // Panoptes: Heroic
            1879702969, // Heroic: Curse of Osiris
          ],
        },
      },
      {
        name: 'Explore: Mars',
        slug: 'mars',
        buckets: {
          nodes: [
            4139791843, // BrayTech Suit
            4139791840, // Yuga Sundown Suit
            3476818390, // BrayTech Suit
            3476818389, // Abhorrent Imperative Suit
            3952745162, // BrayTech Suit
            3952745161, // Midnight Exigent Suit
            3570368582, // Mars
          ],
          collectibles: [
            1041306082, // IKELOS_SG_v1.0.1
            1203091693, // IKELOS_SR_v1.0.1
            2998976141, // IKELOS_SMG_v1.0.1
            3805476501, // IKELOS_HC_v1.0.1
            256984754, // Kibou AR3
            1168191343, // Proelium FR3
            1105208973, // Hagakure
            1099984909, // Requiem-45
            1152758813, // The Frigid Jackal
            1099984910, // Agrona PR4
            1350431644, // Foregone Conclusion
            1350431647, // BrayTech Winter Wolf
            1534387876, // Scipio-D
            1945987450, // G-72 Classical Sepheid
            2589931337, // Telemachus-C
            2219212008, // 18 Kelvins
            2130750728, // Polestar II Shell
            2691646945, // Data Mine
            4259147767, // Warmind's Fortress
            4259147765, // Wormslayer
            4259147766, // Cradle of Invention
            4259147764, // Relic of the Golden Age
            2691646949, // IKELOS Imperative
            2691646946, // Warminded
            2691646947, // Cold Comfort
            2589931338, // Niflheim Frost
            2300770642, // Vacuna SR4
            2130750731, // Polestar I Shell
            2691646950, // Apparatus Belli
            2691646948, // Arctic Arsenalist
            2770012880, // Alpha Umi
            2998976138, // The Quickstep
            1282368177, // Arctic Dreamscape
            1232035296, // The Mad Monk
            1282368176, // Bray Innovation
            259147457, // Hellas Basin
            1199798688, // Block-Z Shell
            1945987448, // G-335 Anseris Overdrive
            1945987451, // G-693 Orchestral Maneuver
            1945987454, // Pacific Deception
            3368709535, // GENOTYPENULL-ZERO
            3816666661, // Activate ESCALATION
            2292889986, // Return TYRANT++
            2770012883, // Groundswell Nullifier99
            2691646944, // Specter of the Gun
            2670498157, // Technological Singularity
            2300770645, // BrayTech RWP Mk. II
            2857012627, // Rose
            2924632392, // Lumina
            1642951318, // Polaris Lance
            199171387, // Worldline Zero
            199171386, // Sleeper Simulant
          ],
          records: [
            581089627, // The Frozen Horde
            709188219, // The Tyrant
            435060157, // The Last Bray
            242464656, // Emissary
            3431961942, // Fanatic | Part II
            2104527476, // Savin
            2104527477, // Pulled Pork
            3431961937, // Fanatic | Part I
            3647083276, // Mission: Ice and Shadow
            1651981295, // Mission: Pilgrimage
            2982664966, // Mission: Will of the Thousands
            452451691, // Mission: Strange Terrain
            3158715546, // Mission: Off-World Recovery
            1640774328, // Polaris Lance Catalyst
            2562666046, // Worldline Catalyst
            559593008, // Xol: Heroic
            3957303142, // Heroic: Warmind
          ],
        },
      },
      {
        name: 'Nightfall Strikes',
        slug: 'nightfall-strikes',
        buckets: {
          nodes: [],
          collectibles: [
            2448009818, // Universal Wavefunction
            1463718186, // Savathûn's Song
            1083244620, // Praxic Fire
            1083244623, // Watcher from Beyond
            1083244622, // Search and Rescue
            2206107773, // Master Gardener
            2222885351, // Master Cartographer
            2428465607, // Blast from the Past
            2428465604, // Odysseus's Offspring
            1463718183, // A Garden World
            2428465606, // Pulling Out the Roots
            3333524756, // An Inscrutable Amygdaloid Eigenstate
            1463718182, // The Pyramidion
            3333524758, // Operation Intrepid
            3333524759, // Spiraling into the Infinite
            1165552016, // Maleficarum Interrupted
            1165552017, // Purifying Light
            1165552018, // Bane of Nokris
            2256440525, // Strange Terrain
            1489018578, // Feast of Worms
            1489018579, // Giantfall
            2256440524, // Will of the Thousands
            1489018577, // Death to the Deathless
            3810498718, // No More Lasers
            3810498717, // A Forest of Red
            1463718184, // Tree of Probabilities
            3810498719, // Valus Intrigue
            1152758802, // Silicon Neuroma
            1333654061, // Duty Bound
            1279318110, // D.F.A.
            2466440635, // Worm God Incarnation
            1534387877, // BrayTech Osprey
          ],
          records: [
            3054774873, // A Garden World
            2692332187, // A Garden World
            1398454187, // The Quickening
            1889144800, // Tree of Probabilities
            2282894388, // Tree of Probabilities
            3636866482, // Laser Dodger
            256005845, // Savathûn's Song
            1442950315, // The Best Defense
            2099501667, // Savathûn's Song
            165166474, // Strange Terrain
            1871570556, // Don't Take Five
            2737678546, // Strange Terrain
            3013611925, // Three and Out
            1039797865, // Will of the Thousands
            3749730895, // Will of the Thousands
            319759693, // The Pyramidion
            1060780635, // The Pyramidion
            1142177491, // Siege Engine
          ],
        },
      },
      {
        name: 'Raid: Leviathan',
        slug: 'leviathan',
        buckets: {
          nodes: [
            1375933822, // Fulminator Suit
            1375933823, // Emperor's Minister Suit
            464179111, // Ace-Defiant Suit
            464179110, // Emperor's Agent Suit
            1847361715, // Rull Suit
            1847361714, // Emperor's Champion Suit
          ],
          collectibles: [
            1088431377, // It Stared Back
            1116762618, // Inaugural Address
            1152758804, // Alone as a god
            1333654057, // Ghost Primus
            1296095691, // Midnight Coup
            2283993083, // Conspirator
            1503018490, // The Emperor's Pleasure
            1551165471, // Sins of the Past
            1718922260, // Contender's Shell
            1687023288, // Calus's Selected
            1687023289, // Calus's Treasured
            3125541837, // Embrace His Name
            3125541836, // Glory to the Emperor
            3125541835, // Splish Splash
            3125541834, // Good Dog
            3125541833, // Two Enter, One Leaves
            3125541832, // Take the Throne
            2982198545, // Mob Justice
            199171389, // Legend of Acrius
          ],
          records: [
            3420353827, // Grow Fat from Strength
            940998165, // Calus Has Spoken
            3337586114, // Acrius Catalyst
            3985015094, // Skyburner Catalyst
          ],
        },
      },
      {
        name: 'Raid: Leviathan, Eater of Worlds',
        slug: 'eater-of-worlds',
        buckets: {
          nodes: [
            1375933820, // Sekris Suit
            464179109, // Feltroc Suit
            1847361713, // Nohr Suit
          ],
          collectibles: [
            137678704, // Eater of Worlds Ornament
            34034587, // Eater of Worlds Ornament
            142045026, // Eater of Worlds Ornament
            163526584, // Eater of Worlds Ornament
            570175150, // Eater of Worlds Ornament
            568904801, // Eater of Worlds Ornament
            732164139, // Eater of Worlds Ornament
            923412096, // Eater of Worlds Ornament
            2010060117, // Eater of Worlds Ornament
            1563262913, // Eater of Worlds Ornament
            2668637695, // Eater of Worlds Ornament
            2865463981, // Eater of Worlds Ornament
            3142552022, // Eater of Worlds Ornament
            3447840252, // Eater of Worlds Ornament
            3646831311, // Eater of Worlds Ornament
            3159097105, // Emperor's Envy
            3159097108, // Covetous Emperor
            1687023290, // Calus's Elite
            1041306085, // Zenith of Your Kind
            2287445851, // I Am Alive
            1687023291, // Calus's Preferred
          ],
          records: [
            2602370549, // A Whole Buffet
            3861076347, // Fine Dining
            2087362844, // Telesto Catalyst
          ],
        },
      },
      {
        name: 'Raid: Leviathan, Spire of Stars',
        slug: 'spire-of-stars',
        buckets: {
          nodes: [
            1375933818, // Insigne Shade Suit
            464179107, // Equitis Shade Suit
            1847361719, // Turris Shade Suit
          ],
          collectibles: [
            1672335738, // Atop the Spire
            1683229551, // The Emperor's Envy
            1687023292, // Praetorian Visage
            1687023293, // Calus's Shadow
            2365603951, // Grind Underfoot
            3125541831, // Spire Star
            2365603950, // Together, For Glory!
            1200315408, // Last of the Legion
            147690202, // Praetorian Ornament
            812431666, // Praetorian Ornament
            830288331, // Praetorian Ornament
            1356356143, // Praetorian Ornament
            1581770035, // Praetorian Ornament
            1117261917, // Praetorian Ornament
            1848153313, // Praetorian Ornament
            2251847166, // Praetorian Ornament
            2550071209, // Praetorian Ornament
            2401836420, // Praetorian Ornament
            1932322183, // Praetorian Ornament
            2799901966, // Praetorian Ornament
            3443184892, // Praetorian Ornament
            4121352016, // Praetorian Ornament
            3171962093, // Praetorian Ornament
          ],
          records: [
            1742345588, // On Your Way Up
            2923250426, // A Superior Retainer
            3686797699, // Sleeper Simulant Catalyst
          ],
        },
      },
      {
        name: 'Raid: Scourge of the Past',
        slug: 'scourge-of-the-past',
        buckets: {
          nodes: [
            1114960391, // Gunsmith's Devotion Suit
            1384165442, // Bladesmith's Memory Suit
            1672247878, // Bulletsmith's Ire Suit
            4214538151, // Scourge of the Past
          ],
          collectibles: [
            982798874, // No Feelings
            204024317, // Tempered Dynamo
            4165423054, // Bellowing Giant
            2596090783, // Threat Level
            1903459810, // Always on Time
            2220014607, // Anarchy
            4176285806, // Fallen Invigoration
            3647888847, // Fallen Armaments
            3162743664, // Recovered Memories
            1657525185, // Fallen Barrier
            557403582, // Fallen Repurposing
            2473783710, // Scourge of Nothing
            4051063432, // Midnight Smith
          ],
          records: [],
        },
      },
      {
        name: 'Raid: Crown of Sorrow',
        slug: 'crown-of-sorrow',
        buckets: {
          nodes: [
            714676221, // Shadow of Judgment Suit
            3847915640, // Shadow of Silence Suit
            1649720500, // Shadow of War Suit
            1070500232, // The Chronicon
            2721577348, // Confessions
            1891105980, // Crown of Sorrow
          ],
          collectibles: [
            2014766405, // Emperor's Courtesy
            916585710, // Calusea Noblesse
            3424884099, // Gahlran's Right Hand
            3923108273, // Bane of Sorrow
            2329697053, // Tarrabah
            3927974185, // Hive Barrier
            3587920870, // Hive Invigoration
            2600003719, // Hive Armaments
            1366523382, // Hive Repurposing
            753635605, // Shadow of Earth Shell
            3171386139, // Crown of Sorrow
            3171386140, // Heavy Is the Crown
            2168196994, // Imperial Opulence
            2168196995, // Imperial Dress
          ],
          records: [],
        },
      },
      {
        name: 'The Menagerie',
        slug: 'the-menagerie',
        buckets: {
          nodes: [
            2551808106, // Opulent Scholar Suit
            327169819, // Opulent Stalker Suit
            3760158863, // Opulent Duelist Suit
            4139791855, // Exodus Down Suit
            3476818394, // Exodus Down Suit
            3952745158, // Exodus Down Suit
            1117466231, // Menagerie
          ],
          collectibles: [
            152623661, // Drang (Baroque)
            527295602, // The Epicurean
            3394660195, // Beloved
            3376099856, // Goldtusk
            2857012626, // Austringer
            2237685612, // CALUS Mini-Tool
            1572606157, // Death's Razor
            1692129580, // Throne-Cleaver
            1100183748, // Imperial Decree
            832124045, // Fixed Odds
            3003919297, // Striking Hand
            3950181352, // Energized
            3702797496, // Power Overwhelming
            3646536351, // Emperor's Balance
            2923955453, // Giving Hand
            1980462058, // Radiant Largesse
            1108546639, // Emperor's Shock
            632821489, // Empowering Largesse
            528474349, // Embraced Largesse
            620017332, // Emperor's Blaze
            462836291, // Shielding Hand
            1763840761, // Truth
            3636059127, // Árma Mákhēs
            2678796997, // The Emperor's Chosen
            1242690195, // A Hall of Delights
            1242690194, // The Imperial Menagerie
            704486706, // Shadow Gilt
            704486707, // Cinderchar
            704486704, // Golden Empire
            704486705, // Goldleaf
          ],
          records: [
            52802522, // Mint in Box
          ],
        },
      },
      {
        name: 'The Tribute Hall',
        slug: 'tribute-hall',
        buckets: {
          nodes: [
            3892601654, // The Tribute Hall
          ],
          collectibles: [
            4207100358, // Bad Juju
            1242690193, // The Tribute Hall
          ],
          records: [
            2245186555, // Bad Juju Catalyst
          ],
        },
      },
    ],
  },
];
