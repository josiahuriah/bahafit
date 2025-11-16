import { defineType } from 'sanity'

export default defineType({
  name: 'raceEvent',
  title: 'Race Event',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Event Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' }
    },
    {
      name: 'description',
      title: 'Description',
      type: 'blockContent'
    },
    {
      name: 'eventType',
      title: 'Event Type',
      type: 'string',
      options: {
        list: [
          { title: '5K', value: '5k' },
          { title: '10K', value: '10k' },
          { title: 'Half Marathon', value: 'half_marathon' },
          { title: 'Full Marathon', value: 'full_marathon' },
          { title: 'Trail Run', value: 'trail_run' }
        ]
      }
    },
    {
      name: 'date',
      title: 'Event Date',
      type: 'datetime',
      validation: Rule => Rule.required()
    },
    {
      name: 'registrationDeadline',
      title: 'Registration Deadline',
      type: 'datetime'
    },
    {
      name: 'location',
      title: 'Location',
      type: 'object',
      fields: [
        { name: 'name', type: 'string', title: 'Venue Name' },
        { name: 'address', type: 'string', title: 'Address' },
        { name: 'city', type: 'string', title: 'City' },
        { name: 'island', type: 'string', title: 'Island' },
        { name: 'latitude', type: 'number', title: 'Latitude' },
        { name: 'longitude', type: 'number', title: 'Longitude' }
      ]
    },
    {
      name: 'pricing',
      title: 'Pricing',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'category', type: 'string', title: 'Category' },
          { name: 'price', type: 'number', title: 'Price' },
          { name: 'currency', type: 'string', title: 'Currency', initialValue: 'USD' }
        ]
      }]
    },
    {
      name: 'capacity',
      title: 'Maximum Capacity',
      type: 'number'
    },
    {
      name: 'images',
      title: 'Event Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }]
    },
    {
      name: 'organizer',
      title: 'Organizer',
      type: 'reference',
      to: [{ type: 'user' }]
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Published', value: 'published' },
          { title: 'Cancelled', value: 'cancelled' },
          { title: 'Completed', value: 'completed' }
        ]
      }
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }]
    },
    {
      name: 'externalTicketUrl',
      title: 'External Ticket URL',
      type: 'url'
    }
  ]
})
