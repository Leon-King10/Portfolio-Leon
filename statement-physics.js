// Physics for the point-of-view statement only. The heading remains the layout source.
(() => {
  const section = document.querySelector('.statement');
  const inner = section?.querySelector('.statement-inner');
  const title = section?.querySelector('.scatter-text');
  if (!section || !inner || !title) return;

  const sentence = title.textContent.trim();
  title.setAttribute('aria-label', sentence);
  title.replaceChildren(...sentence.split(/( )/).map(word => {
    if (word === ' ') return document.createTextNode(' ');
    const wrapper = document.createElement('span');
    wrapper.className = 'word';
    for (const character of word) {
      const span = document.createElement('span');
      span.className = 'letter';
      span.setAttribute('aria-hidden', 'true');
      span.textContent = character;
      wrapper.append(span);
    }
    return wrapper;
  }));

  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.Matter) return;

  const { Engine, Bodies, Body, Composite, Events } = Matter;
  const STEP = 1000 / 60;
  const START = .68;
  const RESET = .62;
  const ROW_DELAY = 260;
  let engine, layer, pieces = [], running = false, visible = false;
  let frameId = 0, previousTime = 0, accumulator = 0, elapsed = 0;
  let floorImpactAt = null;
  let bottomRow = 0;
  let cursor = null;

  function progress() {
    const rect = section.getBoundingClientRect();
    return Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height - innerHeight)));
  }

  function build() {
    const titleStyle = getComputedStyle(title);
    const innerRect = inner.getBoundingClientRect();
    const positions = [...title.querySelectorAll('.letter')].map(element => {
      const rect = element.getBoundingClientRect();
      return {
        character: element.textContent,
        x: rect.left - innerRect.left + rect.width / 2,
        y: rect.top - innerRect.top + rect.height / 2,
        width: Math.max(4, rect.width),
        height: Math.max(4, rect.height),
        top: rect.top
      };
    });
    const rowTops = [...new Set(positions.map(position => Math.round(position.top / 4) * 4))].sort((a, b) => a - b);
    bottomRow = rowTops.length - 1;

    engine = Engine.create({ positionIterations: 8, velocityIterations: 6 });
    engine.gravity.y = 1.05;
    engine.gravity.scale = .001;
    const width = inner.clientWidth;
    const height = inner.clientHeight;
    const floor = Bodies.rectangle(width / 2, height + 30, width + 120, 60, { isStatic: true, friction: .8 });
    Composite.add(engine.world, [
      floor,
      Bodies.rectangle(-30, height / 2, 60, height * 2, { isStatic: true, friction: .8 }),
      Bodies.rectangle(width + 30, height / 2, 60, height * 2, { isStatic: true, friction: .8 })
    ]);

    layer = document.createElement('div');
    layer.className = 'statement-physics-layer';
    layer.setAttribute('aria-hidden', 'true');
    layer.style.font = titleStyle.font;
    layer.style.letterSpacing = titleStyle.letterSpacing;
    layer.style.lineHeight = titleStyle.lineHeight;
    layer.style.textTransform = titleStyle.textTransform;
    layer.style.color = titleStyle.color;
    inner.append(layer);

    pieces = positions.map(position => {
      const row = rowTops.findIndex(top => Math.abs(top - position.top) <= 4);
      const body = Bodies.rectangle(position.x, position.y, position.width, position.height, {
        density: .004,
        friction: .55,
        frictionStatic: .85,
        restitution: .13,
        frictionAir: .025,
        sleepThreshold: 90
      });
      Body.setStatic(body, true);
      Composite.add(engine.world, body);
      const element = document.createElement('span');
      element.className = 'letter';
      element.textContent = position.character;
      element.style.width = `${position.width}px`;
      element.style.height = `${position.height}px`;
      layer.append(element);
      return { body, element, row, released: false };
    });
    const bottomBodies = new Set(pieces.filter(piece => piece.row === bottomRow).map(piece => piece.body));
    Events.on(engine, 'collisionStart', event => {
      if (floorImpactAt !== null) return;
      if (event.pairs.some(pair =>
        (pair.bodyA === floor && bottomBodies.has(pair.bodyB)) ||
        (pair.bodyB === floor && bottomBodies.has(pair.bodyA))
      )) floorImpactAt = elapsed;
    });
    title.style.visibility = 'hidden';
    elapsed = accumulator = previousTime = 0;
    floorImpactAt = null;
    running = true;
    render();
    if (visible) frameId = requestAnimationFrame(tick);
  }

  function reset() {
    running = false;
    cancelAnimationFrame(frameId);
    frameId = 0;
    layer?.remove();
    layer = null;
    title.style.visibility = '';
    if (engine) {
      Composite.clear(engine.world, false);
      Engine.clear(engine);
      engine = null;
    }
    pieces = [];
    cursor = null;
    floorImpactAt = null;
  }

  function render() {
    for (const { body, element } of pieces) {
      element.style.transform = `translate(${body.position.x}px, ${body.position.y}px) translate(-50%, -50%) rotate(${body.angle}rad)`;
    }
  }

  function pushNearby() {
    if (!cursor?.pending) return;
    cursor.pending = false;
    const rawSpeed = Math.hypot(cursor.vx, cursor.vy);
    if (rawSpeed < .08) return;
    const speed = Math.min(2.5, rawSpeed);
    const radius = 145;
    for (const { body, released } of pieces) {
      if (!released) continue;
      const distance = Math.hypot(body.position.x - cursor.x, body.position.y - cursor.y);
      if (distance >= radius) continue;
      const falloff = (1 - distance / radius) ** 2;
      const force = body.mass * Math.min(.004, speed * .0016) * falloff;
      const x = cursor.vx / rawSpeed;
      const y = cursor.vy / rawSpeed * .3 - .7;
      const directionLength = Math.max(1, Math.hypot(x, y));
      Body.applyForce(body, body.position, { x: x * force / directionLength, y: y * force / directionLength });
    }
  }

  function tick(time) {
    if (!running || !visible) { frameId = 0; return; }
    if (!previousTime) previousTime = time;
    accumulator += Math.min(67, time - previousTime);
    previousTime = time;
    let steps = 0;
    while (accumulator >= STEP && steps < 4) {
      for (const piece of pieces) {
        if (piece.released || (piece.row !== bottomRow &&
          (floorImpactAt === null || elapsed < floorImpactAt + (bottomRow - piece.row) * ROW_DELAY))) continue;
        piece.released = true;
        Body.setStatic(piece.body, false);
        // A slight outward tip lets the edge letters respond to their balance.
        const edge = (piece.body.position.x - inner.clientWidth / 2) / (inner.clientWidth / 2);
        Body.setAngularVelocity(piece.body, edge * .004);
      }
      pushNearby();
      Engine.update(engine, STEP);
      for (const { body, released } of pieces) {
        if (released) Body.setAngularVelocity(body, body.angularVelocity * .992);
      }
      elapsed += STEP;
      accumulator -= STEP;
      steps++;
    }
    if (steps === 4) accumulator = 0;
    render();
    frameId = requestAnimationFrame(tick);
  }

  function onScroll() {
    const amount = progress();
    if (running && amount < RESET) reset();
    else if (!running && visible && amount >= START) build();
  }

  inner.addEventListener('pointermove', event => {
    if (!running || event.pointerType === 'touch') return;
    const rect = inner.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const delta = cursor ? Math.max(8, event.timeStamp - cursor.time) : 16;
    cursor = {
      x, y,
      vx: cursor ? Math.max(-2.5, Math.min(2.5, (x - cursor.x) / delta)) : 0,
      vy: cursor ? Math.max(-2.5, Math.min(2.5, (y - cursor.y) / delta)) : 0,
      time: event.timeStamp,
      pending: true
    };
  }, { passive: true });

  const observer = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (!visible) {
      cancelAnimationFrame(frameId);
      frameId = 0;
      previousTime = 0;
    } else {
      onScroll();
      if (running && !frameId) frameId = requestAnimationFrame(tick);
    }
  });
  observer.observe(inner);
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', () => {
    if (running) reset();
    onScroll();
  });
  document.fonts?.ready.then(() => {
    if (running) reset();
    onScroll();
  });
  onScroll();
})();
