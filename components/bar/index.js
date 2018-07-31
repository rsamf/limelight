import React from 'react';
import { View } from 'react-native';
import globals from '../helpers';
import Header from '../helpers/header';
import Spotlight from './spotlight';
import Spotify from 'rn-spotify-sdk';
import { graphql, compose } from 'react-apollo';
import Songs from './songs';
import GetPlaylist from '../../GQL/queries/GetPlaylist';
import OnSongsChangedSubscription from '../../GQL/subscriptions/SongsChanged';
import VoteSongMutation from '../../GQL/mutations/VoteSong';
import NextSongMutation from '../../GQL/mutations/NextSong';
const style = globals.style;

export default class Bar extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    const playlist = this.props.navigation.state.params;
    const PlaylistElement = this.getPlaylist(playlist);
    return (
      <View style={style.view}>
        <Header type="back" navigation={this.props.navigation}>
          {playlist.playlistName}
        </Header>
        <PlaylistElement/>
      </View>
    );
  }

  getPlaylist = ({id}) => compose(
    graphql(GetPlaylist, {
      options: {
        fetchPolicy: 'cache-and-network',
        variables: { id }
      },
      props: (props) => ({
        playlist: props.data.getPlaylist,
        loading: props.data.loading,
        error: props.data.error,
        subscribeToSongChanges: () => {
          props.data.subscribeToMore({
            document: OnSongsChangedSubscription,
            variables: { id },
            updateQuery: (prev, { subscriptionData }) => {
              console.warn(subscriptionData);
              return prev;
            }
          });
        }
      })
  }))(Playlist);
}

class Playlist extends React.Component {
  componentWillMount() {
    this.props.subscribeToSongChanges();
  }

  next(){
    // this.setState({
    //   songs: [...this.state.songs.slice(1), {
    //     ...this.state.songs[0],
    //     votes: 0,
    //     voted: false
    //   }]
    // });
    // return (this.state.songs[1] || this.state.songs[0]);
    globals.client.mutate({
      mutation: NextSongMutation,
      variables: {
        id: this.props.playlist.id
      }
    }).then(({loading, data: { nextSong }})=>{
    });
  }

  componentDidUpdate(){
  }

  vote(song, i){
    globals.client.mutate({
      mutation: VoteSongMutation,
      variables: {
        id: this.props.playlist.id,
        index: i
      }
    }).then(({loading, data: { voteSong }})=>{
    });
  }

  render() {
    if(!this.props.loading && this.props.playlist) {
      let songs = this.props.playlist.songs.slice(1);
      return (
        <View>
          <Spotlight next={()=>this.next()} owned={true}>
            {this.props.playlist.songs[0]}
          </Spotlight>
          <Songs vote={(song, i)=>this.vote(song, i)}>
            {songs}
          </Songs>
        </View>
      );
    }
    return <globals.Loader/>;
  }
}