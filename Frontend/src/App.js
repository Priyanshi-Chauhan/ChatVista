import {Route} from 'react-router-dom';
import {Homepage, Chatpage} from './Pages';
import './App.css';

function App() {
  return (
    <div className="App">
      <Route path= "/"  component= {Homepage} exact></Route>
      <Route path="/chats" component ={Chatpage} exact></Route>
    </div>
  );
}

export default App;
