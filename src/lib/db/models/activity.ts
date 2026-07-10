import { Collection, ObjectId } from 'mongodb'
import { getDatabase } from '../mongodb'

/**
 * Community feed activities — the "Strava layer" of Bahafit.
 * Activities live in MongoDB alongside users and registrations.
 */

export const SPORT_TYPES = [
  'run',
  'ride',
  'swim',
  'walk',
  'hike',
  'gym',
  'hiit',
  'yoga',
  'crossfit',
  'other',
] as const

export type SportType = (typeof SPORT_TYPES)[number]

export type ActivityVisibility = 'public' | 'followers' | 'private'
export type ActivitySource = 'manual' | 'gpx' | 'apple-shortcut'

export interface Activity {
  _id?: string
  userId: string
  userName: string
  userImage?: string

  title: string
  description?: string
  sportType: SportType

  startedAt: Date
  durationSec: number
  distanceKm?: number
  elevationGainM?: number
  avgHeartRate?: number
  calories?: number
  /** Perceived effort 1–10 */
  effort?: number

  /** Downsampled [lat, lng] pairs from a GPX upload — used to draw the route. */
  route?: Array<[number, number]>

  visibility: ActivityVisibility
  source: ActivitySource

  kudos: string[]
  kudosCount: number
  commentCount: number

  /** PR badges computed at save time, e.g. "Longest run". */
  achievements: string[]

  createdAt: Date
  updatedAt: Date
}

export interface ActivityComment {
  _id?: string
  activityId: string
  userId: string
  userName: string
  userImage?: string
  text: string
  createdAt: Date
}

const ACTIVITIES = 'activities'
const COMMENTS = 'activity_comments'

export async function getActivitiesCollection(): Promise<Collection<Activity>> {
  const db = await getDatabase()
  return db.collection<Activity>(ACTIVITIES)
}

export async function getCommentsCollection(): Promise<Collection<ActivityComment>> {
  const db = await getDatabase()
  return db.collection<ActivityComment>(COMMENTS)
}

const serialize = <T extends { _id?: unknown }>(doc: T) => ({
  ...doc,
  _id: doc._id?.toString(),
})

/** Average pace in seconds per km (undefined when there's no distance). */
export function paceSecPerKm(a: Pick<Activity, 'durationSec' | 'distanceKm'>): number | undefined {
  if (!a.distanceKm || a.distanceKm <= 0 || !a.durationSec) return undefined
  return Math.round(a.durationSec / a.distanceKm)
}

/**
 * Compute PR badges by comparing against the user's history for the
 * same sport. Called before insert.
 */
async function computeAchievements(
  data: Omit<Activity, '_id' | 'kudos' | 'kudosCount' | 'commentCount' | 'achievements' | 'createdAt' | 'updatedAt'>
): Promise<string[]> {
  const collection = await getActivitiesCollection()
  const previous = await collection
    .find({ userId: data.userId, sportType: data.sportType })
    .project({ distanceKm: 1, durationSec: 1 })
    .limit(2000)
    .toArray()

  const achievements: string[] = []
  const sportLabel = data.sportType === 'gym' ? 'workout' : data.sportType

  if (previous.length === 0) {
    achievements.push(`First ${sportLabel}`)
    return achievements
  }

  if (data.distanceKm && data.distanceKm > 0) {
    const maxDistance = Math.max(...previous.map((p) => p.distanceKm || 0))
    if (data.distanceKm > maxDistance && maxDistance > 0) {
      achievements.push(`Longest ${sportLabel}`)
    }

    const newPace = paceSecPerKm(data)
    if (newPace && data.distanceKm >= 3) {
      const previousPaces = previous
        .filter((p) => (p.distanceKm || 0) >= 3 && p.durationSec)
        .map((p) => (p.durationSec as number) / (p.distanceKm as number))
      if (previousPaces.length > 0 && newPace < Math.min(...previousPaces)) {
        achievements.push('Best avg pace')
      }
    }
  }

  const maxDuration = Math.max(...previous.map((p) => p.durationSec || 0))
  if (data.durationSec > maxDuration) {
    achievements.push('Longest duration')
  }

  return achievements
}

