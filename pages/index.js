import { Component } from 'react'
import 'isomorphic-fetch'
import Layout from '../components/Layout';
import ChannelGrid from '../components/ChannelGrid';

export default class extends Component {
    static async getInitialProps() {
        const req = await fetch('https://api.audioboom.com/channels/recommended')
        const { body: channels } = await req.json()
        return { channels }
    }
    render() {
        const { channels } = this.props
        return <div>
            <Layout title='App de Podcasts'>
                <ChannelGrid channels={channels} />
            </Layout>
        </div >
    }
}