import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import './App.css';

//You must add your own API key here from Clarifai.
const app = new Clarifai.App({
 apiKey: '0e2e07f35dd54a348e5cb3554a8a7594'
});

const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

const initialState = {

      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    
}
class App extends Component {
  constructor() {
    super();
    this.state = initialState;
   
  }
  // check communication between client and server is working. if it is working 
  // we sould see what the server(http://localhost:3001/) is giving back in the console
  // componentDidMount() {
  //   fetch('http://localhost:3001/')
  //   .then(response=> response.json())
  //   .then(console.log);//the same as .then(data=>console.log(data));
  // }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    app.models
      .predict(
        // HEADS UP! Sometimes the Clarifai Models can be down or not working as they are constantly getting updated.
        // A good way to check if the model you are using is up, is to check them on the clarifai website. For example,
        // for the Face Detect Mode: https://www.clarifai.com/models/face-detection
        // If that isn't working, then that means you will have to wait until their servers are back up. Another solution
        // is to use a different version of their model that works like: `c0c0ac362b03416da06ab3fa36fb58e3`
        // so you would change from:
        // .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
        // to:
        // .predict('c0c0ac362b03416da06ab3fa36fb58e3', this.state.input)
        Clarifai.FACE_DETECT_MODEL,
        this.state.input)
      .then(response => {
        console.log('hi', response)
        if (response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count}))
            })

        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState)
      return this.setState({route: 'signin'})
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
         <Particles className='particles'
          params={particlesOptions}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        { route === 'home'
          ? <div>
              <Logo />
              <Rank
                name={this.state.user.name}
                entries={this.state.user.entries}
              />
              <ImageLinkForm
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecognition box={box} imageUrl={imageUrl} />
            </div>
          : (
             route === 'signin'
             ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
             : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            )
        }
      </div>
    );
  }
}

export default App;


// This for celebname face recognition
// import React, { Component } from 'react'
// import Particles from 'react-particles-js';
// import './App.css';
// import Navigation from './components/Navigation/Navigation';
// import Logo from './components/Logo/Logo';
// import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
// import FaceRecognition from './components/FaceRecognition/FaceRecognition';
// import Rank from './components/Rank/Rank';
// import Clarifai from 'clarifai';


// const app = new Clarifai.App({
//  apiKey: '0e2e07f35dd54a348e5cb3554a8a7594'
// });

// const particlesOptions = {
//                 particles: {
//                   number: {
//                     value: 100,
//                     density: {
//                       enable: true,
//                       value_area: 800
//                     }
//                   }
//                 }
//               }
// class App extends Component {
//   constructor(){
//     super();
//     this.state = {
//       input:'',
//       imageUrl:'',
//       celebName:'',
//       probability:''
//     }
//   }
//   onInputChange = (event) => {
//     this.setState({input:event.target.value});
//   }

//   onButtonSubmit =() => {
//     this.setState({imageUrl:this.state.input});
//      app.models.predict(
//       Clarifai.CELEBRITY_MODEL,
//       // THE JPG
//       this.state.input
//       )
//       .then((response) => {
//         console.log(response.outputs[0].data.regions[0].data.concepts[0].name);
//         console.log(response.outputs[0].data.regions[0].data.concepts[0].value);

//        this.setState({celebName:response.outputs[0].data.regions[0].data.concepts[0].name});
//        this.setState({probability:response.outputs[0].data.regions[0].data.concepts[0].value});
//       })
//       .catch((err) => {
//        console.log(err);
//       });
//   }

//   render(){

//   return (
//     <div className="App">
//      <Particles className = 'particles'
//               params={particlesOptions}
//       />
//       <Navigation />'
//       <Logo/>
//       <Rank/>
//       <ImageLinkForm 
//         onInputChange={this.onInputChange} 
//         onButtonSubmit={this.onButtonSubmit}/>
//       <FaceRecognition 
//       imageUrl= {this.state.imageUrl} 
//       celebName= {this.state.celebName}
//       probability= {this.state.probability} />

//     </div>
//   );
//   }
// }

// export default App;

