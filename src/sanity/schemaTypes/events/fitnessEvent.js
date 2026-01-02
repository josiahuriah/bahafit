export default {
  name: 'fitnessEvent',
  title: 'Fitness Event',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Event Title',
      type: 'string',
      validation: Rule => Rule.required().min(5).max(100)
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: Rule => Rule.required()
    },
    {
      name: 'eventType',
      title: 'Event Type',
      type: 'string',
      validation: Rule => Rule.required(),
      options: {
        list: [
          { title: 'Race/Run', value: 'race' },
          { title: 'Marathon', value: 'marathon' },
          { title: 'Triathlon', value: 'triathlon' },
          { title: 'Cycling Event', value: 'cycling' },
          { title: 'Swimming Event', value: 'swimming' },
          { title: 'Fitness Competition', value: 'competition' },
          { title: 'CrossFit Competition', value: 'crossfit' },
          { title: 'Bodybuilding Show', value: 'bodybuilding' },
          { title: 'Fitness Challenge', value: 'challenge' },
          { title: 'Bootcamp', value: 'bootcamp' },
          { title: 'Yoga Retreat', value: 'yoga_retreat' },
          { title: 'Wellness Expo', value: 'wellness_expo' },
          { title: 'Fitness Workshop', value: 'workshop' },
          { title: 'Charity Event', value: 'charity' },
          { title: 'Beach Workout', value: 'beach_workout' },
          { title: 'Group Fitness Class', value: 'group_class' },
          { title: 'Sports Tournament', value: 'tournament' },
          { title: 'Outdoor Adventure', value: 'outdoor_adventure' },
          { title: 'Virtual Event', value: 'virtual' },
          { title: 'Other', value: 'other' }
        ]
      }
    },
    {
      name: 'description',
      title: 'Description',
      type: 'blockContent'
    },
    {
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      validation: Rule => Rule.max(300),
      description: 'A brief description for event cards and previews (max 300 characters)'
    },
    {
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Important for SEO and accessibility'
        }
      ]
    },
    {
      name: 'images',
      title: 'Gallery Images',
      type: 'array',
      of: [{
        type: 'image',
        options: { hotspot: true },
        fields: [
          { name: 'alt', type: 'string', title: 'Alternative Text' },
          { name: 'caption', type: 'string', title: 'Caption' }
        ]
      }]
    },
    // Date and Time
    {
      name: 'startDate',
      title: 'Start Date & Time',
      type: 'datetime',
      validation: Rule => Rule.required()
    },
    {
      name: 'endDate',
      title: 'End Date & Time',
      type: 'datetime',
      description: 'Leave empty for single-day events'
    },
    {
      name: 'isMultiDay',
      title: 'Multi-Day Event',
      type: 'boolean',
      initialValue: false
    },
    {
      name: 'registrationStartDate',
      title: 'Registration Opens',
      type: 'datetime'
    },
    {
      name: 'registrationDeadline',
      title: 'Registration Deadline',
      type: 'datetime'
    },
    {
      name: 'earlyBirdDeadline',
      title: 'Early Bird Deadline',
      type: 'datetime',
      description: 'Deadline for early bird pricing'
    },
    // Location
    {
      name: 'isVirtual',
      title: 'Virtual Event',
      type: 'boolean',
      initialValue: false
    },
    {
      name: 'virtualEventLink',
      title: 'Virtual Event Link',
      type: 'url',
      hidden: ({ document }) => !document?.isVirtual
    },
    {
      name: 'virtualEventPlatform',
      title: 'Virtual Platform',
      type: 'string',
      options: {
        list: [
          { title: 'Zoom', value: 'zoom' },
          { title: 'Google Meet', value: 'google_meet' },
          { title: 'Microsoft Teams', value: 'teams' },
          { title: 'YouTube Live', value: 'youtube' },
          { title: 'Facebook Live', value: 'facebook' },
          { title: 'Instagram Live', value: 'instagram' },
          { title: 'Custom Platform', value: 'custom' },
          { title: 'Other', value: 'other' }
        ]
      },
      hidden: ({ document }) => !document?.isVirtual
    },
    {
      name: 'location',
      title: 'Event Location',
      type: 'object',
      hidden: ({ document }) => document?.isVirtual === true,
      fields: [
        { name: 'venueName', type: 'string', title: 'Venue Name' },
        { name: 'address', type: 'string', title: 'Street Address' },
        { name: 'city', type: 'string', title: 'City' },
        { name: 'island', type: 'string', title: 'Island' },
        { name: 'country', type: 'string', title: 'Country', initialValue: 'Bahamas' },
        { name: 'postalCode', type: 'string', title: 'Postal Code' },
        { name: 'latitude', type: 'number', title: 'Latitude' },
        { name: 'longitude', type: 'number', title: 'Longitude' },
        { name: 'directions', type: 'text', title: 'Directions/Notes', rows: 3 }
      ]
    },
    // Capacity and Registration
    {
      name: 'capacity',
      title: 'Maximum Capacity',
      type: 'number',
      validation: Rule => Rule.min(1),
      description: 'Maximum number of participants'
    },
    {
      name: 'currentRegistrations',
      title: 'Current Registrations',
      type: 'number',
      initialValue: 0,
      readOnly: true
    },
    {
      name: 'waitlistEnabled',
      title: 'Enable Waitlist',
      type: 'boolean',
      initialValue: false
    },
    {
      name: 'requiresRegistration',
      title: 'Requires Registration',
      type: 'boolean',
      initialValue: true
    },
    // Pricing
    {
      name: 'isFree',
      title: 'Free Event',
      type: 'boolean',
      initialValue: false
    },
    {
      name: 'pricing',
      title: 'Pricing Tiers',
      type: 'array',
      hidden: ({ document }) => document?.isFree === true,
      of: [{
        type: 'object',
        fields: [
          { name: 'tierName', type: 'string', title: 'Tier Name', validation: Rule => Rule.required() },
          { name: 'description', type: 'string', title: 'Description' },
          { name: 'price', type: 'number', title: 'Price', validation: Rule => Rule.required().min(0) },
          { name: 'earlyBirdPrice', type: 'number', title: 'Early Bird Price' },
          { name: 'currency', type: 'string', title: 'Currency', initialValue: 'BSD' },
          { name: 'capacity', type: 'number', title: 'Tier Capacity' },
          { name: 'includes', type: 'array', of: [{ type: 'string' }], title: 'Includes' }
        ],
        preview: {
          select: {
            title: 'tierName',
            price: 'price',
            currency: 'currency'
          },
          prepare({ title, price, currency }) {
            return {
              title,
              subtitle: `${currency || 'BSD'} ${price}`
            }
          }
        }
      }]
    },
    // Categories for race events
    {
      name: 'raceCategories',
      title: 'Race Categories',
      type: 'array',
      description: 'For race events, define distance categories',
      of: [{
        type: 'object',
        fields: [
          { name: 'name', type: 'string', title: 'Category Name' },
          { name: 'distance', type: 'string', title: 'Distance' },
          { name: 'startTime', type: 'string', title: 'Start Time' },
          { name: 'ageGroups', type: 'array', of: [{ type: 'string' }], title: 'Age Groups' }
        ]
      }],
      hidden: ({ document }) => !['race', 'marathon', 'triathlon', 'cycling', 'swimming'].includes(document?.eventType)
    },
    // Organizer Info
    {
      name: 'organizer',
      title: 'Organizer',
      type: 'reference',
      to: [{ type: 'user' }],
      validation: Rule => Rule.required()
    },
    {
      name: 'coOrganizers',
      title: 'Co-Organizers',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'user' }] }]
    },
    {
      name: 'contactInfo',
      title: 'Contact Information',
      type: 'object',
      fields: [
        { name: 'email', type: 'string', title: 'Contact Email' },
        { name: 'phone', type: 'string', title: 'Contact Phone' },
        { name: 'whatsapp', type: 'string', title: 'WhatsApp Number' }
      ]
    },
    // Sponsors and Partners
    {
      name: 'sponsors',
      title: 'Sponsors',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'name', type: 'string', title: 'Sponsor Name' },
          { name: 'logo', type: 'image', title: 'Sponsor Logo', options: { hotspot: true } },
          { name: 'website', type: 'url', title: 'Sponsor Website' },
          { name: 'tier', type: 'string', title: 'Sponsorship Tier', options: {
            list: [
              { title: 'Title Sponsor', value: 'title' },
              { title: 'Gold Sponsor', value: 'gold' },
              { title: 'Silver Sponsor', value: 'silver' },
              { title: 'Bronze Sponsor', value: 'bronze' },
              { title: 'Supporting Sponsor', value: 'supporting' }
            ]
          }}
        ]
      }]
    },
    // Additional Details
    {
      name: 'requirements',
      title: 'Requirements',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'What participants need to bring or requirements'
    },
    {
      name: 'amenities',
      title: 'Amenities Provided',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Water Stations', value: 'water_stations' },
          { title: 'Refreshments', value: 'refreshments' },
          { title: 'T-Shirt', value: 'tshirt' },
          { title: 'Medal/Trophy', value: 'medal' },
          { title: 'Goodie Bag', value: 'goodie_bag' },
          { title: 'Parking', value: 'parking' },
          { title: 'Changing Rooms', value: 'changing_rooms' },
          { title: 'First Aid', value: 'first_aid' },
          { title: 'Photography', value: 'photography' },
          { title: 'Live Timing', value: 'live_timing' },
          { title: 'Results Online', value: 'results_online' },
          { title: 'Certificate', value: 'certificate' }
        ]
      }
    },
    {
      name: 'ageRestriction',
      title: 'Age Restriction',
      type: 'object',
      fields: [
        { name: 'minAge', type: 'number', title: 'Minimum Age' },
        { name: 'maxAge', type: 'number', title: 'Maximum Age' },
        { name: 'allowMinorsWithGuardian', type: 'boolean', title: 'Allow Minors with Guardian', initialValue: false }
      ]
    },
    {
      name: 'schedule',
      title: 'Event Schedule',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'time', type: 'string', title: 'Time' },
          { name: 'activity', type: 'string', title: 'Activity' },
          { name: 'description', type: 'string', title: 'Description' },
          { name: 'location', type: 'string', title: 'Location' }
        ]
      }]
    },
    {
      name: 'faqs',
      title: 'Frequently Asked Questions',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'question', type: 'string', title: 'Question' },
          { name: 'answer', type: 'text', title: 'Answer' }
        ]
      }]
    },
    // External Links
    {
      name: 'externalRegistrationUrl',
      title: 'External Registration URL',
      type: 'url',
      description: 'Link to external registration page (if not using platform registration)'
    },
    {
      name: 'websiteUrl',
      title: 'Event Website',
      type: 'url'
    },
    {
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'object',
      fields: [
        { name: 'facebook', type: 'url', title: 'Facebook Event' },
        { name: 'instagram', type: 'url', title: 'Instagram' },
        { name: 'twitter', type: 'url', title: 'Twitter/X' }
      ]
    },
    // SEO and Meta
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' }
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        { name: 'metaTitle', type: 'string', title: 'Meta Title' },
        { name: 'metaDescription', type: 'text', title: 'Meta Description', rows: 3 },
        { name: 'keywords', type: 'array', of: [{ type: 'string' }], title: 'Keywords' }
      ]
    },
    // Status
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      validation: Rule => Rule.required(),
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Pending Review', value: 'pending' },
          { title: 'Published', value: 'published' },
          { title: 'Cancelled', value: 'cancelled' },
          { title: 'Postponed', value: 'postponed' },
          { title: 'Completed', value: 'completed' },
          { title: 'Archived', value: 'archived' }
        ],
        layout: 'radio'
      },
      initialValue: 'draft'
    },
    {
      name: 'featured',
      title: 'Featured Event',
      type: 'boolean',
      initialValue: false,
      description: 'Show this event in featured sections'
    },
    {
      name: 'approvedBy',
      title: 'Approved By',
      type: 'reference',
      to: [{ type: 'user' }],
      hidden: ({ document }) => document?.status !== 'published'
    },
    {
      name: 'approvedAt',
      title: 'Approved At',
      type: 'datetime',
      hidden: ({ document }) => document?.status !== 'published'
    },
    {
      name: 'cancellationReason',
      title: 'Cancellation Reason',
      type: 'text',
      rows: 3,
      hidden: ({ document }) => document?.status !== 'cancelled'
    }
  ],
  orderings: [
    {
      title: 'Start Date, Newest First',
      name: 'startDateDesc',
      by: [{ field: 'startDate', direction: 'desc' }]
    },
    {
      title: 'Start Date, Oldest First',
      name: 'startDateAsc',
      by: [{ field: 'startDate', direction: 'asc' }]
    },
    {
      title: 'Title A-Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }]
    }
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'eventType',
      date: 'startDate',
      media: 'featuredImage',
      status: 'status'
    },
    prepare(selection) {
      const { title, subtitle, date, media, status } = selection
      const eventTypeLabels = {
        race: 'Race/Run',
        marathon: 'Marathon',
        triathlon: 'Triathlon',
        cycling: 'Cycling Event',
        swimming: 'Swimming Event',
        competition: 'Fitness Competition',
        crossfit: 'CrossFit Competition',
        bodybuilding: 'Bodybuilding Show',
        challenge: 'Fitness Challenge',
        bootcamp: 'Bootcamp',
        yoga_retreat: 'Yoga Retreat',
        wellness_expo: 'Wellness Expo',
        workshop: 'Fitness Workshop',
        charity: 'Charity Event',
        beach_workout: 'Beach Workout',
        group_class: 'Group Fitness Class',
        tournament: 'Sports Tournament',
        outdoor_adventure: 'Outdoor Adventure',
        virtual: 'Virtual Event',
        other: 'Other'
      }
      const formattedDate = date ? new Date(date).toLocaleDateString() : 'No date set'
      return {
        title,
        subtitle: `${eventTypeLabels[subtitle] || subtitle} | ${formattedDate} | ${status}`,
        media
      }
    }
  }
}
