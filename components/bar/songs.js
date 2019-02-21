import React from 'react';
import { Text, StyleSheet, View, Image, TouchableOpacity, Linking, Alert, SectionList, RefreshControl } from 'react-native';
import { Icon, Badge } from 'react-native-elements';
import Modal from "react-native-modal";
import globals from '../../util';

export default class extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      addingSong: false,
      viewingSong: null,
      viewingSongIsRequest: false,
      promptSpotify: false
    };
  }

  onLongPress(song, isRequest, i) {
    this.setState({
      viewingSong: song,
      viewingSongIsRequest: isRequest,
      viewingSongIndex: i,
      promptSpotify: false
    });
  }

  onPressSpotify(song) {
    this.setState({
      viewingSong: song,
      promptSpotify: true  
    });
  }

  addSong(song=this.state.viewingSong, index=this.state.viewingSongIndex) {
    const uri = "spotify:track:"+song.id;
    this.props.addSong(song, uri, index);
    this.setState({
      viewingSong: null
    });
  }

  vote(index) {
    this.setState({ viewingSong: null });
    this.props.vote(index);
  }

  eachSong(song, i) {
    const votedColor = this.props.voted(i) ? globals.sGreen : globals.sGrey;
    const artist = globals.getArtistsText(song);
    return (
      <View style={{margin: 10}} key={i}>
        <View style={style.song}>
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 2, flex: 1}}>
            <Icon
              containerStyle={style.voteIcon}
              size={30}
              type="simple-line-icon" 
              name="arrow-up-circle"
              color={votedColor}
              underlayColor={globals.sBlack}
              onPress={()=>this.vote(i)}
            />
            <Text ellipsizeMode="tail" numberOfLines={1} style={style.songName}>{song.name}</Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <View style={{flexDirection: 'row', flex: 1}}>
              <View style={{justifyContent: 'center'}}>
                <Badge containerStyle={{width:35}} textStyle={{color: votedColor}} value={song.votes}/>
              </View>
              <TouchableOpacity onPress={()=>this.onPressSpotify(song)} style={{marginLeft: 10, justifyContent: 'center'}}>
                <Icon size={21} color={sWhite} name="spotify" type="font-awesome"/>
              </TouchableOpacity>
              <Text ellipsizeMode="tail" numberOfLines={1} style={{flex: 1, marginLeft: 10, ...style.songArtist}}>{artist}</Text>
            </View>
            <TouchableOpacity onPress={()=>this.onLongPress(song, false, i)} style={{paddingLeft: 10, paddingRight:10, paddingTop: 0, paddingBottom: 0, borderRadius: 20, borderWidth: 1, borderColor: sWhite, flexDirection: 'row', marginLeft: 10}}>
              <Icon color={sWhite} size={18} name="more-horizontal" type="feather"/>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  eachRequest(song, i) {
    if(song === "ADD") return this.renderAddButton();
    return (
      <View key={i}>
        <View style={style.request}>
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 2}}>
            {
              this.props.isOwned &&
              <Icon
                containerStyle={style.addIcon} 
                size={35}
                type="entypo" 
                name="plus" 
                color={globals.sWhite}
                underlayColor={globals.sBlack} 
                onPress={()=>this.addSong(song, i)}
              />
            }
            <Text ellipsizeMode="tail" numberOfLines={1} style={style.songName}>{song.name}</Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity onPress={()=>this.onPressSpotify(song)} style={{marginRight: 10, justifyContent: 'center'}}>
                <Icon size={21} color={sWhite} name="spotify" type="font-awesome"/>
              </TouchableOpacity>
              <Text ellipsizeMode="tail" numberOfLines={1} style={style.songArtist}>{song.artist}</Text>
            </View>
            <TouchableOpacity onPress={()=>this.onLongPress(song, true, i)} style={{paddingLeft: 10, paddingRight:10, paddingTop: 0, paddingBottom: 0, borderRadius: 20, borderWidth: 1, borderColor: sWhite, flexDirection: 'row', marginLeft: 10}}>
              <Icon color={sWhite} name="more-horizontal" type="feather"/>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  renderAddButton() {
    return (
      <View style={style.song}>
        <View style={style.addButtonContainer}>
          <TouchableOpacity onPress={()=>this.props.search()} style={style.addButton}>
            <Icon name='add' color={globals.sBlack}/>
            <Text style={{...globals.style.text,color: globals.sBlack}}>Add Song</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  ackSong() {
    this.props.ackSong(this.state.viewingSongIndex);
    this.setState({
      viewingSong: null
    });
  }

  deleteSong() {
    this.props.deleteSong(this.state.viewingSong.id);
    this.setState({
      viewingSong: null
    });
  }

  visitSong() {
    let url = "https://open.spotify.com/track/"+this.state.viewingSong.id;
    Linking.canOpenURL(url).then(supported => {
      if (!supported) {
        Alert.alert("Could not open the link to the song!");
      } else {
        Linking.openURL(url);
      }
      this.setState({
        viewingSong: null
      });
    });
  }

  each(item, index, section) {
    if(section.title === "Queue") {
      return this.eachSong(item, index);
    } else {
      return this.eachRequest(item, index);
    }
  }

  render() {
    const songs = this.props.children;
    const requests = this.props.requests;
    const isVoted = this.state.viewingSong && !this.state.viewingSongIsRequest && this.props.voted(this.state.viewingSongIndex);
    return (
      <View style={style.view}>
        {
          this.state.viewingSong &&
          <Modal isVisible={true} onBackdropPress={()=>this.setState({ viewingSong: null })}>
            <View style={style.modalView}>
              <View style={{...style.modalBorder, ...style.modalItem}}>
                <Image style={style.modalImage} source={{uri: this.state.viewingSong.image}}/>
                <View style={style.modalDetails}>
                  {globals.getScrollableText(this.state.viewingSong.name)}
                  {globals.getScrollableText(globals.getArtistsText(this.state.viewingSong), style.songArtist)}
                </View>
              </View>
              {
                !this.state.promptSpotify && !this.state.viewingSongIsRequest &&
                <TouchableOpacity disabled={isVoted} style={{...style.modalBorder, ...style.modalItem, opacity: 1-.5*isVoted}} onPress={()=>this.vote(this.state.viewingSongIndex)}>
                  <Icon containerStyle={style.modalIcon} color={globals.sWhite} name="arrow-circle-o-up" type="font-awesome"/>
                  <Text style={globals.style.text}>Vote</Text>
                </TouchableOpacity>
              }
              {
                !this.state.promptSpotify && this.props.isOwned && (
                  this.state.viewingSongIsRequest ? (
                    <View>
                      <TouchableOpacity style={{...style.modalBorder, ...style.modalItem}} onPress={()=>this.addSong()}>
                        <Icon containerStyle={style.modalIcon} color={globals.sWhite} name="check" type="feather"/>
                        <Text style={globals.style.text}>Accept</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={{...style.modalBorder, ...style.modalItem}} onPress={()=>this.ackSong()}>
                        <Icon containerStyle={style.modalIcon} color={globals.sWhite} name="x" type="feather"/>
                        <Text style={globals.style.text}>Reject</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity style={{...style.modalBorder, ...style.modalItem}} onPress={()=>this.deleteSong()}>
                      <Icon containerStyle={style.modalIcon} color={globals.sWhite} name="trash-o" type="font-awesome"/>
                      <Text style={globals.style.text}>Delete</Text>
                    </TouchableOpacity>
                  )
                )
              }
              <TouchableOpacity style={{...style.modalItem}} onPress={()=>this.visitSong()}>
                <Icon containerStyle={style.modalIcon} color={globals.sWhite} name="spotify" type="font-awesome"/>
                <Text style={globals.style.text}>View in Spotify</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        }
        <View style={globals.style.view}>
          <SectionList
            indicatorStyle="white"
            refreshControl={
              <RefreshControl refreshing={this.props.refreshing} onRefresh={()=>this.props.refresh()}/>
            }
            renderItem={({item, index, section}) => this.each(item, index, section)}
            renderSectionHeader={({section: {title}}) => (
                title === "Requests" && this.props.requests.length === 0 ?
                (<View/>) : (
                  <View style={style.sectionHeader}>
                    <Text style={style.sectionHeaderText}>{title}</Text>
                    {/* <Icon name="spotify" type="font-awesome" size={21} color={sWhite}/> */}
                  </View>
                )
            )}
            sections={[
              {title: 'Queue', data: songs},
              {title: 'Requests', data: [...requests, "ADD"]},
            ]}
            keyExtractor={(_, index) => String(index)}
          />
        </View>
      </View>
    );
  }
}

const style = StyleSheet.create({
  view: {
    flex: 1,
    marginBottom: 82
  },
  sectionHeader: {
    backgroundColor: globals.darkerGrey,
    paddingRight: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    ...globals.style.shadow
  },
  sectionHeaderText: {
    ...globals.style.smallText,
    margin: 5,
  },
  song: {
    flex: 1,
    margin: 5
  },
  voteIcon: {
    width: 35,
    height: 35,
    marginRight: 10
  },
  addIcon: {
    width: 35,
    height: 35,
    marginRight: 10
  },
  voteNumber: {
    marginRight: 10,
    color: globals.sGrey,
    ...globals.style.text,
  },
  songImage: {
    height: 30,
    width: 30,
    marginRight: 10
  },
  songInfo: {
    flexDirection: 'column',
    flex: 1
  },
  songName: {
    flex: 1,
    ...globals.style.text
  },
  songArtist: {
    ...globals.style.smallText,
    color: globals.sGrey
  },
  request: {
    flex: 1,
    margin: 10
  },
  addButtonContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20
  },
  addButton: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 30,
    paddingRight: 30,
    borderRadius: 20,
    backgroundColor: globals.sWhite,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalOptions: {
    marginTop: 20,
    flexDirection: 'row'
  },
  modalView: {
    backgroundColor: 'rgba(0,0,0,.6)',
    borderWidth: 1,
    borderRadius: 20,
    borderColor: globals.sWhite
  },
  modalBorder: {
    borderBottomWidth: 1,
    borderBottomColor: globals.sGrey
  },
  modalItem: {
    flexDirection: 'row',
    padding: 15
  },
  modalIcon: {
    marginRight: 10
  },
  modalImage: {
    height: 50,
    width: 50
  },
  modalDetails: {
    marginLeft: 10,
    flex: 1
  }
});