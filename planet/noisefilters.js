class MinMax {
    constructor() {
        this.min = Number.MAX_VALUE;
        this.max = Number.MIN_VALUE;
    }

    addVal(val) {
        if (val > this.max) this.max = val;
        if (val < this.min) this.min = val;
    }
}


class ShapeGenerator {
    constructor(noiseFilters, elevationMinMax, radius) {
        this.noiseFilters = noiseFilters;
        this.elevationMinMax = elevationMinMax;
        this.radius = radius;
    }

    getUnscaledElevation(vector) {
        let firstLayerElevation = 0;
        let elevation = 0;
        if (this.noiseFilters.length > 0) {
            firstLayerElevation = this.noiseFilters[0].evaluate(vector)
            if (this.noiseFilters[0].enabled) elevation = firstLayerElevation;
        }

        for (let i = 1; i < this.noiseFilters.length; i++) {
            let mask = this.noiseFilters[i].useFirstLayerAsMask ? firstLayerElevation : 1;
            elevation += this.noiseFilters[i].evaluate(vector) * mask;
        }

        this.elevationMinMax.addVal(elevation);
        return elevation;
    }

    getScaledElevation(unscaledElevation) {
        let elevation = Math.max(0, unscaledElevation);
        elevation = this.radius * (1 + elevation);
        return elevation;
    }
}


class SimpleNoiseFilter {
    constructor(enabled, baseRoughness, roughness, persistence, strength, minValue, numLayers, center, usflam) {
        this.enabled = enabled
        this.baseRoughness = baseRoughness
        this.roughness = roughness
        this.persistence = persistence
        this.strength = strength
        this.minValue = minValue
        this.numLayers = numLayers;
        this.center = center;
        this.useFirstLayerAsMask = usflam
    }

    evaluate(vector) {
        let noiseValue = 0;
        let frequency = this.baseRoughness;
        let amplitude = 1;
        const formatVector = (v, i) => v.getComponent(i) * frequency + this.center.getComponent(i);

        for (let i = 0; i < this.numLayers; i++) {
            let v = noise.perlin3(formatVector(vector, 0), formatVector(vector, 1), formatVector(vector, 2));
            noiseValue += v * 0.5 * amplitude;
            frequency *= this.roughness;
            amplitude *= this.persistence;
        }

        noiseValue -= this.minValue;

        return noiseValue * this.strength;
    }
}