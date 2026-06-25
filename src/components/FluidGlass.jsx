import React, { useRef, useState, useEffect, memo, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, createPortal, useFrame, useThree } from '@react-three/fiber';
import {
  useFBO,
  useScroll,
  Image,
  Scroll,
  Preload,
  ScrollControls,
  MeshTransmissionMaterial,
  Text
} from '@react-three/drei';
import { easing } from 'maath';

export default function FluidGlass({ mode = 'lens', backgroundMode = false, lensProps = {}, barProps = {}, cubeProps = {} }) {
  const Wrapper = mode === 'bar' ? Bar : mode === 'cube' ? Cube : Lens;
  const rawOverrides = mode === 'bar' ? barProps : mode === 'cube' ? cubeProps : lensProps;

  const {
    navItems = [
      { label: 'Home', link: '/' },
      { label: 'Services', link: '/services' },
      { label: 'Contact', link: '/contact' }
    ],
    ...modeProps
  } = rawOverrides;

  const content = (
    <>
      {mode === 'bar' && <NavItems items={navItems} />}
      <Wrapper modeProps={modeProps}>
        {!backgroundMode ? (
          <Scroll>
            <Typography />
            <Images />
          </Scroll>
        ) : (
          <BackgroundImages />
        )}
        {!backgroundMode && <Scroll html />}
        <Preload />
      </Wrapper>
    </>
  );

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <Canvas eventSource={document.getElementById('root')} eventPrefix="client" camera={{ position: [0, 0, 20], fov: 15 }} gl={{ alpha: true }}>
        {backgroundMode ? content : (
          <ScrollControls damping={0.2} pages={3} distance={0.4}>
            {content}
          </ScrollControls>
        )}
      </Canvas>
    </div>
  );
}

