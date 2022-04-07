const { ref, watch, onMounted, computed } = Vue;

Vue.createApp({
  setup() {
    const sTheta = ref(0);
    const sPhi = ref(0);

    const theta = ref(0);
    const phi = ref(0);
    const lambda = ref(0);

    const time = ref(100);

    const is_playing = ref(false);

    const setU3 = (t, p, l) => {
      theta.value = t;
      phi.value = p;
      lambda.value = l;
    };

    const setState = (t, p) => {
      sTheta.value = t;
      sPhi.value = p;
    };

    watch(sTheta, (v) => (window._bloch_stheta = v));
    watch(sPhi, (v) => (window._bloch_sphi = v));

    watch(theta, (v) => (window._bloch_theta = v));
    watch(phi, (v) => (window._bloch_phi = v));
    watch(lambda, (v) => (window._bloch_lambda = v));
    watch(time, (v) => (window._bloch_time = v));

    onMounted(() => {
      window._bloch_stheta = sTheta.value;
      window._bloch_sphi = sPhi.value;

      window._bloch_theta = theta.value;
      window._bloch_phi = phi.value;
      window._bloch_lambda = lambda.value;
      window._bloch_time = time.value;
    });

    const start = () => {
      time.value = 0;
    };

    const end = () => {
      time.value = 100;
    };

    const play = () => {
      if (is_playing.value) return;
      is_playing.value = true;

      const original_time = time.value;
      for (let i = 0; i < original_time; i++) {
        setTimeout(() => (time.value = original_time - i), i * 5);
      }
      setTimeout(() => {
        for (let i = 0; i < 101; i++) {
          setTimeout(() => (time.value = i), i * 50);
        }
        setTimeout(() => (is_playing.value = false), 100 * 50);
      }, original_time * 5);
    };

    return {
      sTheta,
      sPhi,
      theta,
      phi,
      lambda,
      time,
      play,
      is_playing,
      start,
      end,
      setU3,
      setState,
    };
  },
}).mount("#app");
