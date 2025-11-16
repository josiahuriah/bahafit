import { defineType } from 'sanity'

// schemas/events/competition.ts
export default defineType({
  name: 'competition',
  title: 'Competition Event',
  type: 'document',
  fields: [
    // Base event fields
    {
      name: 'competitionType',
      title: 'Competition Type',
      type: 'string',
      options: {
        list: [
          { title: 'Bodybuilding', value: 'bodybuilding' },
          { title: 'Powerlifting', value: 'powerlifting' },
          { title: 'Olympic Weightlifting', value: 'olympic_weightlifting' },
          { title: 'CrossFit', value: 'crossfit' }
        ]
      }
    },
    {
      name: 'divisions',
      title: 'Competition Divisions',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'name', type: 'string', title: 'Division Name' },
          { name: 'ageRange', type: 'string', title: 'Age Range' },
          { name: 'weightClass', type: 'string', title: 'Weight Class' },
          { name: 'rules', type: 'text', title: 'Rules' }
        ]
      }]
    },
    {
      name: 'judges',
      title: 'Judges',
      type: 'array',
      of: [{ type: 'string' }]
    }
  ]
})
