import Game, { GameTemplateProps } from 'templates/Game'

import galleryMock from 'components/Gallery/mock'
import gamesMock from 'components/GameCardSlider/mock'
import highlightMock from 'components/Highlight/mock'
import { useRouter } from 'next/router'
import { initializedApollo } from 'utils/apollo'
import { QueryGames, QueryGamesVariables } from 'graphql/generated/QueryGames'
import { QUERY_GAMES, QUERY_GAME_BY_SLUG } from 'graphql/queries/games'
import {
  QueryGameBySlug,
  QueryGameBySlugVariables
} from 'graphql/generated/QueryGameBySlug'
import { GetStaticProps } from 'next'

const apolloClient = initializedApollo()

export default function Index(props: GameTemplateProps) {
  const router = useRouter()

  if (router.isFallback) return null

  return <Game {...props} />
}

// gerar em build time (/game/bla, /bame/foo ...)
export async function getStaticPaths() {
  /* return {
    paths: [{ params: { slug: 'cyberpunk-2077' } }],
    fallback: false
  } */

  const { data } = await apolloClient.query<QueryGames, QueryGamesVariables>({
    query: QUERY_GAMES,
    variables: { limit: 9 }
  })

  const paths = data.games.map(({ slug }) => ({
    params: { slug }
  }))

  return { paths, fallback: true }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { data } = await apolloClient.query<
    QueryGameBySlug,
    QueryGameBySlugVariables
  >({
    query: QUERY_GAME_BY_SLUG,
    variables: { slug: `${params?.slug}` }
  })

  if (!data.games.length) {
    return { notFound: true }
  }

  const game = data.games[0]

  return {
    props: {
      revalidate: 60,
      cover: `http://localhost:1337${game.cover?.src}`,
      gameInfo: {
        title: game.name,
        price: game.price,
        description: game.description
      },
      gallery: game.gallery.map((image) => ({
        src: `http://localhost:1337${image.src}`,
        label: image.label
      })),
      description: game.description,
      details: {
        developer: game.developers[0].name,
        releaseDate: game.release_date,
        platforms: game.plataforms.map((plataform) => plataform.name),
        publisher: game.publisher,
        rating: game.rating,
        genres: game.categories.map((category) => category.name)
      },
      upcomingGames: gamesMock,
      upcomingHighlight: highlightMock,
      recommendedGames: gamesMock
    }
  }
}