export default {
  name: 'fitnessEvent',
  title: 'Fitness Event',
  type: 'document',
  fields: [
    // Core Info
    {
      name: 'title',
      title: 'Event Title',
      type: 'string',
      validation: Rule => Rule.required().min(5).max(100)
    },
    // Slug is hidden — auto-generated upon publication via the admin API
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      hidden: true
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
          { title: 'Yoga Retreat', value: 'yoga_retreat' },
          { title: 'Wellness Expo', value: 'wellness_expo' },
          { title: 'Beach Workout', value: 'beach_workout' },
          { title: 'Group Fitness Class', value: 'group_class' },
          { title: 'Sports Tournament', value: 'tournament' },
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
    // Date and Time
    {
      name: 'startDate',
      title: 'Start Date & Time',
      type: 'datetime',
      validation: Rule => Rule.required()
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
    // Location
    {
      name: 'location',
      title: 'Event Location',
      type: 'object',
      fields: [
        { name: 'venueName', type: 'string', title: 'Venue Name' },
        { name: 'address', type: 'string', title: 'Address' }
      ]
    },
    // Pricing
    {
      name: 'price',
      title: 'Price (BSD)',
      type: 'number',
      description: 'Entry price in Bahamian dollars. Leave empty or set to 0 for free events.',
      validation: Rule => Rule.min(0)
    },
    // Race Categories (for race-type events)
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
    // Organizer
    {
      name: 'organizer',
      title: 'Organizer',
      type: 'reference',
      to: [{ type: 'user' }],
      validation: Rule => Rule.required()
    },
    // Sponsors
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
    // Amenities
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
        yoga_retreat: 'Yoga Retreat',
        wellness_expo: 'Wellness Expo',
        beach_workout: 'Beach Workout',
        group_class: 'Group Fitness Class',
        tournament: 'Sports Tournament',
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
