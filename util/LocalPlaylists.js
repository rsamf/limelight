import LocalArray from "./LocalArray";

export default class LocalPlaylists extends LocalArray {
  constructor(component){
    super("playlists", (playlists) => {
      component.setState({
        playlists,
        blurProps: {
          ...component.state.blurProps,
          playlists
        }
      });
    });
  }
}