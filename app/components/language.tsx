"use client";

import { Languages } from "lucide-react";
import { createContext, useContext, useEffect, useState } from "react";

type Locale = "en" | "zh";
type CopyKey = keyof typeof copy.en;

const copy = {
  en: {
    drivers: "Drivers",
    teams: "Teams",
    races: "Races",
    compare: "Compare",
    calculators: "Calculators",
    openMenu: "Open navigation menu",
    closeMenu: "Close navigation menu",
    privacyPolicy: "Privacy Policy",
    rightsReserved: "All rights reserved.",
    dataSource: "Data sourced from Jolpica F1 API.",
    heroEyebrow: "FORMULA 1 DATA HUB · 2026",
    heroTitle: "F1 statistics,",
    heroTitleAccent: "without the noise.",
    heroDescription:
      "Championship standings, race results, driver data and practical calculators in one fast F1 statistics hub.",
    driverStandings: "Driver standings",
    raceCalendar: "Race calendar",
    viewAll: "View all",
    championship: "CHAMPIONSHIP",
    season: "SEASON",
    raceStatus: "Race status",
    lastRace: "LAST RACE",
    nextRace: "NEXT RACE",
    raceDetails: "Race details",
    weekendDetails: "Weekend details",
    tools: "TOOLS",
    f1Calculators: "F1 calculators",
    constructors: "CONSTRUCTORS",
    teamStandings: "Team standings",
    interactiveTool: "Interactive F1 tool",
    round: "ROUND",
    allTimesUtc: "All times are UTC.",
    weekendSchedule: "Weekend schedule",
    raceResults: "Race results",
    qualifyingResults: "Qualifying results",
    sprintResults: "Sprint results",
    racePointsChart: "Race points by driver",
    racePointsChartLead: "Points awarded to each driver in this Grand Prix.",
    driverPointsTrend: "Driver race points by round",
    driverPointsTrendLead: "Points scored in each Grand Prix this season.",
    qualifyingLapTrend: "Qualifying lap times",
    qualifyingLapTrendLead:
      "Each driver's latest available Q3, Q2 or Q1 time. Hover a point for the driver and session; lower times appear higher.",
    session: "SESSION",
    date: "DATE",
    timeUtc: "TIME (UTC)",
    fp1: "FP1",
    fp2: "FP2",
    fp3: "FP3",
    sprintQualifying: "Sprint qualifying",
    sprint: "Sprint",
    qualifying: "Qualifying",
    race: "Race",
    position: "Position",
    driver: "Driver",
    team: "Team",
    points: "Points",
    wins: "Wins",
    grid: "Grid",
    result: "Result",
    timeStatus: "Time / Status",
    f1Drivers: "F1 Drivers",
    driversLead: "2026 driver championship standings and statistics.",
    f1Teams: "F1 Teams",
    teamsLead: "2026 constructor championship standings.",
    calendarTitle: "2026 Race Calendar",
    calendarLead: "Race schedule, results and weekend information.",
    dataUnavailable: "Data is not available yet.",
    dataWorkflow: "Run the data workflow to populate this page.",
    driverNotFound: "Driver not found",
    teamNotFound: "Team not found",
    raceNotFound: "Race not found",
    driverSeason: "2026 DRIVER",
    constructorSeason: "2026 CONSTRUCTOR",
    legal: "LEGAL",
    lastUpdated: "Last updated: September 25, 2026",
    informationCollection: "Information collection",
    dataSources: "Data sources",
    hostingTechnical: "Hosting and technical data",
    updates: "Updates",
    compareTitle: "Driver & Team Comparison",
    compareLead:
      "Compare driver standings and season scenarios, or compare constructor standings.",
    driverComparison: "Driver Comparison",
    teamComparison: "Team Comparison",
    comparisonType: "Comparison type",
    teamCompareLead:
      "Compare two constructors by championship position, points and wins.",
    teamA: "TEAM A",
    teamB: "TEAM B",
    swapTeams: "Swap compared teams",
    headToHead: "HEAD-TO-HEAD",
    driverA: "DRIVER A",
    driverB: "DRIVER B",
    championshipPosition: "Championship position",
    seasonScenario: "SEASON SCENARIO",
    championshipSimulator: "Championship Simulator",
    raceByRaceScenario: "RACE-BY-RACE SCENARIO",
    scenarioDefaults:
      "Starting results vary around current championship positions; edit each round as needed.",
    remaining: "REMAINING",
    raceCount: "races",
    sprintCount: "sprints",
    currentPoints: "Current",
    expectedRaceFinish: "Expected race finish",
    expectedSprintFinish: "Expected sprint finish",
    noPoints: "No points",
    pointsShort: "pts",
    projectedTotals: "PROJECTED TOTALS",
    projectedGap: "PROJECTED GAP",
    driverMaximum: "DRIVER MAXIMUM",
    teamMaximum: "TEAM MAXIMUM",
    pointsCalculator: "Points Calculator",
    lapTimeCalculator: "Lap Time Calculator",
    pitStopCalculator: "Pit Stop Calculator",
    calculatorsLead:
      "Browse the interactive tools for points, lap pace and pit strategy.",
    weekendScoring: "WEEKEND SCORING",
    pointsLead:
      "Calculate one driver's points from a Grand Prix and optional Sprint session.",
    grandPrixResult: "Grand Prix result",
    sprintResult: "Sprint result",
    grandPrix: "GRAND PRIX",
    weekendTotal: "WEEKEND TOTAL",
    raceStrategy: "RACE STRATEGY",
    pitStrategy: "Pit Strategy Calculator",
    pitLead:
      "Compare tyre-degradation and pit-lane loss across one, two and three-stop strategies.",
    raceLaps: "Race laps",
    baseLap: "Base lap time (sec)",
    pitLoss: "Pit-lane loss (sec)",
    tyreDegradation: "Tyre degradation / lap (sec)",
    paceAnalysis: "PACE ANALYSIS",
    lapDelta: "Lap Time Delta",
    lapLead:
      "Convert a lap-time gap into percentage pace and accumulated race time.",
    referenceMinutes: "Reference minutes",
    referenceSeconds: "Reference seconds",
    lapDeltaSeconds: "Lap delta (sec)",
    targetLap: "TARGET LAP",
    paceDelta: "PACE DELTA",
    tenLapGap: "10-LAP GAP",
  },
  zh: {
    drivers: "车手",
    teams: "车队",
    races: "赛历",
    compare: "对比",
    calculators: "计算器",
    openMenu: "打开导航菜单",
    closeMenu: "关闭导航菜单",
    privacyPolicy: "隐私政策",
    rightsReserved: "版权所有。",
    dataSource: "数据来自 Jolpica F1 API。",
    heroEyebrow: "F1 数据中心 · 2026",
    heroTitle: "F1 数据统计，",
    heroTitleAccent: "清晰直观。",
    heroDescription:
      "在一个快速的 F1 数据中心中查看积分榜、比赛结果、车手数据与实用计算器。",
    driverStandings: "车手积分榜",
    raceCalendar: "比赛赛历",
    viewAll: "查看全部",
    championship: "锦标赛",
    season: "赛季",
    raceStatus: "比赛状态",
    lastRace: "上一站",
    nextRace: "下一站",
    raceDetails: "比赛详情",
    weekendDetails: "周末详情",
    tools: "工具",
    f1Calculators: "F1 计算器",
    constructors: "车队",
    teamStandings: "车队积分榜",
    interactiveTool: "交互式 F1 工具",
    round: "第",
    allTimesUtc: "所有时间均为 UTC。",
    weekendSchedule: "周末赛程",
    raceResults: "正赛结果",
    qualifyingResults: "排位赛结果",
    sprintResults: "冲刺赛结果",
    racePointsChart: "本场正赛车手积分",
    racePointsChartLead: "显示每位车手在本场大奖赛获得的正赛积分。",
    driverPointsTrend: "车手每站正赛积分",
    driverPointsTrendLead: "展示本赛季每站正赛获得的积分。",
    qualifyingLapTrend: "车手排位圈速",
    qualifyingLapTrendLead:
      "显示每位车手最终参加阶段的圈速（Q3、Q2 或 Q1）；悬停查看车手和阶段，用时越短折线位置越高。",
    session: "项目",
    date: "日期",
    timeUtc: "时间 (UTC)",
    fp1: "第一次练习",
    fp2: "第二次练习",
    fp3: "第三次练习",
    sprintQualifying: "冲刺排位",
    sprint: "冲刺赛",
    qualifying: "排位赛",
    race: "正赛",
    position: "排名",
    driver: "车手",
    team: "车队",
    points: "积分",
    wins: "胜场",
    grid: "发车位",
    result: "结果",
    timeStatus: "时间 / 状态",
    f1Drivers: "F1 车手",
    driversLead: "2026 年 F1 车手积分榜与数据。",
    f1Teams: "F1 车队",
    teamsLead: "2026 年 F1 车队积分榜。",
    calendarTitle: "2026 年比赛赛历",
    calendarLead: "比赛赛程、成绩与周末信息。",
    dataUnavailable: "暂时没有可用数据。",
    dataWorkflow: "运行数据更新工作流以填充此页面。",
    driverNotFound: "未找到车手",
    teamNotFound: "未找到车队",
    raceNotFound: "未找到比赛",
    driverSeason: "2026 车手",
    constructorSeason: "2026 车队",
    legal: "法律信息",
    lastUpdated: "最后更新：2026 年 9 月 25 日",
    informationCollection: "信息收集",
    dataSources: "数据来源",
    hostingTechnical: "托管与技术数据",
    updates: "更新",
    compareTitle: "车手与车队对比",
    compareLead: "对比车手积分与赛季情景，或查看两支车队的积分榜表现。",
    driverComparison: "车手对比",
    teamComparison: "车队对比",
    comparisonType: "对比类型",
    teamCompareLead: "比较两支车队的锦标赛排名、积分和胜场。",
    teamA: "车队 A",
    teamB: "车队 B",
    swapTeams: "交换对比车队",
    headToHead: "正面对比",
    driverA: "车手 A",
    driverB: "车手 B",
    championshipPosition: "锦标赛排名",
    seasonScenario: "赛季情景",
    championshipSimulator: "冠军形势模拟器",
    raceByRaceScenario: "逐站比赛情景",
    scenarioDefaults: "初始示例围绕车手当前排名小幅浮动；每一站的成绩都可单独调整。",
    remaining: "剩余赛程",
    raceCount: "场正赛",
    sprintCount: "场冲刺赛",
    currentPoints: "当前",
    expectedRaceFinish: "预计正赛名次",
    expectedSprintFinish: "预计冲刺赛名次",
    noPoints: "无积分",
    pointsShort: "分",
    projectedTotals: "预计总积分",
    projectedGap: "预计分差",
    driverMaximum: "车手理论上限",
    teamMaximum: "车队理论最高积分",
    pointsCalculator: "积分计算器",
    lapTimeCalculator: "圈速计算器",
    pitStopCalculator: "进站策略计算器",
    calculatorsLead: "浏览比赛积分、圈速与进站策略等交互式工具。",
    weekendScoring: "周末积分",
    pointsLead: "计算一位车手在大奖赛与可选冲刺赛中的积分。",
    grandPrixResult: "大奖赛成绩",
    sprintResult: "冲刺赛成绩",
    grandPrix: "大奖赛",
    weekendTotal: "周末总积分",
    raceStrategy: "比赛策略",
    pitStrategy: "进站策略计算器",
    pitLead: "比较一停、两停、三停策略中的轮胎衰退与进站时间损失。",
    raceLaps: "比赛圈数",
    baseLap: "基础圈速（秒）",
    pitLoss: "进站通道损失（秒）",
    tyreDegradation: "轮胎衰退 / 圈（秒）",
    paceAnalysis: "圈速分析",
    lapDelta: "圈速差转换",
    lapLead: "将单圈时间差转换为速度百分比和累计比赛时间差。",
    referenceMinutes: "参考分钟",
    referenceSeconds: "参考秒数",
    lapDeltaSeconds: "单圈差距（秒）",
    targetLap: "目标圈速",
    paceDelta: "速度差",
    tenLapGap: "十圈累计差",
  },
} as const;

const LanguageContext = createContext<{
  locale: Locale;
  setLocale: (locale: Locale) => void;
}>({ locale: "en", setLocale: () => {} });

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem("f1-stats-locale");
    if (saved === "zh" || saved === "en") setLocale(saved);
  }, []);

  function selectLocale(nextLocale: Locale) {
    window.localStorage.setItem("f1-stats-locale", nextLocale);
    setLocale(nextLocale);
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale: selectLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function Text({ id }: { id: CopyKey }) {
  const { locale } = useContext(LanguageContext);
  return <>{copy[locale][id]}</>;
}

export function useText() {
  const { locale } = useContext(LanguageContext);
  return copy[locale];
}

export function LanguageSwitcher() {
  const { locale, setLocale } = useContext(LanguageContext);
  return (
    <div className="language-switcher" aria-label="Language selector">
      <Languages aria-hidden="true" size={15} />
      <button
        type="button"
        aria-pressed={locale === "en"}
        onClick={() => setLocale("en")}
      >
        EN
      </button>
      <button
        type="button"
        aria-pressed={locale === "zh"}
        onClick={() => setLocale("zh")}
      >
        中文
      </button>
    </div>
  );
}
