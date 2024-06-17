import { ref, onMounted, onUnmounted } from 'vue'


export function useZoom() {
    const sliderValue = ref(16);
    const outputValue = ref(0);
    
    const updateOutput = () => {
        outputValue.value = sliderValue.value;
    };

    // Exponer las variables y funciones que deseas utilizar en tu componente
    return {
        sliderValue,
        outputValue,
        updateOutput,
    };
}