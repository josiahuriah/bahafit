export default {
  name: 'user',
  title: 'User',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: Rule => Rule.required().email()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' }
    },
    {
      name: 'profileImage',
      title: 'Profile Image',
      type: 'image',
      options: { hotspot: true }
    },
    {
      name: 'userType',
      title: 'User Type',
      type: 'string',
      validation: Rule => Rule.required(),
      options: {
        list: [
          { title: 'Member', value: 'member' },
          { title: 'Trainer', value: 'trainer' },
          { title: 'Business', value: 'business' }
        ],
        layout: 'radio'
      },
      initialValue: 'member'
    },
    {
      name: 'bio',
      title: 'Bio',
      type: 'blockContent'
    },
    {
      name: 'phone',
      title: 'Phone Number',
      type: 'string'
    },
    {
      name: 'location',
      title: 'Location',
      type: 'object',
      fields: [
        { name: 'city', type: 'string', title: 'City' },
        { name: 'island', type: 'string', title: 'Island' },
        { name: 'country', type: 'string', title: 'Country', initialValue: 'Bahamas' }
      ]
    },
    {
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'object',
      fields: [
        { name: 'facebook', type: 'url', title: 'Facebook' },
        { name: 'instagram', type: 'url', title: 'Instagram' },
        { name: 'twitter', type: 'url', title: 'Twitter/X' },
        { name: 'linkedin', type: 'url', title: 'LinkedIn' },
        { name: 'website', type: 'url', title: 'Personal Website' }
      ]
    },
    // Member-specific fields
    {
      name: 'fitnessGoals',
      title: 'Fitness Goals',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Weight Loss', value: 'weight_loss' },
          { title: 'Muscle Building', value: 'muscle_building' },
          { title: 'Endurance', value: 'endurance' },
          { title: 'Flexibility', value: 'flexibility' },
          { title: 'General Fitness', value: 'general_fitness' },
          { title: 'Sports Performance', value: 'sports_performance' },
          { title: 'Rehabilitation', value: 'rehabilitation' },
          { title: 'Stress Relief', value: 'stress_relief' }
        ]
      },
      hidden: ({ document }) => document?.userType !== 'member'
    },
    {
      name: 'fitnessLevel',
      title: 'Fitness Level',
      type: 'string',
      options: {
        list: [
          { title: 'Beginner', value: 'beginner' },
          { title: 'Intermediate', value: 'intermediate' },
          { title: 'Advanced', value: 'advanced' },
          { title: 'Professional', value: 'professional' }
        ]
      },
      hidden: ({ document }) => document?.userType !== 'member'
    },
    {
      name: 'preferredActivities',
      title: 'Preferred Activities',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Running', value: 'running' },
          { title: 'Swimming', value: 'swimming' },
          { title: 'Cycling', value: 'cycling' },
          { title: 'Weight Training', value: 'weight_training' },
          { title: 'Yoga', value: 'yoga' },
          { title: 'CrossFit', value: 'crossfit' },
          { title: 'Martial Arts', value: 'martial_arts' },
          { title: 'Group Classes', value: 'group_classes' },
          { title: 'Outdoor Activities', value: 'outdoor' },
          { title: 'Dance Fitness', value: 'dance_fitness' }
        ]
      },
      hidden: ({ document }) => document?.userType !== 'member'
    },
    // Trainer-specific fields
    {
      name: 'specializations',
      title: 'Specializations',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Personal Training', value: 'personal_training' },
          { title: 'Strength & Conditioning', value: 'strength_conditioning' },
          { title: 'Weight Loss', value: 'weight_loss' },
          { title: 'Sports Performance', value: 'sports_performance' },
          { title: 'Yoga', value: 'yoga' },
          { title: 'Pilates', value: 'pilates' },
          { title: 'CrossFit', value: 'crossfit' },
          { title: 'HIIT', value: 'hiit' },
          { title: 'Nutrition Coaching', value: 'nutrition' },
          { title: 'Rehabilitation', value: 'rehabilitation' },
          { title: 'Senior Fitness', value: 'senior_fitness' },
          { title: 'Pre/Postnatal', value: 'prenatal_postnatal' },
          { title: 'Swimming', value: 'swimming' },
          { title: 'Martial Arts', value: 'martial_arts' },
          { title: 'Dance Fitness', value: 'dance_fitness' }
        ]
      },
      hidden: ({ document }) => document?.userType !== 'trainer'
    },
    {
      name: 'certifications',
      title: 'Certifications',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'name', type: 'string', title: 'Certification Name', validation: Rule => Rule.required() },
          { name: 'organization', type: 'string', title: 'Issuing Organization' },
          { name: 'year', type: 'number', title: 'Year Obtained' },
          { name: 'expiryDate', type: 'date', title: 'Expiry Date' },
          { name: 'certificateImage', type: 'image', title: 'Certificate Image', options: { hotspot: true } }
        ],
        preview: {
          select: {
            title: 'name',
            subtitle: 'organization'
          }
        }
      }],
      hidden: ({ document }) => document?.userType !== 'trainer'
    },
    {
      name: 'experience',
      title: 'Years of Experience',
      type: 'number',
      validation: Rule => Rule.min(0).max(50),
      hidden: ({ document }) => document?.userType !== 'trainer'
    },
    {
      name: 'hourlyRate',
      title: 'Hourly Rate',
      type: 'object',
      fields: [
        { name: 'amount', type: 'number', title: 'Amount' },
        { name: 'currency', type: 'string', title: 'Currency', initialValue: 'BSD' }
      ],
      hidden: ({ document }) => document?.userType !== 'trainer'
    },
    {
      name: 'availability',
      title: 'Availability',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {
            name: 'day',
            type: 'string',
            title: 'Day',
            options: {
              list: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
            }
          },
          { name: 'startTime', type: 'string', title: 'Start Time' },
          { name: 'endTime', type: 'string', title: 'End Time' },
          { name: 'available', type: 'boolean', title: 'Available', initialValue: true }
        ]
      }],
      hidden: ({ document }) => document?.userType !== 'trainer'
    },
    {
      name: 'trainingLocations',
      title: 'Training Locations',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'At Client Location', value: 'client_location' },
          { title: 'At Gym', value: 'gym' },
          { title: 'Online/Virtual', value: 'online' },
          { title: 'Outdoors', value: 'outdoors' },
          { title: 'Home Studio', value: 'home_studio' }
        ]
      },
      hidden: ({ document }) => document?.userType !== 'trainer'
    },
    // Business-specific fields
    {
      name: 'businessName',
      title: 'Business Name',
      type: 'string',
      hidden: ({ document }) => document?.userType !== 'business'
    },
    {
      name: 'businessType',
      title: 'Business Type',
      type: 'string',
      options: {
        list: [
          { title: 'Gym/Fitness Center', value: 'gym' },
          { title: 'Wellness Center/Spa', value: 'wellness_center' },
          { title: 'Sports Club', value: 'sports_club' },
          { title: 'Yoga/Pilates Studio', value: 'yoga_studio' },
          { title: 'CrossFit Box', value: 'crossfit_box' },
          { title: 'Martial Arts Academy', value: 'martial_arts' },
          { title: 'Dance Studio', value: 'dance_studio' },
          { title: 'Swimming/Aquatics Center', value: 'aquatics' },
          { title: 'Fitness Equipment Retailer', value: 'equipment_retailer' },
          { title: 'Fitness Apparel Brand', value: 'apparel_brand' },
          { title: 'Supplement Store', value: 'supplement_store' },
          { title: 'Event Organizer', value: 'event_organizer' },
          { title: 'Other', value: 'other' }
        ]
      },
      hidden: ({ document }) => document?.userType !== 'business'
    },
    {
      name: 'businessAddress',
      title: 'Business Address',
      type: 'object',
      fields: [
        { name: 'street', type: 'string', title: 'Street Address' },
        { name: 'city', type: 'string', title: 'City' },
        { name: 'island', type: 'string', title: 'Island' },
        { name: 'postalCode', type: 'string', title: 'Postal Code' },
        { name: 'country', type: 'string', title: 'Country', initialValue: 'Bahamas' },
        { name: 'latitude', type: 'number', title: 'Latitude' },
        { name: 'longitude', type: 'number', title: 'Longitude' }
      ],
      hidden: ({ document }) => document?.userType !== 'business'
    },
    {
      name: 'businessHours',
      title: 'Business Hours',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {
            name: 'day',
            type: 'string',
            title: 'Day',
            options: {
              list: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
            }
          },
          { name: 'open', type: 'string', title: 'Opening Time' },
          { name: 'close', type: 'string', title: 'Closing Time' },
          { name: 'closed', type: 'boolean', title: 'Closed', initialValue: false }
        ]
      }],
      hidden: ({ document }) => document?.userType !== 'business'
    },
    {
      name: 'businessLicense',
      title: 'Business License Number',
      type: 'string',
      hidden: ({ document }) => document?.userType !== 'business'
    },
    {
      name: 'taxId',
      title: 'Tax ID / VAT Number',
      type: 'string',
      hidden: ({ document }) => document?.userType !== 'business'
    },
    // Common fields for all user types
    {
      name: 'isVerified',
      title: 'Verified Account',
      type: 'boolean',
      initialValue: false,
      description: 'Whether the user has been verified by admin'
    },
    {
      name: 'isActive',
      title: 'Active Account',
      type: 'boolean',
      initialValue: true
    },
    {
      name: 'canCreateEvents',
      title: 'Can Create Events',
      type: 'boolean',
      initialValue: true,
      description: 'Allow this user to create fitness events'
    },
    {
      name: 'canCreateListings',
      title: 'Can Create Listings',
      type: 'boolean',
      initialValue: true,
      description: 'Allow this user to create fitness listings'
    },
    {
      name: 'memberSince',
      title: 'Member Since',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    },
    {
      name: 'lastLogin',
      title: 'Last Login',
      type: 'datetime'
    },
    {
      name: 'notificationPreferences',
      title: 'Notification Preferences',
      type: 'object',
      fields: [
        { name: 'emailNotifications', type: 'boolean', title: 'Email Notifications', initialValue: true },
        { name: 'smsNotifications', type: 'boolean', title: 'SMS Notifications', initialValue: false },
        { name: 'marketingEmails', type: 'boolean', title: 'Marketing Emails', initialValue: false },
        { name: 'eventReminders', type: 'boolean', title: 'Event Reminders', initialValue: true }
      ]
    }
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'userType',
      media: 'profileImage'
    },
    prepare(selection) {
      const { title, subtitle, media } = selection
      const userTypeLabels = {
        member: 'Member',
        trainer: 'Trainer',
        business: 'Business'
      }
      return {
        title,
        subtitle: userTypeLabels[subtitle] || subtitle,
        media
      }
    }
  }
}
