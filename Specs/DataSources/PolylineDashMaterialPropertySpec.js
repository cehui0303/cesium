/*global defineSuite*/
defineSuite([
        'DataSources/PolylineDashMaterialProperty',
        'Core/Color',
        'Core/JulianDate',
        'Core/TimeInterval',
        'DataSources/ConstantProperty',
        'DataSources/TimeIntervalCollectionProperty'
    ], function(
        PolylineDashMaterialProperty,
        Color,
        JulianDate,
        TimeInterval,
        ConstantProperty,
        TimeIntervalCollectionProperty) {
    'use strict';

    it('constructor provides the expected defaults', function() {
        var property = new PolylineDashMaterialProperty();
        expect(property.getType()).toEqual('PolylineDash');

        var result = property.getValue();
        expect(result.color).toEqual(Color.WHITE);
        expect(result.dashLength).toEqual(5.0);
    });

    it('constructor sets options and allows raw assignment', function() {
        var options = {
            color : Color.RED,
            dashLength: 10.0
        };

        var property = new PolylineDashMaterialProperty(options);
        expect(property.color).toBeInstanceOf(ConstantProperty);
        expect(property.dashLength).toBeInstanceOf(ConstantProperty);

        expect(property.color.getValue()).toEqual(options.color);
        expect(property.dashLength.getValue()).toEqual(options.dashLength);
    });

    it('works with constant values', function() {
        var property = new PolylineDashMaterialProperty();
        property.color = new ConstantProperty(Color.RED);
        property.dashLength = new ConstantProperty(10.0);

        var result = property.getValue(JulianDate.now());
        expect(result.color).toEqual(Color.RED);
        expect(result.dashLength).toEqual(10.0);
    });

    it('works with dynamic values', function() {
        var property = new PolylineDashMaterialProperty();
        property.color = new TimeIntervalCollectionProperty();
        property.dashLength = new TimeIntervalCollectionProperty();

        var start = new JulianDate(1, 0);
        var stop = new JulianDate(2, 0);
        property.color.intervals.addInterval(new TimeInterval({
            start : start,
            stop : stop,
            data : Color.BLUE
        }));
        property.dashLength.intervals.addInterval(new TimeInterval({
            start : start,
            stop : stop,
            data : 10.0
        }));

        var result = property.getValue(start);
        expect(result.color).toEqual(Color.BLUE);
        expect(result.dashLength).toEqual(10.0);
    });

    it('works with a result parameter', function() {
        var property = new PolylineDashMaterialProperty();
        property.color = new ConstantProperty(Color.RED);
        property.dashLength = new ConstantProperty(10.0);

        var result = {
            color : Color.YELLOW.clone(),
            dashLength : 1.0
        };
        var returnedResult = property.getValue(JulianDate.now(), result);
        expect(returnedResult).toBe(result);
        expect(result.color).toEqual(Color.RED);
        expect(result.dashLength).toEqual(10.0);
    });

    it('equals works', function() {
        var left = new PolylineDashMaterialProperty();
        left.color = new ConstantProperty(Color.WHITE);
        left.dashLength = new ConstantProperty(5.0);

        var right = new PolylineDashMaterialProperty();
        right.color = new ConstantProperty(Color.WHITE);
        right.dashLength = new ConstantProperty(5.0);
        expect(left.equals(right)).toEqual(true);

        right.color = new ConstantProperty(Color.RED);
        expect(left.equals(right)).toEqual(false);

        right.color = left.color;
        right.dashLength = new ConstantProperty(3.0);
        expect(left.equals(right)).toEqual(false);
    });

    it('raises definitionChanged when a property is assigned or modified', function() {
        var property = new PolylineDashMaterialProperty();
        var listener = jasmine.createSpy('listener');
        property.definitionChanged.addEventListener(listener);

        var oldValue = property.color;
        property.color = new ConstantProperty(Color.RED);
        expect(listener).toHaveBeenCalledWith(property, 'color', property.color, oldValue);
        listener.calls.reset();

        property.color.setValue(Color.YELLOW);
        expect(listener).toHaveBeenCalledWith(property, 'color', property.color, property.color);
        listener.calls.reset();

        property.color = property.color;
        expect(listener.calls.count()).toEqual(0);
        listener.calls.reset();

        oldValue = property.dashLength;
        property.dashLength = new ConstantProperty(3.0);
        expect(listener).toHaveBeenCalledWith(property, 'dashLength', property.dashLength, oldValue);
        listener.calls.reset();

        property.dashLength.setValue(2.0);
        expect(listener).toHaveBeenCalledWith(property, 'dashLength', property.dashLength, property.dashLength);
        listener.calls.reset();

        property.dashLength = property.dashLength;
        expect(listener.calls.count()).toEqual(0);
    });

    it('isConstant is only true when all properties are constant or undefined', function() {
        var property = new PolylineDashMaterialProperty();
        expect(property.isConstant).toBe(true);

        property.color = undefined;
        property.dashLength = undefined;
        expect(property.isConstant).toBe(true);

        var start = new JulianDate(1, 0);
        var stop = new JulianDate(2, 0);
        property.color = new TimeIntervalCollectionProperty();
        property.color.intervals.addInterval(new TimeInterval({
            start : start,
            stop : stop,
            data : Color.RED
        }));
        expect(property.isConstant).toBe(false);

        property.color = undefined;
        expect(property.isConstant).toBe(true);
        property.dashLength = new TimeIntervalCollectionProperty();
        property.dashLength.intervals.addInterval(new TimeInterval({
            start : start,
            stop : stop,
            data : 3.0
        }));
        expect(property.isConstant).toBe(false);
    });
});