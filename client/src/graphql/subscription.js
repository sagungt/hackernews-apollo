import { gql } from '@apollo/client';
import { CORE_LINK_FIELDS } from './fragments';

export const NEW_LINK_SUBSCRIPTION = gql`
  ${CORE_LINK_FIELDS}
  subscription NewLink {
    newLink {
      id
      newLink {
        ...CoreLinkFields
      }
    }
  }
`;

export const NEW_VOTES_SUBSCRIPTION = gql`
  ${CORE_LINK_FIELDS}
  subscription NewVote {
    newVote {
      id
      vote {
        link {
          ...CoreLinkFields
        }
        user {
          id
        }
      }
    }
  }
`;
