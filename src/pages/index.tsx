import { GetStaticProps } from 'next';

type File = {
  url: string;
  type: string;
  duration: number
}

type Episodes = {
  id: string;
  title: string;
  members: string;
  published_at: Date;
  thumbnail: string;
  description: string
  file: File
}

type HomeProps = {
  episodes: Array<Episodes>
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
	const response = await fetch('http://localhost:3333/episodes?_limit=12&_sort=published_at&_order=desc')
	const data = await response.json()

  return {
		props: {
			episodes: data
		},
		revalidate: 60 * 60 * 8
	}
}
