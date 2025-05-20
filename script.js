// script.js for future interactivity

document.addEventListener("DOMContentLoaded", () => {
  console.log("Portfolio website loaded and script running.");

  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll('nav ul li a[href^="#"]');
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Intersection Observer for scroll animations
  const animatedSections = document.querySelectorAll("section");

  const observerOptions = {
    root: null, // relative to document viewport
    rootMargin: "0px",
    threshold: 0.1, // 10% of the item is visible
  };

  const observerCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // The CSS already has an animation 'slideInUp' defined
        // We ensure it plays by adding a class or by directly manipulating style if needed
        // For simplicity, assuming the CSS animation starts on 'opacity: 1' or a class triggers it.
        // The current CSS has sections start at opacity 0 and animate to 1.
        // We can add a class to ensure the animation re-triggers or is applied dynamically.
        entry.target.style.opacity = "1"; // Ensure it's visible if CSS handles animation
        entry.target.style.transform = "translateY(0)"; // Ensure it's in final position
        // If CSS animations are set up to run once on load,
        // you might need to add a class here to trigger them on scroll.
        // e.g., entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Optional: stop observing after animation
      }
    });
  };

  const scrollObserver = new IntersectionObserver(
    observerCallback,
    observerOptions
  );

  animatedSections.forEach((section) => {
    scrollObserver.observe(section);
  });

  // Theme Toggle Functionality
  const themeToggleButton = document.getElementById("theme-toggle");
  const currentTheme = localStorage.getItem("theme") || "dark"; // Default to dark

  if (currentTheme === "light") {
    document.body.classList.add("light-theme");
    themeToggleButton.textContent = "☀️"; // Sun icon for light theme
  } else {
    themeToggleButton.textContent = "🌙"; // Moon icon for dark theme
  }

  themeToggleButton.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
    let theme = "dark";
    if (document.body.classList.contains("light-theme")) {
      theme = "light";
      themeToggleButton.textContent = "☀️";
    } else {
      themeToggleButton.textContent = "🌙";
    }
    localStorage.setItem("theme", theme);
  });

  // Optional: Typing effect for the hero tagline
  const tagline = document.querySelector(".hero .tagline");
  if (tagline) {
    const originalText = tagline.textContent;
    tagline.textContent = ""; // Clear it initially
    let i = 0;
    function typeWriter() {
      if (i < originalText.length) {
        tagline.textContent += originalText.charAt(i);
        i++;
        setTimeout(typeWriter, 70); // Adjust typing speed here
      }
    }
    // Start typing after a short delay to allow other elements to load
    setTimeout(typeWriter, 500);
  }

  // Three.js particle animation
  const canvas = document.getElementById("bg-animation");
  if (!canvas) {
    console.error("Canvas element #bg-animation not found!");
    return;
  }

  // Scene, Camera, Renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true, // Transparent background
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Function to set canvas height to extend to the bottom of the contact section
  const contactSection = document.getElementById("contact");
  function adjustCanvasHeight() {
    if (contactSection && canvas) {
      const heroSection = document.querySelector(".hero");
      const heroRect = heroSection.getBoundingClientRect();
      const contactRect = contactSection.getBoundingClientRect();
      // Calculate the height from the top of the hero section to the bottom of the contact section
      const totalHeight = contactRect.bottom - heroRect.top + window.scrollY;

      canvas.style.height = `${totalHeight}px`;
      renderer.setSize(window.innerWidth, totalHeight); // Update renderer size
      camera.aspect = window.innerWidth / totalHeight;
      camera.updateProjectionMatrix();

      // Adjust canvas position to be fixed relative to the viewport but cover the desired area
      // This is tricky if other content scrolls over it.
      // For now, we assume the canvas is a background for hero + sections up to contact.
      // The CSS already has position: absolute, top: 0, left: 0 within the .hero
      // We need to ensure .hero itself is tall enough or the canvas is moved out
      // and positioned globally.
      // Let's try making the canvas fixed and adjusting its height.
      // This might require re-thinking the z-index and layout if content is meant to scroll OVER it.
      // For now, let's assume the animation is a full background up to contact.
      // The CSS has #bg-animation position: absolute, z-index: 0 within .hero
      // To make it span further, it should be a direct child of body or a container that spans that height.
      // Let's adjust the height of the hero section to contain the canvas fully.
      const header = document.querySelector("header");
      const headerHeight = header ? header.offsetHeight : 0;
      const desiredCanvasHeight = contactRect.bottom - headerHeight; // from bottom of header to bottom of contact

      // The canvas is inside .hero. Let's adjust .hero's height.
      // Or, more simply, make the canvas position fixed and give it a high z-index but below content.
      // Let's try adjusting the canvas height directly and ensuring its parent (.hero) can accommodate.
      // The simplest for now is to set the canvas height and let it overflow if needed,
      // assuming the visual effect is desired as a background.
      // The CSS has #bg-animation position: absolute; top: 0; left: 0; width: 100%;
      // This means its height is relative to the .hero container.
      // To make it extend to contact, the .hero container would need to be that tall,
      // or the canvas needs to be moved out of .hero and positioned globally.

      // Simpler approach: Set canvas height and ensure it's visible.
      // The canvas is already set to 100% height of its container (.hero) by CSS.
      // We need to make the canvas itself taller.
      // The current script sets renderer size, which is good.
      // The CSS for #bg-animation has height: 100%. This will be 100% of .hero.
      // We need to override this or make .hero taller.

      // Let's try setting the canvas style height directly.
      // And ensure the renderer and camera are updated.
      // The canvas is inside .hero. If .hero is not tall enough, the canvas will be clipped.
      // Let's assume for now the goal is for the *visual effect* to extend.
      // The canvas element itself will be sized, and the Three.js scene will render to that size.

      // The canvas is absolutely positioned within .hero.
      // To make it appear to go to the bottom of #contact:
      const heroTop = canvas.parentElement.offsetTop; // .hero's top
      const contactBottom =
        contactSection.offsetTop + contactSection.offsetHeight;
      const requiredHeight = contactBottom - heroTop;

      canvas.style.height = `${requiredHeight}px`;
      renderer.setSize(window.innerWidth, requiredHeight);
      camera.aspect = window.innerWidth / requiredHeight;
      camera.updateProjectionMatrix();
    }
  }

  // Particles & Shapes
  const elements = new THREE.Group(); // Group to hold all shapes
  const particleCount = 300; // Reduced for performance with more complex shapes
  const shapeTypes = ["sphere", "cube", "cone", "torus", "dodecahedron"];

  for (let i = 0; i < particleCount; i++) {
    let geometry;
    const shapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
    const size = Math.random() * 0.2 + 0.05; // Random size for shapes

    switch (shapeType) {
      case "sphere":
        geometry = new THREE.SphereGeometry(size, 16, 16);
        break;
      case "cube":
        geometry = new THREE.BoxGeometry(size, size, size);
        break;
      case "cone":
        geometry = new THREE.ConeGeometry(size, size * 1.5, 16);
        break;
      case "torus":
        geometry = new THREE.TorusGeometry(size, size * 0.4, 16, 50);
        break;
      case "dodecahedron":
        geometry = new THREE.DodecahedronGeometry(size);
        break;
      default:
        geometry = new THREE.SphereGeometry(size, 16, 16);
    }

    const material = new THREE.MeshPhongMaterial({
      color: new THREE.Color(Math.random() * 0xffffff),
      shininess: 50 + Math.random() * 50,
      specular: 0x222222,
      transparent: true,
      opacity: 0.7 + Math.random() * 0.3,
      blending: THREE.AdditiveBlending,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(
      (Math.random() - 0.5) * 15,
      (Math.random() - 0.5) * 15,
      (Math.random() - 0.5) * 15
    );
    mesh.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );
    mesh.userData.velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 0.01,
      (Math.random() - 0.5) * 0.01,
      (Math.random() - 0.5) * 0.01
    );
    mesh.userData.rotationSpeed = new THREE.Vector3(
      (Math.random() - 0.5) * 0.02,
      (Math.random() - 0.5) * 0.02,
      (Math.random() - 0.5) * 0.02
    );
    elements.add(mesh);
  }
  scene.add(elements);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  const pointLight = new THREE.PointLight(0xffffff, 0.8, 100);
  pointLight.position.set(5, 5, 5);
  scene.add(pointLight);

  // Mouse interaction
  const mouse = new THREE.Vector2();
  window.addEventListener("mousemove", (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  });

  // Animation
  const clock = new THREE.Clock();

  const animate = () => {
    const elapsedTime = clock.getElapsedTime();

    // Animate shapes
    elements.children.forEach((object) => {
      // Movement
      object.position.add(object.userData.velocity);

      // Rotation
      object.rotation.x += object.userData.rotationSpeed.x;
      object.rotation.y += object.userData.rotationSpeed.y;
      object.rotation.z += object.userData.rotationSpeed.z;

      // Boundary check (simple wrap around)
      if (object.position.x > 7.5 || object.position.x < -7.5)
        object.userData.velocity.x *= -1;
      if (object.position.y > 7.5 || object.position.y < -7.5)
        object.userData.velocity.y *= -1;
      if (object.position.z > 7.5 || object.position.z < -7.5)
        object.userData.velocity.z *= -1;

      // Mouse influence (subtle)
      object.position.x += mouse.x * 0.001 * object.position.z; // Parallax effect
      object.position.y += mouse.y * 0.001 * object.position.z;
    });

    // Overall group rotation based on mouse (less intense than individual particle rotation)
    elements.rotation.y = mouse.x * 0.1;
    elements.rotation.x = mouse.y * 0.1;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };

  // Initial and on-resize/load adjustment of canvas height
  adjustCanvasHeight();
  animate();

  // Handle window resize
  window.addEventListener("resize", () => {
    adjustCanvasHeight(); // Adjust canvas height on resize
    // Camera aspect and renderer size are handled within adjustCanvasHeight
  });

  // Ensure canvas height is adjusted after everything is loaded, especially images if any
  window.addEventListener("load", adjustCanvasHeight);
  // Also, consider a small delay if content shifts after initial load
  setTimeout(adjustCanvasHeight, 100);
});
