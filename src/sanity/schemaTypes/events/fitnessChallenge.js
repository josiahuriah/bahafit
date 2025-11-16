export default {
  name: 'fitnessChallenge',
  title: 'Fitness Challenge',
  type: 'document',
  fields: [
    // Base event fields
    {
      name: 'challengeType',
      title: 'Challenge Type',
      type: 'string',
      options: {
        list: [
          { title: 'Step Challenge', value: 'step_challenge' },
          { title: 'Weight Loss Challenge', value: 'weight_loss' },
          { title: 'Endurance Challenge', value: 'endurance' },
          { title: 'Strength Challenge', value: 'strength' }
        ]
      }
    },
    {
      name: 'duration',
      title: 'Challenge Duration',
      type: 'object',
      fields: [
        { name: 'value', type: 'number', title: 'Duration Value' },
        { name: 'unit', type: 'string', title: 'Unit', options: {
          list: ['days', 'weeks', 'months']
        }}
      ]
    },
    {
      name: 'goals',
      title: 'Challenge Goals',
      type: 'array',
      of: [{ type: 'text' }]
    },
    {
      name: 'prizes',
      title: 'Prizes',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'place', type: 'string', title: 'Place' },
          { name: 'prize', type: 'string', title: 'Prize Description' },
          { name: 'value', type: 'number', title: 'Prize Value' }
        ]
      }]
    }
  ]
}