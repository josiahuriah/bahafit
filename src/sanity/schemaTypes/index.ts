import { type SchemaTypeDefinition } from 'sanity'

// Import base types
import blockContent from './blockContent'

// Import event types
import raceEvent from './events/raceEvent'
import wellnessExpo from './events/wellnessExpo'
import competition from './events/competition'
import fitnessChallenge from './events/fitnessChallenge'

// Import listing types
import gym from './listings/gym'
import coach from './listings/coach'
import wellnessCenter from './listings/wellnessCenter'
import fitnessEquipment from './listings/fitnessEquipment'
import fitnessApparel from './listings/fitnessApparel'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Base types
    blockContent,

    // Event types
    raceEvent,
    wellnessExpo,
    competition,
    fitnessChallenge,

    // Listing types
    gym,
    coach,
    wellnessCenter,
    fitnessEquipment,
    fitnessApparel,
  ],
}
