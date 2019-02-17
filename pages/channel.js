import 'isomorphic-fetch'
import Layout from '../components/Layout'
import ChannelGrid from '../components/ChannelGrid'
import PodcastList from '../components/PodcastList'
import Error from './error'

export default class extends React.Component {

    static async getInitialProps({ query, res }) {
        const idChannel = query.id
        try {
            const [reqChannel, reqSeries, reqAudios] = await Promise.all([
                fetch(`https://api.audioboom.com/channels/${idChannel}`),
                fetch(`https://api.audioboom.com/channels/${idChannel}/child_channels`),
                fetch(`https://api.audioboom.com/channels/${idChannel}/audio_clips`)
            ])

            if (reqChannel.status >= 404) {
                res.statusCode = reqChannel.status
                return { channel: null, audioClips: null, series: null, statusCode: 404 }
            }
            const dataChannel = await reqChannel.json()
            const channel = dataChannel.body.channel

            const dataAudios = await reqAudios.json()
            const audioClips = dataAudios.body.audio_clips

            const dataSeries = await reqSeries.json()
            const series = dataSeries.body.channels

            return { channel, audioClips, series, statusCode: 200 }
        } catch (error) {
            return { channel: null, audioClips: null, series: null, statusCode: 503 }
        }

    }

    render() {
        const { channel, audioClips, series } = this.props
        if (statusCode !== 200) {
            // <div>Se rompio el server</div>
            return <Error {...statusCode} />
        }
        return <Layout title={channel.title}>
            <div className="banner" style={{ backgroundImage: `url(${channel.urls.banner_image.original})` }} />

            <h1>{channel.title}</h1>

            {series.length > 0 &&
                <div>
                    <h2>Series</h2>
                    <ChannelGrid channels={series} />
                </div>
            }

            <h2>Ultimos Podcasts</h2>
            <PodcastList podcasts={audioClips} />

            <style jsx>{`
        .banner {
          width: 100%;
          padding-bottom: 25%;
          background-position: 50% 50%;
          background-size: cover;
          background-color: #aaa;
        }
        h1 {
          font-weight: 600;
          padding: 15px;
        }
        h2 {
          padding: 15px;
          font-size: 1.2em;
          font-weight: 600;
          margin: 0;
        }
      `}</style>
        </Layout>
    }
}