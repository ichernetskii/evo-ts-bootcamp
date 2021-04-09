import React from 'react';
import Field from '../field/field';
import {randomArray, delay} from "../../assets/utils";

// styles
import './app.scss';

enum Status {
  notStarted = "not started",
  started = "started",
  paused = "paused",
  solved = "solved"
}

interface IState {
  elements: number[],
  delay: number, // ms
  status: Status,
  elemsCountError: boolean,
  elemsDelayError: boolean
}

class App extends React.Component {
  state: IState = {
    elements: Array(20).fill(0),
    delay: 50,
    status: Status.notStarted,
    elemsCountError: false,
    elemsDelayError: false
  };

  private setElements(elements: number[]): void {
    this.setState((state: IState) => ({ ...state, elements }));
  }

  private setRandomElements(count: number = this.state.elements.length): void {
    this.setState((state: IState) => ({
      ...state,
      elemsCountError: false,
      elemsDelayError: false,
      status: Status.notStarted,
      elements: randomArray(count)
    }));
  }

  private newSetHandler = () => {
    this.setState({ status: Status.notStarted });
    this.setRandomElements();
  }

  private sortHandler = async (event: React.MouseEvent<HTMLButtonElement>) => {
    switch (this.state.status) {
      case Status.started:
        this.setState({ status: Status.paused });
        return;
      case Status.paused:
        this.setState({ status: Status.started });
        return;
      case Status.solved:
        this.setState({ status: Status.solved });
        return;
      default:
        this.setState({ status: Status.started });
    }

    for (let lastIndex: number = this.state.elements.length - 1; lastIndex >= 1 ; lastIndex-- ) {
      let changed: boolean = false;

      for (let i: number = 0; i < lastIndex; i++) {
        const els: number[] = [...this.state.elements];
        if (els[i] > els[i + 1]) {
          [els[i + 1], els[i]] = [els[i], els[i + 1]];
          this.setElements(els);
          changed = true;
        }
  
        await delay(this.state.delay);
        
        if (this.state.status === Status.notStarted) {
          this.setRandomElements();
          return;
        }

        if (this.state.status === Status.paused) i--;
      }

      if (!changed) {
        this.setState({ status: Status.solved })
        return;
      }
    }

    this.setState({ status: Status.solved })
  }

  private changeCountHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val: number = Number.parseInt(event.target.value);
      if (!isNaN(val) && val > 1 && val <= 100) {
        this.setRandomElements(val);
      } else this.setState({ elemsCountError: true });
  }

  private changeDelayHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val: number = Number.parseInt(event.target.value);
      if (!isNaN(val) && val > 1 && val <= 5000) {
        this.setState({ delay: val, elemsDelayError: false })
      } else this.setState({ elemsDelayError: true });
  }

  componentDidMount(): void {
    this.setRandomElements();
  }

  componentDidUpdate(prevProps: any, prevState: IState): void {
    if (this.state.elements.length !== prevState.elements.length) this.setRandomElements();
  }

  render () {
    return (
      <div className="app">
        <div className="app__container">
          <div className="app__field">
            <Field data={this.state.elements} />
          </div>
          <div className="app__controls">
            <div className="app__buttons">
              <button onClick={(this.newSetHandler)}>New set</button>
              <button onClick={(this.sortHandler)} disabled={this.state.status === Status.solved}>
                { this.state.status === Status.started ? "Pause" : "Start" }
              </button>
            </div>
            <span className="app__status" >{ this.state.status }</span>
            <div className="app__edit-box">
              <label htmlFor="elemsCount">Elements count: </label>
              <input
                className="app__input"
                type="edit"
                id="elemsCount"
                defaultValue={this.state.elements.length}
                onChange={ this.changeCountHandler }
                style={{ border: this.state.elemsCountError ? "1px solid #F00" : "" }}
              />
            </div>
            <div className="app__edit-box">
              <label htmlFor="delay">Delay: </label>
              <input
                className="app__input"
                type="edit"
                id="delay"
                defaultValue={this.state.delay}
                onChange={ this.changeDelayHandler }
                style={{ border: this.state.elemsDelayError ? "1px solid #F00" : "" }}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default App;
