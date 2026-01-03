import { StructureBuilder } from 'sanity/structure';
import { DocumentsIcon, CommentIcon, BookIcon, EarthGlobeIcon, CogIcon, UsersIcon } from '@sanity/icons';

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      // Trips
      S.listItem()
        .title('Trips')
        .icon(EarthGlobeIcon)
        .child(S.documentTypeList('trip').title('Trips')),

      // Notes
      S.listItem()
        .title('Notes')
        .icon(BookIcon)
        .child(S.documentTypeList('note').title('Notes')),

      // Pages
      S.listItem()
        .title('Pages')
        .icon(DocumentsIcon)
        .child(S.documentTypeList('page').title('Pages')),

      S.divider(),

      // Comments section with filters
      S.listItem()
        .title('Comments')
        .icon(CommentIcon)
        .child(
          S.list()
            .title('Comments')
            .items([
              S.listItem()
                .title('All Comments')
                .icon(CommentIcon)
                .child(
                  S.documentTypeList('comment')
                    .title('All Comments')
                    .defaultOrdering([{ field: 'createdAt', direction: 'desc' }])
                ),
              S.listItem()
                .title('Trip Comments')
                .icon(EarthGlobeIcon)
                .child(
                  S.documentList()
                    .title('Trip Comments')
                    .filter('_type == "comment" && parentType == "trip"')
                    .defaultOrdering([{ field: 'createdAt', direction: 'desc' }])
                    .apiVersion('2024-01-01')
                ),
              S.listItem()
                .title('Note Comments')
                .icon(BookIcon)
                .child(
                  S.documentList()
                    .title('Note Comments')
                    .filter('_type == "comment" && parentType == "note"')
                    .defaultOrdering([{ field: 'createdAt', direction: 'desc' }])
                    .apiVersion('2024-01-01')
                ),
            ])
        ),

      // Guestbook
      S.listItem()
        .title('Guestbook')
        .icon(UsersIcon)
        .child(
          S.documentTypeList('guestbookEntry')
            .title('Guestbook Entries')
            .defaultOrdering([{ field: 'createdAt', direction: 'desc' }])
        ),

      S.divider(),

      // Site Stats
      S.listItem()
        .title('Site Stats')
        .icon(CogIcon)
        .child(S.documentTypeList('siteStats').title('Site Stats')),
    ]);
