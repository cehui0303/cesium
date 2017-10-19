czm_material czm_getMaterial(czm_materialInput materialInput)
{
    czm_material material = czm_getDefaultMaterial(materialInput);

    vec3 heightColor = vec3(1.0, 1.0, 1.0);
    if (materialInput.height < 1000.0) {
        heightColor = vec3(1.0, 0.0, 0.0);
    }
    else if (materialInput.height < 2000.0) {
        heightColor = vec3(0.0, 1.0, 0.0);
    }
    else if (materialInput.height < 3000.0) {
        heightColor = vec3(0.0, 1.0, 1.0);
    }
    else if (materialInput.height < 4000.0) {
        heightColor = vec3(0.0, 0.0, 1.0);
    }
    else if (materialInput.height < 5000.0) {
        heightColor = vec3(1.0, 0.0, 1.0);
    }
    else {
        heightColor = vec3(1.0, 1.0, 1.0);
    }
    material.diffuse = heightColor;

    material.alpha = 1.0;

    return material;
}