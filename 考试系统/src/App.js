import React from 'react';
import './css/App.css';
import {HashRouter,Route, Switch} from 'react-router-dom';
import './css/animate.css';
import Login from './pages/login';
import Detail from './pages/Detail';
import Sets from './pages/Sets';
import Mine from './pages/Mine';
import Classes from './pages/Classes';
import Final from './pages/Final';
import Result from './pages/Result';
import Change from './pages/Change';
function App() {
  return (
    <div className="App">
        <HashRouter> 
             <Switch>
                <Route exact path="/" component={Login}/>
                <Route exact path="/detail" component={Detail}/>
                <Route exact path="/sets" component={Sets}/>
                <Route exact path="/mine" component={Mine}/>
                <Route exact path="/classes" component={Classes}/>
                <Route exact path="/finalTests" component={Final}/>
                <Route exact path="/result" component={Result}/>
                <Route exact path="/change/:op" component={Change}/>
             </Switch>
        </HashRouter>
    </div>
  );
}

export default App;
