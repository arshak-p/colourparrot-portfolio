import { gsap } from 'gsap';

function lerp(a, b, n) {
  return (1 - n) * a + n * b;
}

function getLocalPointerPos(e, rect) {
  let clientX = 0, clientY = 0;
  if (e.touches && e.touches.length > 0) {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  } else {
    clientX = e.clientX;
    clientY = e.clientY;
  }
  return { x: clientX - rect.left, y: clientY - rect.top };
}

function getMouseDistance(p1, p2) {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.hypot(dx, dy);
}

class ImageItem {
  constructor(DOM_el) {
    this.DOM = { el: DOM_el, inner: DOM_el.querySelector('.content__img-inner') };
    this.defaultStyle = { scale: 1, x: 0, y: 0, opacity: 0 };
    this.getRect();
    this.initEvents();
  }
  initEvents() {
    this.resize = () => {
      gsap.set(this.DOM.el, this.defaultStyle);
      this.getRect();
    };
    window.addEventListener('resize', this.resize);
  }
  getRect() {
    this.rect = this.DOM.el.getBoundingClientRect();
  }
  destroy() {
    window.removeEventListener('resize', this.resize);
  }
}

class BaseTrail {
  constructor(container) {
    this.container = container;
    this.DOM = { el: container };
    this.images = [...this.DOM.el.querySelectorAll('.content__img')].map(img => new ImageItem(img));
    this.imagesTotal = this.images.length;
    this.imgPosition = 0;
    this.zIndexVal = 1;
    this.activeImagesCount = 0;
    this.isIdle = true;
    this.threshold = 80;

    this.mousePos = { x: 0, y: 0 };
    this.lastMousePos = { x: 0, y: 0 };
    this.cacheMousePos = { x: 0, y: 0 };

    this.handlePointerMove = ev => {
      const rect = this.container.getBoundingClientRect();
      this.mousePos = getLocalPointerPos(ev, rect);
    };
    
    this.initRender = ev => {
      const rect = this.container.getBoundingClientRect();
      this.mousePos = getLocalPointerPos(ev, rect);
      this.cacheMousePos = { ...this.mousePos };
      this.rafId = requestAnimationFrame(() => this.render());
      window.removeEventListener('mousemove', this.initRender);
      window.removeEventListener('touchmove', this.initRender);
    };

    const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    if (!isTouchDevice) {
      window.addEventListener('mousemove', this.handlePointerMove);
      window.addEventListener('mousemove', this.initRender);
    } else {
      window.addEventListener('touchmove', this.handlePointerMove);
      window.addEventListener('touchmove', this.initRender);
    }
  }

  destroy() {
    window.removeEventListener('mousemove', this.handlePointerMove);
    window.removeEventListener('touchmove', this.handlePointerMove);
    window.removeEventListener('mousemove', this.initRender);
    window.removeEventListener('touchmove', this.initRender);
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.images.forEach(img => {
      gsap.killTweensOf(img.DOM.el);
      gsap.killTweensOf(img.DOM.inner);
      img.destroy();
    });
  }

  onImageActivated() {
    this.activeImagesCount++;
    this.isIdle = false;
  }

  onImageDeactivated() {
    this.activeImagesCount--;
    if (this.activeImagesCount === 0) {
      this.isIdle = true;
    }
  }
}

class ImageTrailVariant1 extends BaseTrail {
  render() {
    let distance = getMouseDistance(this.mousePos, this.lastMousePos);
    this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, 0.1);
    this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, 0.1);

    if (distance > this.threshold) {
      this.showNextImage();
      this.lastMousePos = { ...this.mousePos };
    }
    if (this.isIdle && this.zIndexVal !== 1) this.zIndexVal = 1;
    this.rafId = requestAnimationFrame(() => this.render());
  }

  showNextImage() {
    ++this.zIndexVal;
    this.imgPosition = this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;
    if (!this.images[this.imgPosition]) return;
    const img = this.images[this.imgPosition];

    gsap.killTweensOf(img.DOM.el);
    gsap.timeline({
      onStart: () => this.onImageActivated(),
      onComplete: () => this.onImageDeactivated()
    })
    .fromTo(img.DOM.el, {
      opacity: 1, scale: 1, zIndex: this.zIndexVal,
      x: this.cacheMousePos.x - img.rect.width / 2, y: this.cacheMousePos.y - img.rect.height / 2
    }, {
      duration: 0.4, ease: 'power1',
      x: this.mousePos.x - img.rect.width / 2, y: this.mousePos.y - img.rect.height / 2
    }, 0)
    .to(img.DOM.el, { duration: 0.4, ease: 'power3', opacity: 0, scale: 0.2 }, 0.4);
  }
}

