import React from 'react';
import './app.css';
import PhotoLoader from "../photo-loader/photo-loader";

class App extends React.Component<{}, {}> {
  render() {
    return (
        <div className="app">
            { <PhotoLoader /> }
        </div>
    )
  }
}

export default App;
