export default {
  name: 'fitnessApparel',
  title: 'Fitness Apparel',
  type: 'document',
  fields: [
    {
      name: 'storeName',
      title: 'Store Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'storeName' }
    },
    {
      name: 'description',
      title: 'Description',
      type: 'blockContent'
    },
    {
      name: 'storeType',
      title: 'Store Type',
      type: 'string',
      options: {
        list: [
          { title: 'Physical Store', value: 'physical' },
          { title: 'Online Store', value: 'online' },
          { title: 'Both', value: 'both' }
        ]
      }
    },
    {
      name: 'categories',
      title: 'Product Categories',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Athletic Wear', value: 'athletic_wear' },
          { title: 'Gym Wear', value: 'gym_wear' },
          { title: 'Running Gear', value: 'running' },
          { title: 'Yoga Wear', value: 'yoga' },
          { title: 'Swimwear', value: 'swimwear' },
          { title: 'Accessories', value: 'accessories' },
          { title: 'Footwear', value: 'footwear' }
        ]
      }
    },
    {
      name: 'brands',
      title: 'Brands Carried',
      type: 'array',
      of: [{ type: 'string' }]
    },
    {
      name: 'location',
      title: 'Location',
      type: 'object',
      fields: [
        { name: 'address', type: 'string', title: 'Address' },
        { name: 'city', type: 'string', title: 'City' },
        { name: 'island', type: 'string', title: 'Island' }
      ]
    },
    {
      name: 'contact',
      title: 'Contact Information',
      type: 'object',
      fields: [
        { name: 'phone', type: 'string', title: 'Phone' },
        { name: 'email', type: 'string', title: 'Email' },
        { name: 'website', type: 'url', title: 'Website' }
      ]
    },
    {
      name: 'onlineStore',
      title: 'Online Store URL',
      type: 'url'
    },
    {
      name: 'images',
      title: 'Store Images',
      type: 'array',
      of: [{ type: 'image' }]
    }
  ]
}