const ModeWrapper = memo(function ModeWrapper({
  children,
  geometry,
  lockToBottom = false,
  followPointer = true,
  modeProps = {},
  ...props
}) {
  const ref = useRef();
  const buffer = useFBO();
  const { viewport: vp } = useThree();
  const [scene] = useState(() => new THREE.Scene());
  const geoWidthRef = useRef(1);

  useEffect(() => {
    if (geometry) {
      geometry.computeBoundingBox();
      geoWidthRef.current = geometry.boundingBox.max.x - geometry.boundingBox.min.x || 1;
    }
  }, [geometry]);

  useFrame((state, delta) => {
    const { gl, viewport, pointer, camera } = state;
    const v = viewport.getCurrentViewport(camera, [0, 0, 15]);

    const destX = followPointer ? (pointer.x * v.width) / 2 : 0;
    const destY = lockToBottom ? -v.height / 2 + 0.2 : followPointer ? (pointer.y * v.height) / 2 : 0;
    easing.damp3(ref.current.position, [destX, destY, 15], 0.15, delta);

    if (modeProps.scale == null) {
      const maxWorld = v.width * 0.9;
      const desired = maxWorld / geoWidthRef.current;
      ref.current.scale.setScalar(Math.min(0.15, desired));
    }

    gl.setRenderTarget(buffer);
    gl.render(scene, camera);
    gl.setRenderTarget(null);

    // Background Color
    gl.setClearColor(0x0a0a0a, 1);
  });

  const { scale, ior, thickness, anisotropy, chromaticAberration, ...extraMat } = modeProps;

  return (
    <>
      {createPortal(children, scene)}
      <mesh scale={[vp.width, vp.height, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={buffer.texture} transparent />
      </mesh>
      <mesh ref={ref} scale={scale ?? 0.15} rotation-x={Math.PI / 2} geometry={geometry} {...props}>
        <MeshTransmissionMaterial
          buffer={buffer.texture}
          ior={ior ?? 1.15}
          thickness={thickness ?? 5}
          anisotropy={anisotropy ?? 0.01}
          chromaticAberration={chromaticAberration ?? 0.1}
          {...extraMat}
        />
      </mesh>
    </>
  );
});

function Lens({ modeProps, ...p }) {
  const geo = useMemo(() => new THREE.CylinderGeometry(1, 1, 0.5, 32), []);
  return <ModeWrapper geometry={geo} followPointer modeProps={modeProps} {...p} />;
}

function Cube({ modeProps, ...p }) {
  const geo = useMemo(() => new THREE.BoxGeometry(2, 2, 2), []);
  return <ModeWrapper geometry={geo} followPointer modeProps={modeProps} {...p} />;
}

function Bar({ modeProps = {}, ...p }) {
  const defaultMat = {
    transmission: 1,
    roughness: 0,
    thickness: 10,
    ior: 1.15,
    color: '#ffffff',
    attenuationColor: '#ffffff',
    attenuationDistance: 0.25
  };
  const geo = useMemo(() => new THREE.BoxGeometry(4, 1, 1), []);
  return (
    <ModeWrapper
      geometry={geo}
      lockToBottom
      followPointer={false}
      modeProps={{ ...defaultMat, ...modeProps }}
      {...p}
    />
  );
}

function NavItems({ items }) {
  const group = useRef();
  const { viewport, camera } = useThree();

  const DEVICE = {
    mobile: { max: 639, spacing: 0.2, fontSize: 0.035 },
    tablet: { max: 1023, spacing: 0.24, fontSize: 0.035 },
    desktop: { max: Infinity, spacing: 0.3, fontSize: 0.035 }
  };
  const getDevice = () => {
    const w = window.innerWidth;
    return w <= DEVICE.mobile.max ? 'mobile' : w <= DEVICE.tablet.max ? 'tablet' : 'desktop';
  };

  const [device, setDevice] = useState(getDevice());

  useEffect(() => {
    const onResize = () => setDevice(getDevice());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const { spacing, fontSize } = DEVICE[device];

  useFrame(() => {
    if (!group.current) return;
    const v = viewport.getCurrentViewport(camera, [0, 0, 15]);
    group.current.position.set(0, -v.height / 2 + 0.2, 15.1);

    group.current.children.forEach((child, i) => {
      child.position.x = (i - (items.length - 1) / 2) * spacing;
    });
  });

  const handleNavigate = link => {
    if (!link) return;
    link.startsWith('#') ? (window.location.hash = link) : (window.location.href = link);
  };

  return (
    <group ref={group} renderOrder={10}>
      {items.map(({ label, link }) => (
        <Text
          key={label}
          fontSize={fontSize}
          color="white"
          anchorX="center"
          anchorY="middle"
          depthWrite={false}
          outlineWidth={0}
          outlineBlur="20%"
          outlineColor="#000"
          outlineOpacity={0.5}
          depthTest={false}
          renderOrder={10}
          onClick={e => {
            e.stopPropagation();
            handleNavigate(link);
          }}
          onPointerOver={() => (document.body.style.cursor = 'pointer')}
          onPointerOut={() => (document.body.style.cursor = 'auto')}
        >
          {label}
        </Text>
      ))}
    </group>
  );
}

function Images() {
  const group = useRef();
  const data = useScroll();
  const { height } = useThree(s => s.viewport);

  useFrame(() => {
    if (group.current && group.current.children) {
      if (group.current.children[0]) group.current.children[0].material.zoom = 1 + data.range(0, 1 / 3) / 3;
      if (group.current.children[1]) group.current.children[1].material.zoom = 1 + data.range(0, 1 / 3) / 3;
      if (group.current.children[2]) group.current.children[2].material.zoom = 1 + data.range(1.15 / 3, 1 / 3) / 2;
      if (group.current.children[3]) group.current.children[3].material.zoom = 1 + data.range(1.15 / 3, 1 / 3) / 2;
      if (group.current.children[4]) group.current.children[4].material.zoom = 1 + data.range(1.15 / 3, 1 / 3) / 2;
    }
  });

  return (
    <group ref={group}>
      <Image position={[-2, 0, 0]} scale={[3, height / 1.1, 1]} url="/content_creation_new.png" />
      <Image position={[2, 0, 3]} scale={3} url="/video_production_new.png" />
      <Image position={[-2.05, -height, 6]} scale={[1, 3, 1]} url="/digital_marketing_new.png" />
      <Image position={[-0.6, -height, 9]} scale={[1, 2, 1]} url="/web_design_new.png" />
      <Image position={[0.75, -height, 10.5]} scale={1.5} url="/content_creation_new.png" />
    </group>
  );
}

function BackgroundImages() {
  const { height } = useThree(s => s.viewport);
  return (
    <group>
      <Image position={[-2, 0, 0]} scale={[3, height / 1.1, 1]} url="/content_creation_new.png" />
      <Image position={[2, 0, 3]} scale={3} url="/video_production_new.png" />
      <Image position={[-2.05, -height, 6]} scale={[1, 3, 1]} url="/digital_marketing_new.png" />
      <Image position={[-0.6, -height, 9]} scale={[1, 2, 1]} url="/web_design_new.png" />
      <Image position={[0.75, -height, 10.5]} scale={1.5} url="/content_creation_new.png" />
    </group>
  );
}

function Typography() {
  const DEVICE = {
    mobile: { fontSize: 0.2 },
    tablet: { fontSize: 0.4 },
    desktop: { fontSize: 0.6 }
  };
  const getDevice = () => {
    const w = window.innerWidth;
    return w <= 639 ? 'mobile' : w <= 1023 ? 'tablet' : 'desktop';
  };

  const [device, setDevice] = useState(getDevice());

  useEffect(() => {
    const onResize = () => setDevice(getDevice());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const { fontSize } = DEVICE[device];

  return (
    <Text
      position={[0, 0, 12]}
      fontSize={fontSize}
      letterSpacing={-0.05}
      outlineWidth={0}
      outlineBlur="20%"
      outlineColor="#000"
      outlineOpacity={0.5}
      color="white"
      anchorX="center"
      anchorY="middle"
    >
      Colour Parrot
    </Text>
  );
}