class ImageTrailVariant2 extends BaseTrail {
  render() {
    let distance = getMouseDistance(this.mousePos, this.lastMousePos);
    this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, 0.1);
    this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, 0.1);
    if (distance > this.threshold) {
      this.showNextImage();
      this.lastMousePos = { ...this.mousePos };
    }
    if (this.isIdle && this.zIndexVal !== 1) this.zIndexVal = 1;
    this.rafId = requestAnimationFrame(() => this.render());
  }

  showNextImage() {
    ++this.zIndexVal;
    this.imgPosition = this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;
    if (!this.images[this.imgPosition]) return;
    const img = this.images[this.imgPosition];

    gsap.killTweensOf(img.DOM.el);
    gsap.killTweensOf(img.DOM.inner);
    gsap.timeline({
      onStart: () => this.onImageActivated(),
      onComplete: () => this.onImageDeactivated()
    })
    .fromTo(img.DOM.el, {
      opacity: 1, scale: 0, zIndex: this.zIndexVal,
      x: this.cacheMousePos.x - img.rect.width / 2, y: this.cacheMousePos.y - img.rect.height / 2
    }, {
      duration: 0.4, ease: 'power1', scale: 1,
      x: this.mousePos.x - img.rect.width / 2, y: this.mousePos.y - img.rect.height / 2
    }, 0)
    .fromTo(img.DOM.inner, { scale: 2.8, filter: 'brightness(250%)' }, { duration: 0.4, ease: 'power1', scale: 1, filter: 'brightness(100%)' }, 0)
    .to(img.DOM.el, { duration: 0.4, ease: 'power2', opacity: 0, scale: 0.2 }, 0.45);
  }
}

class ImageTrailVariant3 extends BaseTrail {
  render() {
    let distance = getMouseDistance(this.mousePos, this.lastMousePos);
    this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, 0.1);
    this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, 0.1);
    if (distance > this.threshold) {
      this.showNextImage();
      this.lastMousePos = { ...this.mousePos };
    }
    if (this.isIdle && this.zIndexVal !== 1) this.zIndexVal = 1;
    this.rafId = requestAnimationFrame(() => this.render());
  }

  showNextImage() {
    ++this.zIndexVal;
    this.imgPosition = this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;
    if (!this.images[this.imgPosition]) return;
    const img = this.images[this.imgPosition];

    gsap.killTweensOf(img.DOM.el);
    gsap.killTweensOf(img.DOM.inner);
    gsap.timeline({
      onStart: () => this.onImageActivated(),
      onComplete: () => this.onImageDeactivated()
    })
    .fromTo(img.DOM.el, {
      opacity: 1, scale: 0, zIndex: this.zIndexVal, xPercent: 0, yPercent: 0,
      x: this.cacheMousePos.x - img.rect.width / 2, y: this.cacheMousePos.y - img.rect.height / 2
    }, {
      duration: 0.4, ease: 'power1', scale: 1,
      x: this.mousePos.x - img.rect.width / 2, y: this.mousePos.y - img.rect.height / 2
    }, 0)
    .fromTo(img.DOM.inner, { scale: 1.2 }, { duration: 0.4, ease: 'power1', scale: 1 }, 0)
    .to(img.DOM.el, { duration: 0.6, ease: 'power2', opacity: 0, scale: 0.2, xPercent: () => gsap.utils.random(-30, 30), yPercent: -200 }, 0.6);
  }
}

