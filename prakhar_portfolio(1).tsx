import React, { useState, useEffect, useRef } from 'react';
import { Github, Linkedin, Mail, Code2, Trophy, Star, ArrowUpRight, Sparkles } from 'lucide-react';
import * as THREE from 'three';

export default function Portfolio() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeProject, setActiveProject] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef(null);

  // Three.js animated background
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const material = new THREE.ShaderMaterial({
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
      },
      vertexShader: `
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float iTime;
        uniform vec2 iResolution;

        #define NUM_OCTAVES 3

        float rand(vec2 n) {
          return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
        }

        float noise(vec2 p) {
          vec2 ip = floor(p);
          vec2 u = fract(p);
          u = u*u*(3.0-2.0*u);

          float res = mix(
            mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x),
            mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x), u.y);
          return res * res;
        }

        float fbm(vec2 x) {
          float v = 0.0;
          float a = 0.3;
          vec2 shift = vec2(100);
          mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
          for (int i = 0; i < NUM_OCTAVES; ++i) {
            v += a * noise(x);
            x = rot * x * 2.0 + shift;
            a *= 0.4;
          }
          return v;
        }

        void main() {
          vec2 shake = vec2(sin(iTime * 1.2) * 0.005, cos(iTime * 2.1) * 0.005);
          vec2 p = ((gl_FragCoord.xy + shake * iResolution.xy) - iResolution.xy * 0.5) / iResolution.y * mat2(6.0, -4.0, 4.0, 6.0);
          vec2 v;
          vec4 o = vec4(0.0);

          float f = 2.0 + fbm(p + vec2(iTime * 5.0, 0.0)) * 0.5;

          for (float i = 0.0; i < 35.0; i++) {
            v = p + cos(i * i + (iTime + p.x * 0.08) * 0.025 + i * vec2(13.0, 11.0)) * 3.5 + vec2(sin(iTime * 3.0 + i) * 0.003, cos(iTime * 3.5 - i) * 0.003);
            float tailNoise = fbm(v + vec2(iTime * 0.5, i)) * 0.3 * (1.0 - (i / 35.0));
            vec4 auroraColors = vec4(
              0.1 + 0.3 * sin(i * 0.2 + iTime * 0.4),
              0.3 + 0.5 * cos(i * 0.3 + iTime * 0.5),
              0.7 + 0.3 * sin(i * 0.4 + iTime * 0.3),
              1.0
            );
            vec4 currentContribution = auroraColors * exp(sin(i * i + iTime * 0.8)) / length(max(v, vec2(v.x * f * 0.015, v.y * 1.5)));
            float thinnessFactor = smoothstep(0.0, 1.0, i / 35.0) * 0.6;
            o += currentContribution * (1.0 + tailNoise * 0.8) * thinnessFactor;
          }

          o = tanh(pow(o / 100.0, vec4(1.6)));
          gl_FragColor = o * 1.5;
        }
      `
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let frameId;
    const animate = () => {
      material.uniforms.iTime.value += 0.016;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      material.uniforms.iResolution.value.set(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const projects = [
    {
      title: 'VyTal',
      award: '1st Place • IEEE WoP',
      description: 'Won IEEE Winter of Projects with this smart health companion that simplifies medical record management. Built an AI chatbot for health queries, medicine verification system, emergency SOS features, and added gamification to make healthcare engagement actually fun.',
      tech: ['AI/ML', 'Healthcare', 'Gamification']
    },
    {
      title: 'ClauseWise',
      award: '2nd Place • Cognitive-X',
      description: 'Secured 2nd place at Cognitive-X Hackathon with an AI-powered legal document analyzer. Transforms complex legal contracts into plain English in seconds, achieved 95% classification accuracy, and built a visual dashboard for risk assessment.',
      tech: ['NLP', 'AI', 'Legal Tech']
    }
  ];

  const currentActivities = [
    {
      logo: 'https://bmsit.ac.in/wp-content/uploads/2023/04/bmsit-logo.png',
      title: 'BE in Computer Science',
      institution: 'BMSIT&M',
      description: 'Diving deep into algorithms, system design, and software engineering fundamentals.',
      status: 'In Progress'
    },
    {
      logo: 'https://www.iitm.ac.in/sites/default/files/images/logo/iitm_logo.png',
      title: 'BS in Data Science & Applications',
      institution: 'IIT Madras',
      description: 'Exploring statistical methods, machine learning, and data-driven decision making.',
      status: 'In Progress'
    }
  ];

  const skills = [
    { name: 'Python', level: 90 },
    { name: 'C++', level: 85 },
    { name: 'Data Analysis', level: 88 },
    { name: 'Machine Learning', level: 82 },
    { name: 'Problem Solving', level: 90 },
  ];

  return (
    <div className="bg-black text-white min-h-screen relative overflow-hidden">
      {/* Animated shader background */}
      <div ref={containerRef} className="fixed inset-0 z-0" />

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-6 backdrop-blur-xl bg-black/30 border-b border-white/10">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Prakhar Singh
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-8 pt-20">
          <div className="max-w-5xl w-full">
            <div className="space-y-8">
              
              <h1 className="text-7xl md:text-8xl font-bold leading-tight">
                Building AI
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  solutions
                </span>
                <br />
                that matter
              </h1>
              
              <p className="text-xl text-zinc-400 max-w-2xl leading-relaxed">
                CS student passionate about artificial intelligence and data science. 
                I create systems that solve real problems. Currently exploring the intersection 
                of AI and practical applications.
              </p>

              <div className="pt-8 flex items-center gap-6 text-zinc-500">
                <span className="flex items-center gap-2">📍 Bengaluru, India</span>
              </div>
            </div>
          </div>
        </section>

        {/* Winning Projects */}
        <section id="projects" className="py-32 px-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-16">
              <Trophy className="text-yellow-400" size={32} />
              <h2 className="text-5xl font-bold">Winning Projects</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {projects.map((project, idx) => (
                <div
                  key={idx}
                  onMouseEnter={() => setActiveProject(idx)}
                  className="group relative p-8 bg-black border border-white/10 rounded-3xl hover:border-blue-500/50 transition-all duration-500 cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
                  
                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-3xl font-bold">{project.title}</h3>
                      <ArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
                    </div>
                    
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-sm text-yellow-400 mb-4">
                      <Trophy size={14} />
                      {project.award}
                    </div>
                    
                    <p className="text-zinc-400 leading-relaxed mb-6">
                      {project.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech, i) => (
                        <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-zinc-400">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Currently Doing */}
        <section id="currently" className="py-32 px-8 bg-white/5">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-16">
              <Sparkles className="text-blue-400" size={32} />
              <h2 className="text-5xl font-bold">Currently Pursuing</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {currentActivities.map((activity, idx) => (
                <div
                  key={idx}
                  className="group p-8 bg-black border border-white/10 rounded-3xl hover:border-purple-500/50 transition-all duration-500"
                >
                  <div className="mb-4">
                    <h3 className="text-xl font-bold mb-1">{activity.title}</h3>
                    <p className="text-sm text-zinc-500">{activity.institution}</p>
                  </div>
                  
                  <p className="text-zinc-400 leading-relaxed">
                    {activity.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Skills */}
        <section id="skills" className="py-32 px-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-16">
              <Code2 className="text-blue-400" size={32} />
              <h2 className="text-5xl font-bold">Skills & Expertise</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {['Python', 'Data Analysis', 'Machine Learning', 'Statistics', 'Data Preprocessing', 'Problem Solving', 'Git / GitHub', 'Exploratory Data Analysis (EDA)', 'Feature Engineering', 'Model Evaluation & Validation', 'Data Visualization (Matplotlib / Seaborn / Plotly)', 'AI-Assisted Development (Claude / ChatGPT)'].map((tech, idx) => (
                <div key={idx} className="p-4 bg-black border border-white/10 rounded-xl text-center hover:border-blue-500/50 transition-all">
                  <span className="text-sm text-zinc-400">{tech}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="py-32 px-8 bg-white/5">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-5xl font-bold mb-6">Let's Build Something</h2>
            <p className="text-xl text-zinc-400 mb-12">
              Open to collaborations, hackathons, and interesting projects
            </p>
            
            <a
              href="mailto:24ug1bycs526@bmsit.in"
              className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full font-medium text-lg hover:scale-105 transition-transform"
            >
              <Mail size={20} />
              Get in Touch
            </a>

            <div className="mt-12 text-zinc-500">
              24ug1bycs526@bmsit.in
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-8 border-t border-white/5">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-zinc-600 text-sm">
                © 2025 Prakhar Singh • Bengaluru, India
              </div>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <a
                  href="https://github.com/Kshtiz-Debug"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 border border-white/10 hover:border-white/30 rounded-full font-medium transition-all flex items-center gap-2 text-sm"
                >
                  <Github size={18} /> GitHub
                </a>
                <a
                  href="https://leetcode.com/u/Kshitix_24/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 border border-white/10 hover:border-white/30 rounded-full font-medium transition-all flex items-center gap-2 text-sm"
                >
                  <Code2 size={18} /> LeetCode
                </a>
                <a
                  href="https://www.linkedin.com/in/prakhar-singh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 border border-white/10 hover:border-white/30 rounded-full font-medium transition-all flex items-center gap-2 text-sm"
                >
                  <Linkedin size={18} /> LinkedIn
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}