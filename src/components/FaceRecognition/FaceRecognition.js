//This for celebname face recognition
// import React from 'react';

// const FaceRecognition = ({imageUrl, celebName, probability}) =>{
// 	return (
// 	<div className= 'center ma'>
// 		<div className= 'absolute mt2'>
// 			<img alt={celebName} src={imageUrl} width='700px' hight='auto' />
// 				<div className='white f3' >
// 					{celebName} in probability of : {probability}
// 				</div>

// 		</div>
// 	</div>

// 	);
// }
// export default FaceRecognition;

import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({ imageUrl, box }) => {
  return (
    <div className='center ma'>
      <div className='absolute mt2'>
        <img id='inputimage' alt='' src={imageUrl} width='700px' heigh='auto'/>
        <div className='bounding-box' style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}></div>
      </div>
    </div>
  );
}

export default FaceRecognition;