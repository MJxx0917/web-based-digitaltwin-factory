import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Dashboard from './views/dashboard'
import PhysicsWorld from './model/PhysicsWorld';
import ConveyorScene from './model/ConveyorScene';
import PickUpMachine from './model/PickUpMachine';
import ConveyorBelt from './model/ConveyorBelt';
import CustomObject from './model/CustomObject'
import Testing from './model/Testing'
import ConveyorTesting from './model/ConveyorTesting'
import UnityUI from './views/UnityUI';

const App = () => {
  return(
   <Router>
      <div style={{ height: '100vh' }}>
        <Routes>
          <Route exact path='/' element={<UnityUI />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
