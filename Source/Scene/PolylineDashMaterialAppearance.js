/*global define*/
define([
        '../Core/defaultValue',
        '../Core/defined',
        '../Core/defineProperties',
        '../Core/VertexFormat',
        '../Shaders/Appearances/PolylineMaterialAppearanceVS',
        '../Shaders/PolylineCommon',
        '../Shaders/PolylineDashFS',
        './Appearance',
        './Material'
    ], function(
        defaultValue,
        defined,
        defineProperties,
        VertexFormat,
        PolylineMaterialAppearanceVS,
        PolylineCommon,
        PolylineDashFS,
        Appearance,
        Material) {
    'use strict';

    var defaultVertexShaderSource = PolylineCommon + '\n' + PolylineMaterialAppearanceVS;
    var defaultFragmentShaderSource = PolylineDashFS;

    /**
     * An appearance for {@link PolylineGeometry} that supports shading with materials and dashes.
     *
     * @alias PolylineDashMaterialAppearance
     * @constructor
     *
     * @param {Object} [options] Object with the following properties:
     * @param {Boolean} [options.translucent=true] When <code>true</code>, the geometry is expected to appear translucent so {@link PolylineDashMaterialAppearance#renderState} has alpha blending enabled.
     * @param {Material} [options.material=Material.ColorType] The material used to determine the fragment color.
     * @param {String} [options.vertexShaderSource] Optional GLSL vertex shader source to override the default vertex shader.
     * @param {String} [options.fragmentShaderSource] Optional GLSL fragment shader source to override the default fragment shader.
     * @param {RenderState} [options.renderState] Optional render state to override the default render state.
     *
     * @see {@link https://github.com/AnalyticalGraphicsInc/cesium/wiki/Fabric|Fabric}
     *
     * @example
     * var primitive = new Cesium.Primitive({
     *   geometryInstances : new Cesium.GeometryInstance({
     *     geometry : new Cesium.PolylineGeometry({
     *       positions : Cesium.Cartesian3.fromDegreesArray([
     *         0.0, 0.0,
     *         5.0, 0.0
     *       ]),
     *       width : 10.0,
     *       vertexFormat : Cesium.PolylineDashMaterialAppearance.VERTEX_FORMAT
     *     })
     *   }),
     *   appearance : new Cesium.PolylineDashMaterialAppearance({
     *     material : Cesium.Material.fromType('Color')
     *   })
     * });
     */
    function PolylineDashMaterialAppearance(options) {
        options = defaultValue(options, defaultValue.EMPTY_OBJECT);

        var translucent = defaultValue(options.translucent, true);
        var closed = false;
        var vertexFormat = PolylineDashMaterialAppearance.VERTEX_FORMAT;

        /**
         * The material used to determine the fragment color.  Unlike other {@link PolylineDashMaterialAppearance}
         * properties, this is not read-only, so an appearance's material can change on the fly.
         *
         * @type Material
         *
         * @default {@link Material.ColorType}
         *
         * @see {@link https://github.com/AnalyticalGraphicsInc/cesium/wiki/Fabric|Fabric}
         */
        this.material = defined(options.material) ? options.material : Material.fromType(Material.ColorType);

        /**
         * When <code>true</code>, the geometry is expected to appear translucent so
         * {@link PolylineDashMaterialAppearance#renderState} has alpha blending enabled.
         *
         * @type {Boolean}
         *
         * @default true
         */
        this.translucent = translucent;

        this._vertexShaderSource = defaultValue(options.vertexShaderSource, defaultVertexShaderSource);
        this._fragmentShaderSource = defaultValue(options.fragmentShaderSource, defaultFragmentShaderSource);
        this._renderState = Appearance.getDefaultRenderState(translucent, closed, options.renderState);
        this._closed = closed;

        // Non-derived members

        this._vertexFormat = vertexFormat;
    }

    defineProperties(PolylineDashMaterialAppearance.prototype, {
        /**
         * The GLSL source code for the vertex shader.
         *
         * @memberof PolylineDashMaterialAppearance.prototype
         *
         * @type {String}
         * @readonly
         */
        vertexShaderSource : {
            get : function() {
                return this._vertexShaderSource;
            }
        },

        /**
         * The GLSL source code for the fragment shader.
         *
         * @memberof PolylineDashMaterialAppearance.prototype
         *
         * @type {String}
         * @readonly
         */
        fragmentShaderSource : {
            get : function() {
                return this._fragmentShaderSource;
            }
        },

        /**
         * The WebGL fixed-function state to use when rendering the geometry.
         * <p>
         * The render state can be explicitly defined when constructing a {@link PolylineDashMaterialAppearance}
         * instance, or it is set implicitly via {@link PolylineDashMaterialAppearance#translucent}
         * and {@link PolylineDashMaterialAppearance#closed}.
         * </p>
         *
         * @memberof PolylineDashMaterialAppearance.prototype
         *
         * @type {Object}
         * @readonly
         */
        renderState : {
            get : function() {
                return this._renderState;
            }
        },

        /**
         * When <code>true</code>, the geometry is expected to be closed so
         * {@link PolylineDashMaterialAppearance#renderState} has backface culling enabled.
         * This is always <code>false</code> for <code>PolylineDashMaterialAppearance</code>.
         *
         * @memberof PolylineDashMaterialAppearance.prototype
         *
         * @type {Boolean}
         * @readonly
         *
         * @default false
         */
        closed : {
            get : function() {
                return this._closed;
            }
        },

        /**
         * The {@link VertexFormat} that this appearance instance is compatible with.
         * A geometry can have more vertex attributes and still be compatible - at a
         * potential performance cost - but it can't have less.
         *
         * @memberof PolylineDashMaterialAppearance.prototype
         *
         * @type VertexFormat
         * @readonly
         *
         * @default {@link PolylineDashMaterialAppearance.VERTEX_FORMAT}
         */
        vertexFormat : {
            get : function() {
                return this._vertexFormat;
            }
        }
    });

    /**
     * The {@link VertexFormat} that all {@link PolylineDashMaterialAppearance} instances
     * are compatible with. This requires <code>position</code> and <code>st</code> attributes.
     *
     * @type VertexFormat
     *
     * @constant
     */
    PolylineDashMaterialAppearance.VERTEX_FORMAT = VertexFormat.POSITION_AND_ST;

    /**
     * Procedurally creates the full GLSL fragment shader source.  For {@link PolylineDashMaterialAppearance},
     * this is derived from {@link PolylineDashMaterialAppearance#fragmentShaderSource} and {@link PolylineDashMaterialAppearance#material}.
     *
     * @function
     *
     * @returns {String} The full GLSL fragment shader source.
     */
    PolylineDashMaterialAppearance.prototype.getFragmentShaderSource = Appearance.prototype.getFragmentShaderSource;

    /**
     * Determines if the geometry is translucent based on {@link PolylineDashMaterialAppearance#translucent} and {@link Material#isTranslucent}.
     *
     * @function
     *
     * @returns {Boolean} <code>true</code> if the appearance is translucent.
     */
    PolylineDashMaterialAppearance.prototype.isTranslucent = Appearance.prototype.isTranslucent;

    /**
     * Creates a render state.  This is not the final render state instance; instead,
     * it can contain a subset of render state properties identical to the render state
     * created in the context.
     *
     * @function
     *
     * @returns {Object} The render state.
     */
    PolylineDashMaterialAppearance.prototype.getRenderState = Appearance.prototype.getRenderState;

    return PolylineDashMaterialAppearance;
});