class ImageTrailVariant4 extends BaseTrail {
  render() {
    let distance = getMouseDistance(this.mousePos, this.lastMousePos);
    if (distance > this.threshold) {
      this.showNextImage();
      this.lastMousePos = { ...this.mousePos };
    }
    this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, 0.1);
    this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, 0.1);
    if (this.isIdle && this.zIndexVal !== 1) this.zIndexVal = 1;
    this.rafId = requestAnimationFrame(() => this.render());
  }

  showNextImage() {
    ++this.zIndexVal;
    this.imgPosition = this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;
    if (!this.images[this.imgPosition]) return;
    const img = this.images[this.imgPosition];

    let dx = this.mousePos.x - this.cacheMousePos.x;
    let dy = this.mousePos.y - this.cacheMousePos.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance !== 0) { dx /= distance; dy /= distance; }
    dx *= distance / 100; dy *= distance / 100;

    gsap.killTweensOf(img.DOM.el);
    gsap.killTweensOf(img.DOM.inner);
    gsap.timeline({
      onStart: () => this.onImageActivated(),
      onComplete: () => this.onImageDeactivated()
    })
    .fromTo(img.DOM.el, {
      opacity: 1, scale: 0, zIndex: this.zIndexVal,
      x: this.cacheMousePos.x - img.rect.width / 2, y: this.cacheMousePos.y - img.rect.height / 2
    }, {
      duration: 0.4, ease: 'power1', scale: 1,
      x: this.mousePos.x - img.rect.width / 2, y: this.mousePos.y - img.rect.height / 2
    }, 0)
    .fromTo(img.DOM.inner, { scale: 2, filter: `brightness(${Math.max((400 * distance) / 100, 100)}%) contrast(${Math.max((400 * distance) / 100, 100)}%)` }, { duration: 0.4, ease: 'power1', scale: 1, filter: 'brightness(100%) contrast(100%)' }, 0)
    .to(img.DOM.el, { duration: 0.4, ease: 'power3', opacity: 0 }, 0.4)
    .to(img.DOM.el, { duration: 1.5, ease: 'power4', x: `+=${dx * 110}`, y: `+=${dy * 110}` }, 0.05);
  }
}

class ImageTrailVariant5 extends BaseTrail {
  constructor(container) {
    super(container);
    this.lastAngle = 0;
  }
  render() {
    let distance = getMouseDistance(this.mousePos, this.lastMousePos);
    if (distance > this.threshold) {
      this.showNextImage();
      this.lastMousePos = { ...this.mousePos };
    }
    this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, 0.1);
    this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, 0.1);
    if (this.isIdle && this.zIndexVal !== 1) this.zIndexVal = 1;
    this.rafId = requestAnimationFrame(() => this.render());
  }
  showNextImage() {
    let dx = this.mousePos.x - this.cacheMousePos.x;
    let dy = this.mousePos.y - this.cacheMousePos.y;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    if (angle < 0) angle += 360;
    if (angle > 90 && angle <= 270) angle += 180;
    const isMovingClockwise = angle >= this.lastAngle;
    this.lastAngle = angle;
    let startAngle = isMovingClockwise ? angle - 10 : angle + 10;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance !== 0) { dx /= distance; dy /= distance; }
    dx *= distance / 150; dy *= distance / 150;

    ++this.zIndexVal;
    this.imgPosition = this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;
    if (!this.images[this.imgPosition]) return;
    const img = this.images[this.imgPosition];

    gsap.killTweensOf(img.DOM.el);
    gsap.timeline({
      onStart: () => this.onImageActivated(),
      onComplete: () => this.onImageDeactivated()
    })
    .fromTo(img.DOM.el, {
      opacity: 1, filter: 'brightness(80%)', scale: 0.1, zIndex: this.zIndexVal,
      x: this.cacheMousePos.x - img.rect.width / 2, y: this.cacheMousePos.y - img.rect.height / 2, rotation: startAngle
    }, {
      duration: 1, ease: 'power2', scale: 1, filter: 'brightness(100%)',
      x: this.mousePos.x - img.rect.width / 2 + dx * 70, y: this.mousePos.y - img.rect.height / 2 + dy * 70, rotation: this.lastAngle
    }, 0)
    .to(img.DOM.el, { duration: 0.4, ease: 'expo', opacity: 0 }, 0.5)
    .to(img.DOM.el, { duration: 1.5, ease: 'power4', x: `+=${dx * 120}`, y: `+=${dy * 120}` }, 0.05);
  }
}

