import LocalArray from "./LocalArray";

export default class LocalPlaylists extends LocalArray {
  constructor(component){
    super("playlists", () => {
      component.setState({
        playlists: this,
        blurProps: {
          ...component.state.blurProps,
          playlists: this
        }
      });
    });
  }
}