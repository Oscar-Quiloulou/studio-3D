export class Controls {
  constructor(canvas) {
    this.forward = false;
    this.backward = false;
    this.left = false;
    this.right = false;
    this.mouseDeltaX = 0;

    this._mx = 0;
    this._my = 0;
    this._locked = false;

    const onKey = (e, down) => {
      const k = e.key.toLowerCase();
      if (k === 'w' || k === 'arrowup') this.forward = down;
      if (k === 's' || k === 'arrowdown') this.backward = down;
      if (k === 'a' || k === 'arrowleft') this.left = down;
      if (k === 'd' || k === 'arrowright') this.right = down;
    };

    window.addEventListener('keydown', e => onKey(e, true));
    window.addEventListener('keyup', e => onKey(e, false));

    canvas.addEventListener('click', () => {
      canvas.requestPointerLock?.();
    });

    document.addEventListener('pointerlockchange', () => {
      this._locked = document.pointerLockElement === canvas;
      this.mouseDeltaX = 0;
    });

    window.addEventListener('mousemove', e => {
      if (!this._locked) return;
      this.mouseDeltaX = e.movementX || 0;
    });
  }

  postUpdate() {
    this.mouseDeltaX = 0;
  }
}
