import { Component } from 'react'
import 'isomorphic-fetch'
import Layout from '../components/Layout';
import ChannelGrid from '../components/ChannelGrid';
import Error from 'next/error'

export default class extends Component {
    static async getInitialProps({ res }) {
        try {
            const req = await fetch('https://api.audioboom.com/channels/recommended')
            const { body: channels } = await req.json()
            return { channels, statusCode: 200 }
        } catch (error) {
            res.statusCode = 503
            return { channels: null, statusCode: 503 }
        }

    }
    render() {
        const { channels, statusCode } = this.props
        if (statusCode !== 200) {
            // <div>Se rompio el server</div>
            return <Error {...statusCode} />
        }
        return <div>
            <Layout title='App de Podcasts'>
                <ChannelGrid channels={channels} />
            </Layout>
        </div >
    }
}