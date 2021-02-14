import { gql } from '@apollo/client'

export const GameFragment = gql`
  fragment GameFrament on Game {
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
`
