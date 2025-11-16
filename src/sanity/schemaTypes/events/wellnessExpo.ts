import { defineType } from 'sanity'

export default defineType({
  name: 'wellnessExpo',
  title: 'Health & Wellness Expo',
  type: 'document',
  fields: [
    // Similar base fields as raceEvent
    {
      name: 'exhibitors',
      title: 'Exhibitors',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'name', type: 'string', title: 'Exhibitor Name' },
          { name: 'booth', type: 'string', title: 'Booth Number' },
          { name: 'description', type: 'text', title: 'Description' }
        ]
      }]
    },
    {
      name: 'workshops',
      title: 'Workshops',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'title', type: 'string', title: 'Workshop Title' },
          { name: 'time', type: 'datetime', title: 'Time' },
          { name: 'speaker', type: 'string', title: 'Speaker' },
          { name: 'capacity', type: 'number', title: 'Capacity' }
        ]
      }]
    }
  ]
})
