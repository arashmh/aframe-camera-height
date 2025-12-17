import * as THREE from "three";

// Custom HUD Component
AFRAME.registerComponent('height-readout', {
  init: function () {
    this.camera = document.querySelector('#head');
    this.rig = document.querySelector('#cameraRig');
    this.adjuster = document.querySelector('#camera-height-adjuster');
    this.displayText = this.el;
    
    this.worldPos = new THREE.Vector3();
    this.localPos = new THREE.Vector3();
  },
  tick: function () {
    if (!this.camera || !this.rig) return;

    // Global
    this.camera.object3D.getWorldPosition(this.worldPos);
    
    // Rig Relative
    this.localPos.copy(this.worldPos);
    this.rig.object3D.worldToLocal(this.localPos);

    const relativeHeight = this.worldPos.y - 10.0;
    const adjusterHeight = this.adjuster ? this.adjuster.object3D.position.y : 0;
    
    // Access target from the sibling component for display
    const smartComp = this.rig.components['smart-height-adjuster'];
    const currentTarget = smartComp ? smartComp.data.targetHeight : 0;

    const f = (n) => n.toFixed(2);

    const textOutput = 
      `:: TELEMETRY ::\n` +
      `Global Y: ${f(this.worldPos.y)}\n` +
      `Rig Rel Y: ${f(this.localPos.y)}\n` + 
      `Adj Offset: ${f(adjusterHeight)}\n` +
      `Target: ${f(currentTarget)}m`;

    this.displayText.setAttribute('text', { value: textOutput });
  }
});
