import { gql } from '@apollo/client'
import { HighlightFragment } from 'graphql/fragments/highlight'

export const QUERY_RECOMMENDED = gql`
  query QueryRecommended {
    recommended {
      section {
        title
        highlight {
          ...HighlightFragment
        }
        games {
          name
          slug
          cover {
            url
          }
          developers {
            name
          }
          price
        }
      }
    }
  }

  ${HighlightFragment}
`
