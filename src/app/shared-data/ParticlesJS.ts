/* or the classic JavaScript object */
export const PARTICLE_OPTIONS = {
  background: {
    color: {
      value: '#fff'
    }
  },
  fpsLimit: 60,
  interactivity: {
    detectsOn: 'canvas',
    events: {
      onClick: {
        enable: false,
        mode: 'push'
      },
      onHover: {
        enable: false,
        mode: 'repulse'
      },
      resize: true
    },
    modes: {
      bubble: {
        distance: 400,
        duration: 2,
        opacity: 0.8,
        size: 10
      },
      push: {
        quantity: 4
      },
      repulse: {
        distance: 200,
        duration: 0.4
      }
    }
  },
  particles: {
    color: {
      value: ['#ed553b', '#ffdc4d', '#F8F9FF', '#e74c3c', '#1abc9c']
    },
    links: {
      color: '#ffffff',
      distance: 150,
      enable: true,
      opacity: 0.5,
      width: 1
    },
    collisions: {
      enable: true
    },
    move: {
      direction: 'none',
      enable: true,
      outMode: 'bounce',
      random: false,
      speed: 0.5,
      straight: false
    },
    number: {
      density: {
        enable: true,
        value_area: 1200
      },
      value: 50
    },
    opacity: {
      value: 0.5,
    },
    shape: {
      type: 'circle'
    },
    size: {
      random: true,
      value: 6
    }
  },
  detectRetina: true
};