export async function createActivity(
  data: Omit<Activity, '_id' | 'kudos' | 'kudosCount' | 'commentCount' | 'achievements' | 'createdAt' | 'updatedAt'>
): Promise<Activity> {
  const collection = await getActivitiesCollection()

  const achievements = await computeAchievements(data)

  const activity: Activity = {
    ...data,
    kudos: [],
    kudosCount: 0,
    commentCount: 0,
    achievements,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const result = await collection.insertOne(activity as never)
  return { ...activity, _id: result.insertedId.toString() }
}

export async function getActivityById(id: string): Promise<Activity | null> {
  if (!ObjectId.isValid(id)) return null
  const collection = await getActivitiesCollection()
  const activity = await collection.findOne({ _id: new ObjectId(id) } as never)
  if (!activity) return null
  return serialize(activity) as Activity
}

export interface FeedOptions {
  viewerId: string
  /** IDs the viewer follows (for scope=following and visibility checks). */
  followingIds: string[]
  scope: 'following' | 'all' | 'me'
  /** Return activities created before this ISO date (cursor pagination). */
  before?: Date
  limit?: number
  userId?: string
}

export async function getFeed(options: FeedOptions): Promise<Activity[]> {
  const collection = await getActivitiesCollection()
  const limit = Math.min(options.limit || 20, 50)

  let query: Record<string, unknown>
  if (options.scope === 'me') {
    query = { userId: options.viewerId }
  } else if (options.scope === 'following') {
    query = {
      $or: [
        { userId: options.viewerId },
        {
          userId: { $in: options.followingIds },
          visibility: { $in: ['public', 'followers'] },
        },
      ],
    }
  } else {
    // 'all' — public activities only (plus the viewer's own)
    query = {
      $or: [{ visibility: 'public' }, { userId: options.viewerId }],
    }
  }

  if (options.userId) {
    query = { $and: [query, { userId: options.userId }] }
  }

  if (options.before) {
    query = { $and: [query, { createdAt: { $lt: options.before } }] }
  }

  const activities = await collection
    .find(query as never)
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray()

  return activities.map(serialize) as Activity[]
}

/** Activities visible to a viewer on someone's profile. */
export async function getActivitiesForProfile(
  profileUserId: string,
  viewerId: string,
  viewerFollows: boolean,
  limit = 20
): Promise<Activity[]> {
  const collection = await getActivitiesCollection()

  const visibilities: ActivityVisibility[] =
    profileUserId === viewerId
      ? ['public', 'followers', 'private']
      : viewerFollows
        ? ['public', 'followers']
        : ['public']

  const activities = await collection
    .find({ userId: profileUserId, visibility: { $in: visibilities } })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray()

  return activities.map(serialize) as Activity[]
}

export async function updateActivity(
  id: string,
  userId: string,
  data: Partial<Pick<Activity, 'title' | 'description' | 'sportType' | 'visibility' | 'effort'>>
): Promise<Activity | null> {
  if (!ObjectId.isValid(id)) return null
  const collection = await getActivitiesCollection()
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id), userId } as never,
    { $set: { ...data, updatedAt: new Date() } },
    { returnDocument: 'after' }
  )
  if (!result) return null
  return serialize(result) as Activity
}

export async function deleteActivity(id: string, userId: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false
  const collection = await getActivitiesCollection()
  const result = await collection.deleteOne({ _id: new ObjectId(id), userId } as never)
  if (result.deletedCount === 1) {
    const comments = await getCommentsCollection()
    await comments.deleteMany({ activityId: id })
    return true
  }
  return false
}

export async function toggleKudos(
  id: string,
  userId: string
): Promise<{ kudosCount: number; hasKudos: boolean } | null> {
  if (!ObjectId.isValid(id)) return null
  const collection = await getActivitiesCollection()
  const activity = await collection.findOne({ _id: new ObjectId(id) } as never)
  if (!activity) return null

  const hasKudos = (activity.kudos || []).includes(userId)
  const update = hasKudos
    ? { $pull: { kudos: userId }, $inc: { kudosCount: -1 } }
    : { $addToSet: { kudos: userId }, $inc: { kudosCount: 1 } }

  await collection.updateOne({ _id: new ObjectId(id) } as never, update as never)
  return {
    kudosCount: (activity.kudosCount || 0) + (hasKudos ? -1 : 1),
    hasKudos: !hasKudos,
  }
}

// ─── Comments ───

export async function addComment(data: Omit<ActivityComment, '_id' | 'createdAt'>): Promise<ActivityComment> {
  const comments = await getCommentsCollection()
  const comment: ActivityComment = { ...data, createdAt: new Date() }
  const result = await comments.insertOne(comment as never)

  const activities = await getActivitiesCollection()
  await activities.updateOne(
    { _id: new ObjectId(data.activityId) } as never,
    { $inc: { commentCount: 1 } }
  )

  return { ...comment, _id: result.insertedId.toString() }
}

export async function getComments(activityId: string): Promise<ActivityComment[]> {
  const comments = await getCommentsCollection()
  const list = await comments.find({ activityId }).sort({ createdAt: 1 }).limit(200).toArray()
  return list.map(serialize) as ActivityComment[]
}

