// Copyright 2015-2019, University of Colorado Boulder

/**
 * A rectangular momentary button: on when pressed, off when released.
 * This is the file in which the view (appearance) and model (behavior) are brought together.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const InstanceRegistry = require( 'PHET_CORE/documentation/InstanceRegistry' );
  const MomentaryButtonInteractionStateProperty = require( 'SUN/buttons/MomentaryButtonInteractionStateProperty' );
  const MomentaryButtonModel = require( 'SUN/buttons/MomentaryButtonModel' );
  const RectangularButtonView = require( 'SUN/buttons/RectangularButtonView' );
  const sun = require( 'SUN/sun' );
  const Tandem = require( 'TANDEM/Tandem' );

  /**
   * @param {Object} valueOff - value when the button is in the off state
   * @param {Object} valueOn - value when the button is in the on state
   * @param {Property} property
   * @param {Object} [options]
   * @constructor
   */
  function RectangularMomentaryButton( valueOff, valueOn, property, options ) {

    options = _.extend( {
      tandem: Tandem.required
    }, options );

    // Note it shares a tandem with this, so the emitter will be instrumented as a child of the button
    var buttonModel = new MomentaryButtonModel( valueOff, valueOn, property, options );
    RectangularButtonView.call( this, buttonModel, new MomentaryButtonInteractionStateProperty( buttonModel ), options );

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'sun', 'AccordionBox', this );
  }

  sun.register( 'RectangularMomentaryButton', RectangularMomentaryButton );

  return inherit( RectangularButtonView, RectangularMomentaryButton );
} );