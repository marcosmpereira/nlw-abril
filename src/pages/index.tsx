import { GetStaticProps } from 'next';
import { api } from '../services/api';
import { format , parseISO } from 'date-fns';
import ptBr from 'date-fns/locale/pt-BR';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';
import Image from 'next/image';

import style from './home.module.scss';

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
  lastEpisodes: Array<Episode>,
  allEpisodes: Array<Episode>
}


export default function Home({lastEpisodes, allEpisodes}: HomeProps) {
  return (
    <div className={style.homepage}>
      <section className={style.lastestEpisodes}>
        <h2>Últimos lançamentos</h2>
        <ul>
          {lastEpisodes.map(episode =>{
            return(
              <li key={episode.id}>
                <Image
                  width={192}
                  height={192} 
                  src={episode.thumbnail} 
                  alt={episode.title}
                  objectFit="cover"
                />
                
                <div className={style.episodeDetails}>
                  <a href="#">{episode.title}</a>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.duration}</span>
                </div>
                <button type="button">
                  <img src="/play-green.svg" alt="Tocar episódio"/>
                </button>
              </li>
            )
          })}
        </ul>
      </section>
      <section className={style.allEpisodes}>

      </section>
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

  const lastEpisodes = episodes.slice(0,2);
  const allEpisodes = episodes.slice(2, episodes.lenght);

  return {
		props: {
			lastEpisodes,
      allEpisodes
		},
		revalidate: 60 * 60 * 8
	}
}
