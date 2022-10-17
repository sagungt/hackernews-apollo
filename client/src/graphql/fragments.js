import { gql } from '@apollo/client';

export const CORE_LINK_FIELDS = gql`
  fragment CoreLinkFields on Link {
    id
    url
    description
    createdAt
    postedBy {
      id
      name
    }
    voters {
      id
    }
  }
`;
