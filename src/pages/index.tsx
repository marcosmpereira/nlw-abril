import { GetStaticProps } from 'next';
import { api } from '../services/api';
import { format , parseISO } from 'date-fns';
import ptBr from 'date-fns/locale/pt-BR';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';

type File = {
  url: string;
  type: string;
  duration: number
}

type Episode = {
  id: number,
  title: string,
  thumbnail: string,
  members: string,
  publishedAt: Date,
  duration: number,
  durationAsString: string,
  description: string,
  url: string
}

type HomeProps = {
  episodes: Array<Episode>
}


export default function Home(props: HomeProps) {
  return (
    <div>
      <h1>App</h1>
      <p>{JSON.stringify(props.episodes)}</p>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
	const { data } = await api.get('episodes',{
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBr}),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      description: episode.description,
      url: episode.file.url
    }
  })

  return {
		props: {
			episodes
		},
		revalidate: 60 * 60 * 8
	}
}
