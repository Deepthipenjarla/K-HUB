


import { BrowserRouter, Form, Route , Router, Routes } from 'react-router-dom'
import Home from './components/Home';
import PieChartComponent from './components/Piechart';

import './App.css'

function App() {
  return (
    <div className="appjscontainer">
    
    <div className='components.container'>
    <BrowserRouter>
    <Routes>
    <Route path="/" exact element={<Home/>}></Route>
    <Route path="/result" exact element={<PieChartComponent/>}></Route>
    

    </Routes>
    </BrowserRouter> 
     </div></div>
    
  );
}

export default App;
