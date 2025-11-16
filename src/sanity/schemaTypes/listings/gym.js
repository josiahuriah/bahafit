export default {
  name: 'gym',
  title: 'Gym',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Gym Name',
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
      name: 'description',
      title: 'Description',
      type: 'blockContent'
    },
    {
      name: 'owner',
      title: 'Owner',
      type: 'reference',
      to: [{ type: 'user' }]
    },
    {
      name: 'location',
      title: 'Location',
      type: 'object',
      fields: [
        { name: 'address', type: 'string', title: 'Address' },
        { name: 'city', type: 'string', title: 'City' },
        { name: 'island', type: 'string', title: 'Island' },
        { name: 'latitude', type: 'number', title: 'Latitude' },
        { name: 'longitude', type: 'number', title: 'Longitude' }
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
        { name: 'facebook', type: 'url', title: 'Facebook' },
        { name: 'instagram', type: 'url', title: 'Instagram' }
      ]
    },
    {
      name: 'hours',
      title: 'Operating Hours',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'day', type: 'string', title: 'Day' },
          { name: 'open', type: 'string', title: 'Opening Time' },
          { name: 'close', type: 'string', title: 'Closing Time' },
          { name: 'closed', type: 'boolean', title: 'Closed' }
        ]
      }]
    },
    {
      name: 'amenities',
      title: 'Amenities',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Free Weights', value: 'free_weights' },
          { title: 'Cardio Equipment', value: 'cardio' },
          { title: 'Group Classes', value: 'group_classes' },
          { title: 'Personal Training', value: 'personal_training' },
          { title: 'Locker Rooms', value: 'lockers' },
          { title: 'Showers', value: 'showers' },
          { title: 'Parking', value: 'parking' },
          { title: 'WiFi', value: 'wifi' },
          { title: 'Sauna', value: 'sauna' },
          { title: 'Pool', value: 'pool' }
        ]
      }
    },
    {
      name: 'membership',
      title: 'Membership Plans',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'name', type: 'string', title: 'Plan Name' },
          { name: 'price', type: 'number', title: 'Price' },
          { name: 'period', type: 'string', title: 'Period', options: {
            list: ['day', 'week', 'month', 'year']
          }},
          { name: 'features', type: 'array', of: [{ type: 'string' }] }
        ]
      }]
    },
    {
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }]
    },
    {
      name: 'featured',
      title: 'Featured Listing',
      type: 'boolean',
      initialValue: false
    },
    {
      name: 'verified',
      title: 'Verified',
      type: 'boolean',
      initialValue: false
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Published', value: 'published' },
          { title: 'Archived', value: 'archived' }
        ]
      }
    }
  ]
}