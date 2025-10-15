"use client";

import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";

export interface ModelProps {
  textureUrl: string;
  onRotationComplete: () => void;
}

export default function Model({ textureUrl, onRotationComplete }: ModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const rotationRef = useRef(0);
  const gltf = useGLTF("/model/modelHuman6.glb");
  const { scene } = gltf;

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.name === "prox_plane") {
        child.visible = false;
      }
      if (child instanceof THREE.Object3D) {
        child.position.set(0, 0, 0);
        child.rotation.set(0, 0, 0);
        child.quaternion.set(0, 0, 0, 1);
        child.animations = [];
      }
      
      // Add subtle emissive glow to t-shirt mesh
      if (child instanceof THREE.Mesh && child.name === "Animated Shirt") {
        const material = child.material as THREE.MeshStandardMaterial;
        if (material) {
          material.emissive = new THREE.Color(0x111111);
          material.emissiveIntensity = 0.3;
        }
      }
    });
    scene.updateMatrixWorld(true);
  }, [scene]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
      rotationRef.current += delta * 0.5;
      groupRef.current.rotation.x = 0;
      groupRef.current.rotation.z = 0;

      if (rotationRef.current >= Math.PI * 2) {
        rotationRef.current = 0;
        onRotationComplete();
      }
    }
  });

  useEffect(() => {
    if (!textureUrl) return;
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(textureUrl, (texture) => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.flipY = false;
      
      const tshirtMaterial = gltf.materials["Tshirt Material"];
      if (tshirtMaterial && (tshirtMaterial instanceof THREE.MeshPhysicalMaterial || tshirtMaterial instanceof THREE.MeshStandardMaterial)) {
        tshirtMaterial.map = texture;
        tshirtMaterial.needsUpdate = true;
      }

      scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.name === "Animated Shirt") {
          const material = child.material;
          if (material && (material instanceof THREE.MeshPhysicalMaterial || material instanceof THREE.MeshStandardMaterial)) {
            material.map = texture;
            material.needsUpdate = true;
          }
        }
      });
    });
  }, [textureUrl, gltf.materials, scene]);

  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={1.2} />
    </group>
  );
}
