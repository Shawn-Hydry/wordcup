"""Pydantic 数据模型"""
from pydantic import BaseModel
from typing import Optional, Any


class Coach(BaseModel):
    name: str = ""
    style: str = ""


class Team(BaseModel):
    id: str
    name: str
    flag: str = ""
    flagUrl: str = ""
    fifaRank: int = 0
    formation: str = "4-3-3"
    style: str = ""
    starPlayer: str = ""
    coach: str = ""
    coachStyle: str = ""
    group: str = ""


class GoalEvent(BaseModel):
    minute: int
    isExtraTime: bool = False
    player: str
    team: str  # 'home' | 'away'
    type: str = "goal"  # 'goal' | 'penalty' | 'own_goal'


class MatchResult(BaseModel):
    homeScore: int
    awayScore: int
    homeScorers: list[str] = []
    awayScorers: list[str] = []
    timeline: list[GoalEvent] = []


class Match(BaseModel):
    id: str
    homeTeam: dict
    awayTeam: dict
    matchDate: str
    kickoffTime: str = ""
    venue: str = ""
    stage: str = ""
    status: str = "upcoming"  # 'upcoming' | 'live' | 'finished'
    result: Optional[dict] = None


class ScoreItem(BaseModel):
    score: str
    probability: float


class TotalGoalRange(BaseModel):
    range: str
    probability: float


class ScorePrediction(BaseModel):
    mostLikelyScore: str
    topScores: list[ScoreItem]
    totalGoals: list[TotalGoalRange]
    avgGoals: float


class WinPrediction(BaseModel):
    homeWinProb: float
    drawProb: float
    awayWinProb: float
    upsetProb: float
    upsetLevel: str
    tacticalAnalysis: str
    coachComparison: str
    keyFactors: list[str]


class ExternalPredictionItem(BaseModel):
    source: str
    sourceType: str
    prediction: str
    confidence: float
    analysis: str
    avatar: str


class ApiResponse(BaseModel):
    success: bool
    data: Optional[Any] = None
    error: Optional[str] = None


# 常量
TEAM_POSITIONS = {"FW": "前锋", "MF": "中场", "DF": "后卫", "GK": "门将"}
UPSET_LEVELS = {"low": "低风险", "medium": "中等风险", "high": "高风险"}
SOURCE_TYPES = {"platform": "数据平台", "expert": "专家评论", "media": "知名媒体", "ai": "AI模型"}
INJURY_STATUS = {"fit": "健康", "doubtful": "疑似伤停", "out": "确认伤停"}
