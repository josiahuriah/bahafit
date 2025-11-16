import { defineType } from 'sanity'

export default defineType({
  name: 'fitnessEquipment',
  title: 'Fitness Equipment',
  type: 'document',
  fields: [
    // Similar structure to fitnessApparel
    {
      name: 'equipmentTypes',
      title: 'Equipment Types',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Cardio Equipment', value: 'cardio' },
          { title: 'Strength Equipment', value: 'strength' },
          { title: 'Free Weights', value: 'free_weights' },
          { title: 'Accessories', value: 'accessories' },
          { title: 'Home Gym', value: 'home_gym' },
          { title: 'Commercial Gym', value: 'commercial' }
        ]
      }
    },
    {
      name: 'services',
      title: 'Services',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Sales', value: 'sales' },
          { title: 'Rental', value: 'rental' },
          { title: 'Repairs', value: 'repairs' },
          { title: 'Maintenance', value: 'maintenance' },
          { title: 'Installation', value: 'installation' }
        ]
      }
    }
  ]
})
