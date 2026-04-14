/**
 * HeroCharacter — Three.js + GSAP 3D character that peeks in and waves.
 *
 * Character model: Uses a free Ready Player Me half-body avatar (GLB).
 * Swap MODEL_URL with any GLB that has a "RightArm" or similar bone.
 *
 * Animation flow:
 *  1. Character starts off-screen left (x = -2.5)
 *  2. Fast peek-in: slides to x = 0 with slight forward lean (0.4s)
 *  3. Wave: RightArm bone rotates 3 times (1.2s total)
 *  4. Idle: subtle breathing loop (continuous, low amplitude)
 */

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { gsap } from "gsap";

// Local GLB — served from public/ folder, base path handled by Vite
const MODEL_URL = `${import.meta.env.BASE_URL}RobotExpressive.glb`;

interface Props {
  className?: string;
}

export function HeroCharacter({ className = "" }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = mount.clientWidth || 500;
    const H = mount.clientHeight || 520;

    // ── Scene ──────────────────────────────────────────────────────────────
    const scene = new THREE.Scene();

    // ── Camera ─────────────────────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 20);
    camera.position.set(0, 0.8, 5.5);
    camera.lookAt(0, 0.2, 0);

    // ── Renderer ───────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,        // transparent background
      powerPreference: "high-performance",
    });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = false;
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ── Lighting ───────────────────────────────────────────────────────────
    const ambient = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambient);

    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(2, 4, 3);
    scene.add(key);

    const fill = new THREE.DirectionalLight(0x8888ff, 0.8);
    fill.position.set(-3, 2, 1);
    scene.add(fill);

    // ── Load model ─────────────────────────────────────────────────────────
    const loader = new GLTFLoader();
    let mixer: THREE.AnimationMixer | null = null;
    let modelRoot: THREE.Object3D | null = null;
    let rightArmBone: THREE.Bone | null = null;
    let idleTween: gsap.core.Tween | null = null;

    // Start off-screen to the left
    const startX = -2.5;

    loader.load(
      MODEL_URL,
      (gltf) => {
        console.log("HeroCharacter: model loaded ✓", gltf.animations.map(a => a.name));
        modelRoot = gltf.scene;
        modelRoot.position.set(startX, -1.8, 0);
        modelRoot.rotation.y = 0.2;
        modelRoot.scale.setScalar(0.7);
        scene.add(modelRoot);

        // Find right arm bone for wave
        modelRoot.traverse((obj) => {
          if (obj instanceof THREE.Bone) {
            const n = obj.name.toLowerCase();
            if (n.includes("rightarm") || n.includes("right_arm") || n.includes("upperarm_r")) {
              rightArmBone = obj;
            }
          }
        });

        // Built-in animations — RobotExpressive has "Wave", "Idle", "Walking" etc.
        if (gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(modelRoot);

          const getAction = (name: string) => {
            const clip = gltf.animations.find(
              (a) => a.name.toLowerCase().includes(name.toLowerCase())
            );
            return clip ? mixer!.clipAction(clip) : null;
          };

          const idleAction = getAction("Idle");
          const waveAction = getAction("Wave");

          if (idleAction) {
            idleAction.setLoop(THREE.LoopRepeat, Infinity);
            idleAction.play();
          }

          if (waveAction) {
            // Play wave once after peek-in
            setTimeout(() => {
              if (!mixer) return;
              waveAction.setLoop(THREE.LoopOnce, 1);
              waveAction.clampWhenFinished = true;
              waveAction.reset().play();
              // Fade back to idle after wave
              setTimeout(() => {
                if (!idleAction || !waveAction) return;
                waveAction.crossFadeTo(idleAction, 0.4, false);
              }, 2000);
            }, 600); // start wave after peek-in completes
          }
        }

        // ── Animation sequence ──────────────────────────────────────────
        const tl = gsap.timeline({ delay: 0.3 });

        // 1. Peek in — fast horizontal slide
        tl.to(modelRoot.position, {
          x: 0.5,
          duration: 0.45,
          ease: "power3.out",
        });

        // 2. Slight forward lean on arrival
        tl.to(modelRoot.rotation, {
          z: -0.06,
          duration: 0.18,
          ease: "power2.out",
        }, "-=0.1");

        tl.to(modelRoot.rotation, {
          z: 0,
          duration: 0.22,
          ease: "power2.inOut",
        });

        // 3. Wave — only if bone found
        if (rightArmBone) {
          const arm = rightArmBone;
          // Store original rotation
          const origX = arm.rotation.x;
          const origZ = arm.rotation.z;

          // Raise arm
          tl.to(arm.rotation, {
            x: origX - 1.1,
            z: origZ + 0.4,
            duration: 0.28,
            ease: "power2.out",
          });

          // Wave 1
          tl.to(arm.rotation, { z: origZ + 0.8, duration: 0.18, ease: "power1.inOut" });
          tl.to(arm.rotation, { z: origZ + 0.2, duration: 0.18, ease: "power1.inOut" });
          // Wave 2
          tl.to(arm.rotation, { z: origZ + 0.8, duration: 0.18, ease: "power1.inOut" });
          tl.to(arm.rotation, { z: origZ + 0.2, duration: 0.18, ease: "power1.inOut" });
          // Wave 3
          tl.to(arm.rotation, { z: origZ + 0.7, duration: 0.16, ease: "power1.inOut" });

          // Lower arm back
          tl.to(arm.rotation, {
            x: origX,
            z: origZ,
            duration: 0.35,
            ease: "power2.inOut",
          });
        }

        // 4. Idle breathing (subtle y bob)
        tl.call(() => {
          if (!modelRoot) return;
          idleTween = gsap.to(modelRoot.position, {
            y: -1.15,
            duration: 2.2,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          });
        });
      },
      undefined,
      (err) => {
        console.error("HeroCharacter: model load FAILED →", err);
        // Show fallback text so user knows something was attempted
        const div = document.createElement("div");
        div.style.cssText = "position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:rgba(37,99,235,0.4);font-size:12px;font-family:monospace;";
        div.textContent = "// character unavailable";
        mount.appendChild(div);
        if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      }
    );

    // ── Render loop ────────────────────────────────────────────────────────
    const timer = new THREE.Timer();
    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      timer.update();
      const delta = timer.getDelta();
      if (mixer) mixer.update(delta);
      renderer.render(scene, camera);
    };
    animate();

    // ── Resize handler ─────────────────────────────────────────────────────
    const onResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // ── Cleanup ────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      idleTween?.kill();
      gsap.killTweensOf(modelRoot?.position);
      gsap.killTweensOf(modelRoot?.rotation);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`absolute inset-0 ${className}`}
      aria-hidden="true"
    />
  );
}
