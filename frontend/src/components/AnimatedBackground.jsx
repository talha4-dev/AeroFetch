import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function AnimatedBackground() {
    const mountRef = useRef(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        mount.appendChild(renderer.domElement);

        // Particles
        const particleCount = 120;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        const palette = [
            new THREE.Color('#6c63ff'),
            new THREE.Color('#00d4aa'),
            new THREE.Color('#9b8fff'),
            new THREE.Color('#00ffcc'),
            new THREE.Color('#ff6b6b'),
        ];

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

            const color = palette[Math.floor(Math.random() * palette.length)];
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;

            sizes[i] = Math.random() * 3 + 0.5;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.PointsMaterial({
            size: 0.08,
            vertexColors: true,
            transparent: true,
            opacity: 0.7,
            sizeAttenuation: true,
        });

        const particles = new THREE.Points(geometry, material);
        scene.add(particles);

        // Floating mesh orbs
        const orbGeometry = new THREE.SphereGeometry(1.5, 32, 32);
        const orbMaterial = new THREE.MeshBasicMaterial({
            color: 0x6c63ff, wireframe: true, transparent: true, opacity: 0.04,
        });
        const orb = new THREE.Mesh(orbGeometry, orbMaterial);
        orb.position.set(-3, 1, -2);
        scene.add(orb);

        const orb2Geo = new THREE.SphereGeometry(1, 24, 24);
        const orb2Mat = new THREE.MeshBasicMaterial({
            color: 0x00d4aa, wireframe: true, transparent: true, opacity: 0.04,
        });
        const orb2 = new THREE.Mesh(orb2Geo, orb2Mat);
        orb2.position.set(3, -1, -3);
        scene.add(orb2);

        // Mouse tracking
        const mouse = { x: 0, y: 0 };
        const handleMouseMove = (e) => {
            mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
            mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
        };
        window.addEventListener('mousemove', handleMouseMove);

        // Resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        // Animation loop
        let animFrame;
        const clock = new THREE.Clock();
        const animate = () => {
            animFrame = requestAnimationFrame(animate);
            const t = clock.getElapsedTime();

            particles.rotation.y = t * 0.03 + mouse.x * 0.05;
            particles.rotation.x = t * 0.015 + mouse.y * 0.03;

            orb.rotation.x = t * 0.15;
            orb.rotation.y = t * 0.2;
            orb.position.y = Math.sin(t * 0.4) * 0.5 + 1;

            orb2.rotation.x = t * 0.1;
            orb2.rotation.z = t * 0.15;
            orb2.position.y = Math.cos(t * 0.3) * 0.5 - 1;

            renderer.render(scene, camera);
        };
        animate();

        return () => {
            cancelAnimationFrame(animFrame);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            renderer.dispose();
            geometry.dispose();
            material.dispose();
            if (mount.contains(renderer.domElement)) {
                mount.removeChild(renderer.domElement);
            }
        };
    }, []);

    return (
        <div
            ref={mountRef}
            style={{
                position: 'fixed',
                top: 0, left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 0,
                pointerEvents: 'none',
                overflow: 'hidden',
            }}
            aria-hidden="true"
        />
    );
}
