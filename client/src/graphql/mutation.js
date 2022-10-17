import { gql } from '@apollo/client';
import { CORE_LINK_FIELDS } from './fragments';

export const VOTE_MUTATION = gql`
  ${CORE_LINK_FIELDS}
  mutation VoteMutation($linkId: Int!) {
    vote(linkId: $linkId) {
      link {
        ...CoreLinkFields
      }
      user {
        id
      }
    }
  }
`;

export const CREATE_LINK_MUTATION = gql`
  ${CORE_LINK_FIELDS}
  mutation CreateLink(
    $description: String!
    $url: String!
  ) {
    createLink(description: $description, url: $url) {
      ...CoreLinkFields
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation SignupMutation(
    $email: String!
    $password: String!
    $name: String!
  ) {
    signup(
      email: $email
      password: $password
      name: $name
    ) {
      token
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation LoginMutation(
    $email: String!
    $password: String!
  ) {
    login(
      email: $email
      password: $password
    ) {
      token
    }
  }
`;