class ImageTrailVariant6 extends BaseTrail {
  render() {
    let distance = getMouseDistance(this.mousePos, this.lastMousePos);
    this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, 0.3);
    this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, 0.3);
    if (distance > this.threshold) {
      this.showNextImage();
      this.lastMousePos = { ...this.mousePos };
    }
    if (this.isIdle && this.zIndexVal !== 1) this.zIndexVal = 1;
    this.rafId = requestAnimationFrame(() => this.render());
  }

  mapSpeedToSize(speed, minSize, maxSize) { return minSize + (maxSize - minSize) * Math.min(speed / 200, 1); }
  mapSpeedToBrightness(speed, minB, maxB) { return minB + (maxB - minB) * Math.min(speed / 70, 1); }
  mapSpeedToBlur(speed, minBlur, maxBlur) { return minBlur + (maxBlur - minBlur) * Math.min(speed / 90, 1); }
  mapSpeedToGrayscale(speed, minG, maxG) { return minG + (maxG - minG) * Math.min(speed / 90, 1); }

  showNextImage() {
    let dx = this.mousePos.x - this.cacheMousePos.x;
    let dy = this.mousePos.y - this.cacheMousePos.y;
    let speed = Math.sqrt(dx * dx + dy * dy);

    ++this.zIndexVal;
    this.imgPosition = this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;
    if (!this.images[this.imgPosition]) return;
    const img = this.images[this.imgPosition];

    let scaleFactor = this.mapSpeedToSize(speed, 0.3, 2);
    let brightnessValue = this.mapSpeedToBrightness(speed, 0, 1.3);
    let blurValue = this.mapSpeedToBlur(speed, 20, 0);
    let grayscaleValue = this.mapSpeedToGrayscale(speed, 600, 0);

    gsap.killTweensOf(img.DOM.el);
    gsap.killTweensOf(img.DOM.inner);
    gsap.timeline({
      onStart: () => this.onImageActivated(),
      onComplete: () => this.onImageDeactivated()
    })
    .fromTo(img.DOM.el, {
      opacity: 1, scale: 0, zIndex: this.zIndexVal,
      x: this.cacheMousePos.x - img.rect.width / 2, y: this.cacheMousePos.y - img.rect.height / 2
    }, {
      duration: 0.8, ease: 'power3', scale: scaleFactor, filter: `grayscale(${grayscaleValue * 100}%) brightness(${brightnessValue * 100}%) blur(${blurValue}px)`,
      x: this.mousePos.x - img.rect.width / 2, y: this.mousePos.y - img.rect.height / 2
    }, 0)
    .fromTo(img.DOM.inner, { scale: 2 }, { duration: 0.8, ease: 'power3', scale: 1 }, 0)
    .to(img.DOM.el, { duration: 0.4, ease: 'power3.in', opacity: 0, scale: 0.2 }, 0.45);
  }
}

