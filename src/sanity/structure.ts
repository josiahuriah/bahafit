import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // Users Section
      S.listItem()
        .title('Users')
        .icon(() => '👤')
        .child(
          S.list()
            .title('Users')
            .items([
              S.listItem()
                .title('All Users')
                .child(S.documentTypeList('user').title('All Users')),
              S.divider(),
              S.listItem()
                .title('Members')
                .child(
                  S.documentList()
                    .title('Members')
                    .filter('_type == "user" && userType == "member"')
                ),
              S.listItem()
                .title('Trainers')
                .child(
                  S.documentList()
                    .title('Trainers')
                    .filter('_type == "user" && userType == "trainer"')
                ),
              S.listItem()
                .title('Businesses')
                .child(
                  S.documentList()
                    .title('Businesses')
                    .filter('_type == "user" && userType == "business"')
                ),
            ])
        ),

      S.divider(),

      // Fitness Events Section
      S.listItem()
        .title('Fitness Events')
        .icon(() => '📅')
        .child(
          S.list()
            .title('Fitness Events')
            .items([
              S.listItem()
                .title('All Fitness Events')
                .child(S.documentTypeList('fitnessEvent').title('All Fitness Events')),
              S.divider(),
              S.listItem()
                .title('Published Events')
                .child(
                  S.documentList()
                    .title('Published Events')
                    .filter('_type == "fitnessEvent" && status == "published"')
                ),
              S.listItem()
                .title('Pending Review')
                .child(
                  S.documentList()
                    .title('Pending Review')
                    .filter('_type == "fitnessEvent" && status == "pending"')
                ),
              S.listItem()
                .title('Draft Events')
                .child(
                  S.documentList()
                    .title('Draft Events')
                    .filter('_type == "fitnessEvent" && status == "draft"')
                ),
              S.listItem()
                .title('Featured Events')
                .child(
                  S.documentList()
                    .title('Featured Events')
                    .filter('_type == "fitnessEvent" && featured == true')
                ),
              S.divider(),
              S.listItem()
                .title('Race Events')
                .child(S.documentTypeList('raceEvent').title('Race Events')),
              S.listItem()
                .title('Wellness Expos')
                .child(S.documentTypeList('wellnessExpo').title('Wellness Expos')),
              S.listItem()
                .title('Fitness Challenges')
                .child(S.documentTypeList('fitnessChallenge').title('Fitness Challenges')),
              S.listItem()
                .title('Competitions')
                .child(S.documentTypeList('competition').title('Competitions')),
            ])
        ),

      // Fitness Listings Section
      S.listItem()
        .title('Fitness Listings')
        .icon(() => '🏋️')
        .child(
          S.list()
            .title('Fitness Listings')
            .items([
              S.listItem()
                .title('All Fitness Listings')
                .child(S.documentTypeList('fitnessListing').title('All Fitness Listings')),
              S.divider(),
              S.listItem()
                .title('Published Listings')
                .child(
                  S.documentList()
                    .title('Published Listings')
                    .filter('_type == "fitnessListing" && status == "published"')
                ),
              S.listItem()
                .title('Pending Review')
                .child(
                  S.documentList()
                    .title('Pending Review')
                    .filter('_type == "fitnessListing" && status == "pending"')
                ),
              S.listItem()
                .title('Draft Listings')
                .child(
                  S.documentList()
                    .title('Draft Listings')
                    .filter('_type == "fitnessListing" && status == "draft"')
                ),
              S.listItem()
                .title('Featured Listings')
                .child(
                  S.documentList()
                    .title('Featured Listings')
                    .filter('_type == "fitnessListing" && featured == true')
                ),
              S.listItem()
                .title('Verified Listings')
                .child(
                  S.documentList()
                    .title('Verified Listings')
                    .filter('_type == "fitnessListing" && verified == true')
                ),
              S.divider(),
              S.listItem()
                .title('Gyms')
                .child(S.documentTypeList('gym').title('Gyms')),
              S.listItem()
                .title('Coaches/Trainers')
                .child(S.documentTypeList('coach').title('Coaches/Trainers')),
              S.listItem()
                .title('Wellness Centers')
                .child(S.documentTypeList('wellnessCenter').title('Wellness Centers')),
              S.listItem()
                .title('Fitness Apparel')
                .child(S.documentTypeList('fitnessApparel').title('Fitness Apparel')),
              S.listItem()
                .title('Fitness Equipment')
                .child(S.documentTypeList('fitnessEquipment').title('Fitness Equipment')),
            ])
        ),

      S.divider(),

      // Show remaining document types that aren't organized above
      ...S.documentTypeListItems().filter(
        (listItem) =>
          ![
            'user',
            'fitnessEvent',
            'fitnessListing',
            'gym',
            'coach',
            'wellnessCenter',
            'fitnessApparel',
            'fitnessEquipment',
            'raceEvent',
            'wellnessExpo',
            'fitnessChallenge',
            'competition',
          ].includes(listItem.getId() || '')
      ),
    ])
