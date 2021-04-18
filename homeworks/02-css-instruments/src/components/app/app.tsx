import React from 'react';
import './app.css';
import PhotoSet from "../photo-set/photo-set";

class App extends React.Component<{}, {}> {
  render() {
    return (
        <div className="app">
            { <PhotoSet /> }
        </div>
    )
  }
}

export default App;