export async function deleteComment(commentId: string, userId: string, isAdmin = false): Promise<boolean> {
  if (!ObjectId.isValid(commentId)) return false
  const comments = await getCommentsCollection()
  const comment = await comments.findOne({ _id: new ObjectId(commentId) } as never)
  if (!comment) return false
  if (comment.userId !== userId && !isAdmin) return false

  await comments.deleteOne({ _id: new ObjectId(commentId) } as never)
  const activities = await getActivitiesCollection()
  await activities.updateOne(
    { _id: new ObjectId(comment.activityId) } as never,
    { $inc: { commentCount: -1 } }
  )
  return true
}

// ─── Stats & PRs ───

export interface AthleteStats {
  totalActivities: number
  week: { activities: number; distanceKm: number; durationSec: number; elevationGainM: number }
  allTime: { distanceKm: number; durationSec: number }
  bests: Array<{ sportType: string; label: string; value: string }>
}

function fmtDuration(sec: number): string {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

function fmtPace(secPerKm: number): string {
  const m = Math.floor(secPerKm / 60)
  const s = Math.round(secPerKm % 60)
  return `${m}:${String(s).padStart(2, '0')} /km`
}

export async function getAthleteStats(userId: string): Promise<AthleteStats> {
  const collection = await getActivitiesCollection()
  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - weekStart.getDay()) // Sunday
  weekStart.setHours(0, 0, 0, 0)

  const all = await collection
    .find({ userId })
    .project({ sportType: 1, distanceKm: 1, durationSec: 1, elevationGainM: 1, startedAt: 1 })
    .limit(5000)
    .toArray()

  const week = { activities: 0, distanceKm: 0, durationSec: 0, elevationGainM: 0 }
  const allTime = { distanceKm: 0, durationSec: 0 }
  const bestBySport: Record<string, { maxDistance: number; maxDuration: number; bestPace?: number }> = {}

  for (const a of all) {
    const dist = a.distanceKm || 0
    const dur = a.durationSec || 0
    allTime.distanceKm += dist
    allTime.durationSec += dur

    if (new Date(a.startedAt) >= weekStart) {
      week.activities += 1
      week.distanceKm += dist
      week.durationSec += dur
      week.elevationGainM += a.elevationGainM || 0
    }

    const b = (bestBySport[a.sportType] ||= { maxDistance: 0, maxDuration: 0 })
    if (dist > b.maxDistance) b.maxDistance = dist
    if (dur > b.maxDuration) b.maxDuration = dur
    if (dist >= 3 && dur > 0) {
      const pace = dur / dist
      if (!b.bestPace || pace < b.bestPace) b.bestPace = pace
    }
  }

  const bests: AthleteStats['bests'] = []
  for (const [sport, b] of Object.entries(bestBySport)) {
    if (b.maxDistance > 0) {
      bests.push({ sportType: sport, label: `Longest ${sport === 'gym' ? 'workout' : sport}`, value: `${b.maxDistance.toFixed(1)} km` })
    }
    if (b.bestPace) {
      bests.push({ sportType: sport, label: `Best ${sport} pace`, value: fmtPace(b.bestPace) })
    }
    if (b.maxDistance === 0 && b.maxDuration > 0) {
      bests.push({ sportType: sport, label: `Longest ${sport === 'gym' ? 'workout' : sport}`, value: fmtDuration(b.maxDuration) })
    }
  }

  return {
    totalActivities: all.length,
    week: {
      ...week,
      distanceKm: Math.round(week.distanceKm * 10) / 10,
      elevationGainM: Math.round(week.elevationGainM),
    },
    allTime: { distanceKm: Math.round(allTime.distanceKm * 10) / 10, durationSec: allTime.durationSec },
    bests: bests.slice(0, 8),
  }
}

/** Users with the most recent public activity — used for suggestions. */
export async function getRecentlyActiveUserIds(excludeIds: string[], limit = 6): Promise<
  Array<{ userId: string; userName: string; userImage?: string; count: number }>
> {
  const collection = await getActivitiesCollection()
  const results = await collection
    .aggregate([
      { $match: { visibility: 'public', userId: { $nin: excludeIds } } },
      { $sort: { createdAt: -1 } },
      { $limit: 500 },
      {
        $group: {
          _id: '$userId',
          userName: { $first: '$userName' },
          userImage: { $first: '$userImage' },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: limit },
    ])
    .toArray()

  return results.map((r) => ({
    userId: String(r._id),
    userName: r.userName as string,
    userImage: r.userImage as string | undefined,
    count: r.count as number,
  }))
}
