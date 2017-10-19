uniform sampler2D image;
uniform float minHeight;
uniform float maxHeight;

czm_material czm_getMaterial(czm_materialInput materialInput)
{
    czm_material material = czm_getDefaultMaterial(materialInput);
    float scaledHeight = clamp((materialInput.height - minHeight) / (maxHeight - minHeight), 0.0, 1.0);
    material.diffuse = texture2D(image, vec2(scaledHeight, 0.5)).rgb;
    return material;
}