class ImageTrailVariant7 extends BaseTrail {
  constructor(container) {
    super(container);
    this.visibleImagesCount = 0;
    this.visibleImagesTotal = Math.min(9, this.imagesTotal - 1);
  }
  render() {
    let distance = getMouseDistance(this.mousePos, this.lastMousePos);
    this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, 0.3);
    this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, 0.3);
    if (distance > this.threshold) {
      this.showNextImage();
      this.lastMousePos = { ...this.mousePos };
    }
    if (this.isIdle && this.zIndexVal !== 1) this.zIndexVal = 1;
    this.rafId = requestAnimationFrame(() => this.render());
  }

  showNextImage() {
    ++this.zIndexVal;
    this.imgPosition = this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;
    if (!this.images[this.imgPosition]) return;
    const img = this.images[this.imgPosition];
    ++this.visibleImagesCount;

    gsap.killTweensOf(img.DOM.el);
    const scaleValue = gsap.utils.random(0.5, 1.6);

    gsap.timeline({
      onStart: () => this.onImageActivated(),
      onComplete: () => { this.activeImagesCount--; }
    })
    .fromTo(img.DOM.el, {
      scale: scaleValue - Math.max(gsap.utils.random(0.2, 0.6), 0), rotationZ: 0, opacity: 1, zIndex: this.zIndexVal,
      x: this.cacheMousePos.x - img.rect.width / 2, y: this.cacheMousePos.y - img.rect.height / 2
    }, {
      duration: 0.4, ease: 'power3', scale: scaleValue, rotationZ: gsap.utils.random(-3, 3),
      x: this.mousePos.x - img.rect.width / 2, y: this.mousePos.y - img.rect.height / 2
    }, 0);

    if (this.visibleImagesCount >= this.visibleImagesTotal) {
      const realOffset = Math.abs(this.visibleImagesTotal) % this.images.length;
      let pos = this.imgPosition - realOffset >= 0 ? this.imgPosition - realOffset : this.images.length - (realOffset - this.imgPosition);
      if (this.images[pos]) {
        gsap.to(this.images[pos].DOM.el, {
          duration: 0.4, ease: 'power4', opacity: 0, scale: 1.3,
          onComplete: () => { if (this.activeImagesCount === 0) this.isIdle = true; }
        });
      }
    }
  }
}

class ImageTrailVariant8 extends BaseTrail {
  constructor(container) {
    super(container);
    this.rotation = { x: 0, y: 0 };
    this.cachedRotation = { x: 0, y: 0 };
    this.zValue = 0;
    this.cachedZValue = 0;
  }
  render() {
    let distance = getMouseDistance(this.mousePos, this.lastMousePos);
    this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, 0.1);
    this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, 0.1);
    if (distance > this.threshold) {
      this.showNextImage();
      this.lastMousePos = { ...this.mousePos };
    }
    if (this.isIdle && this.zIndexVal !== 1) this.zIndexVal = 1;
    this.rafId = requestAnimationFrame(() => this.render());
  }

  showNextImage() {
    const rect = this.container.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const relX = this.mousePos.x - centerX;
    const relY = this.mousePos.y - centerY;

    this.rotation.x = -(relY / centerY) * 30;
    this.rotation.y = (relX / centerX) * 30;
    this.cachedRotation = { ...this.rotation };

    const proportion = Math.sqrt(relX * relX + relY * relY) / Math.sqrt(centerX * centerX + centerY * centerY);
    this.zValue = proportion * 1200 - 600;
    this.cachedZValue = this.zValue;
    const brightness = 0.2 + ((this.zValue + 600) / 1200) * 2.3;

    ++this.zIndexVal;
    this.imgPosition = this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;
    if (!this.images[this.imgPosition]) return;
    const img = this.images[this.imgPosition];

    gsap.killTweensOf(img.DOM.el);
    gsap.timeline({
      onStart: () => this.onImageActivated(),
      onComplete: () => this.onImageDeactivated()
    })
    .set(this.DOM.el, { perspective: 1000 }, 0)
    .fromTo(img.DOM.el, {
      opacity: 1, z: 0, scale: 1 + this.cachedZValue / 1000, zIndex: this.zIndexVal,
      x: this.cacheMousePos.x - img.rect.width / 2, y: this.cacheMousePos.y - img.rect.height / 2, rotationX: this.cachedRotation.x, rotationY: this.cachedRotation.y, filter: `brightness(${brightness})`
    }, {
      duration: 1, ease: 'expo', scale: 1 + this.zValue / 1000,
      x: this.mousePos.x - img.rect.width / 2, y: this.mousePos.y - img.rect.height / 2, rotationX: this.rotation.x, rotationY: this.rotation.y
    }, 0)
    .to(img.DOM.el, { duration: 0.4, ease: 'power2', opacity: 0, z: -800 }, 0.3);
  }
}

export const variantMap = {
  1: ImageTrailVariant1,
  2: ImageTrailVariant2,
  3: ImageTrailVariant3,
  4: ImageTrailVariant4,
  5: ImageTrailVariant5,
  6: ImageTrailVariant6,
  7: ImageTrailVariant7,
  8: ImageTrailVariant8
};
