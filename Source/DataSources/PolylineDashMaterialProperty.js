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
    var defaultDuty = 0.25;

    /**
     * A {@link MaterialProperty} that maps to polyline dash {@link Material} uniforms.
     * @alias PolylineDashMaterialProperty
     * @constructor
     *
     * @param {Object} [options] Object with the following properties:
     * @param {Property} [options.color=Color.WHITE] A Property specifying the {@link Color} of the line.
     * @param {Property} [options.duty=0.25] A numeric Property specifying the fractional length of a dash, as a percentage of the length of a cycle.
     */
    function PolylineDashMaterialProperty(options) {
        options = defaultValue(options, defaultValue.EMPTY_OBJECT);

        this._definitionChanged = new Event();
        this._color = undefined;
        this._colorSubscription = undefined;
        this._duty = undefined;
        this._dutySubscription = undefined;

        this.color = options.color;
        this.duty = options.duty;
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
                return Property.isConstant(this._color) && Property.isConstant(this._duty);
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
        duty : createPropertyDescriptor('duty')
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
                Property.equals(this._duty, other._duty));
    };

    return PolylineDashMaterialProperty;
});
