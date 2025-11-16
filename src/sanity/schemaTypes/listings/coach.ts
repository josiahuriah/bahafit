import { defineType } from 'sanity'

export default defineType({
  name: 'coach',
  title: 'Coach/Trainer',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Coach Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' }
    },
    {
      name: 'bio',
      title: 'Biography',
      type: 'blockContent'
    },
    {
      name: 'profileImage',
      title: 'Profile Image',
      type: 'image',
      options: { hotspot: true }
    },
    {
      name: 'specializations',
      title: 'Specializations',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Personal Training', value: 'personal_training' },
          { title: 'Strength Training', value: 'strength' },
          { title: 'Weight Loss', value: 'weight_loss' },
          { title: 'Nutrition', value: 'nutrition' },
          { title: 'Yoga', value: 'yoga' },
          { title: 'Pilates', value: 'pilates' },
          { title: 'CrossFit', value: 'crossfit' },
          { title: 'Sports Specific', value: 'sports_specific' }
        ]
      }
    },
    {
      name: 'certifications',
      title: 'Certifications',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'name', type: 'string', title: 'Certification Name' },
          { name: 'organization', type: 'string', title: 'Certifying Organization' },
          { name: 'year', type: 'number', title: 'Year Obtained' }
        ]
      }]
    },
    {
      name: 'experience',
      title: 'Years of Experience',
      type: 'number'
    },
    {
      name: 'services',
      title: 'Services Offered',
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
      name: 'availability',
      title: 'Availability',
      type: 'object',
      fields: [
        { name: 'inPerson', type: 'boolean', title: 'In-Person Training' },
        { name: 'online', type: 'boolean', title: 'Online Training' },
        { name: 'locations', type: 'array', of: [{ type: 'string' }], title: 'Service Locations' }
      ]
    },
    {
      name: 'contact',
      title: 'Contact Information',
      type: 'object',
      fields: [
        { name: 'phone', type: 'string', title: 'Phone' },
        { name: 'email', type: 'string', title: 'Email' },
        { name: 'website', type: 'url', title: 'Website' },
        { name: 'instagram', type: 'url', title: 'Instagram' }
      ]
    }
  ]
})
