import { gql } from '@apollo/client';
import { CORE_LINK_FIELDS } from './fragments';

export const FEED_QUERY = gql`
  ${CORE_LINK_FIELDS}
  query FeedQuery(
    $take: Int
    $skip: Int
    $orderBy: [LinkOrderByInput!]
  ) {
    feed(take: $take, skip: $skip, orderBy: $orderBy) {
      id
      links {
        ...CoreLinkFields
      }
      count
    }
  }
`;

export const FEED_SEARCH_QUERY = gql`
  ${CORE_LINK_FIELDS}
  query FeedSearchQuery($filter: String!) {
    feed(filter: $filter) {
      id
      links {
        ...CoreLinkFields
      }
      count
    }
  }
`;
