// schemas/listings/wellnessCenter.js
export default {
  name: 'wellnessCenter',
  title: 'Wellness Center',
  type: 'document',
  fields: [
    // Similar structure to gym
    {
      name: 'centerType',
      title: 'Center Type',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Spa', value: 'spa' },
          { title: 'Physiotherapy', value: 'physiotherapy' },
          { title: 'Chiropractic', value: 'chiropractic' },
          { title: 'Massage Therapy', value: 'massage' },
          { title: 'Acupuncture', value: 'acupuncture' },
          { title: 'Nutrition Counseling', value: 'nutrition' },
          { title: 'Mental Health', value: 'mental_health' }
        ]
      }
    },
    {
      name: 'services',
      title: 'Services',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'name', type: 'string', title: 'Service Name' },
          { name: 'description', type: 'text', title: 'Description' },
          { name: 'duration', type: 'string', title: 'Duration' },
          { name: 'price', type: 'number', title: 'Price' }
        ]
      }]
    },
    {
      name: 'practitioners',
      title: 'Practitioners',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'name', type: 'string', title: 'Name' },
          { name: 'specialty', type: 'string', title: 'Specialty' },
          { name: 'bio', type: 'text', title: 'Bio' }
        ]
      }]
    }
  ]
}