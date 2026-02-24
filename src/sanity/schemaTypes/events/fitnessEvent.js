export default {
  name: 'fitnessEvent',
  title: 'Fitness Event',
  type: 'document',
  groups: [
    { name: 'core', title: 'Core Info', default: true },
    { name: 'datetime', title: 'Date & Time' },
    { name: 'location', title: 'Location' },
    { name: 'registration', title: 'Registration & Pricing' },
    { name: 'details', title: 'Details' },
    { name: 'media', title: 'Media' },
    { name: 'admin', title: 'Admin' },
  ],
  fields: [
    // ── Core Info ──
    {
      name: 'title',
      title: 'Event Title',
      type: 'string',
      group: 'core',
      validation: (Rule) => Rule.required().min(5).max(100),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'core',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'eventType',
      title: 'Event Type',
      type: 'string',
      group: 'core',
      validation: (Rule) => Rule.required(),
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
          { title: 'Other', value: 'other' },
        ],
      },
    },
    {
      name: 'description',
      title: 'Description',
      type: 'blockContent',
      group: 'core',
    },
    {
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      group: 'core',
      rows: 3,
      validation: (Rule) => Rule.max(300),
      description: 'Brief summary for cards and previews (max 300 characters)',
    },
    {
      name: 'organizer',
      title: 'Organizer',
      type: 'reference',
      to: [{ type: 'user' }],
      group: 'core',
    },

    // ── Date & Time ──
    {
      name: 'startDate',
      title: 'Start Date & Time',
      type: 'datetime',
      group: 'datetime',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'endDate',
      title: 'End Date & Time',
      type: 'datetime',
      group: 'datetime',
    },
    {
      name: 'isMultiDay',
      title: 'Multi-Day Event',
      type: 'boolean',
      group: 'datetime',
      initialValue: false,
    },
    {
      name: 'registrationStartDate',
      title: 'Registration Opens',
      type: 'datetime',
      group: 'datetime',
    },
    {
      name: 'registrationDeadline',
      title: 'Registration Deadline',
      type: 'datetime',
      group: 'datetime',
    },
    {
      name: 'earlyBirdDeadline',
      title: 'Early Bird Deadline',
      type: 'datetime',
      group: 'datetime',
      description: 'Pricing reverts to standard after this date',
    },

    // ── Location ──
    {
      name: 'isVirtual',
      title: 'Virtual Event',
      type: 'boolean',
      group: 'location',
      initialValue: false,
    },
    {
      name: 'virtualEventLink',
      title: 'Virtual Event Link',
      type: 'url',
      group: 'location',
      hidden: ({ document }) => !document?.isVirtual,
    },
    {
      name: 'virtualEventPlatform',
      title: 'Virtual Platform',
      type: 'string',
      group: 'location',
      hidden: ({ document }) => !document?.isVirtual,
      options: {
        list: ['Zoom', 'Google Meet', 'YouTube Live', 'Facebook Live', 'Other'],
      },
    },
    {
      name: 'location',
      title: 'Event Location',
      type: 'object',
      group: 'location',
      hidden: ({ document }) => document?.isVirtual === true,
      fields: [
        { name: 'venueName', type: 'string', title: 'Venue Name' },
        { name: 'address', type: 'string', title: 'Address' },
        { name: 'city', type: 'string', title: 'City' },
        {
          name: 'island',
          type: 'string',
          title: 'Island',
          options: {
            list: [
              'New Providence',
              'Grand Bahama',
              'Abaco',
              'Eleuthera',
              'Exuma',
              'Andros',
              'Bimini',
              'Long Island',
              'Cat Island',
              'San Salvador',
              'Other',
            ],
          },
        },
        { name: 'country', type: 'string', title: 'Country', initialValue: 'Bahamas' },
        { name: 'directions', type: 'text', title: 'Directions / Notes', rows: 2 },
      ],
    },

    // ── Registration & Pricing ──
    {
      name: 'requiresRegistration',
      title: 'Requires Registration',
      type: 'boolean',
      group: 'registration',
      initialValue: true,
    },
    {
      name: 'capacity',
      title: 'Capacity',
      type: 'number',
      group: 'registration',
      description: 'Leave blank for unlimited',
      validation: (Rule) => Rule.min(0),
    },
    {
      name: 'currentRegistrations',
      title: 'Current Registrations',
      type: 'number',
      group: 'registration',
      initialValue: 0,
      readOnly: true,
    },
    {
      name: 'waitlistEnabled',
      title: 'Enable Waitlist',
      type: 'boolean',
      group: 'registration',
      initialValue: false,
    },
    {
      name: 'isFree',
      title: 'Free Event',
      type: 'boolean',
      group: 'registration',
      initialValue: true,
      description: 'Toggle off to set pricing tiers',
    },
    {
      name: 'pricing',
      title: 'Pricing Tiers',
      type: 'array',
      group: 'registration',
      hidden: ({ document }) => document?.isFree === true,
      of: [
        {
          type: 'object',
          fields: [
            { name: 'tierName', type: 'string', title: 'Tier Name', validation: (Rule) => Rule.required() },
            { name: 'description', type: 'string', title: 'Description' },
            { name: 'price', type: 'number', title: 'Price', validation: (Rule) => Rule.required().min(0) },
            {
              name: 'currency',
              type: 'string',
              title: 'Currency',
              initialValue: 'BSD',
              options: { list: ['BSD', 'USD'] },
            },
            { name: 'earlyBirdPrice', type: 'number', title: 'Early Bird Price' },
            { name: 'capacity', type: 'number', title: 'Tier Capacity' },
            { name: 'includes', type: 'array', of: [{ type: 'string' }], title: "What's Included" },
          ],
          preview: {
            select: { title: 'tierName', price: 'price', currency: 'currency' },
            prepare({ title, price, currency }) {
              return { title, subtitle: `${currency || 'BSD'} ${price || 0}` }
            },
          },
        },
      ],
    },
    {
      name: 'externalRegistrationUrl',
      title: 'External Registration URL',
      type: 'url',
      group: 'registration',
      description: 'Link to external registration (if not using platform registration)',
    },

    // ── Details ──
    {
      name: 'raceCategories',
      title: 'Race Categories',
      type: 'array',
      group: 'details',
      hidden: ({ document }) =>
        !['race', 'marathon', 'triathlon', 'cycling', 'swimming'].includes(document?.eventType),
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', type: 'string', title: 'Category Name' },
            { name: 'distance', type: 'string', title: 'Distance' },
            { name: 'startTime', type: 'string', title: 'Start Time' },
            { name: 'ageGroups', type: 'array', of: [{ type: 'string' }], title: 'Age Groups' },
          ],
        },
      ],
    },
    {
      name: 'requirements',
      title: 'Requirements / What to Bring',
      type: 'array',
      group: 'details',
      of: [{ type: 'string' }],
    },
    {
      name: 'amenities',
      title: 'Amenities Provided',
      type: 'array',
      group: 'details',
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
          { title: 'Certificate', value: 'certificate' },
        ],
      },
    },
    {
      name: 'ageRestriction',
      title: 'Age Restriction',
      type: 'object',
      group: 'details',
      fields: [
        { name: 'minAge', type: 'number', title: 'Minimum Age' },
        { name: 'maxAge', type: 'number', title: 'Maximum Age' },
        {
          name: 'allowMinorsWithGuardian',
          type: 'boolean',
          title: 'Allow Minors with Guardian',
          initialValue: false,
        },
      ],
    },
    {
      name: 'schedule',
      title: 'Event Schedule',
      type: 'array',
      group: 'details',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'time', type: 'string', title: 'Time' },
            { name: 'activity', type: 'string', title: 'Activity' },
            { name: 'description', type: 'string', title: 'Description' },
            { name: 'location', type: 'string', title: 'Location / Area' },
          ],
          preview: {
            select: { title: 'activity', time: 'time' },
            prepare({ title, time }) {
              return { title, subtitle: time }
            },
          },
        },
      ],
    },
    {
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      group: 'details',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'question', type: 'string', title: 'Question' },
            { name: 'answer', type: 'text', title: 'Answer', rows: 3 },
          ],
          preview: {
            select: { title: 'question' },
          },
        },
      ],
    },
    {
      name: 'contactInfo',
      title: 'Contact Information',
      type: 'object',
      group: 'details',
      fields: [
        { name: 'email', type: 'string', title: 'Email' },
        { name: 'phone', type: 'string', title: 'Phone' },
        { name: 'whatsapp', type: 'string', title: 'WhatsApp' },
      ],
    },
    {
      name: 'sponsors',
      title: 'Sponsors',
      type: 'array',
      group: 'details',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', type: 'string', title: 'Sponsor Name' },
            { name: 'logo', type: 'image', title: 'Sponsor Logo', options: { hotspot: true } },
            { name: 'website', type: 'url', title: 'Sponsor Website' },
            {
              name: 'tier',
              type: 'string',
              title: 'Sponsorship Tier',
              options: {
                list: [
                  { title: 'Title Sponsor', value: 'title' },
                  { title: 'Gold Sponsor', value: 'gold' },
                  { title: 'Silver Sponsor', value: 'silver' },
                  { title: 'Bronze Sponsor', value: 'bronze' },
                  { title: 'Supporting Sponsor', value: 'supporting' },
                ],
              },
            },
          ],
        },
      ],
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'details',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    },
    {
      name: 'websiteUrl',
      title: 'Event Website',
      type: 'url',
      group: 'details',
    },
    {
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'object',
      group: 'details',
      fields: [
        { name: 'facebook', type: 'url', title: 'Facebook' },
        { name: 'instagram', type: 'url', title: 'Instagram' },
        { name: 'twitter', type: 'url', title: 'Twitter/X' },
      ],
    },

    // ── Media ──
    {
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      group: 'media',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Important for SEO and accessibility',
        },
      ],
    },
    {
      name: 'images',
      title: 'Gallery Images',
      type: 'array',
      group: 'media',
      of: [{ type: 'image', options: { hotspot: true } }],
    },

    // ── Admin ──
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'admin',
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Published', value: 'published' },
          { title: 'Cancelled', value: 'cancelled' },
          { title: 'Completed', value: 'completed' },
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
    },
    {
      name: 'featured',
      title: 'Featured Event',
      type: 'boolean',
      group: 'admin',
      initialValue: false,
      description: 'Show in featured sections',
    },
  ],

  orderings: [
    {
      title: 'Start Date, Newest First',
      name: 'startDateDesc',
      by: [{ field: 'startDate', direction: 'desc' }],
    },
    {
      title: 'Start Date, Oldest First',
      name: 'startDateAsc',
      by: [{ field: 'startDate', direction: 'asc' }],
    },
    {
      title: 'Title A-Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'eventType',
      date: 'startDate',
      media: 'featuredImage',
      status: 'status',
    },
    prepare(selection) {
      const { title, subtitle, date, media, status } = selection
      const eventTypeLabels = {
        race: 'Race/Run',
        marathon: 'Marathon',
        triathlon: 'Triathlon',
        cycling: 'Cycling',
        swimming: 'Swimming',
        competition: 'Competition',
        crossfit: 'CrossFit',
        bodybuilding: 'Bodybuilding',
        challenge: 'Challenge',
        bootcamp: 'Bootcamp',
        yoga_retreat: 'Yoga Retreat',
        wellness_expo: 'Wellness Expo',
        workshop: 'Workshop',
        charity: 'Charity',
        beach_workout: 'Beach Workout',
        group_class: 'Group Class',
        tournament: 'Tournament',
        outdoor_adventure: 'Outdoor Adventure',
        virtual: 'Virtual',
        other: 'Other',
      }
      const formattedDate = date ? new Date(date).toLocaleDateString() : 'No date'
      return {
        title,
        subtitle: `${eventTypeLabels[subtitle] || subtitle || '—'} · ${formattedDate} · ${status || 'draft'}`,
        media,
      }
    },
  },
}
