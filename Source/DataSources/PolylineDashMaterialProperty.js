/*global define*/
define([
        '../Core/Color',
        '../Core/defaultValue',
        '../Core/defined',
        '../Core/defineProperties',
        '../Core/Event',
        './createPropertyDescriptor',
        './Property'
    ], function(
        Color,
        defaultValue,
        defined,
        defineProperties,
        Event,
        createPropertyDescriptor,
        Property) {
    'use strict';

    var defaultColor = Color.WHITE;
    var defaultDuty = 0.5;
    var defaultDashLength = 500000.0;
    var defaultDashPattern = 65535;

    /**
     * A {@link MaterialProperty} that maps to polyline dash {@link Material} uniforms.
     * @alias PolylineDashMaterialProperty
     * @constructor
     *
     * @param {Object} [options] Object with the following properties:
     * @param {Property} [options.color=Color.WHITE] A Property specifying the {@link Color} of the line.
     * @param {Property} [options.duty=0.25] A numeric Property specifying the fractional length of a dash, as a percentage of the length of a cycle.
     * @param {Property} [options.dashLength=500000.0] A numeric Property specifying the actual length of a dash cycle.
     * @param {Property} [options.dashPattern=65535.0] A numeric Property specifying a pattern for the dash
     */
    function PolylineDashMaterialProperty(options) {
        options = defaultValue(options, defaultValue.EMPTY_OBJECT);

        this._definitionChanged = new Event();
        this._color = undefined;
        this._colorSubscription = undefined;
        this._duty = undefined;
        this._dutySubscription = undefined;
        this._dashLength = undefined;
        this._dashLengthSubscription = undefined;
        this._dashPattern = undefined;
        this._dashPatternSubscription = undefined;

        this.color = options.color;
        this.duty = options.duty;
        this.dashLength = options.dashLength;
        this.dashPattern = options.dashPattern;
    }

    defineProperties(PolylineDashMaterialProperty.prototype, {
        /**
         * Gets a value indicating if this property is constant.  A property is considered
         * constant if getValue always returns the same result for the current definition.
         * @memberof PolylineDashMaterialProperty.prototype
         * @type {Boolean}
         * @readonly
         */
        isConstant : {
            get : function() {
                return (Property.isConstant(this._color) && Property.isConstant(this._duty)
                        && Property.isConstant(this._dashLength) && Property.isConstant(this._dashPattern));
            }
        },
        /**
         * Gets the event that is raised whenever the definition of this property changes.
         * The definition is considered to have changed if a call to getValue would return
         * a different result for the same time.
         * @memberof PolylineDashMaterialProperty.prototype
         * @type {Event}
         * @readonly
         */
        definitionChanged : {
            get : function() {
                return this._definitionChanged;
            }
        },
        /**
         * Gets or sets the Property specifying the {@link Color} of the line.
         * @memberof PolylineDashMaterialProperty.prototype
         * @type {Property}
         */
        color : createPropertyDescriptor('color'),
        /**
         * Gets or sets the numeric Property specifying the on duty cycle of the dash.
         * @memberof PolylineDashMaterialProperty.prototype
         * @type {Property}
         */
        duty : createPropertyDescriptor('duty'),
        /**
         * Gets or sets the numeric Property specifying the length of a dash cycle
         * @memberof PolylineDashMaterialProperty.prototype
         * @type {Property}
         */
        dashLength : createPropertyDescriptor('dashLength'),
        /**
         * Gets or sets the numeric Property specifying a dash pattern
         * @memberof PolylineDashMaterialProperty.prototype
         * @type {Property}
         */
        dashPattern : createPropertyDescriptor('dashPattern')

    });

    /**
     * Gets the {@link Material} type at the provided time.
     *
     * @param {JulianDate} time The time for which to retrieve the type.
     * @returns {String} The type of material.
     */
    PolylineDashMaterialProperty.prototype.getType = function(time) {
        return 'PolylineDash';
    };

    /**
     * Gets the value of the property at the provided time.
     *
     * @param {JulianDate} time The time for which to retrieve the value.
     * @param {Object} [result] The object to store the value into, if omitted, a new instance is created and returned.
     * @returns {Object} The modified result parameter or a new instance if the result parameter was not supplied.
     */
    PolylineDashMaterialProperty.prototype.getValue = function(time, result) {
        if (!defined(result)) {
            result = {};
        }
        result.color = Property.getValueOrClonedDefault(this._color, time, defaultColor, result.color);
        result.duty = Property.getValueOrDefault(this._duty, time, defaultDuty, result.duty);
        result.dashLength = Property.getValueOrDefault(this._dashLength, time, defaultDashLength, result.duty);
        result.dashPattern = Property.getValueOrDefault(this._dashPattern, time, defaultDashPattern, result.duty);
        return result;
    };

    /**
     * Compares this property to the provided property and returns
     * <code>true</code> if they are equal, <code>false</code> otherwise.
     *
     * @param {Property} [other] The other property.
     * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
     */
    PolylineDashMaterialProperty.prototype.equals = function(other) {
        return this === other || //
               (other instanceof PolylineDashMaterialProperty && //
                Property.equals(this._color, other._color) &&
                Property.equals(this._duty, other._duty) &&
                Property.equals(this._dashLength, other._dashLength) &&
               Property.equals(this._dashPattern, other._dashPattern));
    };

    return PolylineDashMaterialProperty;
});
