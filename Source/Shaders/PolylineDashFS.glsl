varying vec2 v_st;

void main()
{
    czm_materialInput materialInput;
    
    materialInput.s = v_st.s;
    materialInput.st = v_st;
    materialInput.str = vec3(v_st, 0.0);
    czm_material material = czm_getMaterial(materialInput);
    float omega = mod(v_st.s * 10., 1.);
    float dash = smoothstep(.475, .525, omega)*(1. - smoothstep(.95, 1., omega));
    material.alpha = material.alpha * dash;
    gl_FragColor = vec4(material.diffuse + material.emission, material.alpha);
}
