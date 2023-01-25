var count = 0;
var selectedObj;
var gripPressed;

AFRAME.registerComponent('ball-detect', {
  init: function () {
    var ent = this.el;   
   // var debugtxt = document.getElementById("debugTxt");
    
    this.el.addEventListener('collide', function(e){
      if(e.detail.body.el.id.includes('bowling-pin')){
        //debugtxt.setAttribute('value','colision producida con:' + e.detail.body.el.id);
       // console.log('Colisión producida con: ' + e.detail.body.el.id);
        //console.log(e)
        try{
          ent.parentNode.removeChild(document.getElementById(e.detail.body.el.id));
          ent.parentNode.removeChild(ent);
          count++;
          const regPuntos = /Puntos:(\d|\s)+/
         // let nuevoTexto = document.getElementById("pointsDisplay").setAttribute("value", "Puntos:"+ count)
          //(document.getElementById("pointsDisplay")).value=nuevoTexto;
         
        } catch (err){console.log(err)}
        //console.log('Número de puntos:' + count);
      }
    });
  },
});

AFRAME.registerComponent('thumbstick-movement',{
  init: function () {
    
    this.el.addEventListener('thumbstickmoved', this.thumbstickMovement);
  },
  thumbstickMovement: function (evt) {
    var cameraRig = document.getElementById('camrig');
    
    if (evt.detail.y > 0.95) { 
      cameraRig.object3D.translateZ(0.05);
    }
    if (evt.detail.y < -0.95) { 
      cameraRig.object3D.translateZ(-0.05);
    }
    if (evt.detail.x < -0.95) { 
      cameraRig.object3D.translateX(-0.05);
    }
    if (evt.detail.x > 0.95) { 
      cameraRig.object3D.translateX(0.05);
    }
  }
});

AFRAME.registerComponent('thumbstick-camera',{
  init: function () {
    
    this.el.addEventListener('thumbstickmoved', this.thumbstickCamera);
  },
  thumbstickCamera: function (evt) {
    var cameraRig = document.getElementById('camrig');
    
    if (evt.detail.x < -0.95) { 
      cameraRig.object3D.rotateY(THREE.Math.degToRad(5));
    }
    if (evt.detail.x > 0.95) { 
      cameraRig.object3D.rotateY(THREE.Math.degToRad(-5));
    }
  }
});

AFRAME.registerComponent('collider-check', {
  dependencies: ['raycaster'],

  init: function () {
    var debugtxt = document.getElementById("debugTxt");

    this.el.addEventListener('raycaster-intersection', function (e) {
      this.selectedObj = e.detail.els[0];
      debugtxt.setAttribute('value','Interseccion detectada!');
    });
    
    //-- grip button pressed
    this.el.addEventListener('gripdown', function (e) {
        this.grip = true;
        debugtxt.setAttribute('value', 'Grip button presionado');
    });
    
    //-- grip button released
    this.el.addEventListener('gripup', function (e) {
        this.grip = false;
        debugtxt.setAttribute('value', 'Grip button liberado');
    });
  },
  
  tick: function(){
    if(!this.el.selectedObj) return;
    if(!this.el.grip) return;
    
    
    var raycast = this.el.getAttribute("raycaster").direction;
    
    var pos = new THREE.Vector3(raycast.x, raycast.y, raycast.z);
    pos.normalize();
    
    //-- final destination of object will be 2m in front of ray
    pos.multiplyScalar(0.1);
              
    //-- convert to world coordinate
    this.el.object3D.localToWorld(pos);
    
    //Move selected object to follow the tip of raycaster.
    this.el.selectedObj.object3D.position.set(pos.x, pos.y, pos.z);
    
    
    if (this.el.selectedObj.components["dynamic-body"]) {
      this.el.selectedObj.components["dynamic-body"].syncToPhysics();
    }
  }
  
});

