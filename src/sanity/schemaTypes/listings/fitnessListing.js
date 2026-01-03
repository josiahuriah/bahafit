export default {
  name: 'fitnessListing',
  title: 'Fitness Listing',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Listing Title',
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
      name: 'listingType',
      title: 'Listing Type',
      type: 'string',
      validation: Rule => Rule.required(),
      options: {
        list: [
          { title: 'Gym/Fitness Center', value: 'gym' },
          { title: 'Personal Trainer', value: 'trainer' },
          { title: 'Fitness Class', value: 'fitness_class' },
          { title: 'Wellness Center/Spa', value: 'wellness_center' },
          { title: 'Yoga/Pilates Studio', value: 'yoga_studio' },
          { title: 'CrossFit Box', value: 'crossfit_box' },
          { title: 'Martial Arts Academy', value: 'martial_arts' },
          { title: 'Dance Studio', value: 'dance_studio' },
          { title: 'Swimming/Aquatics', value: 'aquatics' },
          { title: 'Sports Club', value: 'sports_club' },
          { title: 'Fitness Equipment (For Sale)', value: 'equipment_sale' },
          { title: 'Fitness Equipment (Rental)', value: 'equipment_rental' },
          { title: 'Fitness Apparel', value: 'apparel' },
          { title: 'Supplements/Nutrition', value: 'supplements' },
          { title: 'Nutrition Coaching', value: 'nutrition_coaching' },
          { title: 'Sports Medicine/Physiotherapy', value: 'sports_medicine' },
          { title: 'Massage Therapy', value: 'massage' },
          { title: 'Personal Training Services', value: 'pt_services' },
          { title: 'Group Training', value: 'group_training' },
          { title: 'Online Coaching', value: 'online_coaching' },
          { title: 'Fitness Retreat', value: 'fitness_retreat' },
          { title: 'Sports Facility Rental', value: 'facility_rental' },
          { title: 'Other', value: 'other' }
        ]
      }
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Services', value: 'services' },
          { title: 'Facilities', value: 'facilities' },
          { title: 'Products', value: 'products' },
          { title: 'Classes', value: 'classes' },
          { title: 'Rentals', value: 'rentals' }
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
      description: 'A brief description for listing cards and previews (max 300 characters)'
    },
    // Images
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
    {
      name: 'video',
      title: 'Video',
      type: 'object',
      fields: [
        { name: 'url', type: 'url', title: 'Video URL (YouTube/Vimeo)' },
        { name: 'file', type: 'file', title: 'Video File' }
      ]
    },
    // Owner/Creator
    {
      name: 'owner',
      title: 'Owner',
      type: 'reference',
      to: [{ type: 'user' }],
      validation: Rule => Rule.required()
    },
    // Location
    {
      name: 'hasPhysicalLocation',
      title: 'Has Physical Location',
      type: 'boolean',
      initialValue: true
    },
    {
      name: 'location',
      title: 'Location',
      type: 'object',
      hidden: ({ document }) => document?.hasPhysicalLocation === false,
      fields: [
        { name: 'name', type: 'string', title: 'Location Name' },
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
    {
      name: 'serviceAreas',
      title: 'Service Areas',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Areas where you provide services (for mobile services)',
      hidden: ({ document }) => document?.hasPhysicalLocation === true
    },
    {
      name: 'offersOnlineServices',
      title: 'Offers Online/Virtual Services',
      type: 'boolean',
      initialValue: false
    },
    // Contact Information
    {
      name: 'contact',
      title: 'Contact Information',
      type: 'object',
      fields: [
        { name: 'phone', type: 'string', title: 'Phone' },
        { name: 'alternatePhone', type: 'string', title: 'Alternate Phone' },
        { name: 'email', type: 'string', title: 'Email' },
        { name: 'whatsapp', type: 'string', title: 'WhatsApp' },
        { name: 'website', type: 'url', title: 'Website' }
      ]
    },
    {
      name: 'socialLinks',
      title: 'Social Media',
      type: 'object',
      fields: [
        { name: 'facebook', type: 'url', title: 'Facebook' },
        { name: 'instagram', type: 'url', title: 'Instagram' },
        { name: 'twitter', type: 'url', title: 'Twitter/X' },
        { name: 'youtube', type: 'url', title: 'YouTube' },
        { name: 'tiktok', type: 'url', title: 'TikTok' },
        { name: 'linkedin', type: 'url', title: 'LinkedIn' }
      ]
    },
    // Operating Hours
    {
      name: 'operatingHours',
      title: 'Operating Hours',
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
          { name: 'closed', type: 'boolean', title: 'Closed', initialValue: false },
          { name: 'is24Hours', type: 'boolean', title: '24 Hours', initialValue: false }
        ]
      }]
    },
    {
      name: 'byAppointmentOnly',
      title: 'By Appointment Only',
      type: 'boolean',
      initialValue: false
    },
    // Pricing
    {
      name: 'priceRange',
      title: 'Price Range',
      type: 'string',
      options: {
        list: [
          { title: 'Free', value: 'free' },
          { title: '$', value: 'budget' },
          { title: '$$', value: 'moderate' },
          { title: '$$$', value: 'premium' },
          { title: '$$$$', value: 'luxury' },
          { title: 'Contact for Price', value: 'contact' }
        ]
      }
    },
    {
      name: 'pricing',
      title: 'Pricing Details',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'name', type: 'string', title: 'Service/Product Name', validation: Rule => Rule.required() },
          { name: 'description', type: 'string', title: 'Description' },
          { name: 'price', type: 'number', title: 'Price' },
          { name: 'currency', type: 'string', title: 'Currency', initialValue: 'BSD' },
          { name: 'period', type: 'string', title: 'Period', options: {
            list: [
              { title: 'One Time', value: 'one_time' },
              { title: 'Per Session', value: 'per_session' },
              { title: 'Per Hour', value: 'per_hour' },
              { title: 'Per Day', value: 'per_day' },
              { title: 'Per Week', value: 'per_week' },
              { title: 'Per Month', value: 'per_month' },
              { title: 'Per Year', value: 'per_year' }
            ]
          }},
          { name: 'discountedPrice', type: 'number', title: 'Discounted Price' },
          { name: 'includes', type: 'array', of: [{ type: 'string' }], title: 'Includes' }
        ],
        preview: {
          select: {
            title: 'name',
            price: 'price',
            currency: 'currency',
            period: 'period'
          },
          prepare({ title, price, currency, period }) {
            return {
              title,
              subtitle: price ? `${currency || 'BSD'} ${price}${period ? ` / ${period}` : ''}` : 'Price not set'
            }
          }
        }
      }]
    },
    // Amenities and Features
    {
      name: 'amenities',
      title: 'Amenities',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Free Weights', value: 'free_weights' },
          { title: 'Cardio Equipment', value: 'cardio' },
          { title: 'Weight Machines', value: 'weight_machines' },
          { title: 'Swimming Pool', value: 'pool' },
          { title: 'Sauna', value: 'sauna' },
          { title: 'Steam Room', value: 'steam_room' },
          { title: 'Jacuzzi/Hot Tub', value: 'jacuzzi' },
          { title: 'Locker Rooms', value: 'lockers' },
          { title: 'Showers', value: 'showers' },
          { title: 'Towel Service', value: 'towel_service' },
          { title: 'Parking', value: 'parking' },
          { title: 'Free Parking', value: 'free_parking' },
          { title: 'WiFi', value: 'wifi' },
          { title: 'Air Conditioning', value: 'ac' },
          { title: 'Juice Bar', value: 'juice_bar' },
          { title: 'Pro Shop', value: 'pro_shop' },
          { title: 'Child Care', value: 'childcare' },
          { title: 'Personal Training', value: 'personal_training' },
          { title: 'Group Classes', value: 'group_classes' },
          { title: 'Nutrition Counseling', value: 'nutrition' },
          { title: 'Massage Services', value: 'massage' },
          { title: 'Physical Therapy', value: 'physical_therapy' },
          { title: 'Basketball Court', value: 'basketball' },
          { title: 'Tennis Court', value: 'tennis' },
          { title: 'Racquetball Court', value: 'racquetball' },
          { title: 'Boxing Ring', value: 'boxing_ring' },
          { title: 'CrossFit Equipment', value: 'crossfit_equipment' },
          { title: 'Yoga Studio', value: 'yoga_studio' },
          { title: 'Spinning Studio', value: 'spinning_studio' },
          { title: 'Outdoor Training Area', value: 'outdoor_training' },
          { title: 'Beach Access', value: 'beach_access' },
          { title: 'Wheelchair Accessible', value: 'wheelchair_accessible' }
        ]
      }
    },
    {
      name: 'features',
      title: 'Special Features',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Custom features not in the amenities list'
    },
    // Services Offered
    {
      name: 'servicesOffered',
      title: 'Services Offered',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'name', type: 'string', title: 'Service Name' },
          { name: 'description', type: 'text', title: 'Description', rows: 2 },
          { name: 'duration', type: 'string', title: 'Duration' },
          { name: 'price', type: 'number', title: 'Starting Price' }
        ]
      }]
    },
    // Classes/Programs
    {
      name: 'classSchedule',
      title: 'Class Schedule',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'className', type: 'string', title: 'Class Name' },
          { name: 'instructor', type: 'string', title: 'Instructor' },
          { name: 'day', type: 'string', title: 'Day' },
          { name: 'time', type: 'string', title: 'Time' },
          { name: 'duration', type: 'string', title: 'Duration' },
          { name: 'level', type: 'string', title: 'Level', options: {
            list: ['All Levels', 'Beginner', 'Intermediate', 'Advanced']
          }},
          { name: 'capacity', type: 'number', title: 'Max Capacity' }
        ]
      }],
      hidden: ({ document }) => !['gym', 'fitness_class', 'yoga_studio', 'crossfit_box', 'martial_arts', 'dance_studio', 'aquatics'].includes(document?.listingType)
    },
    // For trainers/coaches
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
          { title: 'Dance Fitness', value: 'dance_fitness' },
          { title: 'Bodybuilding', value: 'bodybuilding' },
          { title: 'Functional Training', value: 'functional' },
          { title: 'Group Fitness', value: 'group_fitness' }
        ]
      },
      hidden: ({ document }) => !['trainer', 'pt_services', 'online_coaching', 'group_training'].includes(document?.listingType)
    },
    {
      name: 'certifications',
      title: 'Certifications',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'name', type: 'string', title: 'Certification Name' },
          { name: 'organization', type: 'string', title: 'Issuing Organization' },
          { name: 'year', type: 'number', title: 'Year' }
        ]
      }],
      hidden: ({ document }) => !['trainer', 'pt_services', 'online_coaching', 'nutrition_coaching', 'sports_medicine', 'massage'].includes(document?.listingType)
    },
    // For products (equipment, apparel, supplements)
    {
      name: 'productDetails',
      title: 'Product Details',
      type: 'object',
      hidden: ({ document }) => !['equipment_sale', 'equipment_rental', 'apparel', 'supplements'].includes(document?.listingType),
      fields: [
        { name: 'brand', type: 'string', title: 'Brand' },
        { name: 'condition', type: 'string', title: 'Condition', options: {
          list: ['New', 'Like New', 'Good', 'Fair', 'Used']
        }},
        { name: 'quantity', type: 'number', title: 'Quantity Available' },
        { name: 'sku', type: 'string', title: 'SKU/Product Code' },
        { name: 'specifications', type: 'array', of: [{
          type: 'object',
          fields: [
            { name: 'name', type: 'string', title: 'Specification' },
            { name: 'value', type: 'string', title: 'Value' }
          ]
        }]}
      ]
    },
    // Reviews
    {
      name: 'totalReviews',
      title: 'Total Reviews',
      type: 'number',
      readOnly: true,
      initialValue: 0
    },
    // Policies
    {
      name: 'policies',
      title: 'Policies',
      type: 'object',
      fields: [
        { name: 'cancellationPolicy', type: 'text', title: 'Cancellation Policy', rows: 3 },
        { name: 'refundPolicy', type: 'text', title: 'Refund Policy', rows: 3 },
        { name: 'termsAndConditions', type: 'text', title: 'Terms & Conditions', rows: 5 }
      ]
    },
    // FAQs
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
    // SEO
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
    // Status and Moderation
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
          { title: 'Suspended', value: 'suspended' },
          { title: 'Archived', value: 'archived' }
        ],
        layout: 'radio'
      },
      initialValue: 'draft'
    },
    {
      name: 'featured',
      title: 'Featured Listing',
      type: 'boolean',
      initialValue: false,
      description: 'Show this listing in featured sections'
    },
    {
      name: 'verified',
      title: 'Verified Listing',
      type: 'boolean',
      initialValue: false,
      description: 'Listing has been verified by admin'
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
      name: 'suspensionReason',
      title: 'Suspension Reason',
      type: 'text',
      rows: 3,
      hidden: ({ document }) => document?.status !== 'suspended'
    },
    // Analytics
    {
      name: 'viewCount',
      title: 'View Count',
      type: 'number',
      readOnly: true,
      initialValue: 0
    },
    {
      name: 'contactClicks',
      title: 'Contact Clicks',
      type: 'number',
      readOnly: true,
      initialValue: 0
    },
    // Timestamps
    {
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime'
    },
    {
      name: 'expiresAt',
      title: 'Expires At',
      type: 'datetime',
      description: 'Listing will be automatically unpublished after this date'
    }
  ],
  orderings: [
    {
      title: 'Newest First',
      name: 'createdDesc',
      by: [{ field: '_createdAt', direction: 'desc' }]
    },
    {
      title: 'Title A-Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }]
    },
    {
      title: 'Most Viewed',
      name: 'viewsDesc',
      by: [{ field: 'viewCount', direction: 'desc' }]
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'listingType',
      media: 'featuredImage',
      status: 'status',
      verified: 'verified'
    },
    prepare(selection) {
      const { title, subtitle, media, status, verified } = selection
      const listingTypeLabels = {
        gym: 'Gym/Fitness Center',
        trainer: 'Personal Trainer',
        fitness_class: 'Fitness Class',
        wellness_center: 'Wellness Center/Spa',
        yoga_studio: 'Yoga/Pilates Studio',
        crossfit_box: 'CrossFit Box',
        martial_arts: 'Martial Arts Academy',
        dance_studio: 'Dance Studio',
        aquatics: 'Swimming/Aquatics',
        sports_club: 'Sports Club',
        equipment_sale: 'Fitness Equipment (Sale)',
        equipment_rental: 'Fitness Equipment (Rental)',
        apparel: 'Fitness Apparel',
        supplements: 'Supplements/Nutrition',
        nutrition_coaching: 'Nutrition Coaching',
        sports_medicine: 'Sports Medicine',
        massage: 'Massage Therapy',
        pt_services: 'Personal Training Services',
        group_training: 'Group Training',
        online_coaching: 'Online Coaching',
        fitness_retreat: 'Fitness Retreat',
        facility_rental: 'Sports Facility Rental',
        other: 'Other'
      }
      return {
        title: `${title}${verified ? ' ✓' : ''}`,
        subtitle: `${listingTypeLabels[subtitle] || subtitle} | ${status}`,
        media
      }
    }
  }
}
