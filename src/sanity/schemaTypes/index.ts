import { type SchemaTypeDefinition } from 'sanity'

// Import block content
import blockContent from './blockContent'

// Import listing types
import gym from './listings/gym'
import coach from './listings/coach'
import wellnessCenter from './listings/wellnessCenter'
import fitnessApparel from './listings/fitnessApparel'
import fitnessEquipment from './listings/fitnessEquipment'

// Import event types
import raceEvent from './events/raceEvent'
import wellnessExpo from './events/wellnessExpo'
import fitnessChallenge from './events/fitnessChallenge'
import competition from './events/competition'

// Blog will be added later
// import post from './blog/post'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Core types
    blockContent,

    // Listing types
    gym,
    coach,
    wellnessCenter,
    fitnessApparel,
    fitnessEquipment,

    // Event types
    raceEvent,
    wellnessExpo,
    fitnessChallenge,
    competition,
  ],
}
